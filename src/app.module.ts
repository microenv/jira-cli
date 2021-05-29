import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { JiraModule } from './jira/jira.module';

@Module({
  imports: [
    DatabaseModule,
    JiraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
