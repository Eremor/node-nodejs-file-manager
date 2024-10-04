import { sep } from 'path';
import {
  createReadStream,
  createWriteStream
} from 'fs';
import { pipeline } from 'stream/promises';
import { access, constants, rm } from 'fs/promises';
import { createBrotliDecompress } from 'zlib';
import {
  checkIsDirectory,
  checkIsFile,
  generateCopyFileName,
  normalizePath
} from '../utils/utils.js';

export const decompressFile = async (currentDir, args) => {
  if (!args || args.length !== 2) {
    throw new Error('Invalid input')
  }

  try {
    const [archive, destination] = args;
    const pathToArchive = normalizePath(currentDir, archive);
    const pathToDestination = normalizePath(currentDir, destination);

    await checkIsFile(pathToArchive);
    await checkIsDirectory(pathToDestination);

    const archiveName = pathToArchive.split(sep).slice(-1);
    const fileName = archiveName[0].slice(0, archiveName.length - 4);
    const pathToFile = normalizePath(pathToDestination, fileName);

    let isExist = false;

    await access(pathToFile, constants.F_OK)
      .then(() => isExist = true)
      .catch(() => isExist = false)
    
    let pathToNewFile;

    if (isExist) {
      const newFileName = await generateCopyFileName(pathToFile, pathToDestination)
      pathToNewFile = normalizePath(pathToDestination, newFileName);
    } else {
      pathToNewFile = pathToFile
    }

    const rs = createReadStream(pathToArchive)
    const ws = createWriteStream(pathToNewFile)
    const brotli = createBrotliDecompress()

    await pipeline(
      rs,
      brotli,
      ws
    )

    await rm(pathToArchive)
  } catch {
    throw new Error('Operation failed')
  }
}