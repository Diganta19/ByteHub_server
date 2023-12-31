import  express, { urlencoded }  from "express";
import cors from"cors";
import mongoose from "mongoose";
import userRoutes from './routes/users.js'
import questionRoutes from "./routes/Questions.js"
import answerRoutes from "./routes/Answers.js"
import subscriptionRoutes from './routes/Subscription.js'
import 'dotenv/config'

const app = express();
app.use(express.json({limit:"30mb",extended:true}));
app.use(cors( ));
app.use(urlencoded({limit:'30mb',extended:true}));

app.get('/',(req,res)=>{
    res.send("Welcome to ByteHub");
})

app.use('/user',userRoutes)
app.use('/questions',questionRoutes)
app.use('/answers',answerRoutes);
app.use('/subscription',subscriptionRoutes);



const CONNECTION_PORT = process.env.PORT || 8000;

const DB_CONNECTION_URL = process.env.CONNECTION_URL//"mongodb+srv://admin:Internship2023@bytehub.cugln28.mongodb.net/FirstDB?retryWrites=true&w=majority"
mongoose.connect(DB_CONNECTION_URL,{useNewUrlParser:true})
.then(()=> app.listen(CONNECTION_PORT,()=>{console.log('Server Up and Running')}))
.catch((err)=>console.log(err.message))




