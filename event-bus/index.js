const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;
  axios.post('http://post-clusterip-srv:4000/events', event);
  axios.post('http://comments-srv:4001/events', event);
  axios.post('http://query-srv:4002/events', event);
  axios.post('http://moderation-srv:4003/events', event);

  events.push(event);

  res.send({ status: 'OK' });
});

app.get('/events', async (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event bus is listening on the port 4005');
});
