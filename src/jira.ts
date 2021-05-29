#!/usr/bin/env node
import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { AppUtils } from './app.utils';
import { ErrorHandler } from './error.handler';

const enableLogger = false;

async function bootstrap() {
  try {
    AppUtils.createStorageDir();
    await CommandFactory.run(AppModule, enableLogger && new Logger());
  } catch(error) {
    ErrorHandler.catch(error);
  }
}

bootstrap();
