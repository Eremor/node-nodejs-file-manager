import {
  createReadStream,
  createWriteStream,
  access,
  constants
} from 'fs';
import { sep } from 'path';
import { pipeline } from 'stream/promises';
import { checkIsDirectory, checkIsFile, normalizePath } from '../utils/utils.js';

export const copyFile = async (currentDir, args) => {
  if (!args || args.length !== 2) {
    throw new Error('Invalid input')
  }

  try {
    const [oldFile, newFolder] = args;
    const oldFilePath = normalizePath(currentDir, oldFile);
    const newFolderPath = normalizePath(currentDir, newFolder);

    await checkIsFile(oldFilePath);
    await checkIsDirectory(newFolderPath);

    const copyFile = oldFilePath.split(sep).slice(-1);
    const copyFilePath = normalizePath(newFolderPath, ...copyFile);

    return new Promise((res, rej) => {
      access(copyFilePath, constants.F_OK, (err) => {
        if (err) {
          const rs = createReadStream(oldFilePath);
          const ws = createWriteStream(copyFilePath);
          pipeline(
            rs,
            ws
          )
          res();
        } else {
          rej(new Error('Operation failed'))
        }
      })
    })
  } catch {
    throw new Error('Operation failed')
  }
}