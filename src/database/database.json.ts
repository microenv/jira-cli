import { join } from "path";
import { existsSync, readFile, unlink, writeFile } from "fs";
import { DatabaseSchema, DatabaseSchemaConfig, DatabaseSchemaTracks, defaultDatabaseData } from "./database.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseJson {
  public data: DatabaseSchema;
  private readonly filePath: string = join(__dirname, "jira-cli.db");

  async getJiraConfig(): Promise<DatabaseSchemaConfig> {
    await this.read();
    return this.data.config;
  }

  async getJiraTracks(): Promise<DatabaseSchemaTracks> {
    await this.read();
    return this.data.tracks;
  }

  async read(): Promise<DatabaseSchema> {
    return new Promise((resolve, reject) => {
      if (!existsSync(this.filePath)) {
        this.data = defaultDatabaseData;
        resolve(this.data);
        return;
      }

      readFile(this.filePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          this.data = JSON.parse(data) as unknown as DatabaseSchema;
          resolve(this.data);
        } catch(error) {
          reject(error);
        }
      });
    });
  }

  async write(): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(this.filePath, JSON.stringify(this.data), {
        encoding: 'utf-8',
      }, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  async deleteDatabaseFile(): Promise<void> {
    return new Promise((resolve, reject) => {
      unlink(this.filePath, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}
