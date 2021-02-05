
exports.sqlite = function(){
    return {
        NAME: 'fuel.db'
    }
};

const PORT = 5000;

exports.server_config = function(){
    return {
        PORT: PORT
    };
};