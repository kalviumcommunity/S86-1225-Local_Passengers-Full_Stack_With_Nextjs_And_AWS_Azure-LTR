import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

/**
 * GET /api/teams/[id]
 * Fetch a specific team by ID with members and projects
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = parseInt(params.id);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
          take: 5,
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: team,
    });
  } catch (error: any) {
    console.error("GET /api/teams/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/teams/[id]
 * Update a team by ID
 * Body: { name?, description? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = parseInt(params.id);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description } = body;

    const existingTeam = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!existingTeam) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Team updated successfully",
      data: updatedTeam,
    });
  } catch (error: any) {
    console.error("PUT /api/teams/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/teams/[id]
 * Delete a team by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = parseInt(params.id);

    if (isNaN(teamId)) {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    await prisma.team.delete({
      where: { id: teamId },
    });

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/teams/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
