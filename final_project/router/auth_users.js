const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    users.some(user=>user.username===username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        let accessToken = jwt.sign({ username: user.username }, "access", { expiresIn: '1h' });
        req.session.authorization = { accessToken, username: user.username };
        return res.status(200).json({ message: "Logged in successfully" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
