

const controller = require('./battleController');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

  
app.post('/api/import_csv',multipartMiddleware, controller.import_csv); 
app.get('/api/count',controller.count_items);  
app.get('/api/list',controller.list_items);  
app.get('/api/search',controller.search_items);  




