import {
  EOL,
  cpus,
  homedir,
  userInfo,
  arch
} from 'os';

export const osInfo = (args) => {
  if (!args || args.length > 1) {
    throw new Error('Invalid input')
  }

  const [arg] = args;

  if (arg.includes('--')) {
    switch (arg.slice(2)) {
      case 'EOL':
        process.stdout.write(`The os EOL: ${JSON.stringify(EOL)}\n`)
        break;
      case 'cpus':
        process.stdout.write(`Overall amount of CPUS: ${cpus().length}\n`)
        printCPUsInfo()
        break;
      case 'homedir':
        process.stdout.write(`Home directory: ${homedir()}\n`)
        break;
      case 'username':
        process.stdout.write(`Current system user name: ${userInfo().username}\n`)
        break;
      case 'architecture':
        process.stdout.write(`CPU architecture: ${arch()}\n`)
        break;
      default:
        throw new Error('Invalid input')
    }
  } else {
    throw new Error('Invalid input')
  }
}

const printCPUsInfo = () => {
  const table = cpus().map((cpu) => ({
    'Model': cpu.model,
    'Rate': (cpu.speed / 1000).toFixed(2) + ' GHz'
  }))
  console.table(table)
}