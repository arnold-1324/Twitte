import express from "express"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import connectDb from "./DB/connectToMongo.js"
import authRouter from "./Routers/auth.router.js"

dotenv.config()

const PORT =process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);

app.listen(PORT, () => {
	connectDb();
	console.log(`Server Running on port ${PORT}`);
});
