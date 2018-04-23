const host = require('../../config').host
var app = getApp()
var util = require("../../utils/util.js");

Page({
  data: {
    storeProductTree: {},
  },
  changeCategory: function (e) {
    console.log(e)
    var categoryId = e.target.dataset.id;
    console.log(categoryId)
    this.setData({
      currCategoryId: categoryId
    })
    this.getProductByCategory(categoryId);
    console.log(this.data.storeProductTree)
  },
  onShow: function (e) {
    this.getAllCategory();
  },
  getProductByCategory: function (categoryId) {
    var self = this;
    var storeProductTree = self.data.storeProductTree;
    if (!storeProductTree.hasOwnProperty(categoryId)) {

      wx.request({
        url: host + 'store/selectAllProductAndInventoryByCategoryId?categoryId=' + categoryId,
        header: { "openid": app.getSession("openid") },
        success: function (result) {
          if (result.statusCode) {
            if (result.data.success) {
              if (result.data.data.length > 0) {
                console.log(result)
                var storeProduct = result.data.data;
                storeProduct.forEach(function (product, index) {
                  var pic1 = product.pic1;
                  var src = host + pic1;
                  product.src = src;
                })
                var storeProductTree = self.data.storeProductTree
                storeProductTree[categoryId] = storeProduct
                console.log(storeProductTree)
                self.setData({
                  storeProductTree: storeProductTree
                })
                console.log(storeProduct)
              } else {
                util.showMsgToash("无数据");
              }
            } else {
              util.resultOper(result)
            }
          } else {
            util.showMsgToash("网络异常")
          }
        }
      })
    }
  },
  getAllCategory: function () {
    var self = this;

    wx.request({
      url: host + 'store/getAllCategory',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            if (result.data.data.length > 0) {

              console.log(result.data.data)
              self.setData({
                category: result.data.data,
                currCategoryId: result.data.data[0].categoryGuid
              })
              self.getProductByCategory(result.data.data[0].categoryGuid);
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
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onShow();
  },

})