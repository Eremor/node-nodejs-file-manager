import { access, constants, rename } from 'fs/promises';
import { checkIsFile, normalizePath } from '../utils/utils.js';

export const renameFile = async (currentDir, args) => {
  if (!args || args.length !== 2) {
    throw new Error('Invalid input')
  }

  try {
    const [oldFile, newFile] = args;
    const oldFilePath = normalizePath(currentDir, oldFile);
    const newFilePath = normalizePath(currentDir, newFile);
    let isExist = false;

    await checkIsFile(oldFilePath);
    await access(newFilePath, constants.F_OK)
      .then(() => isExist = true)
      .catch(() => isExist = false)

    if (!isExist) {
      await rename(oldFilePath, newFilePath)
    } else {
      throw new Error()
    }
  } catch {
    throw new Error('Operation failed')
  }
}