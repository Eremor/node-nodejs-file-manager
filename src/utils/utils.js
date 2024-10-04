import { isAbsolute, join, sep, resolve } from 'path';
import { argv } from 'process';
import { access, stat, constants } from 'fs/promises';

const quotes = {
  single: '\'',
  double: '\"',
  back: '\`',
  none: ' '
}

export const getUsername = () => {
  const userArgv = argv.find((value) => value.startsWith('--username'));
  const username = userArgv.split('=')[1];
  return (username === '' || !username) ? 'anonymous' : username;
}

const separateQuotes = (line) => {
  let quoteSep;

  if (line.includes(quotes.single)) {
    quoteSep = quotes.single;
  } else if (line.includes(quotes.double)) {
    quoteSep = quotes.double;
  } else if (line.includes(quotes.back)) {
    quoteSep = quotes.back;
  } else {
    quoteSep = quotes.none;
  }

  const args = line
                .split(quoteSep)
                .filter((item) => item.trim().length > 0)
                .map((item) => item.trim())

  return args;
}

export const lineParser = (line) => {
  if (line === '') {
    throw new Error('Invalid input')
  }

  const lineArr = separateQuotes(line);

  const command = lineArr[0]

  if (lineArr.length > 1) {
    const args = lineArr.slice(1)
    return [command, args]
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

export const generateCopyFileName = async (fileName, folder) => {
  const [name, fileType] = fileName.split('.');
  const newName = name + '-(copy)';
  const newFileName = `${newName}.${fileType}`;
  const path = normalizePath(folder, newFileName)
  let isExist = false;
  await access(path, constants.F_OK)
    .then(() => isExist = true)
    .catch(() => isExist = false);
  
  return isExist ? await generateCopyFileName(newFileName, folder) : newFileName;
}