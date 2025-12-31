import { describe, expect, it, jest } from "@jest/globals";
import { logger } from "../logger";

describe("logger", () => {
  it("emits structured JSON for info", () => {
    const logSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    logger.info("hello", { a: 1 });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0]));

    expect(payload).toMatchObject({
      level: "info",
      message: "hello",
      meta: { a: 1 },
    });
    expect(typeof payload.timestamp).toBe("string");

    logSpy.mockRestore();
  });

  it("sets meta to null when omitted (info)", () => {
    const logSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    logger.info("hello");

    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      level: "info",
      message: "hello",
      meta: null,
    });

    logSpy.mockRestore();
  });

  it("falls back to plain logging for info when JSON stringify fails", () => {
    const stringifySpy = jest
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("boom");
      });
    const logSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    logger.info("hello", { a: 1 });

    expect(logSpy).toHaveBeenCalledWith("info:", "hello", { a: 1 });

    stringifySpy.mockRestore();
    logSpy.mockRestore();
  });

  it("emits structured JSON for error", () => {
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    logger.error("boom", { code: "E_TEST" });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(String(errorSpy.mock.calls[0]?.[0]));

    expect(payload).toMatchObject({
      level: "error",
      message: "boom",
      meta: { code: "E_TEST" },
    });
    expect(typeof payload.timestamp).toBe("string");

    errorSpy.mockRestore();
  });

  it("sets meta to null when omitted (error)", () => {
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    logger.error("boom");

    const payload = JSON.parse(String(errorSpy.mock.calls[0]?.[0]));
    expect(payload).toMatchObject({
      level: "error",
      message: "boom",
      meta: null,
    });

    errorSpy.mockRestore();
  });

  it("falls back to plain logging for error when JSON stringify fails", () => {
    const stringifySpy = jest
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("boom");
      });
    const errorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    logger.error("boom", { code: "E_TEST" });

    expect(errorSpy).toHaveBeenCalledWith("error:", "boom", { code: "E_TEST" });

    stringifySpy.mockRestore();
    errorSpy.mockRestore();
  });
});
