import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET /api/query-optimization
 * Demonstrates query optimization techniques:
 * 1. Field selection (avoid over-fetching)
 * 2. Pagination with skip/take
 * 3. Indexed field queries
 * 4. Batch operations
 * 
 * Query parameter: mode
 * - "inefficient" - shows N+1 problem and over-fetching
 * - "optimized" - shows best practices
 */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode") || "optimized";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const pageSize = 10;

  try {
    if (mode === "inefficient") {
      return handleInefficientQuery(page, pageSize);
    }

    return handleOptimizedQuery(page, pageSize);
  } catch (error: any) {
    console.error("Query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * INEFFICIENT: Over-fetching and N+1 query problem
 */
async function handleInefficientQuery(page: number, pageSize: number) {
  console.log("⚠️  INEFFICIENT QUERY MODE - Over-fetching and N+1 pattern:");
  const startTime = performance.now();

  try {
    // ❌ INEFFICIENT: Fetching all fields including unnecessary relations
    const projects = await prisma.project.findMany({
      include: {
        creator: true, // Fetches ALL user fields
        team: {
          include: {
            members: true, // N+1: Extra query for each team
            creator: true,
          },
        },
        tasks: {
          include: {
            assignee: true, // N+1: Extra query for each task
            comments: {
              include: {
                author: true, // Multiple nested queries!
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    return NextResponse.json({
      mode: "inefficient",
      warning:
        "This query fetches unnecessary data and causes N+1 problems in production",
      duration: `${duration}ms`,
      count: projects.length,
      issues: [
        "Fetching all user fields when only name/email needed",
        "Including team members for each project (N+1)",
        "Including all task comments and their authors (multiple N+1 queries)",
        "Excessive data transfer and memory usage",
      ],
      note: "Compare with ?mode=optimized for best practices",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * OPTIMIZED: Field selection, pagination, indexed queries
 */
async function handleOptimizedQuery(page: number, pageSize: number) {
  console.log("✅ OPTIMIZED QUERY MODE - Field selection & pagination:");
  const startTime = performance.now();

  try {
    // ✅ OPTIMIZED: Select only needed fields
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            tags: true,
          },
        },
      },
      where: {
        status: { in: ["PLANNING", "IN_PROGRESS"] }, // Uses indexed field
      },
      orderBy: { createdAt: "desc" }, // Uses indexed field
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // ✅ OPTIMIZED: Batch get task stats using indexed queries
    const taskStats = await prisma.task.groupBy({
      by: ["status"],
      where: { projectId: { in: projects.map((p) => p.id) } },
      _count: true,
    });

    // ✅ OPTIMIZED: Get recent notifications using indexed query
    const recentNotifications = await prisma.notification.findMany({
      select: {
        id: true,
        message: true,
        type: true,
        read: true,
        createdAt: true,
      },
      where: { read: false }, // Uses indexed field
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    return NextResponse.json({
      mode: "optimized",
      duration: `${duration}ms`,
      pagination: {
        page,
        pageSize,
        count: projects.length,
      },
      projects,
      stats: {
        tasksByStatus: taskStats,
        recentUnreadNotifications: recentNotifications.length,
      },
      optimizations: [
        "✅ Field selection - only selecting necessary fields",
        "✅ Pagination - using skip/take for scalability",
        "✅ Indexed queries - filtering by status (indexed field)",
        "✅ Aggregation - using groupBy for efficient counting",
        "✅ Batch operations - multiple queries for different data",
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/query-optimization/batch
 * Demonstrates batch creation for efficient inserts
 */
export async function POST(request: NextRequest) {
  try {
    const { tags = [] } = await request.json();

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: "tags array is required" },
        { status: 400 }
      );
    }

    console.log(`🔄 Batch creating ${tags.length} tags...`);
    const startTime = performance.now();

    // ✅ OPTIMIZED: Batch insert instead of individual creates
    const createdTags = await prisma.tag.createMany({
      data: tags.map((tag: string) => ({
        name: `${tag}-${Date.now()}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      })),
      skipDuplicates: true,
    });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    return NextResponse.json({
      success: true,
      message: "Batch insert completed",
      duration: `${duration}ms`,
      created: createdTags.count,
      benefit:
        "Batch insert is much faster than individual creates (single DB roundtrip)",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
