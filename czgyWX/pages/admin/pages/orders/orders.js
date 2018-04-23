const host = require('../../config').host
var app = getApp();
var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStateRadio: [
      { id: 0, value: "未付款", isSelect: 'true' },
      { id: 1, value: "未发货" },
      { id: 2, value: "已发货" },
      { id: 3, value: "已收货" }

    ],
    currentTab:0,
    orderCode:"",
    orderState:"",
    ordertype:0,
    orderTypeForm:"",
    isOwnAuthority:false
  },
  details: function (e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../details-orders/details-orders?guid=' + e.currentTarget.dataset.text,
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
  // 点击tab切换 
  swichNav: function (e) {
    console.log(e)
    console.log(e.target.dataset.current)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      // that.loadOrderInfo(e.target.dataset.current);
      let orderState = "";
      switch (e.target.dataset.current) {
        case "0": break;
        case "1": orderState = 0; break;
        case "2": orderState = 1; break;
        case "3": orderState = 2; break;
        case "4": orderState = 3; break;

      }

      that.setData({
        currentTab: e.target.dataset.current,
        orderState:orderState
      })
      that.searchOrders();
    }

    
  },
  switchOrderType:function(e){
    var that = this;
    if (this.data.ordertype === e.target.dataset.ordertype) {
      return false;
    } else {
      // that.loadOrderInfo(e.target.dataset.current);
      let orderTypeForm = "";
      switch (e.target.dataset.ordertype) {
        case "0": break;
        case "1": orderTypeForm = 0; break;
        case "2": orderTypeForm = 1; break;

      }

      that.setData({
        ordertype: e.target.dataset.ordertype,
        orderTypeForm: orderTypeForm
      })
      that.searchOrders();
    }
  },
  onLoad: function () {
    var self = this;

    var authorityArray = [];
    var authorityData = app.getSession("authorityData");
    for (var i = 0; i < authorityData.length; i++) {
      authorityArray[i] = authorityData[i].id;
    }

    console.log(authorityArray.join(","))
    var authorityIds = authorityArray.join(",")
    console.log(authorityIds)
    console.log(authorityIds.indexOf("5") > 0 || authorityIds.indexOf("6") > 0)
    if(authorityIds.indexOf("5")>0||authorityIds.indexOf("6")>0){
      this.setData({
        isOwnAuthority:true
      })
    }
    wx.request({
      url: host + "admin/orderGoods/getAllOrderGoodsInfo?orderCode=",
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

                var colorInfo = result.data.data[i].materialColor;
                var objectColor = JSON.parse(colorInfo);
                result.data.data[i].materialColor = objectColor;
                console.log("color", objectColor);

                var newDate = new Date();
                var newSupplyDate = new Date();

                var dateInfo = result.data.data[i].createDate;
                var supplyDateInfo = result.data.data[i].supplyDate;

                console.log(dateInfo);
                console.log(supplyDateInfo);

                newDate.setTime(dateInfo);
                newSupplyDate.setTime(supplyDateInfo);

                var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
                var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");


                console.log(formatDate);
                console.log(formatSupplyDate);

                result.data.data[i].createDate = formatDate;
                result.data.data[i].supplyDate = formatSupplyDate;
                self.data.orderStateRadio.forEach(function(orderStateObject,index){
                  if (orderStateObject.id == result.data.data[i].orderState){
                    result.data.data[i].orderStateInfo = orderStateObject.value
                  }
                })
                
              };

              self.setData({
                ordersDatas: result.data.data,
                currentTab: 0,
                orderCode: "",
                orderState: "",
                ordertype: 0,
                orderTypeForm: "",
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
      orderCode: e.detail.value
    })
  },
  searchOrders: function (e) {
    this.setData({
      ordersDatas:[]
    })
    var self = this;
    console.log(app.getSession("adminSessionId"))
    console.log(e + "searchInstock");
    console.log(self.data)
    console.log(self.data.orderCode)
    console.log(self.data.orderState)
    var url = host + 'admin/orderGoods/getAllOrderGoodsInfo?orderCode=' + self.data.orderCode + "&orderState=" + self.data.orderState + "&orderTypeForm="+self.data.orderTypeForm;
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


                var colorInfo = result.data.data[i].materialColor;
                var objectColor = JSON.parse(colorInfo);
                result.data.data[i].materialColor = objectColor;
                console.log("color", objectColor);

                var newDate = new Date();
                var newSupplyDate = new Date();

                var dateInfo = result.data.data[i].createDate;
                var supplyDateInfo = result.data.data[i].supplyDate;

                console.log(dateInfo);
                console.log(supplyDateInfo);

                newDate.setTime(dateInfo);
                newSupplyDate.setTime(supplyDateInfo);

                var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
                var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");

                console.log(formatDate);
                console.log(formatSupplyDate);
                result.data.data[i].createDate = formatDate;
                result.data.data[i].supplyDate = formatSupplyDate;
                self.data.orderStateRadio.forEach(function (orderStateObject, index) {
                  if (orderStateObject.id == result.data.data[i].orderState) {
                    result.data.data[i].orderStateInfo = orderStateObject.value
                  }
                })
              };
              self.setData({
                ordersDatas: result.data.data
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
  addOrders: function (e) {
    wx.navigateTo({
      url: '../details-orders/details-orders?guid=0'
    })
  },
  addOrdersUser: function (e) {
    wx.navigateTo({
      url: '../orders-user/orders-user'
    })
  },
  onPullDownRefresh: function () {
    this.onLoad();
  },
  
  logout:function () {
    app.logout();
  }
})
