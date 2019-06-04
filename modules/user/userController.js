const apiReferenceModule = "items";
const Lib = require("../../Libs/validations");
const userJoiSchema = require("./userJoi");
const jwt=require('jsonwebtoken');

const csv = require("csvtojson");
const fs = require("fs");


const user = require("../user/userModel");





const register_user = async function(req, res) {
  const apiReference = {
    module: apiReferenceModule,
    api: "register_user"
  };
  try {

    const reqData = req.body

    console.log("req daa here---", reqData)
    Lib.validateJoi(reqData, userJoiSchema.register_user);

    let userExist = await user.findOne({email : req.body.email})
    if(userExist){
      return res.send({
        status : 200,
        message : 'Sorry, this email Id is already registered with us. Please try with new email Id.'
      })
    } else {
      let data = await new user({email : reqData.email, password : reqData.password}).save();
      console.log('user inserted===', data);
      return res.send({data, status : 200})
    }
  
  } catch (err) {
    console.log("error here===", err)
    res.send({err : 'Oops! Something bad happened', status : 400})
  }
};

const login_user = async function(req, res) {
  const apiReference = {
    module: apiReferenceModule,
    api: "login_user"
  };
  try {
    const reqData = req.body

    console.log("req daa here---", reqData)
    Lib.validateJoi(reqData, userJoiSchema.login_user);
    let userExist = await user.findOne({email:req.body.email})
    console.log("userExistuserExist", userExist)
    if(userExist) {
    userExist.comparePassword(req.body.password,(err,isMatch)=>{
      if(isMatch){
        
          var token=jwt.sign({userId:userExist._id},key.tokenKey);
          console.log("tokenn here-===", token)    
          res.status(200).json({
              userId:user.id,
              username:user.username,
              image:user.image,
              name:user.first,
              token
          })
      }
      else{
          res.status(400).json({message:'Invalid Password/Username'});
      }
    })
    } else {
      res.status(400).json({message:'Invalid Password/Username'});
    }

}
  
  catch (err) {
    console.log("error here===", err)
    res.send({err : 'Oops! Something bad happened', status : 400})
  }
};



// app.post('/api/auth/signin',function(req,res){
//   user.findOne({email:req.body.email}).then((user)=>{
//           user.comparePassword(req.body.password,(err,isMatch)=>{
//               if(isMatch){
//                   var token=jwt.sign({userId:user.id},key.tokenKey);
//                   res.status(200).json({
//                       userId:user.id,
//                       username:user.username,
//                       image:user.image,
//                       name:user.first,
//                       token
//                   })
//               }
//               else{
//                   res.status(400).json({message:'Invalid Password/Username'});
//               }
//           })
//   }).catch((err)=>{
//       res.status(400).json({message:'Invalid Password/Username'});
//   })
// })

module.exports.register_user = register_user;
module.exports.login_user = login_user;


    
