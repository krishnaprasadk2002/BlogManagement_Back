import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoute from '../routes/authRoute';
import globalErrorHandler from '../middlewares/errorHandler';
import blogRoute from '../routes/blogRoute';


const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:4200'
];

// Apply CORS configuration immediately after initializing the app
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use(morgan("dev"));


app.use('/auth', authRoute)
app.use('/blog', blogRoute)

// Global error handler (should be placed after routes and other middlewares)
app.use(globalErrorHandler);


export default app