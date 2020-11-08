const express = require('express');
const app = express();
const port = 3000;
const host = 'http://localhost';

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const user = require('./mocks/user');
const questions = require('./mocks/questions');

const LOGIN_CODE = '123456';
const AUTH_TOKEN = 'my-auth-token';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at ${host}:${port}`);
});

app.post('/auth/login', (req, res) => {
  const {code} = req.body;
  if (code === LOGIN_CODE) {
    res.json({
      success: true,
      authToken: AUTH_TOKEN,
      user,
    });
  } else {
    res.json({success: false});
  }
});

app.get('/questions', (req, res) => {
  validateAuth(req.headers);
  res.json(questions);
});

app.post('/questions/:id', (req, res) => {
  validateAuth(req.headers);

  const {id} = req.params;
  const {answer} = req.body;

  const question = questions.find((question) => question.id == id);
  if (question) {
    question.submitted = true;

    if (question.type === 'photo') {
      const publicPath = `uploads/answer-${Math.random().toString()}.jpg`;
      const filePath = path.join(__dirname, `public/${publicPath}`);
      // eslint-disable-next-line no-undef
      fs.writeFileSync(filePath, Buffer.from(answer, 'base64'));

      question.lastAnswer = `${host}:${port}/${publicPath}`;
    } else {
      question.lastAnswer = answer;
    }

    res.json({success: true, question});
  } else {
    res.json({success: false});
  }
});

function validateAuth(headers) {
  const authToken = headers.authorization;
  if (authToken !== AUTH_TOKEN) {
    throw new Error('Unauthenticated');
  }
}
