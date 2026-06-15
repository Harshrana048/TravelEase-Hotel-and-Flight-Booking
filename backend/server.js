
// External Module
const express = require('express');
require('dotenv').config();

// Local Module
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// connect Db and Start Server
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
});
