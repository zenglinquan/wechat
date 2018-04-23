
var app = getApp();

const host = require('../../config').host
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: "../../images/null.png"
  },
  details: function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../details-product/details-product?guid=' + e.currentTarget.dataset.id,
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
      url: host + 'admin/storeProduct/selectAllStoreProduct',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data.length > 0) {
              console.log('request success', result);

              var StoreProduct = result.data.data;
              for (var i = 0; i < StoreProduct.length; i++) {
                var newDate = new Date();
                var dateInfo = StoreProduct[i].createDate;
                console.log(dateInfo);
                newDate.setTime(dateInfo);
                var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
                console.log(formatDate);
                StoreProduct[i].createDate = formatDate;
                var imageSrc = self.data.imageSrc;
                if (StoreProduct[i].pic1 != "" && StoreProduct[i].pic1 != null) {
                  imageSrc = host + StoreProduct[i].pic1;
                }
                console.log(imageSrc)
                StoreProduct[i].imageSrc = imageSrc;

              };
              self.setData({
                productDatas: StoreProduct,
              });
              console.log(self.data.productDatas)
            } else {
              util.showMsgToash("未检测到数据")
            }

          } else {
            util.resultOper(result);
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    });
  },
  searchProduct: function (e) {
    var self = this;
    self.setData({
      productDatas: [],
    });
    console.log(e + "searchInstock");
    var url = host + 'admin/storeProduct/selectAllStoreProductByProductVersion?productVersion=' + self.data.searchKey;
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
              console.log('request success', result.data.data);
              var StoreProduct = result.data.data;
              for (var i = 0; i < StoreProduct.length; i++) {
                var newDate = new Date();
                var dateInfo = StoreProduct[i].createDate;
                console.log(dateInfo);
                newDate.setTime(dateInfo);
                var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
                console.log(formatDate);
                StoreProduct[i].createDate = formatDate;

                var imageSrc = self.data.imageSrc;
                if (StoreProduct[i].pic1 != "" && StoreProduct[i].pic1 != null) {
                  imageSrc = host + StoreProduct[i].pic1;
                }
                console.log(imageSrc)
                StoreProduct[i].imageSrc = imageSrc;

              };


              self.setData({
                productDatas: StoreProduct,
              });
              console.log(self.data.productDatas)
            } else {
              util.showMsgToash("未检测到数据")
            }

          }else{
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }

      },
      fail: function (resutlt) {

      }
    });
  },
  searchInputChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      searchKey: e.detail.value
    })
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
  addProduct: function (e) {
    wx.navigateTo({
      url: '../details-product/details-product?guid=0'
    })
  },
  logout: function () {
    app.logout();
  }

})
