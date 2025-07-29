import express from 'express';
import 'dotenv/config';
import cors  from 'cors';

import authRoutes from './routes/authRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import './services/scheduler.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
  return res.send("API is working properly");
})

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/reminder',reminderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});

