import { Global, Module } from '@nestjs/common';
import { DatabaseJson } from './database.json';

@Global()
@Module({
  providers: [DatabaseJson],
  exports: [DatabaseJson],
})
export class DatabaseModule {}
