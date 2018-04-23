const host = require('../../config').host
var app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  details: function (e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../details-orders-user/details-orders-user?guid=' + e.currentTarget.dataset.text,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  opendManager: function (e) {
    app.showActionSheetModal();
  },
  onLoad: function () {
    var self = this;
    wx.request({
      url: host + 'admin/orderGoods/selectAllOrderUser',
      header: {
        "Cookie": app.getSession("adminSessionId")
      },
      data: {
        noncestr: Date.now()
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data.length > 0) {
              for (var i = 0; i < result.data.data.length; i++) {
                var newSupplyDate = new Date();
                var supplyDateInfo = result.data.data[i].supplyDate;
                newSupplyDate.setTime(supplyDateInfo);
                var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");
                result.data.data[i].supplyDate = formatSupplyDate;
              };
              self.setData({
                orderUserDatas: result.data.data
              });
            } else {
              util.showMsgToash("未检测到数据")
            }
          } else {
            util.resultOper(result)
          }

        } else {
          util.showMsgToash("网络异常")
        }



      }
    });
  },
  searchInputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      searchKey: e.detail.value
    })
  },
  searchOrders: function (e) {
   
    self.setData({
      orderUserDatas: []
    });
    var self = this;
    console.log(e + "searchInstock");
    var url = host + 'admin/orderGoods/selectAllOrderUserByUserName?orderUserName=' + self.data.searchKey;
    wx.request({
      url: url,
      header: {
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data.length > 0) {
              for (var i = 0; i < result.data.data.length; i++) {
                var newSupplyDate = new Date();
                var supplyDateInfo = result.data.data[i].supplyDate;
                newSupplyDate.setTime(supplyDateInfo);
                var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");
                result.data.data[i].supplyDate = formatSupplyDate;
              };
              self.setData({
                orderUserDatas: result.data.data
              });
            } else {
              util.showMsgToash("未检测到数据")
            }
          } else {
            util.resultOper(result)
          }

        } else {
          util.showMsgToash("网络异常")
        }

      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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
    this.onLoad();
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

  addOrdersUser: function (e) {
    wx.navigateTo({
      url: '../details-orders-user/details-orders-user?guid=0'
    })
  },
  onPullDownRefresh: function () {
    this.onLoad();
  },
})
