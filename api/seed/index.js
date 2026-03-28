import User from '../models/user.model.js';
import Property from '../models/property.model.js';
import City from '../models/city.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const citiesData = [{
                name: 'Kathmandu'
            },
            {
                name: 'Pokhara'
            },
            {
                name: 'Lalitpur'
            },
            {
                name: 'Bhaktapur'
            },
            {
                name: 'Biratnagar'
            },
        ];

        const citiesMap = {};
        for (const cityData of citiesData) {
            let city = await City.findOne({
                name: cityData.name
            });
            if (!city) {
                city = await City.create(cityData);
                console.log(`✓ City created: ${cityData.name}`);
            }
            citiesMap[cityData.name] = city._id;
        }

        const admin = await User.findOne({
            email: 'admin@gmail.com'
        });
        if (!admin) {
            const newAdmin = new User({
                name: 'Admin User',
                email: 'admin@gmail.com',
                password: 'admin123',
                role: 'admin',
                isVerified: true,
            });
            await newAdmin.save();
            console.log('✓ Admin user created');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}
seedData()