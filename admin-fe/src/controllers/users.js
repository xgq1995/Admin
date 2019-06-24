import userTpl from '../views/user.html'
import oAuth from '../utils/oAuth'
class Users {
  constructor() {
    // this._renderUerTpl({isSignin: false})
    this._init()
  }
  async _init() {
    let result = await oAuth()
    if (result) {
      this._renderUerTpl({
        ...result.data
      })
    } else {
      this._renderUerTpl({
        isSignin: false
      })
    }
  }
  _renderUerTpl({isSignin = false,username = ''}) {
    // 认证
    //把这里的认证抽离出去了抽离到oAuth中
    //不用多次请求了
    let template = Handlebars.compile(userTpl)
    let renderedUserTpl = template({
      isSignin,
      username
    })
    $('#user-menu').html(renderedUserTpl)
    this._user()
  }
  // 渲染user模板，绑定登录注册事件
  _user(res) {
    let that = this
    $('#user-menu').on('click', '.hidden-xs', function (e) {
      // e.stopPropagation()
      console.log($(this).attr('id'));
      if ($(this).attr('id') === 'user-signin') {
        $('.useTitle').html('<h1>登录</h1>')
        that._doSign('/api/users/signin', 'signin')
      } else {
        $('.useTitle').html('<h1>注册</h1>')
        that._doSign('/api/users/signup', 'signup')
      }
    })
    $('#user-menu').on('click', '.singOut', function (e) {
      /*
        $.ajax({
          url:'/api/users/signout',
          type: 'get',
          success:function(result){
            console.log(result)
            if (result.ret) {
              that._renderUerTpl({
                isSignin: false,
              })
            }
          }
      })*/
      localStorage.removeItem('token')
      location.reload();
    })
  }

  // 登录注册ajax
  _doSign(url, type) {
    $('#confirm').off('click').on('click', async () => {
      $.ajax({
        url,
        type: 'POST',
        data: $('#user-form').serialize(),
        success: (result, statusCode, jqXHR) => {
          if (type === 'signin') {
            //检查是否成功了
            this._signinSucc(result, jqXHR)
          } else {
            alert(result.data.message)
          }
        }
      })
    })
  }

  _signinSucc(result, jqXHR) {
    console.log("signinSucc")
    //登录成功的话就在进行一次渲染
    if (result.ret) {
      this._renderUerTpl({
        isSignin: true,
        username: result.data.username
      })
      // 存储token
      //以便再次检查
      localStorage.setItem('token', jqXHR.getResponseHeader('X-Access-Token'))
    }
  }

}


export default Users