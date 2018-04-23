var host = require("../../config.js").host
var util = require("../../utils/util.js")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOwnAddress: false,
    detail: ""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var self = this;
    wx.request({
      url: host + 'store/user/selectDefaultAddressByWxUserId',
      header: {
        "openid": app.getSession("openid")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data != null) {
              self.setData({
                isOwnAddress: true,
                addressInfo: result.data.data
              })

              console.log(result.data.data)
            } else {
              util.showMsgToash("请填写收获地址")
            }
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }

    })
  },
  navigatToManagerAddress: function () {
    wx.navigateTo({
      url: '../addaddress/addaddress?guid=0',
    })
  },
  onLoad: function (options) {
    console.log(options)
    console.log(JSON.parse(options.StorePay))
    var StorePay = JSON.parse(options.StorePay);
    this.setData({
      openFrom: StorePay.from
    })
    if (StorePay.from == "spdetail") {
      this.loadInfoBySpDetail(StorePay)
    } else if (StorePay.from == "cart") {
      this.loadInfoByCart(StorePay)
    }

  },
  loadInfoByCart: function (StorePay) {
    StorePay.cartDatas.forEach(function (pay, index) {
      pay.productName = pay.storeProduct.productName;
      pay.price = pay.storeProduct.price;
    })
    console.log(StorePay)
    this.setData({
      StorePays: StorePay.cartDatas,
      total: StorePay.total,
      quantity: StorePay.quantity,
      cartGuids: StorePay.cartGuid

    })
  },
  loadInfoBySpDetail: function (StorePay) {
    var materialColorObject = JSON.parse(StorePay.materialColor);
    StorePay.materialColorObject = materialColorObject;
    var StorePays = [];
    StorePays[0] = StorePay
    this.setData({
      StorePays: StorePays,
      total: StorePay.total,
      quantity: StorePay.quantity
    })
    console.log(this.data.StorePays)
  },
  updateOrderState(orderCode, orderState){
    console.log(orderCode,orderState)
    wx.request({
      url: host + "store/order/updateOrderGoodsStateByWxUser?orderCode=" + orderCode + "&orderState="+orderState,
      method: "POST",
      header: {
        "openid": app.getSession("openid")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == "200") {
          if (result.data.success) {
            util.resultOper(result)
            console.log(result)
            wx.redirectTo({
              url: '../order/order?currentTab=' + (orderState+1),
            })
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  wxPay: function (data,orderCode) {
    console.log(data,orderCode)
    var pack = data.package;
    var split = pack.split("=");
    var self = this;
    if (split[1] != "null") {
      console.log(data.nonceStr, data.package, data.paySign, data.signType, data.timeStamp)
      wx.requestPayment({
        'nonceStr': data.nonceStr,
        'package': data.package,
        'paySign': data.paySign,
        'signType': data.signType,
        'timeStamp': data.timeStamp,
        success: function (result) {
          console.log(result)
          util.showMsgToash("您已完成支付")
          self.updateOrderState(orderCode,1)
        },
        fail: function (result) {
          if (result.errMsg.indexOf("cancel") != -1) {
            util.showMsgToash("您取消了支付")

          } else {
            util.showMsgToash(result.err_desc)
          }
          wx.redirectTo({
            url: '../order/order?currentTab=1',
          })
        }
      })
    } else {
      console.log(data.package)
      util.showMsgToash("请求微信支付失败")
      wx.redirectTo({
        url: '../order/order?currentTab=1',
      })
    }
  },
  commitOrder: function () {
    var self = this;
    var openFrom = this.data.openFrom;
    if (this.data.isOwnAddress) {


      if (openFrom == "spdetail") {

        var StorePay = this.data.StorePays[0];
        var addressInfo = this.data.addressInfo;
        var OrderGoods = Object.assign(StorePay, addressInfo);
        OrderGoods.detail = this.data.detail
        console.log(OrderGoods)
        // return false;
        wx.request({
          url: host + 'store/order/insertOrderFromSpDetail',
          method: 'POST',
          data: OrderGoods,
          header: {
            "openid": app.getSession("openid")
          },
          success: function (result) {
            if (result.statusCode == '200') {
              if (result.data.success) {
                console.log(result)
                util.showMsgToash("正在调用微信支付")
                self.wxPay(result.data.data,result.data.info)
              }
            } else {
            }
          }
        })
      } else if (openFrom == "cart") {
        console.log(self.data)
        var detail = self.data.detail;
        var cartGuids = self.data.cartGuids

        wx.request({
          url: host + 'store/order/insertOrderFromCart',
          method: 'POST',
          data: { "detail": detail, "cartGuids": cartGuids, "orderState": 0 },
          header: {
            "Content-Type": "application/json",
            "openid": app.getSession("openid")
          },
          success: function (result) {
            console.log(result)
            if (result.statusCode == '200') {
              if (result.data.success) {
                console.log(result)
                util.showMsgToash(result.data.info)
                self.wxPay(result.data.data,result.data.info)
              }
            } else {
              util.showMsgToash("网络异常")
            }
          }
        })
      }
    } else {
      util.showMsgToash("请填写收货地址")
    }
  },
  detailChange: function (e) {
    console.log(e);
    this.setData({
      detail: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gotoIndex: function () {
    console.log("1");
    wx.switchTab({
      url: '../index/index',
    })
  },
  gotoAddress: function () {
    wx.navigateTo({
      url: '../addaddress/addaddress',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh: function () {
    this.onShow();
  },
  onShareAppMessage: function () {

  },
})