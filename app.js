const express = require('express');

// const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars'); //raddy
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//Parsing middleware
//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}));

// Parse application/json
app.use(bodyParser.json());



// Static Files
app.use(express.static('public'));

// Templating Engine
//las siguientes lineas difieren del video para actualizar el código a la última versión de handlebars(ver package.json)
const handlebars = exphbs.create({ extname: '.hbs',});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');



// Connection Pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//Connect to DB
pool.getConnection((err, connection)=>{
    if(err) throw err;
    console.log('Connected as ID ' +  connection.threadId);
});



const routes = require('./server/routes/user');
app.use('/' , routes);


app.listen(port, () => console.log (`Listening on port ${port}`));
