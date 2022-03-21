const express = require('express');
require('dotenv').config();
const axios = require('axios').default;
const { countries, categories } = require('./constants');
const url = 'https://search5-noneu.truecaller.com/v2/search';

const app = express();
app.use(express.json());
app.use('/static', express.static('static'));
app.set('view engine', 'ejs');
app.set('views', './');

app.get('/', (req, res) => {
  res.render('index.ejs', { countries: countries });
});

const re = /^\+?[\s0-9]{3,15}$/;

app.get('/search/api', (req, res) => {
  const num = req.query.q;
  const cc = req.query.cc;

  if (!num) {
    res.status(400).json('Query can not be empty');
    return;
  }
  if (!re.test(num)) {
    res.status(400).json('Query must be a number and between 3 to 17 digits long');
    return;
  }

  const conf = {
    headers: {
      'authorization': `Bearer ${process.env.CALLER_TOKEN}`,
      'User-Agent': 'Truecaller/12.15.6 (Android;10)'
    },
    params: {
      q: num,
      countryCode: cc,
      type: 4,
      encoding: 'json'
    }
  };
  axios.get(url, conf)
    .then((response) => {
      const result = response.data.data[0];
      if (!result) {
        res.status(200).json('No result returned');
        return;
      }
      const {
        phones: [
          {
            nationalFormat: nationalFormat,
            countryCode: countryCode
          }
        ],
        spamInfo: spamInfo
      } = result;

      res.status(200);

      const returnObj = {};
      returnObj['query'] = nationalFormat;
      returnObj['country'] = countries[countryCode].name;

      if (!('name' in result)) {
        returnObj['message'] = 'Not Found';
      } else {
        returnObj['message'] = 'Found'
        returnObj['spamStatus'] = spamInfo ? true : false;
        returnObj['numReports'] = spamInfo?.spamScore;
        returnObj['spamCategory'] = categories[spamInfo?.spamCategories?.at(0)];
      }
      res.json(returnObj);
    }).catch((err) => {
      if (err.response) {
        // if error is raised due to response code being outside of 2xx
        res.status(500).json(err.message);
      } else {
        // if error raised due to other reasons like parsing errors, then log 
        // the reason
        console.log(err);
        res.status(500).json(err.message);
      }

    })
})

app.listen(3000, () => {
  console.log('Server running at port 3000');
})