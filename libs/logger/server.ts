import { createLogger } from "./core";
import type { LogContext } from "./types";

export const serverLogger = createLogger({ source: "server" });

export const logApiRequest = (
  method: string,
  path: string,
  context?: LogContext
) => {
  serverLogger.info(`${method} ${path}`, {
    ...context,
    source: "api",
  });
};

export const logApiResponse = (
  method: string,
  path: string,
  status: number,
  durationMs: number,
  context?: LogContext
) => {
  const message = `${method} ${path} ${status} (${durationMs}ms)`;
  const ctx = { ...context, source: "api", status };

  if (status >= 500) {
    serverLogger.error(message, undefined, ctx);
  } else if (status >= 400) {
    serverLogger.warn(message, ctx);
  } else {
    serverLogger.info(message, ctx);
  }
};

export const logApiError = (
  method: string,
  path: string,
  error: Error,
  context?: LogContext
) => {
  serverLogger.error(`${method} ${path} failed`, error, {
    ...context,
    source: "api",
  });
};
