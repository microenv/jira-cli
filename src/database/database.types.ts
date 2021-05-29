export interface DatabaseSchemaConfig {
  jiraHost?: string;
  username?: string;
  password?: string;
}

export type DatabaseSchemaTracks = string[];

export interface DatabaseSchema {
  config: DatabaseSchemaConfig;
  tracks: string[];
}

export const defaultDatabaseData: DatabaseSchema = {
  config: {
    jiraHost: '',
    username: '',
    password: '',
  },
  tracks: [],
};
