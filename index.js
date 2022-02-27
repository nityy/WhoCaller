const express = require('express');
require('dotenv').config();
const path = require('path');
const axios = require('axios').default;

const app = express();

app.use(express.json());
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const re = /^[0-9]{3,17}$/;

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
      'authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'User-Agent': 'Truecaller/12.15.6 (Android;10)'
    }
  };
  axios.get(url, conf)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      const result = response.data.data[0];
      res.status(200);
      if (!('name' in result) || !result) {
        res.json({ message: 'Not Found', query: result.phones[0].e164Format });
        return;
      }
      if ('spamInfo' in result) {
        res.json({ message: 'Found', spamStatus: true, query: result.phones[0].e164Format });
      } else {
        res.json({ message: 'Found', spamStatus: false, query: result.phones[0].e164Format });
      }
    }).catch((err) => {
      res.status(400).json({ error: `Something went wrong! ${err}` });
    })
})

app.listen(3000, () => {
  console.log('Server running at port 3000');
})