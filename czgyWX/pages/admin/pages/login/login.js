var util = require("../../utils/util");
const host = require('../../config').host
var app = getApp();
Page({
  data: {
    phone: '',
    password: ''
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    var self = this;
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      util.showMsgToash("用户名和密码不能为空")
    } else {
      wx.request({
        url: host + '/login',
        method: 'POST',
        data: { "userName": self.data.phone, "password": self.data.password },
        header: {
          "Content-Type": "application/json"
        },
        success: function (result) {
          console.log(result)
          // 这里修改成跳转的页面 
          if (result.statusCode == "200") {

            if (result.data.success) {
              var roleGuid = result.data.data.role.roleGuid;
              self.setSessionId(result.header)
              console.log(result.header)
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              })
              if (app.getSession("adminSessionId") != false) {
                self.getAllAuthorize(roleGuid)
                
              } else {
                util.showMsgToash("发生异常请重试")
              }

            } else {
              util.resultOper(result)

            }
          }else{
            util.showMsgToash("网络异常");
          }

        }
      })

    }
  },
  setSessionId(header) {
    console.log(header)
    var cookie = header['Set-Cookie'];
    console.log(cookie)
    var cookieInfoArr = cookie.split(";");
    cookieInfoArr.forEach(function (cookieInfo, index) {
      if (cookieInfo.indexOf("JSESSIONID") != -1) {
        console.log(cookieInfo)
        app.setSession("adminSessionId", cookieInfo)
      }
    })
    console.log(app.getSession("adminSessionId"))
    console.log()
  },
  onLoad: function (options) {
    console.log(options)
    if (options.stateInfo != null && options.stateInfo != "") {
      util.showMsgToash(options.stateInfo)
    }
  },
  getAllAuthorize: function (roleId) {
    var self = this;
    wx.request({
      url: host + '/getAllAuthorityInfoByRoleList?authorityId=' + roleId,
      header: {
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.length > 0) {
            var authorityData = result.data;
            // var exitObject = { "id": 7,"authorityName":"退出登入"}
            // authorityData.push(exitObject)
            app.setSession("authorityData", authorityData)
            self.redirectToPage(authorityData);
          } else {
            util.showMsgToash("未检测到数据");

          }

        } else {
          util.resultOper(result)
        }
        console.log(self.data);
      }


    });
  },
  redirectToPage: function (authorityData) {
    console.log(authorityData)
    var key = authorityData[0].id;
    if (key == "1") {
      wx.redirectTo({
        url: '/pages/admin/pages/instock/instock',
      })
      app.setSession("adminPage", "/pages/admin/pages/instock/instock")
    } else if (key == "2") {
      wx.redirectTo({
        url: '/pages/admin/pages/outstock/outstock',
      })
      app.setSession("adminPage", "/pages/admin/pages/outstock/outstock")
    } else if (key == "3") {
      wx.redirectTo({
        url: '/pages/admin/pages/orders/orders',
      })
      app.setSession("adminPage", "/pages/admin/pages/orders/orders")
    } else if (key == "4") {
      wx.redirectTo({
        url: '/pages/admin/pages/sales/sales',
      })
      app.setSession("adminPage", "/pages/admin/pages/sales/sales")
    } else if (key == "5") {
      wx.redirectTo({
        url: '/pages/admin/pages/user/user',
      })
      app.setSession("adminPage", "/pages/admin/pages/user/user")
    } else if (key == "6") {
      wx.redirectTo({
        url: '/pages/admin/pages/product/product',
      })
      app.setSession("adminPage", "/pages/admin/pages/product/product")
    }
  },
})