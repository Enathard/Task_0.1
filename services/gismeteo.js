const axios = require('axios');
const cheerio = require('cheerio');

const cities = {
  gomel: '/weather-gomel-4918/',
  minsk: '/weather-minsk-4248/',
  vitebsk: '/weather-vitebsk-4239/',
  mogilev: '/weather-mogilev-4926/',
  grodno: '/weather-grodno-4910/'
};
//ф-ция извлечения температуры с html элемента "value"
function parseTemp($el)
 { if (!$el || !$el.length) return null;//null если элемент (город) не найден 
   const v = $el.attr("value"); //получение значения из value
   if (v != null && v !==""){
     const n = Number (v);
      return Number.isFinite(n) ? n : null; 
      //eсли value нет - запись в переменную txt значения из элемента
    } const txt = $el.text().trim().replaceAll ("-", "-").replaceAll("+", ""); 
    const n = Number(txt); 
    return Number.isFinite(n) ? n : null; 
  }

  //ф-ция получения погоды по городу 
async function getWeatherByCity(city) {
  const cityKey = city.toLowerCase();
//проверка на наличие города в списке 
  if (!cities[cityKey]) {
    throw new Error('Город не найден');
  }
//создание полной урлы города
  const cityUrl = 'https://www.gismeteo.by' + cities[cityKey];
//отправка http get-запроса на урлу  
  const response = await axios.get(cityUrl)
  //проверка получения html 
  if (!response || !response.data){ 
      throw new Error ('Данные с Gismeteo не удалось получить'); 
    }
    //загрузка полученного html в cheerio
  const $ = cheerio.load(response.data);
  //Поиск элемента с температурой по селектору
  const tempEl = $(".weather .weather-value temperature-value").first();
  //Парс значения температуры (через ф-цию)
  const temp = parseTemp(tempEl);

  return {
    city: cityKey,
    temperature: temp || 'нет данных',
    source: cityUrl
  };
}
//экспорт ф-ции для использования в bot and server.
module.exports = { getWeatherByCity };