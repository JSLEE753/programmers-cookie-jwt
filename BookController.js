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

  let sql = "SELECT * FROM books";
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
