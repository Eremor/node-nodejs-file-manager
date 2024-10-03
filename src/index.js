import readline from 'readline/promises';
import { stdin, stdout } from 'process';
import { homedir } from 'os';

import { getUsername, lineParser } from './utils/utils.js';
import { up } from './nwd/up.js';
import { cd } from './nwd/cd.js';
import { ls } from './nwd/ls.js';
import { readFile } from './fs/read.js';

const rl = readline.createInterface({
  input: stdin,
  output: stdout
});

const username = getUsername();
let currentDir = homedir();

rl.write(`Welcome to the File Manager, ${username}!\n`);
rl.write(`You are currently in ${currentDir}\n`);

rl.prompt();

rl.on('line', async (line) => {
  try {
    const [command, args] = lineParser(line);

    switch (command) {
      case '.exit':
        rl.close()
        break;
      case 'up':
        currentDir = up(currentDir, args)
        break;
      case 'cd':
        currentDir = await cd(currentDir, args)
        break;
      case 'ls':
        await ls(currentDir, args)
        break;
      case 'cat':
        await readFile(currentDir, args)
        break;
    
      default:
        throw new Error('Invalid input')
    }
  } catch (error) {
    console.error(error.message)
  }

  stdout.write(`You are currently in ${currentDir}\n`)
  rl.prompt();
})

rl.on('close', () => {
  stdout.write(`Thank you for using File Manager, ${username}, goodbye!\n`);
  process.exit(0);
})