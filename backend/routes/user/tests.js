let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "online_diagnostic_hub_and_lab_reporting_system",
});

router.get("/booked/:name?", verifyToken, async function (req, res, next) {
  try {
    if (req.params.name) {
      let sql = `
    SELECT tests.*
    FROM tests
    WHERE tests.name LIKE ? AND tests.id IN (SELECT booking.test_id 
    FROM booking WHERE user_id = ?)`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name, req.user_id], function (err, tests) {
        res.status(201).json({ tests: tests });
      });
    } else {
      sql = `
    SELECT tests.*
    FROM tests
    WHERE tests.id IN
    (SELECT booking.test_id
    FROM booking
    WHERE
    user_id = ?);
    `;
      await db.query(sql, [req.user_id], function (err, tests) {
        res.status(201).json({ tests: tests });
      });
    }
  } catch (er) {
    console.log(err);
  }
});


router.get("/reports/:id", verifyToken, async function (req, res, next) {
 let test_id = req.params.id;
  try {
      sql = `
    SELECT booking.*
    FROM booking
    WHERE
    user_id = ? && test_id = ?
    `;
      await db.query(sql, [req.user_id,test_id], function (err, booking) {
        if (booking) {
          booking = booking[0];
          res.status(201).json({ booking: booking });

        }
      });
    
  } catch (er) {
    console.log(err);
  }
});





// connect to database
db.connect();
/* GET tests listing. */
router.get("/:name?", verifyToken, (req, res, next) => {
  const getUser = async () => {
    var sql = `SELECT users.latitude as user_latitude,users.longitude as user_longitude FROM users WHERE users.id = ?`;
     db.query(sql, [req.user_id], function (err, user) {
      user = user[0];
      if (req.params.name) {
        let sql = `SELECT tests.*,lab_admins.name as lab_admin_name
          FROM tests
          INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id 
          WHERE tests.name LIKE ?`;
        name = "%" + req.params.name + "%";
        db.query(sql,[name], (err, tests) => {
          if (err) throw err;
  
              for(let i=1; i<tests.length; i++)
              {
                for(let j=0; j<tests.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(tests[j].latitude)/180;
                  var theta = parseFloat(user.user_longitude)-parseFloat(tests[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  radlat2 = Math.PI * parseFloat(tests[j+1].latitude)/180;
                  theta = parseFloat(user.user_longitude)-parseFloat(tests[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=tests[j];
                    tests[j]=tests[j+1];
                    tests[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: tests });
        });
      } else {
        let sql = `SELECT tests.*,lab_admins.name  as lab_admin_name,lab_admins.latitude,lab_admins.longitude
          FROM tests
          INNER JOIN lab_admins ON tests.lab_admin_id=lab_admins.id
          WHERE 1
          `;
          db.query(sql, (err, tests) => {
          if (err) throw err;
  
              for(let i=1; i<tests.length; i++)
              {
                for(let j=0; j<tests.length-i; j++) 
                {    
                  var radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  var radlat2 = Math.PI * parseFloat(tests[j].latitude)/180;
                  var theta = parseFloat(user.user_longitude)-parseFloat(tests[j].longitude);
                  var radtheta = Math.PI * theta/180;
                  var dist1 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist1 > 1) {
                    dist1 = 1;
                  }
                  dist1 = Math.acos(dist1);
                  dist1 = dist1 * 180/Math.PI;
                  dist1 = dist1 * 60 * 1.1515;
                  dist1 = dist1 * 1.609344      
                  radlat1 = Math.PI * parseFloat(user.user_latitude)/180;
                  radlat2 = Math.PI * parseFloat(tests[j+1].latitude)/180;
                  theta = parseFloat(user.user_longitude)-parseFloat(tests[j+1].longitude);
                  radtheta = Math.PI * theta/180;
                  var dist2 = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                  if (dist2 > 1) {
                    dist2 = 1;
                  }
                  dist2 = Math.acos(dist2);
                  dist2 = dist2 * 180/Math.PI;
                  dist2 = dist2 * 60 * 1.1515;
                  dist2 = dist2 * 1.609344     
                  if((dist2)<(dist1))
                  {
                    temp=tests[j];
                    tests[j]=tests[j+1];
                    tests[j+1]=temp;
                  }   
                }
              }
          res.status(201).json({ result: tests });
        });
      }
    });
  };
  getUser();
});

/* GET single test */
router.get("/show/:id", verifyToken, async (req, res, next) => {
  try {
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
    await db.query(sql, [req.params.id], (err, result) => {
      try {
        sql = `SELECT reviews.*,
        users.firstname as user_firstname,
        users.lastname as user_lastname,
        users.avatar as user_photo
        FROM reviews 
        INNER JOIN users ON reviews.user_id=users.id
        WHERE
        reviews.test_id = ?
      `;
        db.query(sql, [req.params.id],(err, reviews) => {
          try {
            sql = `SELECT booking.*
              FROM booking
              WHERE
              user_id = ? AND test_id = ?;
              `;
            db.query(
              sql,
              [req.user_id, req.params.id],
              function (err, booking) {
                if (booking.length > 0) {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    booking_id: booking[0].id,
                  });
                } else {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    booking_id: 0,
                  });
                }
              }
            );
          } catch (er) {
            console.log(err);
          }
        });
      } catch (er) {
        console.log(err);
      }
    });
  } catch (er) {
    console.log(err);
  }
});

router.delete("/booking/:id", verifyToken, async (req, res, next) => {
  let sql = `DELETE FROM booking WHERE test_id = ? AND user_id = ?`;
  await db.query(sql, [req.params.id, req.user_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});


router.delete("/reviews/:id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM reviews WHERE id = ? AND user_id`;
  await db.query(sql, [req.params.id, req.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});


router.post("/book", verifyToken, async function (req, res, next) {
  const test_id = req.body.test_id;
  const lab_admin_id = req.body.lab_admin_id;
  const user_id = req.user_id;
  sql =
    "INSERT INTO `booking` (user_id, test_id,lab_admin_id) VALUES (?)";
  let values = [user_id, test_id, lab_admin_id];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({ booking_id: result.insertId });
    }
  });
});

router.post("/review", verifyToken, async function (req, res, next) {
  const user_id = req.user_id;
  const test_id = req.body.test_id;
  const lab_admin_id = req.body.lab_admin_id;
  const enorllment_id = req.body.enorllment_id;
  const reviews = req.body.reviews;
  const reviews_details = req.body.reviews_details;

  sql = "INSERT INTO `reviews` (user_id, test_id,lab_admin_id,booking_id,reviews,reviews_details) VALUES (?)";
  let values = [user_id, test_id, lab_admin_id,enorllment_id,reviews,reviews_details];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err)
      res.status(201).json({ error: "Error while inseting data" });
    } else {
      res.status(201).json({ success: "Review Added" });
    }
  });
});

/* GET users listing. */

module.exports = router;