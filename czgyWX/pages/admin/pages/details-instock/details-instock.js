const host = require('../../config').host
var app = getApp();
var util = require("../../utils/util.js");
var adminSessionId = app.getSession("adminSessionId");
var headerJsonAndCookieInfo = { "Content-Type": "application/json", "Cookie": app.getSession("adminSessionId") }
var headerCookieInfo = { "Cookie": adminSessionId };
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorValue: [],
    deleteFlag: true,
    inventoryData: {
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
    categoryIndex: 0,
    categoryInfo: {},
    categoryNameArray: [],
    categoryGuidArray: [],
    productVersionArray: [],
    productVersionCategoryArray: [],
    imageList: [],
    countIndex: 3,//最多上传图片的数量
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },

  bindCategoryPickerChange: function (e) {
    var categoryIndex = e.detail.value;
    console.log(categoryIndex)
    this.setData({
      categoryIndex: categoryIndex
    })
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
    if (formObject.category == "" || formObject.productName == "" || formObject.productVersion == "" || this.data.inventoryData.materialColor.length <= 0) {
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
      url: host + 'admin/inventory/deleteInventoryByGuid?guid=' + guid,

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
            util.resultOper(result)
            wx.navigateBack({
              delta: 1
            })
          } else {
            console.log("删除失败")
            util.resultOper(result);
          }
        } else {
          util.showMsgToash("网络异常")
        }

      }
    })
  },
  saveForm: function (e) {//注意:更新和插入的区别，guid
    console.log("saveForm");
    console.log(e.detail.value);
    console.log(e.detail.target.id);
    console.log(e.currentTarget);
    console.log(e.currentTarget.id);
    var guid = e.detail.target.id;
    console.log("guid" + guid);
    var url = host + 'admin/inventory/updateInventoryByGuid';
    if (guid == "submitForm") {
      url = host + 'admin/inventory/insertInentoryInfo';
    }
    console.log("url" + url);
    var materialColorObject = this.data.inventoryData.materialColor;
    var materialColorString = JSON.stringify(materialColorObject);
    console.log(materialColorString);
    e.detail.value.materialColor = materialColorString;
    e.detail.value.guid = this.data.inventoryData.guid;
    e.detail.value.category = this.data.categoryGuidArray[this.data.categoryIndex]
    console.log(e.detail.value);
    var self = this;
    console.log(this.data.imageList)
    wx.request({
      url: url,
      data: e.detail.value,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": app.getSession("adminSessionId")
      },
      method: 'POST',
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

              util.resultOper(result)
            } else {
              util.resultOper(result)
            }
          } else {
            console.log("请求失败");
            util.resultOper(result);
          }
        } else {
          console.log("网络异常")
          util.showMsgToash("网络异常");
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerIndex = e.detail.value;

    var updateMaterialColor = this.data.inventoryData.materialColor;
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
    var updateInventoryData = this.data.inventoryData;
    var updateMaterialColor = updateInventoryData.materialColor;
    var isPushMaterialColor = true;
    var totalQuantity = 0;
    if (updateInventoryData.quantity) {
      totalQuantity = updateInventoryData.quantity;
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
    updateInventoryData.materialColor = updateMaterialColor;
    updateInventoryData.quantity = totalQuantity;
    this.setData({
      inventoryData: updateInventoryData
    });
  },
  deleteMaterialColor: function (e) {
    console.log(e.detail);
    console.log(e.target.id);
    console.log(this.data.inventoryData)
    console.log(this.data.inventoryData.materialColor);
    var index = e.target.id;
    var updateInventoryData = this.data.inventoryData;
    var updateMaterialColor = updateInventoryData.materialColor;
    var quantity = updateMaterialColor[index].number;
    console.log(quantity);
    var totalQuantity = updateInventoryData.quantity;
    console.log(totalQuantity);
    var resultQuantity = totalQuantity - quantity;
    console.log(resultQuantity);
    updateInventoryData.quantity = resultQuantity;

    updateMaterialColor.splice(index, 1);
    console.log(updateMaterialColor);
    updateInventoryData.materialColor = updateMaterialColor;


    this.setData({
      inventoryData: updateInventoryData
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
      url: host + 'info/getAllCategory',
      header: {
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log(result);
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
      }
    });



  },
  detailInfo: function (self, options) {
    wx.request({
      url: host + 'admin/inventory/selectInventoryByGuid?guid=' + options.guid,
      data: 'guid =' + options.guid,
      header: {
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {

        console.log('request success', result);
        if (result.statusCode == '200') {
          if (result.data.success) {
            if (result.data.data != null) {

              var newDate = new Date();
              var dateInfo = result.data.data.createDate;
              var colorInfo = result.data.data.materialColor;
              var objectColor = JSON.parse(colorInfo);
              result.data.data.materialColor = objectColor;
              console.log("color", objectColor);
              console.log(dateInfo);
              newDate.setTime(dateInfo);
              var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");

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
                inventoryData: result.data.data,

              });
              console.log(self.data);
            }
          } else {
            util.resultOper(result);
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
    var updateinventoryData = this.data.inventoryData;
    updateinventoryData.productName = e.detail.value;

    this.setData({
      inventoryData: updateinventoryData
    });

    console.log(this.data.inventoryData);
  },
  versionChange: function (e) {
    console.log("versionChange" + e.detail.value);

    var updateinventoryData = this.data.inventoryData;
    updateinventoryData.productVersion = e.detail.value;

    this.setData({
      inventoryData: updateinventoryData
    });

    console.log(this.data.inventoryData);
  },
  categoryChange: function (e) {
    console.log("categoryChange" + e.detail.value);
    var updateinventoryData = this.data.inventoryData;
    updateinventoryData.category = e.detail.value;

    this.setData({
      inventoryData: updateinventoryData
    });

    console.log(this.data.inventoryData);
  },
  detailChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateinventoryData = this.data.inventoryData;
    updateinventoryData.detail = e.detail.value;

    this.setData({
      inventoryData: updateinventoryData
    });

    console.log(this.data.inventoryData);
  }
})