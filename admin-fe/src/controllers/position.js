import positionTpl from '../views/position.hbs'
import oAuth from '../utils/oAuth'
import randomstring from 'randomstring'
export const render = async(req, res, next) => {
  
  let result=await oAuth()
  if(result.data.isSignin){
    // res.render(positionTpl({}))
  // 开始渲染列表数据
  $.ajax({
    url:'api/position',
    headers:{
      'X-Access-Token':localStorage.getItem('token')
    },
    success:(result)=>{
      res.render(positionTpl({
        data: result.data,
        hasResult: result.data.length > 0
      }))
    }
  })
    bindPositionAddEvent(res)
  }else{
    res.go('/')
  }
  
}
function bindPositionAddEvent(res) {
  $('#router-view').off('click', '.delete-row-btn').on('click', '#posback',(e) => {
    res.back()
  })
  $('#router-view').off('click', '#addUse').on('click', '#addUse',function(e){
    
    $('#myModalLabel').html('Add New Contact')
   
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
        // location.reload()
        res.go('/position'+ randomstring.generate(7))
      }
    })
  })
  $('#router-view').off('click', '.alt-row-btn').on('click', '.alt-row-btn',function(e) {
    console.log('显示')
    console.log($('#add-contact'))
    $('#addUse').click()
    $('#myModalLabel').html('Alter User Contact')
    
    $.ajax({
      url: '/api/position/one',
      
      data: {
        '_id': $(this).closest('tr').prop('id')
      },
      headers: {
        'X-Access-Token': localStorage.getItem('token')
      },
      success(result) {
        console.log(result);
        $('#posAdd').find('#name').val(result.data.name)
        $('#posAdd').find('#email').val(result.data.email)
        $('#posAdd').find('#phone').val(result.data.phone)
        $('#posAdd').find('#role').val(result.data.role)
        $('#posAdd').find('#age').val(result.data.age)
        $('#posAdd').find('#joining_date').val(result.data.joining_date)
        $('#posAdd').find('#salery').val(result.data.salery)
      }
    })

  })
  $('#router-view').off('click','#possubmit').on('click','#possubmit', (e) => {
    console.log("提交");
    console.log($('#posAdd'));
    console.log($('#posAdd').serialize());
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
  })
}