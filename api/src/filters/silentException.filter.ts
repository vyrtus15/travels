import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { STATUS_CODES } from 'http';

@Catch(HttpException)
export class SilentExceptionsFilter extends BaseExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus();
    if (status < 400) {
      super.catch(exception, host);
    }

    // Send a general HTTP response.
    super.catch(new HttpException(STATUS_CODES[status], status), host);
  }

}
