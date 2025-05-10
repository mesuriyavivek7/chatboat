import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from "body-parser";

import chatRoute from './routes/chat.js'

dotenv.config();

const port = process.env.port || 8080;

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      "http://localhost:5173",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  credentials: true,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    res.send("Backend Running Successfully.")
})


//Routes
app.use('/api/chat',chatRoute)


// Middleware to catch errors
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || 'Something went wrong!';

  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: err.stack,
  });
});

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
