const express = require("express")
const router = express.Router()
const conn = require("../mariadb")
const { body, param, validationResult } = require("express-validator")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



router.use(express.json())

const validate = (req, res, next) => {
  const err = validationResult(req)
  if (err.isEmpty()) {
    return next()
  }
  return res.status(400).json(err.array())
}


// 로그인
router.post(
  '/login',
  [
    body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
    body("pwd").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    validate
  ],
  (req, res) => {
    const { email, pwd } = req.body

    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (err, results) {
        if (err) {
          console.log(err)
          return res.status(400).end()
        }
        let loginUser = results[0]
        if (loginUser && loginUser.pwd == pwd) {
          const token = jwt.sign(
            {
              email : loginUser.email,
              name : loginUser.name
            }, `{process.env.PRIVATE_KEY}`, 
            {
              expiresIn : '30m' ,
              issuer : "lee"
            })
            
          res.cookie("token" , token, {httpOnly : true})
          

          res.status(200).json({ "message": `${loginUser.name}님, 로그인에 성공하였습니다.`
        })
        }
        // Authentication (인증) 거부 - 403
        else {
          res.status(404).json({ "message": "이메일 또는 비밀번호가 틀렸습니다." })
        }

      })

  });


// 회원가입
router.post(
  '/join',
  [
    body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
    body("name").notEmpty().isString().withMessage("이름 확인 필요"),
    body("pwd").notEmpty().isString().withMessage("비밀번호 확인 필요"),
    body("contact").notEmpty().isString().withMessage("연락처 확인 필요"),
    validate
  ]
  , (req, res) => {
    let { email, name, pwd, contact } = req.body

    conn.query("INSERT INTO users (email , name , pwd, contact ) VALUES (?,?,?,?)"
      , [email, name, pwd, contact]
      , function (err, results) {
        if (err) {
          return res.status(400).end()
        }

        if (results.affectedRows == 0) {
          res.status(400).end()
        } else {
          res.status(201).json(results)
        }

      })

  })

// 회원 개별 조회
router
  .route('/users')
  .get(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
      validate
    ],
    (req, res) => {
      let { email } = req.body

      conn.query(
        `SELECT * FROM users Where email = ?`, [email],
        function (err, results, fields) {
          if (err) {
            return res.status(400).end()
          }

          if (results.length) {
            res.status(200).json(results)
          } else {
            res.status(400).json({ "message": "회원정보가 없습니다." })
          }
        }
      );

    })
  //회원 개별 삭제 (회원 탈퇴)
  .delete(
    [
      body("email").notEmpty().isEmail().withMessage("이메일 확인 필요"),
      validate
    ],
    (req, res) => {
      let { email } = req.body

      conn.query(
        "DELETE FROM users WHERE email = ?",
        [email],
        function (err, results, fields) {
          if (err) {
            return res.status(400).end()
          }
          if (results.affectedRows == 0) {
            return res.status(400).end()
          } else {
            res.status(200).json(results)
          }
        })
    })

module.exports = router