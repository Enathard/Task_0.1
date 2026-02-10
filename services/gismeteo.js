const axios = require('axios');
const cheerio = require('cheerio');

const cities = {
  gomel: '/weather-gomel-4918/',
  minsk: '/weather-minsk-4248/',
  vitebsk: '/weather-vitebsk-4239/',
  mogilev: '/weather-mogilev-4926/',
  grodno: '/weather-grodno-4910/'
};

function parseTemp($el)
 { if (!$el || !$el.length) return null;
   const v = $el.attr("value"); 
   if (v != null && v !==""){
     const n = Number (v);
      return Number.isFinite(n) ? n : null; 
    } const txt = $el.text().trim().replaceAll ("-", "-").replaceAll("+", ""); 
    const n = Number(txt); 
    return Number.isFinite(n) ? n : null; 
  }

async function getWeatherByCity(city) {
  const cityKey = city.toLowerCase();

  if (!cities[cityKey]) {
    throw new Error('Город не найден');
  }

  const cityUrl = 'https://www.gismeteo.by' + cities[cityKey];
  const response = await axios.get(cityUrl)
    if (!response || !response.data){ 
      throw new Error ('Данные с Gismeteo не удалось получить'); 
    }
  const $ = cheerio.load(response.data);
  const tempEl = $(".weather .weather-value temperature-value").first();
  const temp = parseTemp(tempEl);

  return {
    city: cityKey,
    temperature: temp || 'нет данных',
    source: cityUrl
  };
}

module.exports = { getWeatherByCity };