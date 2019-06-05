const apiReferenceModule = "items";
const Lib = require("../../Libs/validations");
const userJoiSchema = require("./userJoi");
const jwt = require("jsonwebtoken");

const user = require("../user/userModel");

const register_user = async function(req, res) {
  const apiReference = {
    module: apiReferenceModule,
    api: "register_user"
  };
  try {
    const reqData = req.body;
    Lib.validateJoi(reqData, userJoiSchema.register_user);
    let userExist = await user.findOne({ email: req.body.email });
    if (userExist) {
      return res.send({
        status: 200,
        message:
          "Sorry, this email Id is already registered with us. Please try with new email Id."
      });
    } else {
      let newUser = await new user({
        email: reqData.email,
        password: reqData.password
      }).save();
      var token = jwt.sign({ userId: newUser._id }, key.tokenKey);
      return res.send({
        message: "User registered successfully",
        status: 200,
        token: token
      });
    }
  } catch (err) {
    return res.send({ err, status: 400 });
  }
};

const login_user = async function(req, res) {
  const apiReference = {
    module: apiReferenceModule,
    api: "login_user"
  };
  try {
    const reqData = req.body;
    Lib.validateJoi(reqData, userJoiSchema.login_user);
    let userExist = await user.findOne({ email: req.body.email });
    if (userExist) {
      userExist.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
          var token = jwt.sign({ userId: userExist._id }, key.tokenKey);
          res.send({
            status: 200,
            data: {
              userId: userExist._id,
              email: userExist.email,
              token
            }
          });
        } else {
          res.send({
            status: 400,
            error: "Invalid Password/Username"
          });
        }
      });
    } else {
      res.send({
        status: 400,
        error: "Invalid Password/Username"
      });
    }
  } catch (err) {
    res.send({ err, status: 400 });
  }
};

module.exports.register_user = register_user;
module.exports.login_user = login_user;
