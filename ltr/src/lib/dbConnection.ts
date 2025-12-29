import { Pool } from 'pg';

/**
 * PostgreSQL Connection Utility
 * 
 * Supports both local (Docker) and cloud (AWS RDS/Azure) databases
 * Automatically handles SSL for cloud connections
 */

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Enable SSL for cloud databases (RDS/Azure)
  ssl: process.env.DATABASE_URL?.includes('rds.amazonaws.com') || 
       process.env.DATABASE_URL?.includes('postgres.database.azure.com')
    ? { rejectUnauthorized: false }
    : false,
  // Connection pool settings
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Connection timeout
});

/**
 * Test database connection
 * Useful for health checks and debugging
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connected:', {
      time: result.rows[0].current_time,
      version: result.rows[0].db_version.split(' ')[0] + ' ' + result.rows[0].db_version.split(' ')[1],
    });
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

/**
 * Execute a query
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args: any[]) => {
    // @ts-ignore
    return query.apply(client, args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
}

export default pool;
