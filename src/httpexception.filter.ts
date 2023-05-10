import { Request, Response } from 'express';
import { ArgumentsHost, Catch, ConflictException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =  HttpStatus.BAD_REQUEST;
    let message = 'mongo exception'
    const start = exception.message.indexOf('{')
    const end = exception.message.indexOf('}',start)+1
    console.log(exception.message)
    switch (exception.code) {
      case 11000:
        // duplicate exception
        // do whatever you want here, for instance send error to client
        
        message = 'duplicate '+exception.message.substring(start,end)
    }
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: [message]
      });
  }
}