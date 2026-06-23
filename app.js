const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const {createServer} = require('node:http')
const {intiateServer} = require('./server/gameSocket')
const {ejs, render} = require('ejs');
const db = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cockieParser = require('cookie-parser');
const {requireAuth} = require('./middleware/authMiddleware');



const dbUri = process.env.DB_URL;
const app = express();
const server = createServer(app);
const io = intiateServer(server);

app.use(express.static('public'));
//app.use(express.urlencoded());
app.use(express.json());
app.use(cockieParser());

db.connect(dbUri)
    .then((result)=>server.listen(process.env.PORT)) 
    .catch((err)=>console.log(err))   
app.set('view engine', 'ejs');


app.use(authRoutes);

app.get('/',requireAuth,(req,res)=>{
    username = req.user.username;
    res.render('index',{username})
})
