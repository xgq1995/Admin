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
      joining_date: '2019年6月21日'
    })

    return position.save()
  }

  // 查询所有数据
  findAll(keywords) {
    let regExp = new RegExp(keywords, "i")
    return this.positionModel.find({}).sort({_id: -1})
    .or([{name:regExp},{email:regExp},{phone:regExp},{role:regExp},{salery:regExp},{joining_date:regExp}])
  
  }
  findOne(id) {
    console.log("findOne")
    return this.positionModel.findById(id)
  }
  findMany({page, pagesize, keywords}){
    let regExp = new RegExp(keywords, "i")
    return this.positionModel.find({}).skip(page * pagesize).limit(pagesize).sort({_id:-1})
            .or([{name:regExp},{email:regExp},{phone:regExp},{role:regExp},{salery:regExp},{joining_date:regExp}])
  }
  delete(id){
    return this.positionModel.findOneAndRemove({_id:id})
  }
  update(id, update){
    return this.positionModel.findOneAndUpdate({_id:id}, update)
  }
}

const positionModel = new PositionModel()

module.exports = positionModel