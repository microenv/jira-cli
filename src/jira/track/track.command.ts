import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { DatabaseJson } from '../../database/database.json';

@Command({ name: 'track' })
export class TrackCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly db: DatabaseJson,
  ) {}

  async run(inputs: string[]): Promise<void> {
    const subcommand = inputs[0];
    const value = inputs[1];

    switch (subcommand) {
      case 'add': await this.trackAdd(value); break;
      case 'remove': await this.trackRemove(value); break;
      case 'list': await this.trackList(); break;
      default: this.showError(subcommand);
    }
  }

  async trackAdd(taskId: string) {
    if(!taskId) {
      console.log('');
      console.log('Please specify a taskId to track');
      console.log('');
      return;
    }

    await this.db.read();
    if (this.db.data.tracks.indexOf(taskId) === -1) {
      this.db.data.tracks.push(taskId);
      await this.db.write();
      console.log('');
      console.log('Tracking', taskId);
      console.log('');
      return;
    }

    console.log('');
    console.log('Already tracking', taskId);
    console.log('');
  }

  async trackRemove(taskId: string) {
    await this.db.read();

    if (!taskId) {
      console.log('');
      console.log('Please specify a taskId to stop tracking');
      console.log('');
      return;
    }

    if (taskId === 'all') {
      this.db.data.tracks = [];
      await this.db.write();
      return;
    }

    const indexOfTask = this.db.data.tracks.indexOf(taskId);

    if (indexOfTask === -1) {
      console.log('');
      console.log(taskId, 'is not on track list');
      console.log('');
      return;
    }

    this.db.data.tracks.splice(indexOfTask, 1);
    await this.db.write();
    console.log('');
    console.log('NOT tracking', taskId, 'anymore!');
    console.log('');
  }

  async trackList() {
    await this.db.read();
    console.log('');
    console.log('tracking:', this.db.data.tracks);
    console.log('');
  }

  showError(subcommand: string) {
    console.log('Invalid track subcommand:', subcommand);
    console.log('');
    console.log('Usage:');
    console.log('jira track add XX-12345');
    console.log('jira track remove XX-12345');
    console.log('jira track list');
    console.log('');
  }
}
