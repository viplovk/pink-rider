const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath;

  if (urlPath === '/' || urlPath === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else if (urlPath.startsWith('/public/')) {
    filePath = path.join(__dirname, urlPath);
  } else if (urlPath.startsWith('/assets/')) {
    filePath = path.join(__dirname, 'public', urlPath);
  } else {
    filePath = path.join(__dirname, urlPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'public', urlPath);
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MONO RIDER server running at http://0.0.0.0:${PORT}`);
});
