var WxAutoImage = require('../../js/detailImage.js');
const host = require('../..//config').host
var app = getApp()
var util = require("../../utils/util.js");
Page({
    data: {
      // input默认是1
        num: 1,
      // 使用data数据对象设置样式名
        minusStatus: 'disabled',
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
        iscollect: true,
        isFavorite:false,
        emptyImage:'../../images/favorite_empty.png',
        fillImage:'../../images/favorite_fill.png'
    },
    pay:function(){
      var colorIndex = this.data.colorIndex;
      var StoreProduct = this.data.StoreProduct;
      var materialColorObject = StoreProduct.materialColorObject[colorIndex];
      console.log(materialColorObject[colorIndex])
      materialColorObject.number = this.data.num;
      var materialColorStr = JSON.stringify(materialColorObject)
      StoreProduct.materialColor = materialColorStr;
      console.log(StoreProduct)
      var StorePay = {}
      StorePay.materialColor = StoreProduct.materialColor;
      StorePay.productId = StoreProduct.guid;
      StorePay.productName = StoreProduct.productName;
      StorePay.src = this.data.imageArray[0];
      StorePay.price = this.data.StoreProduct.price;
      StorePay.total = StorePay.price * materialColorObject.number;
      StorePay.quantity = materialColorObject.number;
      StorePay.from = "spdetail";
      StorePay.category = StoreProduct.inventory.category
      StorePay.productVersion = StoreProduct.inventory.productVersion

      console.log(StorePay)
      var storePay = JSON.stringify(StorePay);
      wx.navigateTo({
        url: '../pay/pay?StorePay=' + storePay,
      })
    },
    insertFavorite:function(){
      var self = this;
      var StoreProduct = this.data.StoreProduct;
      var productId = StoreProduct.guid;
      var url = '';
      if (self.data.isFavorite){
        url = host +'store/favorite/deleteByProductAndUserId?productId='+productId;
      } else{
        url = host + 'store/favorite/insertSelective?productId=' + productId;
      }
      wx.request({
        url: url,
        header: { "openid": app.getSession("openid") },
        method:'POST',
        success:function(result){
          if(result.statusCode=='200'){
            if(result.data.success){
              util.resultOper(result)
              self.setData({
                isFavorite: !self.data.isFavorite
              })
            }else{
              util.resultOper(result)
            }
          }else{
            util.showMsgToash("网络异常")
          }
        }
      })
    },
    insertCart:function(){
      console.log(this.data)
      var colorIndex = this.data.colorIndex;
      var StoreProduct = this.data.StoreProduct;
      var materialColorObject = StoreProduct.materialColorObject[colorIndex];
      console.log(materialColorObject[colorIndex])
      materialColorObject.number = this.data.num;
      var materialColorStr = JSON.stringify(materialColorObject)
      StoreProduct.materialColor = materialColorStr;
      console.log(StoreProduct)
      var StoreCart = {}
      StoreCart.materialColor = StoreProduct.materialColor;
      StoreCart.productId = StoreProduct.guid;
      console.log(StoreCart)
      this.uploadCartInfo(StoreCart);
    },
    uploadCartInfo: function (StoreCart){
      
      wx.request({
        url: host +'store/cart/insertSelective',
        method:'POST',
        data:StoreCart,
        header:{
          "Content-Type": "application/json",
          "openid": app.getSession("openid")
        },
        success:function(result){
          console.log(result)
          if(result.statusCode =='200'){
            if(result.data.success){
              util.resultOper(result)
            }else{
              util.resultOper(result)
            }
          }else{
            util.showMsgToash("网络异常")
          }
        }
      })
    },
    onLoad:function(e){
      console.log(e.productId)
      this.getProductDetail(e.productId);
    },
    getImageList: function (storeProduct) {
   
      var imageArray = [];
      if (storeProduct.pic1 != "" && storeProduct.pic1 != null) {
        imageArray[0] = host+ storeProduct.pic1;
      }
      if (storeProduct.pic2 != "" && storeProduct.pic2 != null) {
        imageArray[1] = host +storeProduct.pic2;
      }
      if (storeProduct.pic3 != "" && storeProduct.pic3 != null) {
        imageArray[2] = host + storeProduct.pic3;
      }
      if (storeProduct.pic4 != "" && storeProduct.pic4 != null) {
        imageArray[3] = host + storeProduct.pic4;
      }
      if (storeProduct.pic5 != "" && storeProduct.pic5 != null) {
        imageArray[4] = host + storeProduct.pic5;
      }

      this.setData({
        imageArray:imageArray
      })
      console.log(this.data.imageArray)
    },
    getIsFavorite: function (StoreProduct){
      var self = this;
      wx.request({
        url: host + 'store/favorite/selectFvoriteByProductIdAndUserId?productId=' + StoreProduct.guid,
        header: { "openid": app.getSession("openid") },
        success:function(result){
          if(result.statusCode=='200'){
            if(result.data.success){
              console.log(result)
              if(result.data.data>=1){
                self.setData({
                  isFavorite:true
                })
              }
            }
          }else{
            util.showMsgToash("网络异常")
          }
        }
      })
    },
    getProductDetail:function(productId){
      var self = this;
      wx.request({
        url: host +'store/selectProductByProductId?productId='+productId,
        header: { "openid": app.getSession("openid") },
        success:function(result){
          console.log(result)
          if(result.statusCode == '200'){
            if(result.data.success){
              if(result.data.data!=null){
                console.log(result.data.data)
                var StoreProduct = result.data.data;
                var inventory = StoreProduct.inventory;
                var materialColor = inventory.materialColor;
                var materialColorObject = JSON.parse(materialColor);
                StoreProduct.materialColorObject = materialColorObject;
                self.getImageList(StoreProduct)
                self.getIsFavorite(StoreProduct)
                self.setData({
                  StoreProduct:StoreProduct,
                  colorIndex:0
                })

              }else{
                util.showMsgToash("系统异常")
              }
            }
          }else{
            util.showMsgToash("网络异常")
          }
        }
      })
    },
    cusImageLoad: function(e){
        var that = this;
        that.setData(WxAutoImage.wxAutoImageCal(e));
    } ,
    
    changeColor: function (e) {
      console.log(e)
      console.log(e.target.dataset.colorindex)
      this.setData({
        colorIndex: e.target.dataset.colorindex
      })
    },
    /* 点击减号 */
    bindMinus: function () {
      var num = this.data.num;
      // 如果大于1时，才可以减
      if (num > 1) {
        num--;
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
    },
    /* 点击加号 */
    bindPlus: function () {
      var num = this.data.num;
      // 不作过多考虑自增1
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
    },
    /* 输入框事件 */
    numberChange: function (e) {
      var num = e.detail.value;
      console.log(num)
      if (num <= 0) {
        num=1
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
    },
    jumpToCart:function(){
      console.log("jumpToCart")
      wx.switchTab({
        url: '/pages/store/pages/cart/cart',
      })
    },
    jumpToService: function () {
      console.log("jumpToService")
      
    },
    onShareAppMessage: function () {

    },

    
    

})