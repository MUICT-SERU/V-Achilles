import 'dotenv-safe/config';

import cors from 'cors';
import path from 'path';
// import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';

import passport from './utils/passport';

import NpmRouter from './routes/npm';
import AuthRouter from './routes/auth';
import IndexRouter from './routes/index';
import ReportRouter from './routes/report';
import ProjectsRouter from './routes/projects';

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost/baak-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors());
// app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', IndexRouter);
app.use('/api/v1/npm', NpmRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/reports', ReportRouter);
app.use('/api/v1/projects', ProjectsRouter);

const PORT = process.env.PORT || '4000';
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
