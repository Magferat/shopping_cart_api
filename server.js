const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 1113; //

app.use(express.json());
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error(err));
