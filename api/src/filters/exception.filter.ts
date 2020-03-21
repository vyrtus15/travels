import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Error } from 'mongoose';

@Catch()
export class CustomExceptionsFilter extends BaseExceptionFilter {

  private readonly knownErrorFilters = [
    isMongoDuplicateError,
    isCastError,
  ];

  catch(exception: any, host: ArgumentsHost) {
    const isKnownError = this.knownErrorFilters.some(filter => filter(exception));
    if (isKnownError) {
      return this.catchErrorResult(exception, host);
    }

    super.catch(exception, host);
  }

  private catchErrorResult(exception: any, host: ArgumentsHost) {
    const message = isMongoDuplicateError(exception) ? `Duplicate value '${exception?.keyValue}'.` : exception.message;

    const details = {
      statusCode: HttpStatus.BAD_REQUEST,
      message,
    };

    super.catch(new HttpException(details, HttpStatus.BAD_REQUEST), host);
  }
}

function isMongoDuplicateError(exception: any) {
  return exception &&
    exception.name === 'MongoError' &&
    exception.code === 11000;
}

function isCastError(exception: any) {
  return exception instanceof Error.CastError;
}
