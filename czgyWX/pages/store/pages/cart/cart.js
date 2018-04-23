// const AV = require('../../utils/av-weapp.js')
const host = require('../..//config').host
var app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {
    carts: [],
    minusStatuses: [],
    selectedAllStatus: false,
    total: '',
    startX: 0,
    itemLefts: []
  },
  uploadMaterlColorInfo: function (cart, carts, minusStatuses) {
    var self = this;
    cart.materialColor = JSON.stringify(cart.materialColorObject);
    wx.request({
      url: host +'store/cart/updateByPrimaryKeySelective',
      header:{
        openid:app.getSession("openid")
      },
      data:cart,
      method:'POST',
      success:function(result){
        if(result.statusCode == '200'){
          if (result.data.success){
            console.log(result)
          }else{
            console.log(result)
          }
        }else{
          util.showMsgToash("网络异常")
        }
      }
    })
  },
  setMinusStatuses: function (num, index) {
    var self = this;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    console.log(minusStatus)
    // 购物车数据
    var carts = this.data.carts;
    carts[index].materialColorObject.number = num;
    // 按钮可用状态
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[index] = minusStatus;
    
    // 将数值与状态写回
    this.uploadMaterlColorInfo(carts[index], carts, minusStatuses)
    self.setData({
      carts: carts,
      minusStatuses: minusStatuses
    });

  },
  bindMinus: function (e) {
    // loading提示
    // wx.showLoading({
    // 	title: '操作中',
    // 	mask: true
    // });
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(index + "index")
    console.log(this.data.carts[index])
    var num = this.data.carts[index].materialColorObject.number;
    console.log(num)
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 将数值与状态写回
    this.setMinusStatuses(num, index)

    this.sum();
  },
  bindPlus: function (e) {
    // wx.showLoading({
    // 	title: '操作中',
    // 	mask: true
    // });
    var index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.carts[index].materialColorObject.number;
    // 自增
    num++;
    // 将数值与状态写回
    this.setMinusStatuses(num, index)
    this.sum();
  },
  
  bindManual: function (e) {
    // wx.showLoading({
    // 	title: '操作中',
    // 	mask: true
    // });
    var index = parseInt(e.currentTarget.dataset.index);
    console.log(index)
    var carts = this.data.carts;
    var num = parseInt(e.detail.value);
    if (isNaN(num) || num <= 0) {
      num = 1;
    }
    // 将数值与状态写回
    this.setMinusStatuses(num, index)
    this.sum();
  },
  bindManualTapped: function () {
    // 什么都不做，只为打断跳转
  },
  bindCheckbox: function (e) {
    console.log(e)
    // wx.showLoading({
    // 	title: '操作中',
    // 	mask: true
    // });
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !carts[index].selected;
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
    });

    this.setData({
      selectedAllStatus: false
    })
    this.sum();
  },
  bindSelectAll: function () {
    // wx.showLoading({
    // 	title: '操作中',
    // 	mask: true
    // });
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
      carts: carts,
    });
    this.sum();

  },
  pay: function () {
    var cartIds = this.calcIds();
    var cartGuid = this.data.cartGuid;
    if(cartIds.length>=1){
      // cartIds = cartIds.join(',');
      cartGuid = cartGuid.join(',')
      console.log(cartIds)
      var StorePay ={};
      var cartDatas = this.data.carts;
      var payCart = [];
      console.log(cartDatas)
      
      cartIds.forEach(function (cartIndex,index) {
        payCart.push(cartDatas[cartIndex])
      })
      console.log(cartDatas)
      StorePay.cartDatas = payCart;
      StorePay.total = this.data.total;
      StorePay.quantity = this.data.quantity;
      StorePay.from = "cart";
      StorePay.cartGuid = cartGuid;
      wx.navigateTo({
        url: '../pay/pay?StorePay=' + JSON.stringify(StorePay)
      });
    }
    
  },
  delete: function (e) {
    var self = this;
    // 购物车单个删除
    var objectId = e.currentTarget.dataset.objectId;
    var index = e.currentTarget.dataset.index;

    console.log(objectId);
    wx.showModal({
      title: '提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: host +'store/cart/deleteByPrimaryKeyAndwxUserId?guid='+objectId,
            header: { "openid": app.getSession("openid") },
            success:function(result){
              if(result.statusCode=='200'){
                if(result.data.success){
                  util.resultOper(result)
                  var carts = self.data.carts
                  carts.splice(index,1);
                  var itemLefts = self.data.itemLefts;
                  itemLefts[index] = 0
                  self.setData({
                    carts:carts,
                    itemLefts: itemLefts
                  })
                }
              }else{
                util.showMsgTaosh("网络异常")
              }
            }
          })
        }
      }
    })
  },
  calcIds: function () {
    // 遍历取出已勾选的cid
    // var buys = [];
    var cartIds = [];
    var cartGuid = [];
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        // 移动到Buy对象里去
        // cartIds += ',';
        cartGuid.push(this.data.carts[i].guid);
        
        cartIds.push(i);
      }
    }
    this.setData({
      cartGuid:cartGuid
    })
    if (cartIds.length <= 0) {
      wx.showToast({
        title: '请勾选商品',
        icon: 'success',
        duration: 1000
      })
      
    }
    return cartIds;
  },
  onShow: function () {
    this.reloadData();
  },
  reloadData: function () {
    var self = this;
    console.log();
    var minusStatuses = [];
    wx.request({
      url: host + 'store/cart/selectCardAndProductAndInventoryByWxUserId?wxUserId=test',
      header: { "openid": app.getSession("openid") },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
          if (result.data.success) {
            var cartDatas = result.data.data;
            console.log(cartDatas)
            for (let i = 0; i < cartDatas.length; i++) {
              var materialColorStr = cartDatas[i].materialColor;
              console.log(materialColorStr)
              var materialColorObject = JSON.parse(materialColorStr);
              cartDatas[i].materialColorObject = materialColorObject;
              cartDatas[i].src = host + cartDatas[i].storeProduct.pic1;
              cartDatas[i].selected = false;

              minusStatuses[i] = cartDatas[i].materialColorObject.number <= 1 ? 'disabled' : 'normal';
            }
            console.log(cartDatas)
            self.setData({
              carts: cartDatas,
              minusStatuses: minusStatuses,
              selectedAllStatus:false,
              total:"0.00"
            })
          } else {

            util.resultOper("未检测导数据")
          }
        }

      }
    })
    this.sum();
  },
  onShow: function () {
    this.reloadData();
  },
  sum: function () {
    var carts = this.data.carts;
    // 计算总金额
    var total = 0;
    var quantity = 0;
    for (var i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += carts[i].materialColorObject.number * carts[i].storeProduct.price;
        quantity += carts[i].materialColorObject.number
      }
    }
    total = total.toFixed(2);
    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: total,
      quantity: quantity
    });
  },
  showGoods: function (e) {
    // 点击购物车某件商品跳转到商品详情
    var productId = e.currentTarget.dataset.objectId;
    console.log(e)
    wx.navigateTo({
      url: '../spdetail/spdetail?productId=' + productId
    });
  },
  touchStart: function (e) {
    var startX = e.touches[0].clientX;
    this.setData({
      startX: startX,
      itemLefts: []
    });
  },
  touchMove: function (e) {
    var index = e.currentTarget.dataset.index;
    var movedX = e.touches[0].clientX;
    var distance = this.data.startX - movedX;
    var itemLefts = this.data.itemLefts;
    itemLefts[index] = -distance;
    this.setData({
      itemLefts: itemLefts
    });
  },
  touchEnd: function (e) {
    var index = e.currentTarget.dataset.index;
    var endX = e.changedTouches[0].clientX;
    var distance = this.data.startX - endX;
    // button width is 60
    var buttonWidth = 60;
    if (distance <= 0) {
      distance = 0;
    } else {
      if (distance >= buttonWidth) {
        distance = buttonWidth;
      } else if (distance >= buttonWidth / 2) {
        distance = buttonWidth;
      } else {
        distance = 0;
      }
    }
    var itemLefts = this.data.itemLefts;
    itemLefts[index] = -distance;
    this.setData({
      itemLefts: itemLefts
    });
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.onShow();
  },

})