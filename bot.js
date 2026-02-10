const { Telegraf } = require('telegraf');
//импорт ф-ции получения погоды
const { getWeatherByCity } = require('./services/gismeteo');
//Токен ВЫНЕСТИ БЛЕАТЬ В env
const BOT_TOKEN = '8360774980:AAFr20_ILNaiwcQysgHDtfS2q7nV9IsGMs8';
//создание бота (экземпляра)
const bot = new Telegraf(BOT_TOKEN);
//Обработчик запуска бота (тыкнул старт при первом запуске)
bot.start(ctx => {
  ctx.reply(
    ' Бот погоды Gismeteo\n\n' +
    'Введите город:\n' +
    'gomel, minsk, vitebsk, mogilev, grodno'
  );
});
//обработчик message (для введения сити)
bot.on('text', async ctx => {
  const city = ctx.message.text.trim().toLowerCase();

  try {
    const weather = await getWeatherByCity(city);
//ответ по городу (если есть)
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