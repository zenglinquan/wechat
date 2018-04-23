const host = require('../../config').host
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorValue: [],
    deleteFlag: true,
    userData: {
      materialColor: []
    },
    index: 0,
    submitDisplay: false,
    editDisplay: false,
    deleteDisplay: false,
    saveDisplay: false,
    inputDisabled: false,
    confirmodalDisplay: false,
    tipComfirmModalDisplay: false,
    buttonDisabled: false,
    clickData: {},
    productVersionIndex: 0,
    passwordType: true,
    confirmType: true,
    rolePickerIndex: 0

  },
  confirmEye: function (e) {
    this.setData({
      confirmType: !this.data.confirmType
    })
  },
  passwordEye: function (e) {
    this.setData({
      passwordType: !this.data.passwordType
    })
  },
  commitForm: function (e) {
    var formObject = e.detail.value;
    console.log("内容不能为空" + e);
    if (formObject.userName == "" || formObject.password == "" || formObject.confirmPassword == "") {
      console.log("内容不能为空" + e);
      util.showMsgToash("输入框不能为空")
    } else if (formObject.password != formObject.confirmPassword) {
      util.showMsgToash("两次密码不一致")
    } else {
      this.showComfirModal(e);
    }
  },
  tipModalBindaconfirm: function (e) {
    this.setData({
      tipComfirmModalDisplay: !this.data.tipComfirmModalDisplay
    });
  },
  showComfirModal: function (e) {

    console.log(e);
    this.setData({
      confirmodalDisplay: !this.data.confirmodalDisplay,
      buttonDisabled: !this.data.buttonDisabled,
      clickData: e
    })
  },
  modalBindaconfirm: function (e) {
    e = this.data.clickData;
    console.log(e);
    this.setData({
      confirmodalDisplay: !this.data.confirmodalDisplay,
      buttonDisabled: !this.data.buttonDisabled
    });
    if (e.target.dataset.text == "delete") {
      console.log("delete");
      this.deleteButton(e);
    } else if (this.data.guid == 0) {
      console.log("submit");
      this.saveForm(e);
    } else {
      console.log("save");
      this.saveForm(e);
    }
  },
  modalBindcancel: function (e) {
    console.log(e);
    this.setData({
      confirmodalDisplay: !this.data.confirmodalDisplay,
      buttonDisabled: !this.data.buttonDisabled
    })
  },
  editButton: function (e) {

    console.log("editForm");
    console.log(e.detail.value);
    this.setData({
      editDisplay: false,
      deleteDisplay: true,
      saveDisplay: true,
      inputDisabled: !this.data.inputDisabled
    })
  },
  deleteButton: function (e) {
    console.log("deleteForm");
    console.log(e.currentTarget.id);
    var guid = e.currentTarget.id;
    var self = this;
    wx.request({
      url: host + 'admin/user/deleteUserByGuid?guid=' + guid,

      header: {
        "Content-Type": "application/json",
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log("insert成功" + result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            self.setData({
              editDisplay: true,
              deleteDisplay: false,
              saveDisplay: false
            });
            util.showMsgToash("删除成功")
            wx.navigateBack({
              delta: 1
            })

          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }

      }
    })
  },
  saveForm: function (e) {//注意:更新和插入的区别，guid
    var self = this;
    console.log("saveForm");
    console.log(e.detail.value);
    console.log(e.detail.target.id);
    console.log(e.currentTarget);
    console.log(e.currentTarget.id);
    var guid = e.detail.target.id;
    console.log("guid" + guid);
    var url = host + 'admin/user/updatUserByGuid';
    e.detail.value.guid = this.data.userData.guid;
    var roleId = this.data.roleArray[this.data.rolePickerIndex].roleGuid;
    e.detail.value.roleId = roleId;
    console.log(e.detail.value);
    if (guid == "submitForm") {
      e.detail.value.guid = ""
      url = host + 'admin/user/insertUserInfo';
    }
    wx.request({
      url: url,
      method:"POST",
      data: e.detail.value,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        console.log("insert成功" + result.data);
        if (result.statusCode == '200') {

          if (result.data.success) {
            if (guid != "submitForm") {
              self.setData({

                deleteDisplay: !self.data.deleteDisplay,
                saveDisplay: !self.data.saveDisplay
              });
              var option = { "guid": self.data.guid }
              self.onLoad(option);
              util.showMsgToash("更新成功")
            } else {
              util.showMsgToash("添加成功")
              wx.navigateBack({
                delta: 1
              })
            }
          } else {
            console.log("请求失败请求失败");
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }


      }
    })
  },

  bindProductVersionPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var rolePickerIndex = e.detail.value;

    this.setData({
      rolePickerIndex: rolePickerIndex
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ jk: "wobianle" });
    app.globalData.jk = this.data.jk;
    console.log("option" + options);

    var self = this;
    var display = options.guid;
    if (display == 0) {

      self.setData({
        submitDisplay: !self.data.submitDisplay,
        guid: options.guid
      });

    } else {
      self.setData({
        inputDisabled: !self.data.inputDisabled,
        editDisplay: !self.data.editDisplay,
        guid: options.guid
      });
    }
    wx.request({
      url: host + 'admin/user/getAllRoleInfo',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode = '200') {
          if (result.data.success) {


            if (result.data.data.length > 0) {
              var roleArray = result.data.data;
              var roleNameArray = [];
              for (var i = 0; i < roleArray.length; i++) {
                roleNameArray[i] = roleArray[i].roleName;
              }
              self.setData({
                roleArray: result.data.data,
                roleNameArray: roleNameArray
              });
              console.log(options.guid)
              if (options.guid != 0) {
                self.detailInfo(self, options);
              }
            } else {
              util.showMsgToash("当前无库存");
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
  detailInfo: function (self, options) {
    wx.request({
      url: host + 'admin/user/selectUserByGuid?guid=' + options.guid,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      data: 'guid =' + options.guid,
      success: function (result) {

        console.log('request success', result.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data != "") {

              var newDate = new Date();
              var dateInfo = result.data.data.createDate;

              console.log(dateInfo);
              newDate.setTime(dateInfo);
              var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
              var roleArray = self.data.roleArray;
              var rolePickerIndex = self.data.rolePickerIndex;
              console.log(roleArray)
              console.log(result.data.data.role)
              for (var i = 0; i < roleArray.length; i++) {
                if (result.data.data.role.roleGuid == roleArray[i].roleGuid) {
                  rolePickerIndex = i;
                }
              }
              console.log(formatDate);
              result.data.data.createDate = formatDate;

              self.setData({
                userData: result.data.data,
                rolePickerIndex: rolePickerIndex
              });

              console.log(self.data);
            } else {
              if (options.guid != 0) {
                util.showMsgToash("未检测到数据");
              }
            }
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }

        console.log(self.data);
      }
    });
  },
  nameChange: function (e) {
    console.log("nameChange" + e.detail.value);
    var updateuserData = this.data.userData;
    updateuserData.userName = e.detail.value;

    this.setData({
      userData: updateuserData
    });

    console.log(this.data.userData);
  },
  passwordChange: function (e) {
    console.log("passwordChange" + e.detail.value);

    var updateuserData = this.data.userData;
    updateuserData.password = e.detail.value;

    this.setData({
      userData: updateuserData
    });

    console.log(this.data.userData);
  },
  confirmPasswordChange: function (e) {
    console.log("confirmPasswordChange" + e.detail.value);
    var updateuserData = this.data.userData;
    updateuserData.confirmPassword = e.detail.value;
    if (updateuserData.password != updateuserData.confirmPassword) {
      util.showMsgToash("两次密码不一致")

    } else {
      this.setData({
        userData: updateuserData
      });
    }


    console.log(this.data.userData);
  }
})