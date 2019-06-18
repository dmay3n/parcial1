//import { builtinModules } from "module";

//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

const conn = mysql.createConnection({
    host:'dblab4.cg9uzs5j16be.us-east-2.rds.amazonaws.com',
    user: "admin",
    password: "holiholi",
    database: "moviesDB"
});

conn.connect((err)=>{
    if(!err)
        console.log('DB connection succeded');
    else
        console.log('DB connection failed due to error\n ' + JSON.stringify(err, undefined, 2));
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
    let sql = "SELECT * FROM moviesDB.movies";
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.render('movie_view',{
        results: results
      });
    });
  });
   
  //route for insert data
  app.post('/save',(req, res) => {
    //let data = {name: req.body.name, year: req.body.year, description: req.body.description};
    let sql = "INSERT INTO movies (name, year, description) VALUES( '"+ req.body.name +"' , '"+req.body.year+"' , '"+req.body.description+"' );";
    //let query = conn.query(sql, data,(err, results) => {
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });
   
  //route for update data
  app.post('/update',(req, res) => {
    let sql = "UPDATE moviesDB.movies SET name='"+req.body.name+"' , year='"+req.body.year+"' , description='"+req.body.description+"' WHERE id= "+req.body.id;
    console.log(sql)
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });
   
  //route for delete data
  app.post('/delete',(req, res) => {
    let data = {id: req.body.id}
    let sql = "DELETE FROM moviesDB.movies WHERE id = "+req.body.id;
    console.log(sql)
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });
   
  //server listening
  app.listen(8000, () => {
    console.log('Server is running at port 8000');
  });