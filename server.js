
var quotes = [
    {
        id: 1,
        quote: "The best is yet to come",
        author: "Unknown",
        year: 2000
    },
    {
        id: 2,
        quote: "This is a quote",
        author: "First Last",
        year: 1930
    },
    {
        id: 3,
        quote: "This is another quote",
        author: "First2 Last2",
        year: 1910
    }
    ];

    // Commit

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./quotes.db');
console.log();

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log('Express app listening on port ' + port)
});

app.get('/quotes', function(req, res){
    db.serialize(() => {
        if (req.query.year) {
            const year = Number(req.query.year);
            db.all('SELECT * FROM Quotes WHERE year = ?', [year], (err, row) => {
                if(err){
                    console.log("ERROR: " + err.message);
                }
                else{
                    res.json(row);
                }
            }); 
        } else {
            db.all('SELECT * FROM Quotes', (err, row) => {
                if(err){
                    console.log("ERROR: " + err.message);
                }
                else{
                    res.json(row);
                }
            }); 
        }
    });
    
    // if(req.query.year){
    //     res.send("Return a list of quotes from the year: " + req.query.year);
    //   }
    //   else{
    //       res.json(quotes);
    // }
});

app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    // res.send("Return quote with the ID: " + req.params.id);
    db.serialize(() => {
        // const id = Number(req.query.year);
        db.get(`SELECT * FROM Quotes WHERE rowid = ${req.params.id}`, (err, row) => {
            if(err){
                console.log("ERROR: " + err.message);   
            }
            else{
                res.json(row);
            }
        }); 
    });
});

app.post('/quotes', function(req, res){
    db.serialize(() => {
        //  const id = Number(req.query.year);
        db.run(`INSERT INTO Quotes VALUES (${req.body.quote}, ${req.body.author}, ${req.body.year})`, (err, row) => {
            if(err){
                console.log("ERROR: " + err.message);   
            }
            else{
                res.json(row);
            }
        }); 
    });
    // console.log("Insert a new quote: " + req.body.quote);
    // res.json(req.body);
});