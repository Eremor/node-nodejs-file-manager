import { rm } from 'fs/promises';
import { checkIsFile, normalizePath } from '../utils/utils.js';

export const deleteFile = async (currentDir, args) => {
  if (!args || args.length > 1) {
    throw new Error('Invalid input')
  }

  try {
    const path = normalizePath(currentDir, ...args);
    await checkIsFile(path);
    await rm(path);
  } catch {
    throw new Error('Operation failed')
  }
}