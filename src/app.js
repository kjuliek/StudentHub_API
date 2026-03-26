const express = require('express');
const app = express();

app.use(express.json());

const studentsRouter = require('./routes/students');
app.use('/students', studentsRouter);

module.exports = app;