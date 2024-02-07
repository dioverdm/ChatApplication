import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './utils/dbConnect';
import mainRouter from './routes/index';
dotenv.config();

const app = express();
const origin = 'http://localhost:5173';

//Middlewares

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: origin
}))

app.use('/api', mainRouter);
app.get('/chat', (req, res) => {
    res.send("server is running properly");
})

dbConnect();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})