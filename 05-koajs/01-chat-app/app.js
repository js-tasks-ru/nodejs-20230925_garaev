const path = require('path');
const Koa = require('koa');
const {
  watch,
  promises,
} = require('fs');
const app = new Koa();
const DB_PATH = path.resolve(__dirname, 'db/messages.json');
const {
  messages,
} = require('./db/messages.json');

const watcher = watch(DB_PATH);
const watchForChanges = async () => {
  return new Promise((resolve) => {
    watcher.once('error', (err) => {
      console.log(err);
      throw err;
    });
    watcher.once('change', (eventType, filename) => {
      console.log(eventType, filename);
      resolve();
    });
  });
};

watcher.unref();


app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  try {
    await watchForChanges();
    const {
      messages,
    } = JSON.parse(await promises.readFile(DB_PATH, {
      encoding: 'utf8',
    }));
    ctx.response.status = 200;
    ctx.response.set('Content-Type', 'text/html');
    ctx.body = messages[messages.length - 1].message;
  } catch (error) {
    ctx.throw(404, 'Сообщения отсутсвуют');
  }
});


router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body;
  if (!message.message || !message.message.trim()) {
    ctx.throw(400, 'Сообщение не передано');
  }
  messages.push(message);
  try {
    await promises.writeFile(DB_PATH, JSON.stringify({
      messages,
    }));
    ctx.response.status = 201;
    ctx.response.set('Content-Type', 'text/html');
    ctx.body = 'Сообщение успешно создано';
  } catch (error) {
    ctx.throw(500, 'Не удалось создать сообщение');
  }
});

app.use(router.routes());


module.exports = app;
