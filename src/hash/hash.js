import { createReadStream } from 'fs';
import { checkIsFile, normalizePath } from '../utils/utils.js';

const { createHash } = await import('crypto');

export const calcHash = async (currentDir, args) => {
  if (!args || args.length > 1) {
    throw new Error('Invalid input')
  }

  try {
    const path = normalizePath(currentDir, ...args);
    await checkIsFile(path);

    const hash = createHash('sha256');
    const rs = createReadStream(path);

    return new Promise((res, rej) => {
      rs
        .pipe(hash)
        .setEncoding('hex')
        .on('data', (data) => {
          process.stdout.write(`${data}\n`)
          res()
        })
        .on('error', () => {
          rej(new Error('Operation failed'))
        })
    })
  } catch {
    throw new Error('Operation failed')
  }
}