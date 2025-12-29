import { NextResponse } from "next/server";
import { testConnection } from "@/lib/dbConnection";

/**
 * Database Health Check Endpoint
 * GET /api/health/db
 * 
 * Tests connection to PostgreSQL database
 * Works with both local (Docker) and cloud (RDS/Azure) databases
 */
export async function GET() {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        database: process.env.DATABASE_URL?.includes('rds.amazonaws.com') 
          ? 'AWS RDS PostgreSQL'
          : process.env.DATABASE_URL?.includes('postgres.database.azure.com')
          ? 'Azure PostgreSQL'
          : 'Local PostgreSQL (Docker)',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Database connection failed",
        error: "Could not establish connection",
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: "Database health check failed",
      error: error.message,
    }, { status: 500 });
  }
}
