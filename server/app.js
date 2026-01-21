import express from "express";
import cors from "cors";
import indexrouter from "./routes/index.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express(); 

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api', indexrouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Form Builder API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});