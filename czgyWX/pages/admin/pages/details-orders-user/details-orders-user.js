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
    orderUserData: {
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
    date: "",
    time: "",
    categoryIndex: 0,
    categoryInfo: {},
    categoryNameArray: [],
    categoryGuidArray: [],

  },

  commitForm: function (e) {
    var formObject = e.detail.value;
    console.log("内容不能为空" + e);
    if (this.data.date == "" || this.data.time == "" || formObject.billingInformation == "" || formObject.contactPerson == "" || formObject.organization == "" || formObject.address == "" || formObject.telephone == "") {
      console.log("内容不能为空" + e);
      this.setData({
        tipComfirmModalDisplay: !this.data.tipComfirmModalDisplay
      })
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
      url: host + 'admin/orderGoods/deleteOrderUserByPrimaryKey?orderUserGuid=' + guid,

      header: {
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
            console.log("请求失败")
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
    var url = host + 'admin/orderGoods/updateOrderUserByPrimaryKeySelective';

    console.log("url" + url);
    e.detail.value.orderUserGuid = this.data.orderUserData.orderUserGuid;
    var stringTime = this.data.date + " " + this.data.time;
    console.log(stringTime);
    var timestamp = Date.parse(new Date(stringTime));
    console.log(timestamp);
    e.detail.value.supply = timestamp
    console.log(e.detail.value);
    if (guid == "submitForm") {
      e.detail.value.guid = ""
      url = host + 'admin/orderGoods/insertOrderUserSelective';
    }
    wx.request({
      url: url,
      data: e.detail.value,
      method: 'POST',
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
    this.detailInfo(self, options)
  },
  detailInfo: function (self, options) {
    if (options.guid != 0) {

      wx.request({
        url: host + 'admin/orderGoods/selectOrderUserByPrimaryKey?orderUserGuid=' + options.guid,
        header: {

          "Cookie": app.getSession("adminSessionId")
        },
        data: 'guid =' + options.guid,
        success: function (result) {

          console.log('request success', result.data);
          if (result.statusCode == '200') {
            if (result.data.success) {

              if (result.data.data != "") {

                var newSupplyDate = new Date();

                var supplyDateInfo = result.data.data.supplyDate;

                console.log(supplyDateInfo);

                newSupplyDate.setTime(supplyDateInfo);

                var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");

                console.log(formatSupplyDate);
                var dateTime = formatSupplyDate.split(" ");
                var date = dateTime[0];
                var time = dateTime[1];

                result.data.data.supplyDate = formatSupplyDate;

                var pickerStartDate = new Date();
                var formPickerStartDate = pickerStartDate.format("yyyy-MM-dd");

                self.setData({
                  orderUserData: result.data.data,
                  date: date,
                  time: time,
                  pickerStartDate: formPickerStartDate
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
    }

  },
  contactPersonChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.contactPerson = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  organizationChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.organization = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  supplyDateChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.supplyDate = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  addressChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.address = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  telephoneChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.telephone = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  billingInformationChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.billingInformation = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  detailChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.detail = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  courierNumberChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderUserData = this.data.orderUserData;
    updateorderUserData.courierNumber = e.detail.value;

    this.setData({
      orderUserData: updateorderUserData
    });

    console.log(this.data.orderUserData);
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  generatorOrderCode: function () {
    console.log(this.data.inputDisabled)
    if (!this.data.inputDisabled) {

      var self = this
      console.log("gengerator")
      wx.request({
        url: host + 'admin/orderGoods/generatorOrderCode',
        header: { "Cookie": app.getSession("adminSessionId")},
        success: function (result) {
          console.log(result)
          if (result.statusCode == '200') {
            if (result.data.success) {
              var orderUserData = self.data.orderUserData
              orderUserData.orderCode = result.data.info;
              self.setData({
                orderUserData: orderUserData
              })
            }
          } else {
            util.showMsgToash("网络异常")
          }
        }
      })
    }
  }

})