

const controller = require('./battleController');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

function proctectRoute(req,res,next){
    // if user exists the token was sent with the request
    if(req.user){
     //if user exists then go to next middleware
       next();
    }
  // token was not sent with request send error to user
    else{
       res.status(500).json({error:'login is required'});
    }
  }


  
app.post('/api/import_csv',multipartMiddleware, controller.import_csv); 
app.get('/api/count',proctectRoute, controller.count_items);  
app.get('/api/list',proctectRoute, controller.list_items);  
app.get('/api/search',proctectRoute, controller.search_items);  




