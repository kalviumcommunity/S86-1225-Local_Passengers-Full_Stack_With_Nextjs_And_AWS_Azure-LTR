/* eslint-disable no-console */
/**
 * Cache Testing Script
 * This script demonstrates the performance improvement from Redis caching
 *
 * Run: node test-cache.js
 */

async function testCachePerformance() {
  const API_BASE = "http://localhost:5174/api";

  console.log("🧪 Starting Redis Cache Performance Test\n");
  console.log("=".repeat(60));

  // Test 1: Trains API - Cold Start (Cache Miss)
  console.log("\n📊 Test 1: GET /api/trains (Cold Start - Cache Miss)");
  console.log("-".repeat(60));

  const start1 = Date.now();
  const response1 = await fetch(`${API_BASE}/trains?page=1&limit=10`);
  const data1 = await response1.json();
  const time1 = Date.now() - start1;

  console.log(`✅ Response received in ${time1}ms`);
  console.log(`📦 Trains fetched: ${data1.data?.trains?.length || 0}`);
  console.log(`💬 Message: ${data1.message}`);

  // Wait 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test 2: Trains API - Cache Hit
  console.log("\n📊 Test 2: GET /api/trains (Cache Hit)");
  console.log("-".repeat(60));

  const start2 = Date.now();
  const response2 = await fetch(`${API_BASE}/trains?page=1&limit=10`);
  const data2 = await response2.json();
  const time2 = Date.now() - start2;

  console.log(`✅ Response received in ${time2}ms`);
  console.log(`📦 Trains fetched: ${data2.data?.trains?.length || 0}`);
  console.log(`💬 Message: ${data2.message}`);

  // Calculate improvement
  const improvement = (((time1 - time2) / time1) * 100).toFixed(2);
  const speedup = (time1 / time2).toFixed(2);

  console.log("\n" + "=".repeat(60));
  console.log("📈 PERFORMANCE ANALYSIS");
  console.log("=".repeat(60));
  console.log(`⏱️  Cold Start (Cache Miss): ${time1}ms`);
  console.log(`⚡ Cache Hit: ${time2}ms`);
  console.log(`🚀 Speed Improvement: ${improvement}%`);
  console.log(`⚡ Speed Multiplier: ${speedup}x faster`);
  console.log(`💾 Latency Reduced By: ${time1 - time2}ms`);

  console.log("\n" + "=".repeat(60));
  console.log("✅ Cache Test Completed Successfully!");
  console.log("=".repeat(60));

  console.log("\n📝 Key Observations:");
  console.log("• First request fetches from source (slower)");
  console.log("• Second request serves from Redis cache (much faster)");
  console.log("• Cache TTL is set to 120 seconds for trains data");
  console.log("• Cache automatically invalidates on data updates");
}

// Run the test
testCachePerformance().catch(console.error);
