const conn = require("../mariadb");
const { StatusCodes } = require('http-status-codes');
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { extractUserId } = require("../func")

const getAllBooks = (req, res) => {
  let allBooksRes = {};
  let { categoryId, isNew, limits, pages } = req.query;
  let offset ; 

  if (limits && pages) {
    limits = parseInt(limits);
    pages = parseInt(pages);
    offset = (pages - 1) * limits
  }

  let sql1 = "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE books.id = likes.liked_book_id ) AS likes FROM books";
  let values = [];
  if (categoryId && isNew) {
    sql1 += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
    values = [categoryId];
  } else if (categoryId) {
    sql1 += " WHERE category_id = ?";
    values = [categoryId];
  } else if (isNew) {
    sql1 += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
  }

  if (offset != undefined) {
    sql1 += " LIMIT ? OFFSET ? ; "
    values.push(limits, offset)
  }

  conn.query(sql1, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    if (results.length) {
      allBooksRes.books = results;
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  })
  let sql2 = " SELECT found_rows() ; "
  conn.query(sql2, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.NOT_FOUND).end();
    }
    if (results.length) {
      let pagination  = {}
      pagination.currentPage = pages;
      pagination.totalCount = results[0]["found_rows()"];
      allBooksRes.pagination = pagination;
      return res.status(StatusCodes.OK).json(allBooksRes)

    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  })
};
