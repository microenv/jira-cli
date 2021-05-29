import * as chalk from 'chalk';

export class ErrorHandler {
  public static catch(error: Error) {
    console.log('');
    console.log(chalk.red(`Error: ${String(error)}`));
    console.log('');
    process.exit(1);
  }
}
