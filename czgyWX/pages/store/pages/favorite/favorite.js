const host = require('../../config').host
var app = getApp()
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLongTap:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  openSpdetail: function (e) {
    var isLongTap = this.data.isLongTap
    if (!isLongTap) {

      var productId = e.currentTarget.dataset.productid
      console.log(productId)
      wx.navigateTo({
        url: "../spdetail/spdetail?productId=" + productId,
      })
    }
  },
  deleteFavorite: function (e) {
    this.setData({
      isLongTap:true
    })
    var self = this
    wx.showModal({
      title: '提示',
      content: '取消该收藏？',
      success: function (res) {
        if (res.confirm) {
          var favoriteId = e.currentTarget.dataset.guid;
          var index = e.currentTarget.dataset.index;
          
          wx.request({
            url: host + 'store/favorite/deleteByPrimaryKey?guid=' + favoriteId,
            header: { "openid": app.getSession("openid") },
            success: function (result) {
              if (result.statusCode == '200') {
                if (result.data.success) {
                  util.resultOper(result)
                  var favoriteDatas = self.data.favoriteDatas;
                  favoriteDatas.splice(index, 1)
                  self.setData({
                    favoriteDatas: favoriteDatas
                  })
                } else {
                  util.resultOper(result)
                }
              } else {
                util.showMsgToash("网络异常")
              }
            }
          })
        }
      }
    })

  },
  onShow: function (options) {
    var self = this;
    wx.request({
      url: host + 'store/favorite/selectFavoriteAndProductWxUserId',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result.data.data)
        if (result.statusCode == '200') {
          if (result.data.success) {
            if (result.data.data.length > 0) {
              var favoriteDatas = result.data.data
              favoriteDatas.forEach(function (favorite, index) {
                var storeProduct = favorite.storeProduct;
                var src = host + storeProduct.pic1;
                storeProduct.src = src;
              });
              self.setData({
                favoriteDatas: favoriteDatas
              })
              console.log(favoriteDatas)
            } else {
              util.showMsgToash("您没有收藏的商品")
            }
          } else {
            util.showMsgToash("获取数据失败请刷新重试")
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh: function () {
    this.onShow();
  },

})