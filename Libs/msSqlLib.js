
const sql 
// = require('mssql');

var db_config = {
  host: process.env.MYSQL_HOST || config.get('databaseSettings.host'),
  user: process.env.MYSQL_USER || config.get('databaseSettings.user'),
  password: process.env.MYSQL_PASS || config.get('databaseSettings.password'),
  database: process.env.MYSQL_DBNAME || config.get('databaseSettings.database'),
  port: process.env.MYSQL_PORT || config.get('databaseSettings.mysqlPORT'),
  multipleStatements: true
};

let url = `mssql://${db_config.user}:${db_config.password}@${db_config.host}/${db_config.database}`

async function connectionWithMysql() {
  try {
    connection = await sql.connect('mssql://UATUser:UAT123User@10.0.10.43/PBCroma');
    return connection;
  } catch (err) {
    console.log('Error While Connecting To MSSQL', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      connectionWithMysql();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  }
}
// global.connection = connection
connection = connectionWithMysql();


