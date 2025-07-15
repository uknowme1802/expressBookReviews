const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password) return res.status(400).json({ message: "Username and password required" });
  if (isValid(username)) return res.status(409).json({ message: "User already exists" });
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res){
    return res.send(JSON.stringify(books,null,2));
});

public_users.get('/async/books', async (req, res) => {
    try {
        // Simulate async behavior
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(books), 100); // simulate delay
            });
        };

        const allBooks = await getBooks();
        res.json(allBooks);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res){
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
 });

 public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {

        const getBooksByIsbn  =  (isbn) => {
            return new Promise((resolve) => {
                const book = books[isbn];
                resolve(book);
            });
        };

        const BooksByIsbn = await getBooksByIsbn(req.params.isbn);
        if (BooksByIsbn.length === 0) {
            return res.status(404).json({ message: "No books found for the given ISBN." });
        }

        return res.status(200).json({ BooksByIsbn });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res){
    const author = req.params.author;
    const booksArray = Object.values(books).filter(book => book.author === author);
    res.status(200).json({ booksByAuthor: booksArray });
});

public_users.get('/async/author/:author', async (req, res) => {
    try {

        const getBooksByAuthor  = function (author) {
            return new Promise((resolve) => {
                const filtered = Object.values(books).filter(book => book.author === author);
                resolve(filtered);
            });
        };

        const booksByAuthor = await getBooksByAuthor(req.params.author);
        if (booksByAuthor.length === 0) {
            return res.status(404).json({ message: "No books found for the given author." });
        }

        return res.status(200).json({ booksByAuthor });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  //Write your code here
    const title = req.params.title;
    const booksArray = Object.values(books).filter(book => book.title === title);
    res.status(200).json({ booksBytitle: booksArray });
});

public_users.get('/async/title/:title', async (req, res) => {
    try {
        const getBooksByTitle = (title) => {
            return new Promise((resolve) => {
                const filtered = Object.values(books).filter(book => book.title === title);
                resolve(filtered);
            });
        };

        const booksByTitle = await getBooksByTitle(req.params.title);

        if (booksByTitle.length === 0) {
            return res.status(404).json({ message: "No books found for the given title." });
        }

        return res.status(200).json({ booksByTitle });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) =>{
  //Write your code here
    const isbn = req.params.isbn;
    return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;
