
const getOrders = async (req, res) => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'BookShop',
    dateStrings: true
  });


  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
  const userId = decoded.userId;

  let sql = `SELECT orders.id, created_at, 
                    deliveries.address, deliveries.receiver, deliveries.contact ,
                    book_title, total_quantity, total_price
            FROM orders 
            LEFT JOIN deliveries 
            ON orders.delivery_id = deliveries.id WHERE user_id = ?;`  ;
  values = [userId] ;
  let [result] = await conn.execute(sql, values) ;
  res.status(StatusCodes.OK).json(result);
}

const getOrderDetail = async (req, res) => {
  const { id } = req.params;

  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'BookShop',
    dateStrings: true
  });

  let sql = `SELECT orderedBooks.book_id , books.title, books.author, books.price, orderedBooks.quantity
  FROM orderedBooks 
  LEFT JOIN books
  ON orderedBooks.book_id = books.id WHERE order_id = ?;`

  let [result] = await conn.query(sql, id);
  return res.status(StatusCodes.OK).json(result);

}
