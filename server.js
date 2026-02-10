const express = require('express');
const path = require('path');
const { getWeatherByCity } = require('./services/gismeteo');

const app = express();
const PORT = 3000;

// статика
app.use(express.static(path.join(__dirname, 'public')));

// API
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'Город не указан' });
  }

  try {
    const data = await getWeatherByCity(city);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});