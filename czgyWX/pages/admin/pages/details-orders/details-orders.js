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
    orderData: {
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
    orderUserIndex: 0,
    orderStateRadio: [
      { id: 0, value: "未付款", isSelect: 'true' },
      { id: 1, value: "待发货" },
      { id: 2, value: "已发货" },
      { id: 3, value: "已收货" }

    ],



  },
  changeRadio: function (orderStateId) {
    for (var i = 0; i < this.data.orderStateRadio.length; i++) {
      if (this.data.orderStateRadio[i].id == orderStateId) {
        this.data.orderStateRadio[i].isSelect = true
      } else {
        this.data.orderStateRadio[i].isSelect = false
      }
    }
    this.setData({
      orderStateRadio: this.data.orderStateRadio,

    })
  },
  selectOrderSateOk: function (event) {
    if (!this.data.inputDisabled) {

      console.log(event)
      var orderStateId = event.currentTarget.dataset.id;
      console.log(orderStateId)
      this.changeRadio(orderStateId)
      var orderData = this.data.orderData
      orderData.orderState = orderStateId;
      this.setData({
        orderData: orderData
      })
      console.log(this.data)
    }
  },
  bindOrderUserPickerChange: function (e) {
    var orderUserIndex = e.detail.value;
    console.log(orderUserIndex)
    var orderData = this.data.orderData;
    var orderUserDatas = this.data.orderUserDatas
    var orderUser = orderUserDatas[orderUserIndex];

    var supplyDateInfo = orderUser.supplyDate;

    var dateTime = supplyDateInfo.split(" ");
    var date = dateTime[0];
    var time = dateTime[1];

    orderData.contactPerson = orderUser.contactPerson;
    orderData.address = orderUser.address;
    orderData.organization = orderUser.organization;
    orderData.telephone = orderUser.telephone;
    orderData.billingInformation = orderUser.billingInformation;
    orderData.detail = orderUser.detail;
    orderData.supplyDate = supplyDateInfo;
    orderData.courierNumber = orderUser.courierNumber
    orderData.orderCode = orderUser.orderCode
    this.setData({
      orderUserIndex: orderUserIndex,
      orderData: orderData,
      date: date,
      time, time
    })
  },
  bindCategoryPickerChange: function (e) {
    var categoryIndex = e.detail.value;
    console.log(categoryIndex)
    this.setData({
      categoryIndex: categoryIndex
    })
  },
  touchstartProdcutVersion: function (e) {
    console.log("touchstartProdcutVersion");
    this.setProductVersionPickerDisabled();
  },
  commitForm: function (e) {
    var formObject = e.detail.value;
    console.log("内容不能为空" + e);
    if (this.data.date == "" || this.data.time == "" || formObject.billingInformation == "" || formObject.price == "" || formObject.total == "" || formObject.contactPerson == "" || formObject.organization == "" || formObject.address == "" || formObject.telephone == "" || formObject.productName == "" || this.data.orderData.materialColor.length <= 0) {
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
      url: host + 'admin/orderGoods/deleteOrderGoodsByGuid?guid=' + guid,

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
            util.resultMsg(result)
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
    var url = host + 'admin/orderGoods/updateOrderGoodsByGuid';

    console.log("url" + url);
    var materialColorObject = this.data.orderData.materialColor;
    var materialColorString = JSON.stringify(materialColorObject);
    console.log(materialColorString);
    e.detail.value.materialColor = materialColorString;
    e.detail.value.guid = this.data.orderData.guid;
    e.detail.value.productVersion = this.data.productVersionArray[this.data.productVersionIndex];
    e.detail.value.category = this.data.categoryGuidArray[this.data.categoryIndex];
    console.log(this.data.orderData.orderState)
    e.detail.value.orderState = this.data.orderData.orderState;

    var stringTime = this.data.date + " " + this.data.time;
    console.log(stringTime);
    var timestamp = Date.parse(new Date(stringTime));
    console.log(timestamp);
    // e.detail.value.supplyDate = timestamp;
    e.detail.value.supply = timestamp;
    console.log(e.detail.value);
    if (guid == "submitForm") {
      e.detail.value.guid = ""
      url = host + 'admin/orderGoods/insertOrderGoodsInfo';
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
  bindNumberChange: function (e) {
    console.log("输入框值改变" + e.detail.value);
    var amount = e.detail.value;
    if (amount == "") {
      amount = 0;
    }
    var updateMaterialColorInfo = this.data.materialColorInfo;
    updateMaterialColorInfo.number = amount;

    console.log(updateMaterialColorInfo);
    this.setData({
      materialColorInfo: updateMaterialColorInfo
    })
  },
  bindProductVersionPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerIndex = e.detail.value;

    this.setData({
      productVersionIndex: pickerIndex
    })

    var categoryGuidArray = this.data.categoryGuidArray;

    var productVersionCategoryArray = this.data.productVersionCategoryArray;

    console.log(categoryGuidArray)
    console.log(productVersionCategoryArray)

    for (var i = 0; i < categoryGuidArray.length; i++) {
      if (productVersionCategoryArray[pickerIndex] == categoryGuidArray[i]) {
        this.setData({
          categoryIndex: i
        })
      }
    }
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerIndex = e.detail.value;

    var updateMaterialColor = this.data.orderData.materialColor;
    var materialColorInfo = this.data.materialColorInfo;
    materialColorInfo.id = this.data.materialColorIdArray[pickerIndex];
    materialColorInfo.color = this.data.materialColorNameArray[pickerIndex];

    console.log(JSON.stringify(materialColorInfo));

    this.setData({
      index: e.detail.value,
      materialColorInfo: materialColorInfo
    })
  },
  addMaterialColor: function () {
    var updateMaterialColorInfo = this.data.materialColorInfo;
    var updateorderData = this.data.orderData;
    var updateMaterialColor = updateorderData.materialColor;
    var isPushMaterialColor = true;
    var totalQuantity = 0;
    if (updateorderData.quantity) {
      totalQuantity = updateorderData.quantity;
    }


    for (var i = 0; i < updateMaterialColor.length; i++) {
      var materialColorId = updateMaterialColor[i].id;
      var materialColorInfoId = updateMaterialColorInfo.id;
      if (materialColorId == materialColorInfoId) {
        totalQuantity += parseInt(updateMaterialColorInfo.number)
        var sum = parseInt(updateMaterialColor[i].number) + parseInt(updateMaterialColorInfo.number);
        updateMaterialColor[i].number = sum;
        isPushMaterialColor = false;
        break;
      }
    }
    if (isPushMaterialColor) {
      updateMaterialColor.push(updateMaterialColorInfo);
      totalQuantity += parseInt(updateMaterialColorInfo.number)
    }
    var updatePrice = updateorderData.price;
    console.log(updatePrice);
    if (updatePrice == "" || updatePrice == undefined) {
      updatePrice = 0;
    }
    updateorderData.total = updatePrice * totalQuantity;
    console.log(updateorderData);
    updateorderData.materialColor = updateMaterialColor;
    updateorderData.quantity = totalQuantity;
    this.setData({
      orderData: updateorderData
    });
  },
  deleteMaterialColor: function (e) {
    console.log(e.detail);
    console.log(e.target.id);
    console.log(this.data.orderData)
    console.log(this.data.orderData.materialColor);
    var index = e.target.id;
    var updateorderData = this.data.orderData;
    var updateMaterialColor = updateorderData.materialColor;
    var quantity = updateMaterialColor[index].number;
    console.log(quantity);
    var totalQuantity = updateorderData.quantity;
    console.log(totalQuantity);
    var resultQuantity = totalQuantity - quantity;
    console.log(resultQuantity);
    updateorderData.quantity = resultQuantity;

    updateMaterialColor.splice(index, 1);

    var updatePrice = updateorderData.price;
    console.log(updatePrice);
    if (updatePrice == "" || updatePrice == undefined) {
      updatePrice = 0;
    }
    updateorderData.total = updatePrice * resultQuantity;
    console.log(updateMaterialColor);
    updateorderData.materialColor = updateMaterialColor;


    this.setData({
      orderData: updateorderData
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
      url: host + 'info/selectAllProductVersion',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        console.log(result)
        if (result.data.success) {

          if (result.data.data.length > 0) {
            var productVersion = result.data.data
            var productVersionArray = [];
            var productVersionCategoryArray = [];

            for (var i = 0; i < productVersion.length; i++) {
              productVersionArray[i] = productVersion[i].productVersion;
              productVersionCategoryArray[i] = productVersion[i].category;
            }
            console.log(productVersionArray)
            console.log(productVersionCategoryArray)
            self.setData({
              productVersionArray: productVersionArray,
              productVersionCategoryArray: productVersionCategoryArray
            });
          } else {
            self.setData({
              productVersionArray: ["当前无库存"]
            });
            util.showMsgToash("当前无库存");
          }
        } else {
          util.resultOper(result)
        }
      }
    });
    wx.request({
      url:  host + 'info/getAllCategory',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log(result);
        if (result.statusCode = '200') {
          if (result.data.success) {

            var categoryNameArray = [];
            var categoryGuidArray = [];
            for (var i = 0; i < result.data.data.length; i++) {
              categoryNameArray[i] = result.data.data[i].categoryName;
              categoryGuidArray[i] = result.data.data[i].categoryGuid;
            }

            var categoryInfo = {};
            categoryInfo.categoryGuid = categoryGuidArray[0];
            categoryInfo.categoryName = categoryNameArray[0];
            console.log(categoryNameArray)
            self.setData({
              categoryInfo: result.data.data,
              categoryNameArray: categoryNameArray,
              categoryGuidArray: categoryGuidArray
            });
            if (options.guid != "0") {

              self.detailInfo(self, options);
            }
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsg("网络异常")
        }
      }
    });


    wx.request({
      url: host + 'info/getAllMaterialColorName',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        if (result.statusCode = "200") {
          if (result.data.success) {

            console.log(result);
            var nameArray = [];
            var idArray = [];
            for (var i = 0; i < result.data.data.length; i++) {
              nameArray[i] = result.data.data[i].materialColorName;
              idArray[i] = result.data.data[i].id;
            }

            var materialColorInfo = {};
            materialColorInfo.id = idArray[0];
            materialColorInfo.color = nameArray[0];
            materialColorInfo.number = 0;
            self.setData({
              materialColorInfo: result.data.data,
              materialColorNameArray: nameArray,
              materialColorIdArray: idArray,
              materialColorInfo: materialColorInfo
            });
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    });
    wx.request({
      url: host + 'admin/orderGoods/selectAllOrderUser',
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
                var newSupplyDate = new Date();
                var supplyDateInfo = result.data.data[i].supplyDate;
                newSupplyDate.setTime(supplyDateInfo);
                var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");
                result.data.data[i].supplyDate = formatSupplyDate;

              };
              var orderUserPicker = [];
              result.data.data.forEach(function (orderUser, index) {
                orderUserPicker[index] = orderUser.contactPerson;
              })
              console.log(orderUserPicker)
              self.setData({
                orderUserDatas: result.data.data,
                orderUserPicker: orderUserPicker
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

  detailInfo: function (self, options) {

    wx.request({
      url: host + 'admin/orderGoods/selectOrderGoodsByGuid?guid=' + options.guid,
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
              var newSupplyDate = new Date();

              var dateInfo = result.data.data.createDate;
              var supplyDateInfo = result.data.data.supplyDate;

              console.log(dateInfo);
              console.log(supplyDateInfo);

              newDate.setTime(dateInfo);
              newSupplyDate.setTime(supplyDateInfo);

              var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
              var formatSupplyDate = newSupplyDate.format("yyyy-MM-dd hh:mm:ss");

              console.log(formatDate);
              console.log(formatSupplyDate);
              var dateTime = formatSupplyDate.split(" ");
              console.log("dateTime",dateTime)
              var date = dateTime[0];
              var time = dateTime[1];

              result.data.data.createDate = formatDate;
              result.data.data.supplyDate = formatSupplyDate;

              var colorInfo = result.data.data.materialColor;
              var objectColor = JSON.parse(colorInfo);
              result.data.data.materialColor = objectColor;
              console.log("color", objectColor);

              var productVersionArrayUpdate = self.data.productVersionArray;
              var updateVersionProductIndex = self.data.productVersionIndex;
              console.log(productVersionArrayUpdate)
              console.log(result.data.data.productVersion)
              for (var i = 0; i < productVersionArrayUpdate.length; i++) {
                if (result.data.data.productVersion == productVersionArrayUpdate[i]) {
                  updateVersionProductIndex = i;
                }
              }

              var categoryGuidArray = self.data.categoryGuidArray;
              for (var i = 0; i < categoryGuidArray.length; i++) {
                if (result.data.data.category == categoryGuidArray[i]) {
                  self.setData({
                    categoryIndex: i
                  })
                }
              }
              self.changeRadio(result.data.data.orderState)
              var pickerStartDate = new Date();
              var formPickerStartDate = pickerStartDate.format("yyyy-MM-dd");


              self.setData({
                orderData: result.data.data,
                productVersionIndex: updateVersionProductIndex,
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
  },

  nameChange: function (e) {
    console.log("nameChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.productName = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  versionChange: function (e) {
    console.log("versionChange" + e.detail.value);

    var updateorderData = this.data.orderData;
    updateorderData.productVersion = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  categoryChange: function (e) {
    console.log("categoryChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.category = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  priceChange: function (e) {
    console.log(e);
    var price = e.detail.value;
    var updateorderData = this.data.orderData;
    var updateQuantity = updateorderData.quantity;
    console.log(price + "price");
    console.log(updateQuantity + "updateQuantity");

    if (price == "") {
      price = 0;
    }
    if (updateQuantity == "" || updateQuantity == undefined) {
      updateQuantity = 0;
    }
    var total = price * updateQuantity;
    console.log("total" + total)
    updateorderData.price = price;
    updateorderData.total = total;
    this.setData({
      orderData: updateorderData
    })
  },
  contactPersonChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.contactPerson = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  organizationChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.organization = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  supplyDateChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.supplyDate = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  addressChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.address = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  telephoneChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.telephone = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  billingInformationChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.billingInformation = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  detailChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.detail = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
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
  courierNumberChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.courierNumber = e.detail.value;

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  orderCodeChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateorderData = this.data.orderData;
    updateorderData.orderCode = "";

    this.setData({
      orderData: updateorderData
    });

    console.log(this.data.orderData);
  },
  generatorOrderCode: function () {
    console.log(this.data.inputDisabled)
    if (!this.data.inputDisabled) {

      var self = this
      console.log("gengerator")
      wx.request({
        header: { "Cookie": app.getSession("adminSessionId") },
        url: host + 'admin/orderGoods/generatorOrderCode',
        success: function (result) {
          console.log(result)
          if (result.statusCode == '200') {
            if (result.data.success) {
              var orderData = self.data.orderData
              orderData.orderCode = result.data.info;
              self.setData({
                orderData: orderData
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