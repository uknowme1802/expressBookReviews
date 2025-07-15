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
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books,null,2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksArray = Object.values(books).filter(book => book.author === author);
    res.status(200).json({ booksByAuthor: booksArray });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    const booksArray = Object.values(books).filter(book => book.title === title);
    res.status(200).json({ booksBytitle: booksArray });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;
