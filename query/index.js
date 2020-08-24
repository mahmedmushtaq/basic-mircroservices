const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = async (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, status, postId, content } = data;
    const post = posts[postId];
    const comment = post.comments.find((cmnt) => cmnt.id === id);

    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', async (req, res) => {
  res.send(posts);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('query is listening on the port 4002');
  const res = await axios.get('http://localhost:4005/events');
  console.log('res data is = ', res.data);
  res.data.map((data) => {
    handleEvents(data.type, data.data);
  });
});
