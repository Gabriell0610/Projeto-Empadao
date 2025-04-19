/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnauthorizedException } from "@/core/error/exceptions/unauthorized-exception";
import { HttpStatus } from "../../core/http";
import { formatZodErroMessage, isZodError } from "../../core/zod";
import { Request, NextFunction } from "express";
import { ZodError } from "zod";

class ErrorHandlerMiddleware {
  private parseError(error: Error) {
    const statusMap: Record<string, HttpStatus> = {
      BadRequestException: HttpStatus.BAD_REQUEST,
      InternalServerException: HttpStatus.INTERNAL_SERVER_ERROR,
      UnauthorizedException: HttpStatus.UNAUTHORIZED,
    };

    const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const status = statusMap[error?.name] || defaultStatus;

    return {
      status,
      message: error.message,
    };
  }
  handle = (error: Error, req: Request, res: any, next: NextFunction) => {
    let statusCode: number;
    let message: string;

    if (isZodError(error)) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = formatZodErroMessage(error as ZodError);
    } else {
      const parsedError = this.parseError(error);
      statusCode = parsedError.status;
      message = parsedError.message;
    }

    res.status(statusCode).json({ message });
  };
}

export { ErrorHandlerMiddleware };
