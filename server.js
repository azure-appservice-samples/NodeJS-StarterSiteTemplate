// var Connection = require('tedious').Connection;
// // var sql = require('mssql');
// var Request = require('tedious').Request;
// // Create connection to database
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
// Setting Base directory
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
     // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
    // res.header("Access-Control-Allow-Origin", "http://localhost:8888");
    // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    // next();
});
// Server=tcp:firerock.database.windows.net,1433;
//Initial Catalog=CabBooking;Persist Security Info=False;User ID={your_username};Password={your_password};
//MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
var config = {
    user: 'satyams',
    password: 'Citiustech@1234',
    server: 'tcp:firerock.database.windows.net,1433',
    database: 'cabbooking',
    dialect: "mssql",
    options: {
        truestedConnection: true,
        encrypt: true // Use this if you're on Windows Azure
    },
    // dialectOptions: {
    //     instanceName: "SQLEXPRESS"
    // }
};
app.get("/booking", function (req, res) {
   console.log(req.query);
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        //  var request = new sql.Request();

        //3.
        var request = new sql.Request();
        request.input('Action', sql.VarChar, 'Get')
        request.input('FromStation', sql.VarChar, req.query.FromStation)
        request.input('ToStation', sql.VarChar,req.query.ToStation)
            .execute("USP_CabBooking").then(function (recordSet) {
                res.send(recordSet);
                sql.close()
            }).catch(function (err) {
                console.log(err);
                sql.close()
            });
        //     }).catch(function (err) {
        //             //6.
        //             console.log(err);
        //     });

        // query to the database and get the records
        // request.query('select * from student', function (err, recordset) {

        //     if (err) console.log(err)

        //     // send records as a response
        //     res.send(recordset);

        // });
    });
});
app.post("/booking", function (req, res) {
    console.log(req.body.id);
    // connect to your database
    sql.connect(config, function (err) {
        // console.log(err);

        if (err) {
            console.log(err)
            sql.close()
        };

        var request = new sql.Request();
        request.input('Action', sql.VarChar, 'Insert')
        request.input('CABID', sql.Int, req.body.Id)
        request.input('TRAVLLERNAME', sql.VarChar, 'rupak')
            .execute("USP_CabBooking").then(function (recordSet) {
                res.send(recordSet);
                sql.close()
            }).catch(function (err) {
                console.log(err);
                sql.close()
            });

    });
});
app.put("/booking", function (req, res) {
    console.log(req.body);
    // connect to your database
    sql.connect(config, function (err) {
        // console.log(err);

        if (err) {
            console.log(err)
            sql.close()
        };

        var request = new sql.Request();
        request.input('Action', sql.VarChar, 'Update')
        request.input('CABID', sql.Int, req.body.Tid)
        request.input('TRAVLLERNAME', sql.VarChar, 'rupak')
            .execute("USP_CabBooking").then(function (recordSet) {
                res.send(recordSet);
                sql.close()
            }).catch(function (err) {
                console.log(err);
                sql.close()
            });

    });
});
app.get("/bookingList", function (req, res) {
    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();
        request.input('Action', sql.VarChar, 'BookingList')
            .execute("USP_CabBooking").then(function (recordSet) {
                res.send(recordSet);
                sql.close()
            }).catch(function (err) {
                console.log(err);
                sql.close()
            });
    });
});

var server = app.listen(5000, function () {

    console.log('Server is running..');
});
