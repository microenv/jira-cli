import { mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

let storageBasePath = join(homedir(), '.microenv/jira-cli');

export class AppUtils {
  public static createStorageDir() {
    mkdirSync(storageBasePath, {
      recursive: true,
    });
  }

  public static storagePath(path: string) {
    return join(storageBasePath, path);
  }
}
