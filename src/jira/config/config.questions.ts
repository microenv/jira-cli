import { Question, QuestionSet } from "nest-commander";
import { CommandError } from "../../errors/command.error";
import { JiraUtils } from "../jira.utils";

// Based on
// https://dev.to/nestjs/introducing-nest-commander-5a3o

@QuestionSet({ name: 'ConfigQuestions' })
export class ConfigQuestions {
  @Question({
    type: 'input',
    name: 'jiraHost',
    message: 'What is your jira host?',
  })
  async parseJiraHost(jiraHost: string) {
    let parsedJiraHost = await JiraUtils.parseJiraHost(jiraHost);
    return parsedJiraHost;
  }

  @Question({
    type: 'input',
    name: 'username',
    message: 'What is your jira user/email?',
  })
  async parseUsername(username: string) {
    await JiraUtils.parseUsername(username);
    return username;
  }

  @Question({
    type: 'password',
    name: 'password',
    message: 'What is your jira password?',
  })
  async parsePassword(password: string) {
    await JiraUtils.parsePassword(password);
    return password;
  }
}
