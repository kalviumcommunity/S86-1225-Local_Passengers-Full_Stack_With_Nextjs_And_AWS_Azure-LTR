import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET /api/teams
 * Fetch all teams with pagination
 * Query params: page (default: 1), limit (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Number(searchParams.get("limit")) || 10);

    const skip = (page - 1) * limit;

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.team.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams
 * Create a new team
 * Body: { name, description?, createdBy }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, createdBy } = body;

    if (!name || !createdBy) {
      return NextResponse.json(
        { error: "Name and createdBy are required" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        description: description || null,
        createdBy,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Team created successfully",
        data: team,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/teams error:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
