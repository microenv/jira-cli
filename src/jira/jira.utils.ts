import { CommandError } from "../errors/command.error";

export class JiraUtils {
  public static async parseJiraHost(jiraHost: string) {
    let jHost = jiraHost;

    if (!jHost) {
      throw new CommandError('Jira host can not be empty');
    }

    if (!jHost.startsWith('http://') && !jHost.startsWith('https://')) {
      throw new CommandError('Jira host should start with "http://" or "https://"');
    }

    jHost = jHost.split('/').slice(0, 3).join('/');

    const slashLength = (jHost.match(/\//g) || []).length;
    if (slashLength !== 2) {
      throw new CommandError(`Jira host should have exactly two slashes, it has ${slashLength}`);
    }

    return jHost;
  }

  public static async parseUsername(username: string) {
    if (!username) {
      throw new CommandError('Jira username can not be empty');
    }
  }

  public static async parsePassword(password: string) {
    if (!password) {
      throw new CommandError('Jira password can not be empty');
    }
  }
}
