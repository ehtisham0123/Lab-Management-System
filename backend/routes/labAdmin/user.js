var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const fileUpload = require("express-fileupload");
const fs = require("fs");
router.use(fileUpload());

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "online_diagnostic_hub_and_lab_reporting_system",
});

// connect to database
db.connect();


/* GET users listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT users.* FROM users WHERE users.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `
          SELECT tests.*
          FROM tests
          WHERE tests.id IN
          (SELECT booking.test_id
          FROM booking
          WHERE
          user_id = ?)
          `;
             await db.query(sql, [req.params.id], function (err, tests) {         
               res.status(201).json({ result: result , tests : tests });
              });
        }catch (er) {
            console.log(err);
        }
        })();

      });
      } catch (er) {
      console.log(err);
    }

});


module.exports = router;
