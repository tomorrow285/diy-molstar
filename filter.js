const path = require('path');
const fsPromises = require('fs/promises');

const list = []

async function isDirectory(entryPath) {
  const stats = await fsPromises.stat(entryPath);
  return stats.isDirectory()
}

async function directoryHandler(entryPath, n = 0) {
  if (n === 2) return
  const files = await fsPromises.readdir(entryPath);
  for (const file of files) {
      const secondLevelPath = path.resolve(entryPath, file);
      const directory = await isDirectory(secondLevelPath);
      if (directory) {
        await directoryHandler(secondLevelPath, n + 1)
      } else {
        readFile(secondLevelPath)
      }
  }
}

async function readFile (filePath) {
  const res = await fsPromises.readFile(filePath, 'utf8')
  const arr = res.split(/\n|\r/g)
  
  // console.log(arr)
  arr.forEach(s => {
    if (s.startsWith('export function')) {
      list.push(s)
    }
  })
  // console.log(filePath)
  // list.push(filePath)
}

(async () => {
  await directoryHandler(path.resolve(__dirname, './src/mol-model-formats'))

  var pattern = /export\sfunction\s[a-zA-z0-9]*/g;
  console.log(list.map(s => s.match(pattern)[0].replace('export function', '-')).join('\n'))
})()