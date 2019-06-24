const db = require('../utils/db')

class PositionModel {
  constructor() {
    /*
No	Name	Email	Phone	Role	Age	Joining date	Salery	Action
    */
    let PositionSchema = {
      name: String,
      email: String,
      phone: String,
      role: String,
      age:Number,
      joining_date: String,
      salery:String
    }
    this.positionModel = db.model('positions', PositionSchema)
  }

  // 职位信息保存
  save(data) {
    let position = new this.positionModel({
      ...data,
      Joining_date: '2019年6月21日'
    })

    return position.save()
  }

  // 查询所有数据
  findAll() {
    return this.positionModel.find({}).sort({_id:-1})
  }
  findOne(id) {
    return this.positionModel.findById(id)
  }
  delete(id){
    console.log(id)
    return this.positionModel.findOneAndRemove(id)
  }
}

const positionModel = new PositionModel()

module.exports = positionModel