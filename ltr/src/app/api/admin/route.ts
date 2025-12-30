import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin
 * Admin dashboard - Get system statistics and overview
 * Access: Admin only
 */
export async function GET(req: NextRequest) {
  try {
    // Extract user info from middleware headers
    const userRole = req.headers.get("x-user-role");
    const userEmail = req.headers.get("x-user-email");

    // Get system statistics
    const [
      totalUsers,
      totalProjects,
      totalTeams,
      totalTasks,
      totalTrains,
      totalAlerts,
      activeAlerts,
      adminUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.team.count(),
      prisma.task.count(),
      prisma.train.count(),
      prisma.alert.count(),
      prisma.alert.count({
        where: { status: "ACTIVE" },
      }),
      prisma.user.count({
        where: { role: "ADMIN" },
      }),
    ]);

    // Get recent users (last 5)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Get recent projects (last 5)
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return sendSuccess(
      {
        message: `Welcome Admin! Access granted to ${userEmail}`,
        statistics: {
          users: totalUsers,
          projects: totalProjects,
          teams: totalTeams,
          tasks: totalTasks,
          trains: totalTrains,
          alerts: totalAlerts,
          activeAlerts,
          adminUsers,
        },
        recentActivity: {
          users: recentUsers,
          projects: recentProjects,
        },
        accessLevel: userRole,
      },
      "Admin dashboard data retrieved successfully"
    );
  } catch (error) {
    logger.error("Admin dashboard error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return sendError(
      "Failed to fetch admin dashboard data",
      ERROR_CODES.DATABASE_ERROR,
      500,
      error
    );
  }
}
