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
router.get("/:name?",verifyToken, async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT tests.*
    FROM tests
    WHERE tests.name LIKE ? AND tests.lab_admin_id = ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name,req.user_id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } 
  else {
    let sql = `SELECT tests.*
    FROM tests
    WHERE tests.lab_admin_id = ?
    `;
    await db.query(sql,[req.user_id],function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});

router.post("/create",verifyToken, async (req, res, next) => {
  let name = req.body.name;
  let cost = req.body.cost;
  let delivery_time = req.body.delivery_time;
  let details = req.body.details;
  let photo;
  const thumbnail = req.files.thumbnail;
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
  sql =
    "INSERT INTO `tests` (name,cost,delivery_time, details,lab_admin_id,thumbnail) VALUES (?)";
  let values = [name, cost, delivery_time,  details, req.user_id, photo];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err)
      res.status(201).json({ 'error': 'Error while inseting data' });
    }
    else {
      res.status(201).json({ 'success': 'Test Added' });
    }
  })
  })

/* GET single test */
router.get("/show/:id",verifyToken, async function (req, res, next) {
    try{
      let sql = `SELECT tests.*
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


router.delete("/booking/:id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM booking WHERE test_id = ? AND lab_admin_id = ?`;
  await db.query(sql, [req.params.id, req.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});



router.put("/update/",verifyToken, async (req, res, next) => {
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




router.post("/reports/create",verifyToken, async (req, res, next) => {
    let user_id = req.body.user_id;
    let test_id  = req.body.test_id;
    let file_name;
    let file_type;

    if (req.files) {
      const file = req.files.file;
      file_name = file.name.split(".");
      file_type = file_name[file_name.length - 1];
      file_name = file_name[0] + "." + Date.now() + "." + file_name[file_name.length - 1];
      file.mv(
        `${__dirname}/../../../frontend/public/uploads/${file_name}`,
        (err) => {
          if (err) {
             console.error(err);
          }

        }
      );
    } 
      sql =
     `
      UPDATE booking
      SET file_name = ?, 
      file_type = ?
      WHERE user_id = ? && test_id = ? && lab_admin_id = ? 
      `;
      await db.query(sql, [file_name,file_type,user_id,test_id,req.user_id], function (err, result) {
        if (err) throw err;
        res.status(201).json({ 'success': 'File Added' });
      })

 })

 
module.exports = router;