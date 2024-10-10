import { createReadStream } from 'fs';
import { checkIsFile, normalizePath } from '../utils/utils.js';

export const readFile = async (currentDir, args) => {
  if (!args || args.length > 1) {
    throw new Error('Invalid input')
  }

  try {
    const path = normalizePath(currentDir, ...args)
    await checkIsFile(path)

    return new Promise((res) => {
      const rs = createReadStream(path)
      rs.on('data', (chunk) => {
        process.stdout.write(chunk.toString() + '\n');
      })
      rs.on('end', () => {
        res()
      })
    })
  } catch {
    throw new Error('Operation failed')
  }
}