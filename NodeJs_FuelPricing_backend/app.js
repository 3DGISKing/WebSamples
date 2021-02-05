let config = require('./config');
let db = require('./db');

let db_name = config.sqlite().NAME;

let path = process.cwd() + '\\' + db_name;

if (process.platform === "win32") {
    path = process.cwd() + '\\' + db_name;
}
else {
    path = process.cwd() + '/' + db_name;
}

function start()
{
    let app = require('./fuel_server');

    let server_config = config.server_config();

    let server = app.start(server_config);

    server.on("error", function (e) {
        if (e.code === "EADDRINUSE") {
            console.log("Account Server Error: Port " + server_config.PORT + " is already in use, select a different port.", "exception");
        }

        process.exit(1);
    });

    process.on('uncaughtException', function (err) {
        console.log('account server exception: ' + err.stack, "exception");
    });
}

db.init(path, start);









