
const host = require('../..//config').host
var app = getApp()
var util = require("../../utils/util.js");

//index.js 
//获取应用实例 
var app = getApp()
Page({
  data: {
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    marginStyle: "marginStyle",
    orderInfo: []
  },
  
  updateOrderState(orderCode, orderState){
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
              url: 'order?currentTab=' + (orderState+1),
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
  confirmOrder(e) {
    let orderCode = e.currentTarget.dataset.value
    this.updateOrderState(orderCode, 3)
  },
  wxPayMent(data, orderCode){
    console.log(data)
    var pack = data.package;
    var split = pack.split("=");

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
         
        }
      })
    } else {
      console.log(data.package)
      util.showMsgToash("请求微信支付失败")
      
    }
  },
  wxPay(e){
    let orderCode = e.currentTarget.dataset.value
    console.log(orderCode)
    let self = this;
    wx.request({
      url: host +"store/order/orderPay?orderCode="+orderCode,
      method:"POST",
      // data:"orderCode="+orderCode,
      header: {
        "openid": app.getSession("openid")
      },
      success:function(result){
        if(result.statusCode == "200"){
          if(result.data.success){
            self.wxPayMent(result.data.data,orderCode)
          }else{
            util.showMsgToash(result.data.info)
          }
        }else{
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  deleteOrder(e){
    let orderCode = e.currentTarget.dataset.value
    console.log(e, orderCode)
    let self = this;
    wx.request({
      url: host + "store/order/deleteOrder?orderCode=" + orderCode,
      header: {
        "openid": app.getSession("openid")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            util.resultOper(result)
          } else {
            util.resultOper(result)
          }

        } else {
          util.showMsgToash("网络异常")
        }
        let obj = {
          currentTab: self.currentTab
        }
        self.setData({
          orderInfo: []
        })
        self.onLoad(obj)
      }
    })
  },
  cancelOrder(e) {
    let orderCode = e.currentTarget.dataset.value
    console.log(e, orderCode)
    let self = this;
    wx.request({
      url: host + "store/order/cancelOrder?orderCode=" + orderCode,
      header: {
        "openid": app.getSession("openid")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            util.resultOper(result)
          } else {
            util.resultOper(result)
          }

        } else {
          util.showMsgToash("网络异常")
        }
        let obj = {
          currentTab: self.currentTab
        }
        self.setData({
          orderInfo:[]
        })
        self.onLoad(obj)
      }
    })
  },
  onLoad: function (options) {

    console.log(options.currentTab)
    this.setData({
      currentTab: options.currentTab
    })
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,

        });
      }
    });
    var currentTab = options.currentTab


    this.loadOrderInfo(currentTab);
  },
  loadOrderInfo: function (currentTab) {
    var self = this;
    let orderState = "";
    switch (currentTab) {
      case "0": break;
      case "1": orderState = 0; break;
      case "2": orderState = 1; break;
      case "3": orderState = 2; break;
      case "4": orderState = 3; break;

    }
    console.log(orderState)
    wx.request({
      url: host + 'store/order/selectOrderGoodsByOrderCode?orderState=' + orderState,
      header: {
        "openid": app.getSession("openid")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            if (result.data.data.length > 0) {
              var orderInfo = result.data.data;


              orderInfo.forEach(function (orderInfoObject, index) {
                let total = 0;
                let quantity = 0;
                var orderCode = ""
                orderInfoObject.forEach(function (orderObject, index) {
                  var colorInfo = orderObject.materialColor;
                  var colorInfoStr = colorInfo.substring(1, colorInfo.length - 1)
                  var materialColorObject = JSON.parse(colorInfoStr);
                  quantity += orderObject.quantity;
                  total += materialColorObject.number * orderObject.price;
                  orderCode = orderObject.orderCode;
                  orderObject.materialColorObject = materialColorObject;
                  orderObject.src = host + orderObject.storeProduct.pic1;

                  orderObject.total = total;
                  orderObject.quantity = quantity;
                  orderObject.orderCode = orderCode;
                })


              })
            }
            self.setData({
              orderInfo: orderInfo,
            })
            console.log(self.data)
          } else {

          }
        } else {
          util.showMsgToash("网络异常")
        }
      }

    })
  },
  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    console.log(e)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.loadOrderInfo(e.target.dataset.current);
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onShareAppMessage: function () {

  },
}) 