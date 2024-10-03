import { isAbsolute, join, sep, resolve } from 'path';
import { argv } from 'process';
import { access, stat, constants } from 'fs/promises';

const quotes = {
  single: '\'',
  double: '\"',
  none: ' '
}

export const getUsername = () => {
  const userArgv = argv.find((value) => value.startsWith('--username'));
  const username = userArgv.split('=')[1];
  return (username === '' || !username) ? 'anonymous' : username;
}

const separateArgs = (line) => {
  let sep;

  if (line.includes(quotes.single)) {
    sep = quotes.single;
  } else if (line.includes(quotes.double)) {
    sep = quotes.double;
  } else {
    sep = quotes.none;
  }

  const args = line.split(sep).filter((item) => item.trim().length > 0)

  return args;
}

export const lineParser = (line) => {
  if (line === '') {
    throw new Error('Invalid input')
  }

  const argsArr = separateArgs(line)

  const command = argsArr[0].trim();

  if (argsArr.length > 1) {
    const args = argsArr.slice(1).map((arg) => arg.includes(' ') ? separateArgs(arg) : arg)
    return [command, args.flat()]
  }

  return [command]
}

export const normalizePath = (currentPath, path) => {
  if (currentPath.split(sep).length <= 1) {
    return isAbsolute(path) ? path : resolve(currentPath, path)
  }

  return isAbsolute(path) ? path : join(currentPath, path)
}

export const checkIsDirectory = async (path) => {
  await access(path, constants.F_OK).catch(() => { throw new Error('Operation failed') })
  const dir = await stat(path)

  if (!dir.isDirectory()) {
    throw new Error('Operation failed')
  }
}

export const checkIsFile = async (path) => {
  await access(path, constants.F_OK).catch(() => { throw new Error('Operation failed') })
  const file = await stat(path)

  if (!file.isFile()) {
    throw new Error('Operation failed')
  }
}