const path = require('path');
const fsPromises = require('fs/promises');
const babel = require("@babel/core");

const babelOptions = {
  ast: true
}

function checkSuffix (entryPath) {
  const suffixArr = entryPath.split('.')
  return suffixArr[suffixArr.length - 1] === 'js'  
}

async function isDirectory(entryPath) {
  const stats = await fsPromises.stat(entryPath);
  return stats.isDirectory()
}

async function transform (filePath, originPath, list) {
  const fileString = await fsPromises.readFile(filePath, 'utf8')
  const {ast} = await babel.transformSync(fileString, babelOptions);
  const {body} = ast.program
  const importList = body.filter(node => node.type === 'ImportDeclaration')
    .map(node => node.source.value)
    .filter(s => s.startsWith('.'))
    .map(p => path.resolve(originPath, `../${p}`))
    // .filter(p => !p.startsWith(originPath))
    .map(s => s.replace('/Users/liujianhong/_work_progress/molstar-master/lib/', '').split('/')[0])

    console.log(importList)
  importList.forEach(name => {
    const n = list.get(name) || 0
    list.set(name, n + 1)
  }) 
}

async function handleCollect (entryPath, originPath, list) {
  const directory = await isDirectory(entryPath);
  if (directory) {
    const dirList = await fsPromises.readdir(entryPath);
    for (let dirName of dirList) {
      const dirPath = path.resolve(entryPath, dirName)
      await handleCollect(dirPath, dirPath, list)
    }
  } else if (checkSuffix(entryPath)) {
    await transform(entryPath, originPath, list)
  }
  return list
}

async function collect (entryPath) {
  const dirList = await fsPromises.readdir(entryPath);
  const exclude = ['cli', 'commonjs', 'perf-tests', 'servers', 'tests', 'tsconfig.commonjs.tsbuildinfo']
  const allList = new Map()
  for (let dirName of dirList) {
    if (exclude.includes(dirName)) continue
    const dirPath = path.resolve(entryPath, dirName)
    const list = await handleCollect(dirPath, dirPath, new Map())
    allList.set(dirName, list)
  }
  console.log(allList)
}

(async () => {
  // transform(path.resolve(__dirname, '../lib/mol-plugin/context.js'))
  collect(path.resolve(__dirname, '../lib'))
  // const pluginPath = path.resolve(__dirname, '../lib/mol-plugin')
  // const list = await handleCollect(pluginPath, pluginPath, new Map())
  // console.log(list)
})()
