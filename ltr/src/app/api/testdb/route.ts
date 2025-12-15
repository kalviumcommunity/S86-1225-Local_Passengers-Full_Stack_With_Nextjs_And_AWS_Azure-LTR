import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get counts from all tables
    const counts = {
      users: await prisma.user.count(),
      teams: await prisma.team.count(),
      projects: await prisma.project.count(),
      tasks: await prisma.task.count(),
      comments: await prisma.comment.count(),
      tags: await prisma.tag.count(),
      notifications: await prisma.notification.count(),
    };

    // Get sample data
    const sampleUsers = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const sampleProjects = await prisma.project.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database connection successful and data seeded!",
      counts,
      sampleData: {
        users: sampleUsers,
        projects: sampleProjects,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
