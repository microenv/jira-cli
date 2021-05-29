import { mkdirSync } from "fs";
import { join } from "path";

// @TODO ~ Add path for windows
let storageBasePath = '~/.microenv/jira-cli';

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
