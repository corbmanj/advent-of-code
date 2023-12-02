import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-7.txt"),
});

const tree = {
  name: '/',
  isDir: true,
  children: [],
  parent: null,
}

let currentNode = tree;

const flatDirs = [];

function executeCommand(line) {
  if (line === '$ ls') {
    return;
  }
  const dir = line.replace('$ cd ', '');
  if (dir === '/') {
    currentNode = tree;
  } else if (dir === '..') {
    currentNode = currentNode.parent
  } else {
    currentNode = currentNode.children.find(child => child.name === dir)
  }
}

function addDir(line) {
  const dirName = line.replace('dir ', '');
  currentNode.children.push({
    name: dirName,
    isDir: true,
    children: [],
    parent: currentNode
  })
}

function addFile(line) {
  const [fileSize, fileName] = line.split(' ');
  currentNode.children.push({
    name: fileName,
    isDir: false,
    size: Number(fileSize),
    children: [],
    parent: currentNode,
  })
}

lineReader.on("line", function (line) {
  if (line) {
    if (line.startsWith('$ ')) {
      executeCommand(line);
    } else if (line.startsWith('dir')) {
      addDir(line);
    } else {
      addFile(line);
    }
  }
});

function extractNode(node) {
  let size = 0;
  node.children.forEach(child => {
    if (child.isDir) {
      size += extractNode(child);
    } else {
      size += child.size;
    }
  })
  node.size = size;
  flatDirs.push(node);
  return size;
}

lineReader.on("close", function () {
  extractNode(tree);
  const currentFreeSpace = 70000000 - tree.size
  const spaceNeeded = 30000000 - currentFreeSpace
  console.log(currentFreeSpace, spaceNeeded);
  const smallestBigEnoughDir = flatDirs
    .filter(dir => dir.size >= spaceNeeded)
    .sort((dirA, dirB) => dirA.size - dirB.size)[0]
  console.log(smallestBigEnoughDir);
});
/**
{
  a: {
    e: {
      i: 584
    },
    f: 29116,
    g: 2557,
    h.lst: 62596
  },
  b.txt: 14848514,
  c.dat: 8504156
  d: {
    j: 4060174
    d.log: 8033020,
    d.ext: 5626152,
    k: 7214296,
  }
}
 */