import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET /api/projects
 * Fetch all projects with pagination and status filtering
 * Query params: page (default: 1), limit (default: 10), status (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Number(searchParams.get("limit")) || 10);
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          startDate: true,
          endDate: true,
          budget: true,
          location: true,
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
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 * Body: { name, description?, status?, startDate?, endDate?, budget?, location?, createdBy, teamId? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, status, startDate, endDate, budget, location, createdBy, teamId } = body;

    if (!name || !createdBy) {
      return NextResponse.json(
        { error: "Name and createdBy are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        status: status || "PLANNING",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget || null,
        location: location || null,
        createdBy,
        teamId: teamId || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        budget: true,
        location: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
