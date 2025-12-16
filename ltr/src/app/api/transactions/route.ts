import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

/**
 * POST /api/transactions
 * Demonstrates Prisma transactions with automatic rollback on error
 * 
 * Scenario: Creating a project with a team and assigning users
 * All operations must succeed together or all rollback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, teamName, userIds = [] } = body;

    if (!projectName || !teamName) {
      return NextResponse.json(
        { error: "projectName and teamName are required" },
        { status: 400 }
      );
    }

    console.log("🔄 Starting transaction...");
    const startTime = performance.now();

    // Execute transaction: Create team, project, and add team members
    const result = await prisma.$transaction(
      async (tx) => {
        // Step 1: Create team
        console.log("  → Creating team...");
        const team = await tx.team.create({
          data: {
            name: teamName,
            description: `Team for ${projectName}`,
            createdBy: 1, // Assumes user with id 1 exists
          },
        });

        // Step 2: Create project
        console.log("  → Creating project...");
        const project = await tx.project.create({
          data: {
            name: projectName,
            description: `Project managed by ${teamName}`,
            status: "PLANNING",
            createdBy: 1,
            teamId: team.id,
          },
        });

        // Step 3: Add team members (if provided)
        let teamMembers = [];
        if (userIds && userIds.length > 0) {
          console.log("  → Adding team members...");
          teamMembers = await Promise.all(
            userIds.map((userId: number) =>
              tx.teamMember.create({
                data: {
                  userId,
                  teamId: team.id,
                  role: "MEMBER",
                },
              })
            )
          );
        }

        // Step 4: Create initial task
        console.log("  → Creating initial task...");
        const task = await tx.task.create({
          data: {
            title: "Project Setup",
            description: "Initialize project workspace",
            status: "TODO",
            priority: "MEDIUM",
            projectId: project.id,
            assignedTo: 1,
          },
        });

        return { team, project, teamMembers, task };
      },
      {
        // Transaction options
        timeout: 10000, // 10 second timeout
      }
    );

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    console.log(`✅ Transaction completed successfully in ${duration}ms`);

    return NextResponse.json({
      success: true,
      message: "Transaction executed successfully - all operations committed",
      duration: `${duration}ms`,
      data: {
        team: {
          id: result.team.id,
          name: result.team.name,
        },
        project: {
          id: result.project.id,
          name: result.project.name,
          teamId: result.project.teamId,
        },
        teamMembersAdded: result.teamMembers.length,
        task: {
          id: result.task.id,
          title: result.task.title,
        },
      },
    });
  } catch (error: any) {
    console.error("❌ Transaction failed - Rolling back all changes:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Transaction failed and rolled back",
        details: error.message,
        note: "All operations were reverted to maintain data consistency",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/transactions/demo
 * Demonstrates transaction rollback by intentionally triggering an error
 */
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("mode") || "success";

  try {
    if (mode === "rollback") {
      console.log("🔄 Starting transaction with intentional error for rollback demo...");

      try {
        await prisma.$transaction(async (tx) => {
          // Create a user
          const user = await tx.user.create({
            data: {
              email: `demo-${Date.now()}@example.com`,
              name: "Demo User",
            },
          });

          console.log("  → User created:", user.id);

          // Simulate error: try to create user with duplicate email
          await tx.user.create({
            data: {
              email: `demo-${Date.now()}@example.com`, // Duplicate!
              name: "Another User",
            },
          });
        });
      } catch (txError: any) {
        console.log("✅ Transaction rolled back successfully");
        return NextResponse.json({
          success: true,
          message:
            "Rollback demonstration successful - duplicate email prevented data corruption",
          error: txError.message,
          note: "Both user creation operations were rolled back automatically",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Transaction API ready",
      endpoints: {
        POST: {
          path: "/api/transactions",
          description: "Execute successful transaction",
          body: {
            projectName: "string",
            teamName: "string",
            userIds: "number[]",
          },
        },
        GET: {
          path: "/api/transactions/demo?mode=rollback",
          description: "Demonstrate transaction rollback on error",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
