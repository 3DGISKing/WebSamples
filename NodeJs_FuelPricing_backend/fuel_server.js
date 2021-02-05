const express = require("express");
const db = require("./db");
const http = require("./http");
const global = require("./global");

let app = express();

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

exports.start = function(cfg){
    // noinspection UnnecessaryLocalVariableJS
    let server = app.listen(cfg.PORT);

    console.log("server listing port: " + cfg.PORT);

    return server;
};

app.get('/login', function(req, res){
    let userName = req.query.userName;
    let password = req.query.password;

    db.get_users(userName, password, function (error, rows) {
        if(error){
            http.send(res, 1, "Server internal error!");
            return;
        }

        if(rows.length !== 1) {
            http.send(res, 1, "Invalid user name or password!");
            return;
        }

        let data = {
            userName: rows[0].user_name,
            fullName: rows[0].full_name,
            address1: rows[0].address1,
            address2: rows[0].address2,
            state: rows[0].state,
            city: rows[0].city,
            zipCode: rows[0].zipcode,
        };

        http.send(res, global.ERROR_SUCCESS, "ok!", data);
    });
});

app.get('/update_profile', function(req, res){
    let userName = req.query.userName;
    let fullName = req.query.fullName;
    let address1 = req.query.address1;
    let address2 = req.query.address2;
    let state = req.query.state;
    let city = req.query.city;
    let zipCode = req.query.zipCode;

    db.update_user(userName, fullName, address1, address2, city, state,zipCode, function (error, rows) {
        if(error){
            http.send(res, 1, "Server  internal error!");
            return;
        }

        http.send(res, global.ERROR_SUCCESS, "ok!");
    });
});

app.get('/join', function(req, res){
    let userName = req.query.userName;
    let password = req.query.password;

    db.is_user_exist(userName, function (isExist) {
        if(isExist)
        {
            http.send(res, 1, "This user name already exists!");
            return;
        }

        db.create_user(userName, password, function (error, rows) {
            if(error){
                http.send(res, 1, "Server internal error!");
                return;
            }

            http.send(res, global.ERROR_SUCCESS, "ok!");
        })
    } )
});

app.get('/history', function(req, res){
    let userName = req.query.userName;

    db.get_history(userName, function (error, rows) {
        if(error){
            http.send(res, 1, "Server internal error!");
            return;
        }

        let data = {
            history : rows
        };

        http.send(res, global.ERROR_SUCCESS, "ok!", data);
    } )
});

function getSeasonFromDate(d) {
    let month = d.getMonth() + 1;

    let season = '';

    switch(month.toString()) {
        case '12':
        case '1':
        case '2':
            season = 'winter';
            break;
        case '3':
        case '4':
        case '5':
            season = 'spring';
            break;
        case '6':
        case '7':
        case '8':
            season = 'summer';
            break;
        case '9':
        case '10':
        case '11':
            season = 'fall';
            break;
    }

    return season;
}

/*
2019-07-01
 */
function dateFromString(string)
{
    let day   = parseInt(string.substring(8, 10));
    let month  = parseInt(string.substring(5, 7));
    let year   = parseInt(string.substring(0, 4));

    return new Date(year, month - 1, day);
}

app.get('/pricing', function(req, res){
    let userName = req.query.userName;
    let gallonsRequested = req.query.gallonsRequested;
    let state = req.query.state;
    let deliveryDate = req.query.deliveryDate;

    /*
    Current price per gallon = $1.50 (this is the price what distributor gets from refinery and it varies based upon crude price.
    But we are keeping it constant for simplicity
     */

    let currentPrice = 1.5;
    let locationFactor = 0.04; // 2% for Texas, 4% for out of state.

    if(state === "TX")
        locationFactor = 0.02;

    let gallonRequestedFactor = 0.03;

    if(gallonsRequested > 1000)
        gallonRequestedFactor = 0.02; // 2% if more than 1000 Gallons, 3% if less

    let companyProfileFactor = 0.1; // always 10%
    let rateFluctuation = 0.03; // 4% for summer, 3% otherwise

    let date = dateFromString(deliveryDate);
    let season  = getSeasonFromDate(date);

    if(season === "summer")
        rateFluctuation = 0.04;

    db.get_history(userName, function (error, rows) {
        if(error){
            http.send(res, 1, "Server internal error!");
            return;
        }

        let historyFactor = 0;

        if(rows.length > 0)
            historyFactor = 0.01;

        let margin = currentPrice * (locationFactor - historyFactor + gallonRequestedFactor + companyProfileFactor + rateFluctuation);
        let suggestedPricePerGallon = currentPrice + margin;

        let totalAmountDue = suggestedPricePerGallon * gallonsRequested;

        let data = {
            suggestedPrice: suggestedPricePerGallon,
            totalAmountDue : totalAmountDue
        };

        http.send(res, global.ERROR_SUCCESS, "ok!", data);
    } )
});

app.get('/submit_quote', function(req, res){
    let userName = req.query.userName;
    let gallonsRequested = req.query.gallonsRequested;
    let state = req.query.state;
    let address = req.query.address;
    let deliveryDate = req.query.deliveryDate;

    /*
    Current price per gallon = $1.50 (this is the price what distributor gets from refinery and it varies based upon crude price.
    But we are keeping it constant for simplicity
     */

    let currentPrice = 1.5;
    let locationFactor = 0.04; // 2% for Texas, 4% for out of state.

    if(state === "TX")
        locationFactor = 0.02;

    let gallonRequestedFactor = 0.03;

    if(gallonsRequested > 1000)
        gallonRequestedFactor = 0.02; // 2% if more than 1000 Gallons, 3% if less

    let companyProfileFactor = 0.1; // always 10%
    let rateFluctuation = 0.03; // 4% for summer, 3% otherwise

    let date = dateFromString(deliveryDate);
    let season  = getSeasonFromDate(date);

    if(season === "summer")
        rateFluctuation = 0.04;

    db.get_history(userName, function (error, rows) {
        if(error){
            http.send(res, 1, "Server internal error!");
            return;
        }

        let historyFactor = 0;

        if(rows.length > 0)
            historyFactor = 0.01;

        let margin = currentPrice * (locationFactor - historyFactor + gallonRequestedFactor + companyProfileFactor + rateFluctuation);
        let suggestedPricePerGallon = currentPrice + margin;

        let totalAmountDue = suggestedPricePerGallon * gallonsRequested;

        db.insert_history(userName, deliveryDate, suggestedPricePerGallon, totalAmountDue, gallonsRequested, address, function(error, rows) {
            if(error){
                http.send(res, 1, "Server internal error!");
                return;
            }

            let data = {
                suggestedPrice: suggestedPricePerGallon,
                totalAmountDue : totalAmountDue
            };

            http.send(res, global.ERROR_SUCCESS, "ok!", data);
        })
    } )
});

