const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname.slice(1);
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  const filepath = path.join(__dirname, 'files', pathname);


  let eventStream = null;

  switch (request.method) {
    case 'GET':
      if (pathname.split('/').length > 1) {
        response.statusCode = 400;
        return response.end('Ошибка:  такого файла не существует');
      }
      eventStream = fs.createReadStream(filepath);
      eventStream.on('error', (err)=> {
        response.statusCode = 404;
        response.end('Ошибка:  такого файла не существует');
      });
      eventStream.on('open', ()=> {
        response.statusCode = 200;
        eventStream.pipe(response);
      });
      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }

  request.on('aborted', ()=> {
    if (eventStream) {
      eventStream.destroy();
    }
  });
});

module.exports = server;
