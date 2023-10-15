const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');

const LimitSizeStream = require('./LimitSizeStream.js');

const ONE_MEGABYTE = 1048576;

const server = new http.Server();

const unlinkFileWhenAborted = (stream, pathFile)=> {
  +
  stream.destroy();
  fs.unlink(pathFile, (err)=> {
    if (err) throw err;
  });
};

server.on('request', (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname.slice(1);
  response.setHeader('Content-Type', 'text/html; charset=utf-8');

  const filepath = path.join(__dirname, 'files', pathname);

  let limitedStream = null;

  switch (request.method) {
    case 'POST':
      if (pathname.split('/').length > 1) {
        response.statusCode = 400;
        response.end('Ошибка: неверный путь до файла');
        return;
      }
      limitedStream = new LimitSizeStream({
        limit: 1024 * 1024,
      });
      fs.stat(filepath, function(error, stat) {
        if (!error) {
          response.statusCode = 409;
          response.end('Файл уже создан на диске');
          return;
        }
        const writeFileStream = fs.createWriteStream(filepath);

        writeFileStream.on('pipe', ()=> {
          request.on('aborted', unlinkFileWhenAborted.bind(null, writeFileStream, filepath));
        });

        writeFileStream.on('finish', ()=> {
          request.off('aborted', unlinkFileWhenAborted);
          response.statusCode = 201;
          response.end('Файл успешно записан на диск');
        });

        limitedStream.on('error', (err)=> {
          unlinkFileWhenAborted(writeFileStream, filepath);
          response.statusCode = 413;
          response.end(err.message);
        });

        request.pipe(limitedStream).pipe(writeFileStream);
      });

      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }
});

module.exports = server;
