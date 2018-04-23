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
      url: '../details-outstock/details-outstock?guid=' + e.currentTarget.dataset.text,
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
      url: host + 'admin/removalInventory/getAllRemovalInventoryInfo',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data.length > 0) {
              for (var i = 0; i < result.data.data.length; i++) {
                var newDate = new Date();
                var dateInfo = result.data.data[i].createDate;
                var colorInfo = result.data.data[i].materialColor;
                var objectColor = JSON.parse(colorInfo);
                result.data.data[i].materialColor = objectColor;
                console.log("color", objectColor);
                console.log(dateInfo);
                newDate.setTime(dateInfo);
                var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");

                console.log(formatDate);
                result.data.data[i].createDate = formatDate;
              };
              self.setData({
                removalInventoryDatas: result.data.data
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
  searchOutstock: function (e) {
    var self = this;
    self.setData({
      removalInventoryDatas: []
    });
    console.log(e + "searchInstock");
    var url = host + 'admin/removalInventory/selectAllRemovalInventoryByProductVersion?outCode=' + self.data.searchKey;
    wx.request({
      url: url,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data.length > 0) {
              for (var i = 0; i < result.data.data.length; i++) {
                var newDate = new Date();
                var dateInfo = result.data.data[i].createDate;
                var colorInfo = result.data.data[i].materialColor;
                var objectColor = JSON.parse(colorInfo);
                result.data.data[i].materialColor = objectColor;
                console.log("color", objectColor);
                console.log(dateInfo);
                newDate.setTime(dateInfo);
                var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");

                console.log(formatDate);
                result.data.data[i].createDate = formatDate;
              };
              self.setData({
                removalInventoryDatas: result.data.data
              });
            } else {
              console.log("未检测到数据")
              util.showMsgToash("未检测到数据")
            }
          }else{
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
  addRemovalInventory: function (e) {
    wx.navigateTo({
      url: '../details-outstock/details-outstock?guid=0'
    })
  },
  logout: function () {
    app.logout();
  }
})
