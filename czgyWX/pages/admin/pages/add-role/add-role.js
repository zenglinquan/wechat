const host = require('../../config').host
var app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {

    input: [],
    roleData: [],
    startX: 0, //开始坐标
    startY: 0,
    hidden: false,
    deleteDisplay: true,
    items: [
      { name: 'USA', value: '美国' },
      { name: 'CHN', value: '中国', checked: 'true' },
      { name: 'BRA', value: '巴西' },
      { name: 'JPN', value: '日本' },
      { name: 'ENG', value: '英国' },
      { name: 'TUR', value: '法国' },
    ]
  },
  details: function (e) {
    var roleData = this.data.roleData;
    if (!roleData[roleData.length - 1].overDispled) {
      var id = e.currentTarget.dataset.id;
      console.log(e.currentTarget.dataset.id);
      wx.navigateTo({
        url: '../../pages/details-role/details-role?guid=' + id,
      })
    }
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var roleData = this.data.roleData;
    var authorizeData = roleData[roleData.length - 1].authorizeData;
    authorizeData.forEach(function (roleAut, roleIndex) {
      console.log(roleAut)
      roleAut.checked = false;
      e.detail.value.forEach(function (checkAut, checkIndex) {
        console.log(checkAut)
        if (roleAut.id == checkAut) {
          roleAut.checked = !roleAut.checked
        }
      })

    })
    roleData.authorizeData = authorizeData;
    var checkArr = e.detail.value
    var authorityStr = e.detail.value.join(",");
    var authorityId = authorityStr + ","
    console.log(roleData)
    this.setData({
      roleData: roleData,
      authorityId: authorityId
    })
  },
  add: function (e) {
    var roleData = this.data.roleData;
    var length = roleData.length;
    if (roleData[length - 1].overDispled) {
      util.showMsgToash("请先完成当前操作")
    } else {

      var self = this;
      var authorizeData = self.data.authorizeData;
      var newAuthorizeData = [];
      console.log(authorizeData)
      authorizeData.forEach(function (v, i) {
        console.log
        v.checked = false;
        v.checkedDisabled = false;
        newAuthorizeData.push(
          v
        )
      })
      console.log(newAuthorizeData)

      this.data.roleData.push({
        isTouchMove: false,
        inputDisabled: false,
        overDispled: true,
        authorizeData: newAuthorizeData
      })
      console.log(this.data.roleData)
      this.setData({
        roleData: this.data.roleData,
        hidden: true
      })
    }
  },
  over: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    console.log("??" + this.data.roleName);
    var roleName = this.data.roleData[this.data.roleData.length - 1].roleName;
    var authorityId = this.data.authorityId;
    if (roleName == "" || roleName == null || authorityId == "" || authorityId == null) {
      util.showMsgToash("输入信息不能为空");
    } else {

      console.log(roleName + "--" + authorityId)

      var materialColor = { "authorityId": authorityId, "roleName": roleName };
      var updateroleData = this.data.roleData;
      console.log(materialColor)
      wx.request({
        url: host + 'admin/user/insertRoleInfo',
        method:"POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": app.getSession("adminSessionId")
        },
        data: materialColor,
        success: function (result) {

          console.log('request success', result.data);
          if (result.statusCode == '200') {
            if (result.data.success) {
              util.resultOper(result)
              updateroleData[updateroleData.length - 1].overDispled = false;

              self.onLoad();
              self.setData({
                hidden: !self.data.hidden,
                roleData: updateroleData
              })

            } else {
              util.resultOper(result)
            }
          } else {
            util.showMsgToash("请求异常");
          }


        }


      });
    }
    console.log(this.data);

  },
  roleNameInputChange: function (e) {
    console.log(e);
    var roleData = this.data.roleData;
    roleData[roleData.length - 1].roleName = e.detail.value
    this.setData({
      roleData: roleData
    })
  },
  submit: function () {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })

  },
  getAllAuthorize: function (e) {
    var self = this;
    wx.request({
      url: host + 'info/getAllAuthorityInfo',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {


          if (result.data.length > 0) {
            var authorizeData = result.data;
            var authorizeArray = [];
            for (var i = 0; i < authorizeData.length; i++) {
              authorizeArray[i] = authorizeData[i].id;
            }
            self.setData({
              authorizeData: result.data,
              authorizeArray: authorizeArray
            });
            console.log(authorizeArray)
          } else {
            util.showMsgToash("未检测到数据");
          }

        } else {
          util.showMsgToash("请求异常");
        }

        self.getAllRoleInfo();

        console.log(self.data);
      }


    });
  },
  getAllRoleInfo: function (e) {
    var self = this;
    wx.request({
      url: host + 'admin/user/getAllRoleInfo',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data.length > 0) {
              var roleData = result.data.data;
              result.data.data.forEach(function (v, i) {
                v.isTouchMove = false,
                  v.inputDisabled = true,
                  v.overDisplay = true;
              })
              var authorizeArray = self.data.authorizeArray;
              var authorizeData = self.data.authorizeData;
              for (var i = 0; i < roleData.length; i++) {
                roleData[i].authorizeData = [];
                var authorityId = roleData[i].authorityId;
                var authorityIdArr = authorityId.split(",");
                for (var j = 0; j < authorizeData.length; j++) {
                  var index = authorizeArray.indexOf(authorityIdArr[j])
                  if (index != -1) {
                    authorizeData[index].checked = true;
                    authorizeData[index].checkedDisabled = true;
                    roleData[i].authorizeData.push(authorizeData[index])
                  }
                }
              }
              self.setData({
                roleData: roleData
              });
              console.log(self.data.roleData);
            } else {
              util.showMsgToash("未检测到数据");
            }
          } else {
            util.resultOper(result)
          }

        } else {
          util.showMsgToash("请求异常");
        }


      }


    });
    console.log(self.data);
  },
  onLoad: function (e) {
    this.getAllAuthorize();
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    var roleData = this.data.roleData;
    if (!roleData[roleData.length - 1].overDispled) {
      //开始触摸时 重置所有删除
      this.data.roleData.forEach(function (v, i) {
        if (v.isTouchMove)//只操作为true的
          v.isTouchMove = false;
      })
      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        roleData: this.data.roleData
      })
      console.log(this.data.roleData)
    }
  },
  //滑动事件处理
  touchmove: function (e) {
    var roleData = this.data.roleData;
    if (!roleData[roleData.length - 1].overDispled) {
      var that = this,
        index = e.currentTarget.dataset.index,//当前索引
        startX = that.data.startX,//开始X坐标
        startY = that.data.startY,//开始Y坐标
        touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
        touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
        //获取滑动角度
        angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      console.log(index);
      console.log(this.data.roleData);
      that.data.roleData.forEach(function (v, i) {
        v.isTouchMove = false
        //滑动超过30度角 return
        if (Math.abs(angle) > 30) return;
        if (i == index) {
          if (touchMoveX > startX) //右滑
            v.isTouchMove = false
          else //左滑
            v.isTouchMove = true
        }
      })
      //更新数据
      that.setData({
        roleData: that.data.roleData
      })
    }
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var self = this;
    console.log(e)
    this.data.roleData.splice(e.currentTarget.dataset.id, 1)
    wx.request({
      url: host + 'admin/user/deleteRoleByGuid?guid=' + e.currentTarget.dataset.text,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data.data);
        if (result.statusCode == '200') {
          if (result.data.success) {
            self.onLoad();
            util.resultOper(result)
          } else {
            util.resultOper(result)
          }

        } else {
          util.resultOper(result)
        }


      }


    });
    this.setData({
      roleData: this.data.roleData
    })
  },
  onShow: function () {
    this.onLoad();
  }

})
