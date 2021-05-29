import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { DatabaseSchemaConfig } from '../../database/database.types';
import { DatabaseJson } from '../../database/database.json';
import { CommandError } from '../../errors/command.error';
import { JiraUtils } from '../jira.utils';

@Command({ name: 'config' })
export class ConfigCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly db: DatabaseJson,
  ) {}

  async run(
    inputs: string[],
    options: DatabaseSchemaConfig,
  ): Promise<void> {
    const subcommand = inputs[0];

    switch (subcommand) {
      case 'list': await this.listConfigs(); break;
      case 'set': await this.setConfigs(options); break;
      case 'remove': await this.removeConfigs(); break;
      default: this.showError(subcommand);
    }
  }

  async listConfigs() {
    await this.db.read();
    console.log('');
    console.log('Jira Host:', this.db.data.config.jiraHost || null);
    console.log('Username: ', this.db.data.config.username || null);
    console.log('');
  }

  async setConfigs(options: DatabaseSchemaConfig) {
    options = await this.inquirerService.ask('ConfigQuestions', options);

    await this.db.read();
    this.db.data.config = options;
    await this.db.write();
  }

  async removeConfigs() {
    try {
      await this.db.deleteDatabaseFile();
    } catch(error) {}

    console.log('');
    console.log('Your configs were removed!');
    console.log('');
  }

  private showError(subcommand: string) {
    console.log('Invalid subcommand', subcommand);
    console.log('');
    console.log('Usage:');
    console.log('jira config list');
    console.log('jira config set');
    console.log('jira config remove');
    console.log('');
  }
}
