"use client";

import { createLogger } from "./core";
import type { LogContext } from "./types";

export const clientLogger = createLogger({ source: "client" });

export const logUserAction = (action: string, context?: LogContext) => {
  clientLogger.info(`User action: ${action}`, {
    ...context,
    source: "user-action",
  });
};

export const logUIError = (
  component: string,
  error: Error,
  context?: LogContext
) => {
  clientLogger.error(`UI Error in ${component}`, error, {
    ...context,
    source: "ui",
  });
};

export const logPerformance = (
  metric: string,
  durationMs: number,
  context?: LogContext
) => {
  clientLogger.debug(`Performance: ${metric} took ${durationMs}ms`, {
    ...context,
    source: "performance",
    durationMs,
  });
};
