const express = require('express');
const app = express();

app.use(express.json());

let users = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Doe', email: 'jane@example.com' }
];

app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

app.get('/users', (req, res) => {
  res.json(users);
});

module.exports = app;