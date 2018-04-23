// addaddress.js

const host = require("../../config.js").host
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_selected: "../../images/address_selected.png",
    address_blank: "../../images/blank.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadUserDefaultAddress();
  },
  loadUserDefaultAddress() {

    var self = this;
    wx.request({
      url: host + 'store/user/selectAddressIdByOpenID',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        if (result.statusCode == '200') {
          if (result.data.success) {
            var addressId = result.data.info;
            self.setData({
              addressId: addressId
            })
            self.loadAddressInfo(addressId)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  loadAddressInfo: function (addressId) {
    this.setData({
      addressDatas:[]
    })
    var self = this;
    wx.request({
      url: host + 'store/address/selectAllAddressByWxUserId',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.data.length > 0) {
            result.data.data.forEach(function (address, index) {
              if (addressId == address.guid) {
                address.selected = true
              } else
                address.selected = false
            });
            self.setData({
              addressDatas: result.data.data
            })
            console.log(self.data.addressDatas)
          } else {
            util.showMsgToash("未填写地址")
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  updateSelectedInfo: function (addressId) {
    var addressDatas = this.data.addressDatas;
    addressDatas.forEach(function (address, index) {
      if (address.guid == addressId) {
        address.selected = true;
      } else {
        address.selected = false;
      }
    })
    console.log(addressDatas)
    this.setData({
      addressDatas: addressDatas,
      addressId: addressId
    })
  },
  uploadDefalutAddress: function (addressId) {
    var self = this;
    wx.request({
      url: host + 'store/user/updateAddressIdByopenID?addressId=' + addressId,
      header: {
        "openid": app.getSession("openid")
      },
      success: function (result) {
        if (result.statusCode == '200') {
          if (result.data.success) {

            util.resultOper(result)
            self.updateSelectedInfo(addressId)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  selectedDefaultAddress: function (e) {
    console.log(e)
    var addressId = e.currentTarget.dataset.guid;
    if (addressId != this.data.addressId) {

      console.log(addressId)
      this.uploadDefalutAddress(addressId)
    }

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
  editor: function (e) {
    console.log('asasa');
    wx.navigateTo({
      url: '../addaddress/addaddress?guid=' + e.currentTarget.dataset.guid,
    })
  },
  addAdress: function () {
    wx.navigateTo({
      url: '../addaddress/addaddress?guid=0',
    })

  },
  del: function (e) {
    var addressId = e.currentTarget.dataset.guid;
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: host + 'store/address/deleteByPrimaryKey?guid='+addressId,
            header:{
              "openid":app.getSession("openid")
            },
            success:function(result){
              if(result.statusCode == '200'){
                if(result.data.success){
                  util.resultOper(result)
                  self.onShow();
                }else{
                  util.resultOper(result)
                }
              }else{
                util.showMsgToash("网络异常")
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShareAppMessage: function () {

  },
  onShareAppMessage: function () {

  }, onShareAppMessage: function () {

  }, onShareAppMessage: function () {

  },

  onShareAppMessage: function () {

  },
})