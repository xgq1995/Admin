const userModel=require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
class UserController{
  hasPassword(pwd){
    return new Promise((resolve)=>{
      const salt = 10;
      bcrypt.hash(pwd, salt, function(err, hash) {
       resolve(hash)
    });
    })
  }
  comparePassword(pwd,hash){
    return new Promise((resolve)=>{
      const salt = 10;
      bcrypt.compare(pwd, hash, function(err, res) {
        // res == true
        resolve(res)
    });
    })
  }
  genToken(username) {
    
    //非对称加密
    /*
      用一个密码字符串加密，并且用一个密码字符串解密
    */
    // let cert = 'i love u'
    // return jwt.sign({username}, cert)
    
    //对称加密
    /*
    用私钥加密用公钥进行解密
    服务端不用储存
    但是容易产生重放攻击
    仿小人不防君子

    */
    //
    let cert = fs.readFileSync(path.resolve(__dirname, '../keys/rsa_private_key.pem'))
    return  jwt.sign({username},cert,{algorithm:'RS256'})
  }
  async signup(req,res,next){
    // let user=await userModel.select(req.body)
    //先判断是否存在这个用户
    //不存在这个用户
    res.set('Content-Type','application/json;charset=utf8');
    let password=await userController.hasPassword(req.body.password)
    let result=await userModel.insert({
      ...req.body,password
    })
    if (result) {
      res.render('succ', {
        data: JSON.stringify({
          message: '用户注册成功。'
        })
      })
    } else {
      res.render('fail', {
        data: JSON.stringify({
          message: '用户注册失败。'
        })
      })
    }
  }
  async signin(req,res,next){
    res.set('Content-Type','application/json;charset=utf8');
    let result=await userModel.select(req.body);
    if(result){
      console.log(result)
      if(await userController.comparePassword(req.body.password,result['password'])){
         // 创建session, 保存用户名
        //  console.log(req.session)
        // res.cookie('name',result['username'])
        // req.session.username = result['username']
        // console.log(req.session)
        //生成token
        res.header('X-Access-Token', userController.genToken(result.username))
        res.render('succ',{
          data : JSON.stringify({
            username : result['username'],
            message :'登陆成功',
          })
        })
      }else{
        res.render('fail',{
        data : JSON.stringify({
          message :'密码错误'
        })
      })
      }
    }else {
      res.render('fail', {
        data: JSON.stringify({
          message: '用户不存在'
        })
      })
    }
  }
  
  // issignin(req, res, next) {
  //   // res.set('Content-Type', 'application/json; charset=utf-8')
  //   if (req.session.username) {
  //     res.render('succ', {
  //       data: JSON.stringify({
  //         username: req.session.username,
  //         isSignin: true
  //       })
  //     })
  //   } else {
  //     res.render('succ', {
  //       data: JSON.stringify({
  //         isSignin: false
  //       })
  //     })
  //   }
  // }
  // signout(req, res, next) {
  //   req.session = null
  //   res.set('Content-Type', 'application/json; charset=utf-8')
  //   res.render('succ', {
  //     data: JSON.stringify({
  //       isSignin: false,
  //     })
  //   })
  // }
}
// const userController = {
//   signup(req, res, next) {
//     res.set('Content-Type', 'application/json; charset=utf-8');
//     res.render('succ', {
//       data: JSON.stringify(req.body)
//     })
//   }
// }
const userController = new UserController()
module.exports = userController