const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname.slice(1);
  response.setHeader('Content-Type', 'text/html; charset=utf-8');

  const filepath = path.join(__dirname, 'files', pathname);

  switch (request.method) {
    case 'DELETE':
      if (pathname.split('/').length > 1) {
        response.statusCode = 400;
        response.end('Неверный путь до файла');
        return;
      }

      fs.stat(filepath, function(error, stat) {
        if (error) {
          response.statusCode = 404;
          response.end('Файла нет');
          return;
        }
        fs.unlink(filepath, (error)=> {
          if (error) throw new TypeError(error.message);
          response.statusCode = 200;
          response.end('Файл успешно удален.');
        });
      });

      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }
});

module.exports = server;
