const axios = require('axios');
const cheerio = require('cheerio');

const cities = {
  gomel: '/weather-gomel-4918/',
  minsk: '/weather-minsk-4248/',
  vitebsk: '/weather-vitebsk-4239/',
  mogilev: '/weather-mogilev-4926/',
  grodno: '/weather-grodno-4910/'
};

async function getWeatherByCity(city) {
  const cityKey = city.toLowerCase();

  if (!cities[cityKey]) {
    throw new Error('Город не найден');
  }

  const cityUrl = 'https://www.gismeteo.by' + cities[cityKey];
  const response = await axios.get(cityUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(response.data);
  const temperature = $('.unit_temperature_c').first().text().trim();

  return {
    city: cityKey,
    temperature: temperature || 'нет данных',
    source: cityUrl
  };
}

module.exports = { getWeatherByCity };