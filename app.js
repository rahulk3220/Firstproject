const express = require('express');
const app = express();
const books = require('./books.json');

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(port, ()=> {
    console.log(`LISTENING ON PORT ${port}`)
});

// GET ALL BOOKS
app.get('/', (req,res) => {
    res.send(books);
});

// GET A PARTICULAR BOOK BY id
app.get('/:id', (req,res) => {
    const book = books.find(b => b.id===parseInt(req.params.id));
    // here parseInt is used because req.params.id is a string
    if(!book) return res.status(404).send('The book with the given ID was not found.');
    res.send(book);
});

// ADD A NEW BOOK
app.post('/',(req,res) => {
    // doing input validation
    if(!req.body.name||!req.body.author) return res.set(400).send('Name or author of the book is missing');
    const book = {
        id: books.length+1,
        name: req.body.name,
        author: req.body.author
    };
    books.push(book);
    res.send({message : "The book has been added"});
});

// UPDATING AN EXISTING BOOK
app.put('/:id',(req,res) => {
    // Look up the book, if not existing return 404
    const book = books.find(b => b.id===parseInt(req.params.id));
    if(!book) 
    {
        res.status(404).send('The book with the given ID was not found.');
        return;
    }
    // Validate the book, if invalid return 400 - Bad request
    if(!req.body.name) return res.set(400).send('Name of the book is missing');
    // Update the book and return the updated book
    book.name = req.body.name;
    res.send(book);
});

// DELETING A BOOK
app.delete('/:id',(req,res)=> {
    // Look up the book, if not existing return 404
    const book = books.find(b => b.id===parseInt(req.params.id));
    if(!book) return res.status(404).send('The book with the given ID was not found.');
    const index = books.indexOf(book);
    books.splice(index, 1);
    res.end(`The book with the id ${index} has been deleted`);
});