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
    saleVolumeData: {
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
    categoryIndex: 0,
    categoryInfo: {},
    categoryNameArray: [],
    categoryGuidArray: [],
    productVersionArray: [],
    productVersionCategoryArray: []
  },
  bindCategoryPickerChange: function (e) {
    var categoryIndex = e.detail.value;
    console.log(categoryIndex)
    this.setData({
      categoryIndex: categoryIndex
    })
  },
  commitForm: function (e) {
    var formObject = e.detail.value;
    console.log("内容不能为空" + e);
    if (formObject.price == "" || formObject.total == "" || formObject.contactPerson == "" || formObject.organization == "" || formObject.address == "" || formObject.telephone == "" || formObject.productName == "" || this.data.saleVolumeData.materialColor.length <= 0) {
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
      url: host + 'admin/saleVolume/deleteSalesVolumeByGuid?guid=' + guid,

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
    var url = host + 'admin/saleVolume/updateSalesVolumeByGuid';

    console.log("url" + url);
    var materialColorObject = this.data.saleVolumeData.materialColor;
    var materialColorString = JSON.stringify(materialColorObject);
    console.log(materialColorString);
    e.detail.value.materialColor = materialColorString;
    e.detail.value.guid = this.data.saleVolumeData.guid;
    e.detail.value.productVersion = this.data.productVersionArray[this.data.productVersionIndex]
    e.detail.value.category = this.data.categoryGuidArray[this.data.categoryIndex]
    console.log(e.detail.value);
    if (guid == "submitForm") {
      e.detail.value.guid = ""
      url = host + 'admin/saleVolume/insertSalesVolumeInfo';
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

    var updateMaterialColor = this.data.saleVolumeData.materialColor;
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
    var updatesaleVolumeData = this.data.saleVolumeData;
    var updateMaterialColor = updatesaleVolumeData.materialColor;
    var isPushMaterialColor = true;
    var totalQuantity = 0;
    if (updatesaleVolumeData.quantity) {
      totalQuantity = updatesaleVolumeData.quantity;
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
    var updatePrice = updatesaleVolumeData.price;
    console.log(updatePrice);
    if (updatePrice == "" || updatePrice == undefined) {
      updatePrice = 0;
    }
    updatesaleVolumeData.total = updatePrice * totalQuantity;
    console.log(updatesaleVolumeData);
    updatesaleVolumeData.materialColor = updateMaterialColor;
    updatesaleVolumeData.quantity = totalQuantity;
    this.setData({
      saleVolumeData: updatesaleVolumeData
    });
  },
  deleteMaterialColor: function (e) {
    console.log(e.detail);
    console.log(e.target.id);
    console.log(this.data.saleVolumeData)
    console.log(this.data.saleVolumeData.materialColor);
    var index = e.target.id;
    var updatesaleVolumeData = this.data.saleVolumeData;
    var updateMaterialColor = updatesaleVolumeData.materialColor;
    var quantity = updateMaterialColor[index].number;
    console.log(quantity);
    var totalQuantity = updatesaleVolumeData.quantity;
    console.log(totalQuantity);
    var resultQuantity = totalQuantity - quantity;
    console.log(resultQuantity);
    updatesaleVolumeData.quantity = resultQuantity;

    updateMaterialColor.splice(index, 1);

    var updatePrice = updatesaleVolumeData.price;
    console.log(updatePrice);
    if (updatePrice == "" || updatePrice == undefined) {
      updatePrice = 0;
    }
    updatesaleVolumeData.total = updatePrice * resultQuantity;
    console.log(updateMaterialColor);
    updatesaleVolumeData.materialColor = updateMaterialColor;


    this.setData({
      saleVolumeData: updatesaleVolumeData
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
        if (result.statusCode = '200') {
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
        } else {
          util.showMsgToash("网络异常")
        }
      }
    });
    wx.request({
      url: host + 'info/getAllCategory',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log(result);
        var categoryNameArray = [];
        var categoryGuidArray = [];
        if (result.statusCode = '200') {
          if (result.data.success) {
            if (result.data.data.length > 0) {

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
            } else {
              util.showMsgToash("未检测到数据")
            }
          } else {
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }

        self.detailInfo(self, options);

      }
    });


    wx.request({
      url: host + 'info/getAllMaterialColorName',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log(result);
        if (result.statusCode == '200') {
          if (result.data.success) {
            if (result.data.data.length > 0) {

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
      url: host + 'admin/saleVolume/selectSalesVolumeByGuid?guid=' + options.guid,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      data: 'guid =' + options.guid,
      success: function (result) {

        console.log('request success', result.data.data);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data != "") {

              var newDate = new Date();
              var dateInfo = result.data.data.createDate;
              var colorInfo = result.data.data.materialColor;
              var objectColor = JSON.parse(colorInfo);
              result.data.data.materialColor = objectColor;
              console.log("color", objectColor);
              console.log(dateInfo);
              newDate.setTime(dateInfo);
              var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
              var productVersionArrayUpdate = self.data.productVersionArray;
              var updateVersionProductIndex = self.data.productVersionIndex;
              console.log(productVersionArrayUpdate)
              console.log(result.data.data.productVersion)
              for (var i = 0; i < productVersionArrayUpdate.length; i++) {
                if (result.data.data.productVersion == productVersionArrayUpdate[i]) {
                  updateVersionProductIndex = i;
                }
              }
              console.log(formatDate);
              result.data.data.createDate = formatDate;

              var categoryGuidArray = self.data.categoryGuidArray;
              for (var i = 0; i < categoryGuidArray.length; i++) {
                if (result.data.data.category == categoryGuidArray[i]) {
                  self.setData({
                    categoryIndex: i
                  })
                }
              }

              self.setData({
                saleVolumeData: result.data.data,
                productVersionIndex: updateVersionProductIndex
              });

              console.log(self.data);
            } else {
              if (options.guid != 0) {
                util.showMsgToash("未检测到数据");
              }

            }
          }else{
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
    var updatesaleVolumeData = this.data.saleVolumeData;
    updatesaleVolumeData.productName = e.detail.value;

    this.setData({
      saleVolumeData: updatesaleVolumeData
    });

    console.log(this.data.saleVolumeData);
  },
  versionChange: function (e) {
    console.log("versionChange" + e.detail.value);

    var updatesaleVolumeData = this.data.saleVolumeData;
    updatesaleVolumeData.productVersion = e.detail.value;

    this.setData({
      saleVolumeData: updatesaleVolumeData
    });

    console.log(this.data.saleVolumeData);
  },
  categoryChange: function (e) {
    console.log("categoryChange" + e.detail.value);
    var updatesaleVolumeData = this.data.saleVolumeData;
    updatesaleVolumeData.category = e.detail.value;

    this.setData({
      saleVolumeData: updatesaleVolumeData
    });

    console.log(this.data.saleVolumeData);
  },
  priceChange: function (e) {
    console.log(e);
    var price = e.detail.value;
    var updatesaleVolumeData = this.data.saleVolumeData;
    var updateQuantity = updatesaleVolumeData.quantity;
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
    updatesaleVolumeData.price = price;
    updatesaleVolumeData.total = total;
    this.setData({
      saleVolumeData: updatesaleVolumeData
    })
  },

  detailChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updatesaleVolumeData = this.data.saleVolumeData;
    updatesaleVolumeData.detail = e.detail.value;

    this.setData({
      saleVolumeData: updatesaleVolumeData
    });

    console.log(this.data.saleVolumeData);
  }
})