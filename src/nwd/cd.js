import { join, sep } from 'path';

import { checkIsDirectory, normalizePath } from '../utils/utils.js';

export const cd = async (currentPath, args) => {
  if (!args || args.length > 1) {
    throw new Error('Invalid input')
  }

  if (currentPath.split(sep).length <= 1) {
    if (args[0].startsWith('..') || args[0].startsWith(`.${sep}..`) || args[0].startsWith(`./..`)) {
      return currentPath
    }
  }

  const normalPath = normalizePath(currentPath, ...args);
  await checkIsDirectory(normalPath);
  
  const dirs = normalPath.split(sep)

  return join(...dirs)
}