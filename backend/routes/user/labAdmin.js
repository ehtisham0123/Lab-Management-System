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


/* GET lab_admins listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT lab_admins.* FROM lab_admins WHERE lab_admins.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `SELECT tests.id,tests.name
          FROM tests 
          INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id
          WHERE
          lab_admins.id = ?
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
