import path from 'path';

export const up = (currentDir, args) => {
  if (args !== undefined) {
    throw new Error('Invalid input')
  }

  const dirs = currentDir.split(path.sep);

  if (dirs.length > 1) {
    return path.join(...dirs, '..')
  } else {
    return dirs[0]
  }
}