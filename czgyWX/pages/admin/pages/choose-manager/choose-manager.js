const host = require('../../config').host
var app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {

  },
  opendManager: function (e) {
    var id = e.target.id;
    console.log(typeof id);
    switch (id) {
      
      case "0":
        wx.navigateTo({
          url: '../../pages/instock/instock',
        })
        break;
      case "1":
        wx.navigateTo({
          url: '../../pages/outstock/outstock',
        })
        break;
      case "2":
        wx.navigateTo({
          url: '../../pages/orders/orders',
        })
        break;
      case "3":
        wx.navigateTo({
          url: '../../pages/sales/sales',
        })
        break;
      case "4":
        wx.navigateTo({
          url: '../../pages/user/user',
        })
        break;
      case "5":
        wx.navigateTo({
          url: '../../pages/product/product',
        })
        break;
      case "6": app.showActionSheetModal();break;
      default: console.log(id)

    }
    // wx.navigateTo({
    //   url: '../../pages/details-role/details-role?guid=' + id,
    // })
  },
  getAllAuthorize: function (e) {
    var self = this;
    wx.request({
      url: host + 'authority/getAllAuthorityInfo',
      data: {
        noncestr: Date.now()
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.length > 0) {
            var authorizeData = result.data;
            var authorizeArray = [];
            for (var i = 0; i < authorizeData.length; i++) {
              authorizeArray[i] = authorizeData[i].id;
            }
            self.setData({
              authorizeData: result.data,
              authorizeArray: authorizeArray
            });
            console.log(authorizeArray)
          } else {
            util.showMsgToash("未检测到数据");
          }

        } else {
          util.showMsgToash("请求异常");
        }
        console.log(self.data);
      }


    });
  },

  onLoad: function (e) {
    console.log(app)
    this.getAllAuthorize();
  },
  onShow: function () {
    this.onLoad();
  }

})
