const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const a3Routes = require('./routes/a3Routes'); // Dedicated for Assignment 3

const { notFoundMiddleware, errorMiddleware } = require('./middleware/errorMiddleware');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 4001;

app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', a3Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

app.listen(port, () => console.log(`TMS app listening on port ${port}`));
