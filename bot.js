const { Telegraf } = require('telegraf');
const { getWeatherByCity } = require('./services/gismeteo');

const BOT_TOKEN = '8360774980:AAFr20_ILNaiwcQysgHDtfS2q7nV9IsGMs8';
const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => {
  ctx.reply(
    ' Бот погоды Gismeteo\n\n' +
    'Напиши город:\n' +
    'gomel, minsk, vitebsk, mogilev, grodno'
  );
});

bot.on('text', async ctx => {
  const city = ctx.message.text.trim().toLowerCase();

  try {
    const weather = await getWeatherByCity(city);

    ctx.reply(
      ` ${weather.city.toUpperCase()}\n` +
      ` Температура: ${weather.temperature}°C\n` +
      ` ${weather.source}`
    );
  } catch (err) {
    ctx.reply(`❌ ${err.message}`);
  }
});

bot.launch();

console.log(' Telegram bot запущен');


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));