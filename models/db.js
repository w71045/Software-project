const { Pool } = require('pg');

const pool = new Pool({
  user: 'judykathryn',
  host: 'localhost',
  database: 'dietcanvas',
  password: '',    //to set password
  port: 5432,
});

module.exports = pool;
