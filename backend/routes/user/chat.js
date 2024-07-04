var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const MySQLEvents = require('@rodrigogs/mysql-events');
const Pusher = require("pusher");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "online_diagnostic_hub_and_lab_reporting_system",
});

// connect to database
db.connect();

const pusher = new Pusher({
  appId: "1213321",
  key: "ea25a3949b7662bf5669",
  secret: "4ba7f89ef3734b4eea50",
  cluster: "ap2",
  useTLS: true
});

/* GET lab_admins listing. */
router.get("/messages/:id", verifyToken, async function (req, res, next) {
    var sql = `SELECT * FROM messages WHERE user_id = ? AND lab_admin_id = ?;`;
    await db.query(sql,[ req.user_id,req.params.id], function (err, messages) {
      if (err) throw err;
      res.status(201).json({ messages: messages });
    });

 });



/* GET lab_admins listing. */
router.get("/lab-admin/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT lab_admins.id,lab_admins.name,lab_admins.firstname,lab_admins.lastname,lab_admins.avatar FROM lab_admins WHERE lab_admins.id = ?`;
    await db.query(sql,[req.params.id], function (err, result) {
            res.status(201).json({ result: result});      

      });
  }
   catch (er) {
  console.log(err);
  }

});



/* GET lab_admins listing. */
router.get("/avatar/", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT users.avatar,users.name FROM users WHERE users.id = ?`;
    await db.query(sql,[req.user_id], function (err, result) {
            res.status(201).json({ result: result});      

      });
  }
   catch (er) {
  console.log(err);
  }

});






/* GET lab_admins listing. */
router.get("/:name?", verifyToken, async function (req, res, next) {
  if (req.params.name) {
    var sql = `SELECT lab_admins.id,lab_admins.name,lab_admins.firstname,lab_admins.lastname,lab_admins.avatar FROM lab_admins WHERE (CONCAT(firstname, ' ', lastname) LIKE ?) AND lab_admins.id IN (SELECT chat.lab_admin_id FROM chat WHERE user_id = ?);`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name,req.user_id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } else {
    var sql = `SELECT lab_admins.id,lab_admins.name,lab_admins.firstname,lab_admins.lastname,lab_admins.avatar FROM lab_admins WHERE lab_admins.id IN (SELECT chat.lab_admin_id FROM chat WHERE user_id = ?);`;
    await db.query(sql,[req.user_id], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});

router.post('/messages/new',verifyToken, async function(req, res, next) {

  let { message,lab_admin_id } = req.body;

   var sql = `SELECT * FROM chat WHERE user_id = ? AND lab_admin_id = ?;`;
    await db.query(sql,[ req.user_id,lab_admin_id], function (err, result) {
     if(!result.length > 0){
        sql = "INSERT INTO `chat` (`user_id`,`lab_admin_id`) VALUES (?)";
        var values = [req.user_id,lab_admin_id];
       return db.query(sql,[values], function (err, result) {
          if (err) throw err; 
            sql = "INSERT INTO `messages` (`user_id`, `lab_admin_id`, `message`,status) VALUES (?)";
            var values = [req.user_id,lab_admin_id,message,true];
            return db.query(sql,[values], function (err, result) {
                if (err) throw err; 
                 var sql = 'SELECT * FROM messages WHERE id = ?';
                   return  db.query(sql,result.insertId, function (err, result) {
                      pusher.trigger("messages", "inserted", 
                      {    
                         user_id:result[0].user_id,
                         lab_admin_id:result[0].lab_admin_id,
                         message:result[0].message,
                         created_at:result[0].created_at,
                         status:result[0].status,     
                      });
                  });                    
            }); 


            }
            ); 
      }
      else{
            sql = "INSERT INTO `messages` (`user_id`, `lab_admin_id`, `message`,status) VALUES (?)";
            var values = [req.user_id,lab_admin_id,message,true];
             db.query(sql,[values], function (err, result) {
                if (err) throw err; 
              
                var sql = 'SELECT * FROM messages WHERE id = ?';
                     db.query(sql,result.insertId, function (err, result) {
                      pusher.trigger("messages", "inserted", 
                      {    
                         user_id:result[0].user_id,
                         lab_admin_id:result[0].lab_admin_id,
                         message:result[0].message,
                         created_at:result[0].created_at,
                         status:result[0].status,     
                      });
                  });



                res.status(201).json('message saved'); 

            }); 
      }

    });


});



module.exports = router;