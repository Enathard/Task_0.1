const http = require('http');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const server = http.createServer(async (req, res) => {

  if (req.url === '/') {
    const html = fs.readFileSync('index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  if (req.url.startsWith('/weather')) {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const city = urlParams.get('city');

    const cities = {
      gme: 'https://www.gismeteo.by/weather-gomel-4918/'
    };

    const cityUrl = cities[city];
    if (!cityUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'City not found' }));
      return;
    }
fs.writeFileSync('page.html', response.data);
    try {
      const response = await axios.get(cityUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const $ = cheerio.load(response.data);
      const temperature = $('span.temp__value').first().text();

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        city,
        temperature
      }));

    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Ошибка получения погоды' }));
    }
  }
});

server.listen(3000, () => {
  console.log('Сервер запущен на 3000 порту');
});