import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { ErrorHandler } from './error.handler';

const enableLogger = false;

async function bootstrap() {
  try {
    await CommandFactory.run(AppModule, enableLogger && new Logger());
  } catch(error) {
    ErrorHandler.catch(error);
  }
}

bootstrap();
