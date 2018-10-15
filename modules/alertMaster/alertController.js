const apiReferenceModule = "items";
const Lib = require('../../Libs/validations')
const alertJoiSchema = require('./alertJoi');

module.exports.add_item = add_item;

const add_item = async function(req, res) {
    const apiReference = {
        module: apiReferenceModule,
        api: 'add_item'
    };
    try {
        const reqData = req.body;
        Lib.validateJoi(reqData, alertJoiSchema.add_item);
        await insertData(reqData);
    } catch(err) {
        throw err;
    }  
}
async function insertData(data) {
    try {
        connection.query`INSERT INTO alertmaster (type, alerttitle, querytype, databasename, collection, dbserver, tomail, tomobile, count, operation, starttime, frequency,
            IsActive, reporttype, endtime, nextruntime, ExcelSheetNames, querysource, ccmail, bccmail, frommail)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`


    } catch(err) {
        throw err;
    }
}