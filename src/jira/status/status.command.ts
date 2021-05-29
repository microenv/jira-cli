import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { DatabaseJson } from '../../database/database.json';
import { JiraBrowser } from '../jira.browser';

@Command({ name: 'status' })
export class StatusCommand implements CommandRunner {
  constructor(
    private readonly db: DatabaseJson,
    private readonly browser: JiraBrowser,
  ) {}

  async run(inputs: string[]): Promise<void> {
    const subcommand = inputs[0];
    
    if (subcommand) {
      this.showError(subcommand);
      return;
    }

    await this.browser.getCurrentTasks();
  }

  showError(subcommand: string) {
    console.log('Invalid track subcommand:', subcommand);
    console.log('');
    console.log('Usage:');
    console.log('jira status');
    console.log('');
  }
}
