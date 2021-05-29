import { Module } from '@nestjs/common';
import { ConfigCommand } from './config/config.command';
import { ConfigQuestions } from './config/config.questions';
import { JiraBrowser } from './jira.browser';
import { StatusCommand } from './status/status.command';
import { TrackCommand } from './track/track.command';

@Module({
  providers: [
    JiraBrowser,
    ConfigCommand,
    TrackCommand,
    StatusCommand,
    ConfigQuestions,
  ],
})
export class JiraModule {}
