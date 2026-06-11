
// External Module
const express = require('express');
require('dotenv').config();

// Local Module
const connectDB = require('./config/db');

const app = express();
app.get('/', (req, res) => {
    console.log('Hello World!');
    res.send('Hello World!');
});



// connect Db and Start Server
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
   
});
