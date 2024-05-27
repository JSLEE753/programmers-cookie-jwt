const conn = require("../mariadb");
const { StatusCodes } = require('http-status-codes');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require('crypto');

const getAllBooks = (req, res) => {
  let { categoryId, isNew, limits, pages } = req.query;
  let offset

  if (limits && pages) {
    limits = parseInt(limits);
    pages = parseInt(pages);
    offset = (pages - 1) * limits
  }

  let sql = "SELECT *, (SELECT count(*) FROM likes WHERE books.id = likes.liked_book_id ) AS likes FROM books";
  let values = [];
  if (categoryId && isNew) {
    sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
    values = [categoryId];
  } else if (categoryId) {
    sql += " WHERE category_id = ?";
    values = [categoryId];
  } else if (isNew) {
    sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
  }
  
  if (offset != undefined) {
    sql += " LIMIT ? OFFSET ?"
    values.push(limits, offset)
  }

  console.log(sql)

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    if (results.length) {
      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  })

};

const getBook = (req, res) => {
  let { bookId } = req.params;
  bookId = parseInt(bookId);
  let { userId }  = req.body;
  userId = parseInt(userId);
  let sql = `SELECT *, 
              (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes ,
              (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked 
              FROM books LEFT JOIN categories 
              ON books.category_id = categories.category_id WHERE books.id = ?`;
  let values = [userId, bookId, bookId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results[0]) {
      return res.status(StatusCodes.OK).json(results[0]);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  })

};

module.exports = {
  getAllBooks,
  getBook,
};
