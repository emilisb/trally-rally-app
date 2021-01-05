const express = require('express');
const {measureDistance} = require('./helpers');

const app = express();
const port = 3000;
const host = 'http://192.168.1.114';

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

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

  const {lat: latString, long: longString} = req.query;
  const lat = parseFloat(latString);
  const long = parseFloat(longString);
  const converter = getQuestionConverter({lat, long});

  res.json(questions.map(converter));
});

app.post('/questions/:id', (req, res) => {
  validateAuth(req.headers);

  const {id} = req.params;
  const {answer} = req.body;

  const question = questions.find((question) => question.id == id);
  if (question) {
    question.submitted = true;

    if (question.type === 'photo') {
      question.lastAnswer = uploadImage(answer);
    } else {
      question.lastAnswer = answer;
    }

    res.json({success: true, question});
  } else {
    res.json({success: false});
  }
});

app.get('/user', (req, res) => {
  validateAuth(req.headers);
  res.json({user});
});

app.post('/user', (req, res) => {
  validateAuth(req.headers);
  const {name, phone, photoData} = req.body;

  user.name = name;
  user.phone = phone;
  if (photoData) {
    user.photo = uploadImage(photoData);
  }

  res.json({success: true, user});
});

function uploadImage(data) {
  const publicPath = `uploads/${Math.random().toString()}.jpg`;
  const filePath = path.join(__dirname, `public/${publicPath}`);
  // eslint-disable-next-line no-undef
  fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
  return `${host}:${port}/${publicPath}`;
}

function validateAuth(headers) {
  const authToken = headers.authorization;
  if (authToken !== AUTH_TOKEN) {
    throw new Error('Unauthenticated');
  }
}

function getQuestionConverter({lat, long}) {
  return (question, index) => {
    const {coordinates, maxDistance} = question;
    const isLocked = measureDistance(lat, long, coordinates.lat, coordinates.long) > maxDistance;
    return {
      ...question,
      title: isLocked ? `-Užrakintas Klausimas ${index + 1}-` : question.title,
      question: !isLocked ? question.question : '',
      locked: isLocked,
    };
  };
}
