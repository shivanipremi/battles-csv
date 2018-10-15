

const controller = require('./alertController');

  
app.post('/add_item',controller.add_item);   
app.get('/list_iteam',controller.list_item);  
app.put('/update_iteam',controller.update_item);  



