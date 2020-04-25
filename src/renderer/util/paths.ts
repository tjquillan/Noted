import {
    getDataHome as pfGetDataHome,
    getConfigHome as pfGetConfigHome
} from 'platform-folders';
import * as path from 'path';
import * as fs from 'fs';

const APP_NAME = "Noted"

const DATA_HOME = path.join(pfGetDataHome(), APP_NAME)
const CONFIG_HOME = path.join(pfGetConfigHome(), APP_NAME)

/**
 * Return the data home for the current OS.
 *
 * This will also create the path if it does not already exist
 *
 * @param paths Optional paths inside the data home
 */
export function getDataHome(...paths: Array<string>): string {
    const dataHome = path.join(DATA_HOME, ...paths)

    if (!fs.existsSync(dataHome)) {
        fs.mkdirSync(dataHome, {recursive: true})
    }

    return dataHome
}

export function getNotebooksHome(): string {
  return getDataHome("Notebooks")
}

/**
 * Return the config home for the current OS.
 *
 * This will also create the path if it does not already exist
 *
 * @param paths Optional paths inside the config home
 */
export function getConfigHome(...paths: Array<string>): string {
    const configHome = path.join(CONFIG_HOME, ...paths)

    if (!fs.existsSync(configHome)) {
        fs.mkdirSync(configHome)
    }

    return configHome
}
