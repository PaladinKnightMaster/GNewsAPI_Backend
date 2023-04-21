const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');
const bodyParser = require('body-parser');
require('rootpath')();
require('dotenv').config()

const cache = new NodeCache({ stdTTL: 3600 }); // cache data for 1 hour

const apiKey = process.env.API_KEY;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());


// app.use(express.json());

// Route for fetching top N news articles
app.get('/articles/top/:n', async (req, res) => {
  const n = req.params.n;
  const cacheKey = `top-${n}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Retrieved cached data for ${cacheKey}`);
    return res.json(cachedData);
  }

  const url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&max=${n}`;
  try {
    const response = await axios.get(url);
    const data = response.data.articles;
    cache.set(cacheKey, data);
    console.log(`Retrieved fresh data for ${cacheKey}`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// Route for fetching a news article by title
app.get('/articles/title/:title', async (req, res) => {
  const title = req.params.title;
  const cacheKey = `title-${title}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Retrieved cached data for ${cacheKey}`);
    return res.json(cachedData);
  }

  const url = `https://gnews.io/api/v4/search?q=${title}&token=${apiKey}&lang=en&sortby=relevance`;
  try {
    const response = await axios.get(url);
    const data = response.data.articles;
    cache.set(cacheKey, data);
    console.log(`Retrieved fresh data for ${cacheKey}`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// Route for fetching news articles by keyword(s)
app.get('/articles/keywords/:keywords', async (req, res) => {
  const keywords = req.params.keywords;
  const cacheKey = `keywords-${keywords}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Retrieved cached data for ${cacheKey}`);
    return res.json(cachedData);
  }

  const url = `https://gnews.io/api/v4/search?q=${keywords}&token=${apiKey}&lang=en&sortby=relevance`;
  try {
    const response = await axios.get(url);
    const data = response.data.articles;
    cache.set(cacheKey, data);
    console.log(`Retrieved fresh data for ${cacheKey}`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
