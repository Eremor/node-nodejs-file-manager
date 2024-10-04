import { sep } from 'path';
import {
  createReadStream,
  createWriteStream
} from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress } from 'zlib';
import {
  checkIsDirectory,
  checkIsFile,
  normalizePath
} from '../utils/utils.js';

export const compressFile = async (currentDir, args) => {
  if (!args || args.length !== 2) {
    throw new Error('Invalid input')
  }

  try {
    const [file, destination] = args;
    const pathToFile = normalizePath(currentDir, file);
    const pathToDestination = normalizePath(currentDir, destination);

    await checkIsFile(pathToFile);
    await checkIsDirectory(pathToDestination);

    const fileName = pathToFile.split(sep).slice(-1);
    const pathToArchive = normalizePath(pathToDestination, `${fileName}.br`);

    const rs = createReadStream(pathToFile);
    const ws = createWriteStream(pathToArchive);
    const brotli = createBrotliCompress()

    await pipeline(
      rs,
      brotli,
      ws
    )
  } catch {
    throw new Error('Operation failed')
  }
}