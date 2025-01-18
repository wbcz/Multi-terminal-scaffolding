#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

function checkPort443() {
  try {
    // 尝试检查 443 端口是否需要权限
    execSync('nc -z localhost 443', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function isRoot() {
  return process.getuid && process.getuid() === 0;
}

async function promptSudo() {
  if (isRoot()) return true;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('需要管理员权限来运行服务。是否使用 sudo? (y/n) ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  const portInUse = checkPort443();
  
  if (!isRoot() && !portInUse) {
    const shouldUseSudo = await promptSudo();
    if (shouldUseSudo) {
      try {
        // 使用 sudo 重新运行当前命令
        const command = process.argv.slice(2).join(' ');
        execSync(`sudo ${command}`, { stdio: 'inherit' });
      } catch (error) {
        console.error('运行失败:', error.message);
        process.exit(1);
      }
      process.exit(0);
    } else {
      console.log('取消运行');
      process.exit(1);
    }
  }
}

main().catch(console.error); 