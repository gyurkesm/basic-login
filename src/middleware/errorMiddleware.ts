import { Request, Response, NextFunction } from "express";
import {
  writeErrorLog,
  writeUnkownErrorLog,
} from "../utilities/logger/loggerUtil";
import { DateTime } from "luxon";
import { AppError } from "../types/status";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const timestamp = DateTime.now().toFormat("yyyy.MM.dd HH:mm:ss.SSS");
  let statusCode = 500;
  let username = "-";
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    username = err.username || "-";
  } else {
    writeUnkownErrorLog(timestamp, err.message, err.stack || "-");
  }
  console.error(err.message, username);
  writeErrorLog(timestamp, err.message, username);
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
}
