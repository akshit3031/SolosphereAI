require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log(' MongoDB connected successfully');
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
})
.catch((err) => {
  console.error(' MongoDB connection error:', err);
});


app.use('/api/reports', reportRoutes);
