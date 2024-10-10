import {
  createReadStream,
  createWriteStream
} from 'fs';
import { sep } from 'path';
import { access, constants } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { checkIsDirectory, checkIsFile, generateCopyFileName, normalizePath } from '../utils/utils.js';

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
    let isExist = false

    await access(copyFilePath, constants.F_OK)
      .then(() => isExist = true)
      .catch(() => isExist = false)
    
    let newFilePath;

    if (isExist) {
      const newCopyFileName = await generateCopyFileName(...copyFile, newFolderPath)
      newFilePath = normalizePath(newFolderPath, newCopyFileName)
    } else {
      newFilePath = copyFilePath
    }

    const rs = createReadStream(oldFilePath)
    const ws = createWriteStream(newFilePath)

    await pipeline(
      rs,
      ws
    )
  } catch {
    throw new Error('Operation failed')
  }
}