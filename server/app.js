import express from "express";
import cors from "cors";
import indexrouter from "./routes/index.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import  connectDB  from "./DB/db.config/mongoose.config.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express(); 
await connectDB();


app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true
  })
);

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.use('/api', indexrouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Form Builder API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});