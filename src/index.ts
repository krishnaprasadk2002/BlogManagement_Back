import dotenv from 'dotenv';
import app from './configs/app';
dotenv.config();

import connectDB from './configs/db';

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
