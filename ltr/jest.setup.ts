// Only load jest-dom matchers in jsdom tests.
if (typeof window !== "undefined" && typeof document !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@testing-library/jest-dom");
}
