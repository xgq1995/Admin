import positionTpl from '../views/position.html'
import positionAddTpl from '../views/position_add.hbs'
import oAuth from '../utils/oAuth'
import randomstring from 'randomstring'
import _ from 'lodash'
export const render = async(req, res, next) => {
  
  let result=await oAuth()
  if(result.data.isSignin){
    // res.render(positionTpl({}))
    let page = req.query && req.query.page || 0
    let pagesize = req.query && req.query.pagesize || 10
    let keywords = req.query && req.query.keywords || ''
  // 开始渲染列表数据
  $.ajax({
    url:'http://localhost:8000/api/position/find/',
    headers:{
      'X-Access-Token':localStorage.getItem('token')
    },
    data: {
      page,
      pagesize,
      keywords
    },
    success:(result)=>{
      // console.log(result.data.total)
      let list = template.render(positionTpl, {
        data: result.data.result, // 显示数据
        hasResult: result.data.result.length > 0, // 数据为空显示提示
        url: location.hash.split('?')[0], // 翻页链接的路径
        total: result.data.total, // 配合最后一页删除处理
        page: ~~page, // 当前页
        pagesize, // 每页数据条数
        keywords, // 搜索关键字
        classList:['label-danger','label-info','label-success','label-inverse','label-warning'],
        pagecount: _.range(1, Math.ceil(result.data.total / ~~pagesize) + 1) // 页码数组
      })
      res.render(list)
    }
  })
    bindPositionAddEvent(res)
  }else{
    res.go('/')
  }
  
}
function bindPositionAddEvent(res,req) {
  $('#router-view').off('click', '.delete-row-btn').on('click', '#posback',(e) => {
    res.back()
  })
  $('#router-view').off('click', '#addUse').on('click', '#addUse',function(e){
    
     $('.modal-content').html(positionAddTpl)
    
  })
  $('#router-view').off('click', '.delete-row-btn').on('click', '.delete-row-btn',function(e) {
    console.log($(this).closest('tr').prop('id'))
    $.ajax({
      url: '/api/position',
      type: 'DELETE',
      data: {'_id':$(this).closest('tr').prop('id')},
      headers: {
        'X-Access-Token': localStorage.getItem('token')
      },
      success(result) {
        let { page = 0, pagesize = 10, keywords = '' } = req.query || {}
        let total = ~~$(this).closest('tr').attr('data-total')

        // 最后一页内容删除完毕以后，需要跳转到上一页
        page = (page * pagesize === total - 1) && (page > 0) ? page - 1 : page

        if (result.ret) {
          res.go('/position/' + randomstring.generate(7) + `?page=${page}&pagesize=${pagesize}&keywords=${keywords || ''}`)
        } else {
          alert(result.data)
        }
      }
    })
  })
  $('#router-view').off('click', '#possearch').on('click', '#possearch', function(e){
    res.go('/position/1/' + `?keywords=${$('#keywords').val()}`)
  })
  $('#router-view').off('click', '.alt-row-btn').on('click', '.alt-row-btn',function(e) {
    console.log('显示')
    console.log($('#add-contact'))
    $('#addUse').click()
    $('#myModalLabel').html('Alter User Contact')
    
    $.ajax({
      url: '/api/position/one/',
      
      data: {
        '_id': $(this).closest('tr').prop('id')
      },
      headers: {
        'X-Access-Token': localStorage.getItem('token')
      },
      success(result) {
        console.log(result);
        console.log(result.data._id);
        $('#posAdd').find('#name').val(result.data.name)
        $('#posAdd').find('#email').val(result.data.email)
        $('#posAdd').find('#phone').val(result.data.phone)
        $('#posAdd').find('#role').val(result.data.role)
        $('#posAdd').find('#age').val(result.data.age)
        $('#posAdd').find('#joining_date').val(result.data.joining_date)
        $('#posAdd').find('#salery').val(result.data.salery)
        $('#hideId').val(result.data._id)
        
      }
    })

  })
  $('#router-view').off('click','#possubmit').on('click','#possubmit', function(e){
    console.log("提交");
    console.log($('#hideId').val());
    console.log($('#posAdd').serialize());
    if(!$('#hideId').val()){
      $.ajax({
        url: '/api/position',
        type: 'POST',
        data: $('#posAdd').serialize(),
        headers: {
          'X-Access-Token': localStorage.getItem('token')
        },
        success(result) {
          res.go('/position'+ randomstring.generate(7))
        }
      })
    }else{
      $.ajax({
        url: '/api/position/update',
        type:"POST",
        data: `${$('#posAdd').serialize()}&id=${$('#hideId').val()}`,
        headers: {
          'X-Access-Token': localStorage.getItem('token')
        },
        success(result) {
          res.go('/position'+ randomstring.generate(7))
        }
    })
}
  })
}