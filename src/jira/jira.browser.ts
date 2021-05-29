import * as chalk from "chalk";
import { Injectable } from "@nestjs/common";
import { Browser, launch, Page } from "puppeteer";
import { DatabaseSchemaConfig } from "src/database/database.types";
import { DatabaseJson } from "../database/database.json";
import { CommandError } from "../errors/command.error";
import { JiraIssue, JiraIssueSubtask } from "./jira.types";
import { AppUtils } from "../app.utils";

@Injectable()
export class JiraBrowser {
  private readonly userDataDir = AppUtils.storagePath('jira_browser_user_data');
  private browser: Browser;

  constructor(
    private readonly db: DatabaseJson,
  ) {}

  async close() {
    (await this.getBrowser()).close();
  }

  async getCurrentTasks() {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    const config = await this.db.getJiraConfig();
    await this.jiraLogin(page, config);

    const currentTasks = await this.db.getJiraTracks();
    for (let i=0; i<currentTasks.length; i++) {
      await this.getTask(currentTasks[i], 0, page);
    }
    await this.close();
  }

  async getTask(taskId: string, blockLevel: number = 0, _page?: Page) {
    const browser = await this.getBrowser();
    const page = _page || await browser.newPage();
    const config = await this.db.getJiraConfig();

    // if you provide a page, you should already be logged
    if (!_page) {
      await this.jiraLogin(page, config);
    }

    await page.goto(`${config.jiraHost}/rest/api/latest/issue/${taskId}`);

    const htmlContent = await page.content();
    const startIndex = htmlContent.indexOf('{"expand"')
    const endIndex = htmlContent.indexOf('}</pre></body></html>') + 1;
    
    if (startIndex <= 0 || endIndex <= 0) {
      console.log('htmlContent:', htmlContent);
      throw new CommandError(`Error: Parsing getTask failed (${startIndex} ${endIndex})`);
    }

    const content: JiraIssue = JSON.parse(htmlContent.substring(startIndex, endIndex));

    const currentStatus = content.fields.status.name; // In Progress
    const summary = content.fields.summary;
    const isMine = content.fields.assignee?.emailAddress === config.username;

    if (blockLevel === 0) console.log('');
    // console.log(chalk.gray(`Task ${taskId}`), chalk.green(currentStatus), chalk.gray(summary));
    this.writeTaskLine(currentStatus, taskId, summary, blockLevel, isMine);
    await this._getTask_subtasks(content.fields.subtasks, blockLevel + 1, page);
    if (blockLevel === 0) console.log('');

    // If you do not provide a page, the browser will close
    if (!_page) {
      await this.close();
    }
  }

  private async _getTask_subtasks(subtasks: JiraIssueSubtask[], blockLevel: number, page: Page) {
    for(let subt of subtasks) {
      const taskId = subt.key;
  
      await this.getTask(
        taskId,
        blockLevel,
        page,
      );
    }
  }

  private async jiraLogin(page: Page, config: DatabaseSchemaConfig) {
    await page.goto(`${config.jiraHost}/secure/Dashboard.jspa`);
  
    await page.waitForSelector('#loginform');
    await page.click('#loginform > div > div > button');
    await page.waitForSelector('#username');
    await page.type('#username', config.username);
    await page.type('#password', config.password);
    await page.click('#kc-login');
    
    await page.waitForSelector(`#header-details-user-fullname[data-username="${config.username}"]`);
  }

  private writeTaskLine(
    statusName: string,
    taskId: string = '◆',
    summary: string = '',
    blockLevel: number = 0,
    isMine: boolean = false,
  ) {
    console.log(
      '    '.repeat(blockLevel),
      this.getStatusEmoji(statusName, isMine),
      this.statusColorMine(statusName, taskId, '', isMine),
      this.statusColorMine(statusName, summary, '', isMine),
    );
  }

  private statusColorMine(
    statusName: string,
    text: string,
    errorMessage: string,
    isMine: boolean,
  ) {
    const isDone = statusName.indexOf('Done') > -1;
    const isProgress = statusName.indexOf('Progress') > -1;
    const isTodo = statusName.indexOf('To Do') > -1;
    const isUnknown = !isTodo && !isDone && !isProgress;
    
    if (!isUnknown && !isDone) {
      if (isMine || isProgress) {
        return this.statusColor(statusName, text, errorMessage);
      }
    }
    return chalk.gray(text);
  }
  
  private statusColor(
    statusName: string,
    text: string,
    errorMessage: string = '',
  ) {
    if (statusName.indexOf('Progress') > -1) {
      return chalk.yellow(text);
    } else if(statusName.indexOf('To Do') > -1) {
      return chalk.gray(text);
    } else if(statusName.indexOf('Done') > -1) {
      return chalk.green(text);
    }
  
    return chalk.red(errorMessage || text);
  }
  
  private getStatusEmoji(statusName: string, isMine: boolean) {
    let out = '';
  
    out += this.statusColor(statusName, '◆', `[${statusName}]`);
  
    // isMine
    if (isMine) {
      out += ' '+chalk.greenBright('💙');
    }
  
    return out;
  }

  private async getBrowser() {
    if (!this.browser) {
      this.browser = await launch({
        headless: true,
        userDataDir: this.userDataDir,
        ignoreHTTPSErrors: true,
      });
    }

    return this.browser;
  }
}
