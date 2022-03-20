const express = require('express');
require('dotenv').config();
const axios = require('axios').default;
const { countries, categories } = require('./constants');

const app = express();
app.use(express.json());
app.use('/static', express.static('static'));
app.set('view engine', 'ejs');
app.set('views', './');

app.get('/', (req, res) => {
  res.render('index.ejs', { countries: countries });
});

const re = /^[0-9]{3,15}$/;

app.get('/search/api', (req, res) => {
  const num = req.query.q;
  if (!num) {
    res.status(400).json({ error: 'Query can not be empty' });
    return;
  }
  if (!re.test(num)) {
    res.status(400).json({ error: 'Query must be a number and between 3 to 17 digits long' });
    return;
  }
  const cc = req.query.cc;
  const url = `https://search5-noneu.truecaller.com/v2/search?q=${num}&countryCode=${cc}&type=4&encoding=json`;
  const conf = {
    headers:
    {
      'authorization': `Bearer ${process.env.CALLER_TOKEN}`,
      'User-Agent': 'Truecaller/12.15.6 (Android;10)'
    }
  };
  axios.get(url, conf)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }

      const result = response.data.data[0];
      const {
        phones: [
          {
            nationalFormat: nationalFormat
          }
        ],
        spamInfo: spamInfo
      } = result;

      res.status(200);

      const returnObj = {};
      returnObj['query'] = nationalFormat;

      if (!('name' in result) || !result) {
        returnObj['message'] = 'Not Found';
        res.json(returnObj);
        return;
      }

      returnObj['message'] = 'Found'
      returnObj['spamStatus'] = spamInfo ? true : false;
      returnObj['numReports'] = spamInfo?.spamScore;
      returnObj['spamCategory'] = categories[spamInfo?.
        spamCategories?.at(0)];

      res.json(returnObj);
    }).catch((err) => {
      res.status(400).json({ error: `Something went wrong! ${err}` });
    })
})

app.listen(3000, () => {
  console.log('Server running at port 3000');
})