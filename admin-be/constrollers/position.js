const positionModel = require('../models/position')

class PositionController {
  constructor(){}

  async findAll(req, res, next) {
    res.set('Content-Type', 'application/json; charset=utf-8')
    let result = await positionModel.findAll()
    res.render('succ', {data: JSON.stringify(result)})
  }
  async findOne(req, res, next) {
    res.set('Content-Type', 'application/json; charset=utf-8')
    let result = await positionModel.findOne(req.query._id)
    res.render('succ', {data: JSON.stringify(result)})
  }

  async save(req, res, next) {
    let result = await positionModel.save(req.body)

    if (result) {
      res.render('succ', {
        data: JSON.stringify({
          message: '数据保存成功.'
        })
      })
    }
  }
  async delete(req, res, next) {
    console.log(req.body)
    let result=await positionModel.delete(req.body._id)
    if(result){
      res.render('succ', {
        data: JSON.stringify({
          message: '数据删除成功.'
        })
    })
  }else{
    res.render('fail', {
      data: JSON.stringify({
        message: '数据删除失败.'
      })
  })
    }
  }
}

const positionController = new PositionController()

module.exports = positionController