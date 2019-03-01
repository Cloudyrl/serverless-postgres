const {Pool} = require('pg'); 
const pool = new Pool({
    host:'',
    user:'',
    database:'',
    password: '',
    port: 5432
});

module.exports = pool