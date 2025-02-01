const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 解析请求路径
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filePath;

  // 根据路径前缀确定子应用
  if (url.pathname.startsWith('/sub1/')) {
    filePath = path.join(__dirname, 'sub1', url.pathname.replace('/sub1/', '') || 'index.html');
  } else if (url.pathname.startsWith('/sub2/')) {
    filePath = path.join(__dirname, 'sub2', url.pathname.replace('/sub2/', '') || 'index.html');
  } else if (url.pathname === '/sub1' || url.pathname === '/sub2') {
    filePath = path.join(__dirname, url.pathname, 'index.html');
  } else {
    filePath = path.join(__dirname, 'sub1', 'index.html');
  }

  // 读取文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Error reading file:', filePath, err);
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    // 设置 Content-Type
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Sub applications server running at http://localhost:${PORT}`);
}); 