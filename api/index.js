import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/auth.route.js';
import citiesRouter from './routes/cities.route.js';
import adminRouter from './routes/admin.route.js';
import propertyRoutes from './routes/property.route.js';
import inquiryRoutes from './routes/inquiry.route.js';
import favoriteRouter from './routes/favorites.route.js';
import userRouter from './routes/user.route.js';
import {
    errorHandler
} from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({
    limit: '10mb'
}));
app.use(express.urlencoded({
    limit: '10mb',
    extended: true
}));


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Database Error:', err.message));


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

app.get('/', (req, res) => {
    res.send('Welcome to the Real Estate API');
})

app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/favorites', favoriteRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);