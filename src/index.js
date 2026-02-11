const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');
const postureRecordsRouter = require('./routes/postureRecords');
const authRouter = require('./routes/auth');
const exercisesRouter = require('./routes/exercises');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ErgoVision Backend çalışıyor!' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/posture-records', postureRecordsRouter);
app.use('/api/exercises', exercisesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});