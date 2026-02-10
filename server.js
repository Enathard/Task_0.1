const express = require('express');
const path = require('path');
// подключение сервиса получения погоды 
const { getWeatherByCity } = require('./services/gismeteo');
//создание Express-приложения для веба
const app = express();
//создание порта для работы сервера
const PORT = 3000;

// статика (раздача статических файлов)
app.use(express.static(path.join(__dirname, 'public')));

// Апишка для запроса и получения погоды 
app.get('/weather', async (req, res) => {
  const city = req.query.city;
//условие если города нет
  if (!city) {
    return res.status(400).json({ error: 'Город не указан' });
  }

  try {
    //получение данных о погоде в data с сайта
    const data = await getWeatherByCity(city);
    res.json(data); //json ответ клиенту с информацией о погоде
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});