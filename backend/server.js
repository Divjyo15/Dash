
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dataRoutes = require('./routes/dataRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err));


app.use('/api/data', dataRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
