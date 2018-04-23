
const host = require('../..//config').host
var app = getApp()
var util = require("../../utils/util.js");

Page({
    data: {
        '__modal__': {
            show: false
        },
        name: '用户昵称',     // 用户昵称
        avatar: '../../images/avtor.png',   // 用户头像
        mbeanCount: 0,   // 妈豆数
        favoriteCount: 0,   // 优惠券数
        waitPayOrderCount: 0,        // 待付款
        waitDeliverOrderCount: 0,    // 待发货
        waitReceiveOrderCount: 0,    // 待收货
        waitCommentOrderCount: 0    // 待评价
    },
    onShow:function(){
      let userInfo = app.getSession("userInfo");
      if(userInfo){
        let user = JSON.parse(userInfo);
        this.setData({
          avatar: user.avatarUrl,
          name: user.nickName 
        })
      }
      this.getCountFavorite();
    },
    getCountFavorite:function(){
      var self = this;
      wx.request({
        url: host +'store/favorite/selectFvoriteCountByUserId',
        header:{"openid":app.getSession("openid")},
        success:function(result){
          if(result.statusCode=='200'){
            if(result.data.success){
              self.setData({
                favoriteCount:result.data.data
              })
            }
          }else{
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
    onShareAppMessage: function () {

    },

});