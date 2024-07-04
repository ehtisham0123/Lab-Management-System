let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require('../verifyToken');
const fs = require("fs");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "online_diagnostic_hub_and_lab_reporting_system",
});

// connect to database
db.connect();
/* GET tests listing. */


router.get("/bookedtests/:name?",verifyToken,async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT tests.id,tests.name,lab_admins.name as lab_admin_name
    FROM tests
    INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id 
    WHERE tests.name LIKE ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name], function (err, result) {
      res.status(201).json({ result: result });
    });
  } 
  else {
    let sql = `SELECT tests.id,tests.name,lab_admins.name as lab_admin_name
    FROM tests
    INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id
    WHERE 1
    `;
    await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
}); 

router.get("/:name?",verifyToken, async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT tests.*,lab_admins.name as lab_admin_name
    FROM tests
    INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id 
    WHERE tests.name LIKE ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name], function (err, result) {
      res.status(201).json({ result: result });
    });
  } 
  else {
    let sql = `SELECT tests.*,lab_admins.name as lab_admin_name
    FROM tests
    INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id
    WHERE 1
    `;
    await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});


/* GET single test */
router.get("/show/:id",verifyToken, async function (req, res, next) {
    try{
      let sql = `SELECT tests.*,
      lab_admins.id as lab_admin_id,
      lab_admins.firstname as lab_admin_firstname,
      lab_admins.lastname as lab_admin_lastname,
      lab_admins.country as lab_admin_country,
      lab_admins.city as lab_admin_city,
      lab_admins.avatar as lab_admin_photo
      FROM tests 
      INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id
      WHERE
      tests.id = ?
      `;
      await db.query(sql, [req.params.id], function (err, result) {
      try{
      sql = `SELECT reviews.*,
      users.firstname as user_firstname,
      users.lastname as user_lastname,
      users.avatar as user_photo
      FROM reviews 
      INNER JOIN users ON reviews.user_id=users.id
      WHERE
      reviews.test_id = ?
      `;
          db.query(sql, [req.params.id], function (err, reviews) {

                try{
                sql = `SELECT users.id,users.name,users.avatar
                  FROM users
                  WHERE users.id IN
                  (SELECT booking.user_id
                  FROM booking
                  WHERE
                  test_id = ?)
              `;
                  db.query(sql, [req.params.id], function (err, bookings) {           
                      res.status(201).json({ result: result , reviews : reviews ,bookings:bookings});
                  });
                }catch (er) {
                  console.log(err);
                }
          });
        }catch (er) {
          console.log(err);
        }
      }); 
    }catch (er) {
      console.log(err);
    }
});


/* GET single test */
router.get("/edit/:id",verifyToken, async function (req, res, next) {
    let sql = `SELECT tests.* FROM tests
    WHERE
    tests.id = ?
    `;
    await db.query(sql, [req.params.id], function (err, result) {
      res.status(201).json({ result: result });
    });
});


router.delete("/:id",verifyToken, async function (req, res, next) {
    let sql = `DELETE FROM tests WHERE id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});


// router.delete("/booking/:id",verifyToken, async function (req, res, next) {
//     let sql = `DELETE FROM booking WHERE id = ?`;
//     await db.query(sql, [req.params.id], function (err, result) {
//       if (err) throw err;
//       res.status(201).json({ result: result });
//     });
// });

router.delete("/booking/test/:test_id/user/:user_id",verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM booking WHERE test_id = ? AND user_id = ?`;
  await db.query(sql, [req.params.test_id, req.params.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});



router.put("/update",verifyToken, async (req, res, next) => {
 let id = req.body.id,
  name = req.body.name,
  cost = req.body.cost,
  delivery_time = req.body.delivery_time,
  details = req.body.details,
  lab_admin_id = req.body.lab_admin_id,
  thumbnail = req.body.thumbnail;
  let photo;
  if (req.files === null) {
          photo = thumbnail;
        } else {
          file = req.files.file;
          fs.unlinkSync(
            `${__dirname}/../../../frontend/public/uploads/${req.body.thumbnail}`
          );
          thumbnail = req.files.file;
          photo = thumbnail.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            thumbnail.mv(
              `${__dirname}/../../../frontend/public/uploads/${photo}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          })();
        }
    sql =
     `
      UPDATE tests
      SET name = ?, 
      cost = ?, 
      delivery_time = ?, 
      thumbnail = ?, 
      details = ?,
      lab_admin_id = ?
      WHERE id = ? 
      `;
      await db.query(sql, [name,cost,delivery_time,photo, details, lab_admin_id, id], function (err, result) {
        if (err) throw err;
        res.status(201).json({ thumbnail:photo,'success': 'Test Updated' });
      })
  })

 
module.exports = router;