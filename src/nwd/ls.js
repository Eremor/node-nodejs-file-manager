import { readdir } from 'fs/promises';

export const ls = async (currentDir, args) => {
  if (args) {
    throw new Error('Invalid input')
  }

  try {
    const files = await readdir(currentDir, { withFileTypes: true });
    const dirArr = [];
    const fileArr = [];

    for (const file of files) {
      if (file.isFile()) {
        fileArr.push({
          'Name': file.name,
          'Type': 'file'
        })
      } else {
        dirArr.push({
          'Name': file.name,
          'Type': 'directory'
        })
      }
    }

    const table = [
      ...dirArr.sort((a, b) => a.Name < b.Name),
      ...fileArr.sort((a, b) => a.Name < b.Name)
    ];

    console.table(table)
  } catch {
    throw new Error('Operation failed')
  }
}