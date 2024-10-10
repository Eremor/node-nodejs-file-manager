import { createWriteStream, access, constants } from 'fs';
import { normalizePath } from '../utils/utils.js';

export const createFile = async (currentDir, args) => {
  if (!args || args.length > 1) {
    throw new Error('Invalid input')
  }

  const path = normalizePath(currentDir, ...args);
  return new Promise((res, rej) => {
    access(path, constants.F_OK, (err) => {
      if (err) {
        const ws = createWriteStream(path);
        ws.close();
        res();
      } else {
        rej(new Error('Operation failed'))
      }
    })
  })
}