const sqlite3 = require('sqlite3').verbose();

let db = null;

String.prototype.format = function(args) {
    let result = this;

    let reg;

    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (const key in args) {
                //noinspection JSUnfilteredForInLoop
                if(args[key]!= undefined){
                    reg = new RegExp("({" + key + "})", "g");

                    //noinspection JSUnfilteredForInLoop
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    reg = new RegExp("({)" + i + "(})", "g");

                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }

    return result;
};

exports.init = function(path, successCallback){
    db = new sqlite3.Database(path, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }

        console.log('Connected to the fuel database.');

        successCallback();
    });
};

exports.get_users = function(userName, password, callback){
    let sql = "SELECT * FROM users WHERE user_name = '" + userName + "' AND password = '" + password + "'";

    db.all(sql, function(error, rows){
        if(callback)
            callback(error, rows)
    });
};

exports.update_user = function(userName, fullName, address1, address2, city, state, zipCode, callback){
    let sql = "UPDATE users SET full_name = '{0}', address1 = '{1}', address2 = '{2}', city = '{3}', state = '{4}', zipcode = '{5}' WHERE user_name = '{6}'";

    sql = sql.format(fullName, address1, address2, city, state, zipCode, userName);

    db.all(sql, function(error, rows){
        if(callback)
            callback(error, rows)
    });
};

exports.create_user = function(userName, password, callback){
    let sql = "INSERT INTO users (user_name, password) VALUES('{0}', '{1}')";

    sql = sql.format(userName, password);

    db.all(sql, function(error, rows){
        if(callback)
            callback(error, rows)
    });
};

exports.is_user_exist = function (userName, callback) {
    let sql = "SELECT COUNT(*) FROM users WHERE user_name ='{0}'";

    sql = sql.format(userName);

    db.all(sql, function(error, rows){
        if(!callback)
            return;

        if(rows.length === 0) {
            callback(false);
            return;
        }

        if(rows[0]["COUNT(*)"] == 0){
            callback(false);
            return;
        }

        callback(true);
    });
};

exports.get_history = function (userName, callback) {
    let sql = "SELECT * FROM quote_history WHERE user_name ='{0}'";

    sql = sql.format(userName);

    db.all(sql, function(error, rows){
        if(callback)
            callback(error, rows)
    });
};

exports.insert_history = function (userName, deliveryDate, suggestedPrice, totalAmountDue, gallonRequested, deliveryAddress, callback) {
    let sql = "INSERT INTO quote_history (user_name, delivery_date, suggested_price, total_amount_due, gallon_requested, delivery_address) VALUES('{0}', '{1}', {2}, {3}, {4}, '{5}')";

    suggestedPrice = suggestedPrice.toFixed(3);

    sql = sql.format(userName, deliveryDate, suggestedPrice, totalAmountDue, gallonRequested, deliveryAddress);

    db.all(sql, function(error, rows){
        if(error){
            console.error(sql);
        }

        if(callback)
            callback(error, rows)
    });
};








