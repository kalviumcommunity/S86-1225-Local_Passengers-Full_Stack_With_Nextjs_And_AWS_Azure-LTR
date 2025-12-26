/**
 * Input Sanitization & OWASP Compliance Demo
 *
 * Interactive demonstration of:
 * - XSS (Cross-Site Scripting) prevention
 * - SQL Injection prevention
 * - Input sanitization techniques
 * - Before/After comparisons
 */

"use client";

import { useState } from "react";

interface TestResult {
  original: string;
  tests: {
    [key: string]: {
      input: string;
      output: string;
      description: string;
    };
  };
  securityChecks: {
    containsXss: boolean;
    containsSqlInjection: boolean;
  };
  verdict: {
    safe: boolean;
    reasons: string[];
    recommendation: string;
  };
}

export default function SanitizationDemoPage() {
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Predefined dangerous inputs for testing
  const dangerousInputs = {
    xssScript: '<script>alert("XSS Attack!")</script>',
    xssImg: "<img src=x onerror=\"alert('XSS')\">",
    xssIframe: "<iframe src=\"javascript:alert('XSS')\"></iframe>",
    sqlUnion: "' OR 1=1 UNION SELECT * FROM users --",
    sqlDrop: "'; DROP TABLE trains; --",
    sqlComment: "admin'--",
    eventHandler: "<div onclick=\"alert('XSS')\">Click me</div>",
    javascriptProtocol: 'javascript:alert("XSS")',
  };

  const testSanitization = async () => {
    if (!testInput) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/examples/test-sanitization?input=${encodeURIComponent(testInput)}`
      );
      const data = await response.json();
      setTestResult(data.data);
    } catch {
      setTestResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const testAlertCreation = async (useSanitization: boolean) => {
    const payload = {
      trainNumber: testInput,
      trainName: testInput,
      message: testInput,
      severity: "medium",
    };

    try {
      const endpoint = useSanitization
        ? "/api/examples/sanitized-alert"
        : "/api/alerts"; // Assuming non-sanitized endpoint

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      alert(
        useSanitization
          ? `✅ With Sanitization: ${JSON.stringify(data, null, 2)}`
          : `⚠️ Without Sanitization: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-6">
        🛡️ Input Sanitization & OWASP Compliance Demo
      </h1>

      <p className="text-gray-600 mb-8">
        This page demonstrates how input sanitization protects against XSS and
        SQL Injection attacks. Test dangerous inputs to see how they&apos;re
        neutralized.
      </p>

      {/* Input Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">🧪 Test Input</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Enter potentially dangerous input:
          </label>
          <textarea
            className="w-full border-2 border-gray-300 rounded p-3 font-mono text-sm"
            rows={3}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Enter text to test sanitization..."
          />
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={testSanitization}
            disabled={!testInput || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Testing..." : "🔍 Test Sanitization"}
          </button>

          <button
            onClick={() => setTestInput("")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {/* Predefined dangerous inputs */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">📋 Try Dangerous Inputs:</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(dangerousInputs).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTestInput(value)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 text-left font-mono"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {testResult && (
        <div className="space-y-6">
          {/* Security Verdict */}
          <div
            className={`shadow-lg rounded-lg p-6 ${
              testResult.verdict.safe
                ? "bg-green-50 border-2 border-green-300"
                : "bg-red-50 border-2 border-red-300"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-3">
              {testResult.verdict.safe
                ? "✅ Safe Input"
                : "⚠️ Dangerous Input Detected"}
            </h2>

            <div className="space-y-2">
              <p className="font-semibold">Security Checks:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  XSS Pattern:{" "}
                  <span
                    className={
                      testResult.securityChecks.containsXss
                        ? "text-red-600 font-bold"
                        : "text-green-600"
                    }
                  >
                    {testResult.securityChecks.containsXss
                      ? "DETECTED ❌"
                      : "Clean ✅"}
                  </span>
                </li>
                <li>
                  SQL Injection:{" "}
                  <span
                    className={
                      testResult.securityChecks.containsSqlInjection
                        ? "text-red-600 font-bold"
                        : "text-green-600"
                    }
                  >
                    {testResult.securityChecks.containsSqlInjection
                      ? "DETECTED ❌"
                      : "Clean ✅"}
                  </span>
                </li>
              </ul>

              {testResult.verdict.reasons.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-red-700">Issues Found:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-600">
                    {testResult.verdict.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-3 font-semibold">
                Recommendation:{" "}
                <span
                  className={
                    testResult.verdict.safe ? "text-green-700" : "text-red-700"
                  }
                >
                  {testResult.verdict.recommendation}
                </span>
              </p>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              📊 Before/After Sanitization
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-red-50 border-2 border-red-300 rounded p-4">
                <h3 className="font-semibold text-red-700 mb-2">
                  ❌ Before (Dangerous)
                </h3>
                <pre className="bg-red-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap overflow-wrap-anywhere">
                  {testResult.original}
                </pre>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded p-4">
                <h3 className="font-semibold text-green-700 mb-2">
                  ✅ After (Safe)
                </h3>
                <pre className="bg-green-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap overflow-wrap-anywhere">
                  {testResult.tests.htmlSanitization.output}
                </pre>
              </div>
            </div>
          </div>

          {/* Detailed Sanitization Results */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              🔬 Detailed Sanitization Tests
            </h2>

            <div className="space-y-4">
              {Object.entries(testResult.tests).map(([testName, result]) => (
                <div
                  key={testName}
                  className="border-2 border-gray-200 rounded p-4"
                >
                  <h3 className="font-semibold text-lg mb-2 capitalize">
                    {testName.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {result.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        INPUT:
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap overflow-wrap-anywhere">
                        {result.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-1">
                        OUTPUT:
                      </p>
                      <pre className="bg-green-50 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap overflow-wrap-anywhere">
                        {result.output || "(empty - rejected as invalid)"}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Test Section */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              🧪 Test API with Current Input
            </h2>
            <p className="text-gray-600 mb-4">
              Send the current input to API endpoints to see how sanitization
              works in practice:
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => testAlertCreation(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ✅ Send WITH Sanitization
              </button>
              <button
                onClick={() => testAlertCreation(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                ⚠️ Send WITHOUT Sanitization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-3">
          📚 About OWASP & Security
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">What is OWASP?</h3>
            <p className="text-gray-700">
              The Open Web Application Security Project (OWASP) is a nonprofit
              foundation that works to improve software security. They maintain
              the OWASP Top 10, a list of the most critical web application
              security risks.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Common Vulnerabilities:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>XSS (Cross-Site Scripting):</strong> Injecting malicious
                scripts into web pages viewed by other users.
              </li>
              <li>
                <strong>SQL Injection:</strong> Inserting malicious SQL code to
                manipulate database queries.
              </li>
              <li>
                <strong>HTML Injection:</strong> Injecting HTML to modify page
                structure or phish users.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Our Protection Strategy:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Input Validation:</strong> Zod schemas validate data
                structure
              </li>
              <li>
                <strong>Malicious Pattern Detection:</strong> Check for attack
                signatures
              </li>
              <li>
                <strong>Sanitization:</strong> Remove/escape dangerous
                characters
              </li>
              <li>
                <strong>Output Encoding:</strong> Safely render user content
              </li>
              <li>
                <strong>Parameterized Queries:</strong> Prisma ORM prevents SQL
                injection
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
