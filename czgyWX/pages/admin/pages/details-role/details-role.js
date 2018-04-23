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
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var authorizeData = this.data.authorizeData;


    var roleData = this.data.roleData;
    var checkArr = e.detail.value
    var authorityStr = e.detail.value.join(",");
    var authorityId = authorityStr + ",";

    var authorizeArray = this.data.authorizeArray;

    console.log(checkArr)
    authorizeData.forEach(function (auht, roleIndex) {
      console.log(auht)
      auht.checked = false;
      e.detail.value.forEach(function (checkAut, checkIndex) {
        console.log(checkAut)
        if (auht.id == checkAut) {
          auht.checked = !auht.checked
        }
      })

    })

    console.log(authorizeData)
    roleData.authorityId = authorityId
    this.setData({
      authorityId: authorityId,
      authorizeData: authorizeData,
      roleData: roleData
    })
  },
  over: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    console.log("??" + this.data.roleName);
    var roleData = this.data.roleData;
    console.log(roleData)
    var roleName = roleData.roleName;
    var authorityId = roleData.authorityId;
    if (roleName == "" || roleName == null || authorityId == "" || authorityId == null) {
      util.showMsgToash("输入信息不能为空");
    } else {

      console.log(roleName + "--" + authorityId)

      var role = { "roleGuid": roleData.roleGuid, "authorityId": authorityId, "roleName": roleName };
      console.log(role)
      wx.request({
        url: host + 'admin/user/updatRoleByGuid',
        method:"POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": app.getSession("adminSessionId")
        },
        data: roleData,
        success: function (result) {

          console.log('request success', result.data);
          if (result.statusCode == '200') {
            if (result.data.success) {
              util.showMsgToash("更新成功");
              wx.navigateBack({
                delta: 1
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
    roleData.roleName = e.detail.value
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
  getAllAuthorize: function (options) {
    var self = this;
    wx.request({
      url: host + 'info/getAllAuthorityInfo',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      data: {
        noncestr: Date.now()
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

        self.getRoleInfo(options);

        console.log(self.data);
      }


    });
  },
  getRoleInfo: function (options) {
    var self = this;
    wx.request({
      url: host + 'admin/user/selectRoleByGuid?guid=' + options.guid,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data != null) {
              var roleData = result.data.data;
              roleData.isTouchMove = false,
                roleData.overDisplay = true;
              var authorizeArray = self.data.authorizeArray;
              var authorizeData = self.data.authorizeData;
              roleData.authorizeData = [];
              var authorityId = roleData.authorityId;

              var authorityIdArr = authorityId.split(",");
              console.log(authorityIdArr)
              for (var j = 0; j < authorizeData.length; j++) {

                var index = authorizeArray.indexOf(authorityIdArr[j])
                if (index != -1) {
                  authorizeData[index].checked = true;
                }
              }
              self.setData({
                roleData: roleData,
                authorizeData: authorizeData
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
  onLoad: function (options) {
    this.getAllAuthorize(options);
  },
})
