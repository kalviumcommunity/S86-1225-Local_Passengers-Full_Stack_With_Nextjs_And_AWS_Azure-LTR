import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      name: "John Doe",
      phone: "+1234567890",
      role: "PROJECT_MANAGER",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      phone: "+0987654321",
      role: "TEAM_LEAD",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      role: "USER",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: "alice.johnson@example.com",
      name: "Alice Johnson",
      role: "USER",
    },
  });

  console.log("✅ Created 4 users");

  // Create teams
  const team1 = await prisma.team.create({
    data: {
      name: "Frontend Team",
      description: "Responsible for UI/UX development",
      createdBy: user1.id,
      members: {
        create: [
          { userId: user1.id, role: "LEAD" },
          { userId: user3.id, role: "MEMBER" },
        ],
      },
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: "Backend Team",
      description: "Responsible for API and database",
      createdBy: user2.id,
      members: {
        create: [
          { userId: user2.id, role: "LEAD" },
          { userId: user4.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("✅ Created 2 teams with members");

  // Create tags
  const tag1 = await prisma.tag.create({
    data: {
      name: "Bug",
      color: "#FF0000",
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: "Feature",
      color: "#00FF00",
    },
  });

  const tag3 = await prisma.tag.create({
    data: {
      name: "Documentation",
      color: "#0000FF",
    },
  });

  console.log("✅ Created 3 tags");

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Local Passenger Portal",
      description:
        "A web application for managing local passenger transportation services",
      status: "IN_PROGRESS",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      budget: 50000,
      location: "City Center",
      createdBy: user1.id,
      teamId: team1.id,
      tags: {
        create: [
          { tagId: tag2.id },
          { tagId: tag3.id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Payment Gateway Integration",
      description: "Integrate payment processing for the passenger portal",
      status: "PLANNING",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-06-30"),
      budget: 25000,
      location: "Remote",
      createdBy: user2.id,
      teamId: team2.id,
      tags: {
        create: [{ tagId: tag2.id }],
      },
    },
  });

  console.log("✅ Created 2 projects with tags");

  // Create tasks for project 1
  const task1 = await prisma.task.create({
    data: {
      title: "Design user dashboard",
      description: "Create mockups for the main user dashboard",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: project1.id,
      assignedTo: user3.id,
      dueDate: new Date("2024-03-15"),
      tags: {
        create: [{ tagId: tag2.id }],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Setup authentication",
      description: "Implement JWT-based authentication",
      status: "TODO",
      priority: "URGENT",
      projectId: project1.id,
      assignedTo: user4.id,
      dueDate: new Date("2024-02-28"),
      tags: {
        create: [
          { tagId: tag2.id },
          { tagId: tag1.id },
        ],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Fix login page styling",
      description: "Adjust CSS for responsive design",
      status: "COMPLETED",
      priority: "MEDIUM",
      projectId: project1.id,
      assignedTo: user3.id,
      dueDate: new Date("2024-02-20"),
      tags: {
        create: [{ tagId: tag1.id }],
      },
    },
  });

  console.log("✅ Created 3 tasks for project 1");

  // Create tasks for project 2
  const task4 = await prisma.task.create({
    data: {
      title: "Research payment providers",
      description: "Compare features and pricing of different payment services",
      status: "IN_PROGRESS",
      priority: "HIGH",
      projectId: project2.id,
      assignedTo: user4.id,
      dueDate: new Date("2024-03-10"),
    },
  });

  await prisma.task.create({
    data: {
      title: "Write payment API documentation",
      description: "Create comprehensive API docs for payment endpoints",
      status: "TODO",
      priority: "MEDIUM",
      projectId: project2.id,
      assignedTo: user2.id,
      dueDate: new Date("2024-04-01"),
      tags: {
        create: [{ tagId: tag3.id }],
      },
    },
  });

  console.log("✅ Created 2 tasks for project 2");

  // Create subtasks
  await prisma.subtask.create({
    data: {
      title: "Create wireframes",
      taskId: task1.id,
    },
  });

  await prisma.subtask.create({
    data: {
      title: "Design color scheme",
      taskId: task1.id,
    },
  });

  await prisma.subtask.create({
    data: {
      title: "Implement JWT tokens",
      taskId: task2.id,
    },
  });

  console.log("✅ Created 3 subtasks");

  // Create comments
  await prisma.comment.create({
    data: {
      content: "Dashboard design looks great! Please add dark mode support.",
      taskId: task1.id,
      authorId: user1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        "I've started working on the authentication. Using express-jwt library.",
      taskId: task2.id,
      authorId: user4.id,
    },
  });

  await prisma.comment.create({
    data: {
      content:
        "Need to test payment integration with sandbox environment first.",
      taskId: task4.id,
      authorId: user2.id,
    },
  });

  console.log("✅ Created 3 comments");

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: user3.id,
      message: "You have been assigned to task: Design user dashboard",
      type: "TASK_ASSIGNED",
      relatedTaskId: task1.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user4.id,
      message: "New comment on task: Setup authentication",
      type: "COMMENT_ADDED",
      relatedTaskId: task2.id,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user1.id,
      message: "Project Local Passenger Portal status updated to IN_PROGRESS",
      type: "PROJECT_UPDATED",
    },
  });

  console.log("✅ Created 3 notifications");

  console.log("🎉 Database seeding completed successfully!");

  // Display summary
  const userCount = await prisma.user.count();
  const teamCount = await prisma.team.count();
  const projectCount = await prisma.project.count();
  const taskCount = await prisma.task.count();
  const commentCount = await prisma.comment.count();
  const notificationCount = await prisma.notification.count();

  console.log("\n📊 Database Summary:");
  console.log(`   Users: ${userCount}`);
  console.log(`   Teams: ${teamCount}`);
  console.log(`   Projects: ${projectCount}`);
  console.log(`   Tasks: ${taskCount}`);
  console.log(`   Comments: ${commentCount}`);
  console.log(`   Notifications: ${notificationCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
