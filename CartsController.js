const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const addItems = (req, res) => {
  let { bookId, quantity } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
  const userId = decoded.userId;

  let sql = `INSERT INTO cartItems (book_id , quantity, user_id ) 
            VALUES (?,?,?)`
  let values = [bookId, quantity, userId];

  conn.query(sql, values, (err, results) => {

    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows) {
      return res.status(StatusCodes.CREATED).end();
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

  })
}

const getItems = (req, res) => {

  let decoded = jwt.verify(req.cookies.token, process.env.PRIVATE_KEY);
  let userId = decoded.userId;

  let sql = `SELECT cartItems.id AS cart_item_id, books.id AS book_id, books.title, books.summary, cartItems.quantity, books.price
              FROM cartItems 
              LEFT JOIN books 
              ON cartItems.book_id = books.id WHERE user_id = ?`
  let values = [userId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  })

}

const deleteItems = (req, res) => {
  const bookId = req.params.id ;
  let decoded = jwt.verify(req.cookies.token, process.env.PRIVATE_KEY);
  let userId = decoded.userId;

  let sql = "DELETE FROM cartItems WHERE book_id = ? AND user_id = ?"
  let values = [bookId , userId];

  conn.query(sql , values , (err,results)=>{

    if (err){
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows == 0){
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {

      return res.status(StatusCodes.ACCEPTED).json(results);
    }

  })

}

const selectedItems = (req,res) => {
  let { cartIds } = req.body;
  let decoded = jwt.verify(req.cookies.token, process.env.PRIVATE_KEY);
  let userId = decoded.userId;
  
  let sql = `SELECT cartItems.id AS cart_item_id, books.id AS book_id, books.title, books.summary, cartItems.quantity, books.price
  FROM cartItems 
  LEFT JOIN books 
  ON cartItems.book_id = books.id WHERE user_id = ? AND cartItems.id IN (?) `
  let values = [userId , cartIds];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  })


}

module.exports = { addItems, getItems, deleteItems, selectedItems };
