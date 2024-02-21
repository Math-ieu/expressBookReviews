const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registred. Now you can login" });
  } else {
    return res.status(404).json({ message: "User already exists!" });
  }
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Créer une nouvelle promesse
  new Promise((resolve, reject) => {
    // Créer un tableau pour contenir les livres
    let bookList = [];

    // Parcourir l'objet des livres
    for (let isbn in books) {
      // Obtenir les détails du livre
      let book = books[isbn];

      // Ajouter le livre à la liste
      bookList.push({
        isbn: isbn,
        author: book.author,
        title: book.title
      });
    }

    // Résoudre la promesse avec la liste des livres
    resolve(bookList);
  })
    .then(bookList => {
      // Envoyer la liste des livres comme réponse
      res.status(200).json(bookList);
    })
    .catch(error => {
      // Gérer les erreurs
      res.status(500).json({ message: "Une erreur s'est produite" });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Créer une nouvelle promesse
  new Promise((resolve, reject) => {
    // Récupérer l'ISBN du livre à partir des paramètres de la requête
    let isbn = req.params.isbn;

    // Vérifier si le livre existe dans la collection
    if (!books[isbn]) {
      reject("Livre non trouvé");
    }

    // Récupérer les détails du livre
    let book = books[isbn];

    // Résoudre la promesse avec les détails du livre
    resolve(book);
  })
    .then(book => {
      // Retourner les détails du livre
      res.status(200).json(book);
    })
    .catch(error => {
      // Gérer les erreurs
      res.status(404).json({ message: error });
    });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Créer une nouvelle promesse
  new Promise((resolve, reject) => {
    // Récupérer le nom de l'auteur à partir des paramètres de la requête
    let author = req.params.author;

    // Créer un tableau pour contenir les livres
    let bookList = [];

    // Parcourir l'objet des livres
    for (let isbn in books) {
      // Obtenir les détails du livre
      let book = books[isbn];

      // Vérifier si l'auteur du livre correspond à l'auteur recherché
      if (book.author === author) {
        // Ajouter le livre à la liste
        bookList.push({
          isbn: isbn,
          author: book.author,
          title: book.title
        });
      }
    }

    // Vérifier si des livres ont été trouvés
    if (bookList.length === 0) {
      reject("Aucun livre trouvé pour cet auteur");
    } else {
      // Résoudre la promesse avec la liste des livres
      resolve(bookList);
    }
  })
    .then(bookList => {
      // Retourner la liste des livres
      res.status(200).json(bookList);
    })
    .catch(error => {
      // Gérer les erreurs
      res.status(404).json({ message: error });
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // Créer une nouvelle promesse
  new Promise((resolve, reject) => {
    // Récupérer le titre du livre à partir des paramètres de la requête
    let title = req.params.title;

    // Créer un tableau pour contenir les livres
    let bookList = [];

    // Parcourir l'objet des livres
    for (let isbn in books) {
      // Obtenir les détails du livre
      let book = books[isbn];

      // Vérifier si le titre du livre correspond au titre recherché
      if (book.title === title) {
        // Ajouter le livre à la liste
        bookList.push({
          isbn: isbn,
          author: book.author,
          title: book.title
        });
      }
    }

    // Vérifier si des livres ont été trouvés
    if (bookList.length === 0) {
      reject("Aucun livre trouvé avec ce titre");
    } else {
      // Résoudre la promesse avec la liste des livres
      resolve(bookList);
    }
  })
    .then(bookList => {
      // Retourner la liste des livres
      res.status(200).json(bookList);
    })
    .catch(error => {
      // Gérer les erreurs
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  // Récupérer l'ISBN du livre à partir des paramètres de la requête
  let isbn = req.params.isbn;

  // Vérifier si le livre existe dans la collection
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Récupérer les critiques du livre
  let reviews = books[isbn].reviews;

  // Retourner les critiques du livre
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
