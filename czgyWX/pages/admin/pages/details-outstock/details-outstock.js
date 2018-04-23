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
    removalInventoryData: {
      materialColor: []
    },
    index: 0,
    submitDisplay: false,
    editDisplay: false,
    deleteDisplay: false,
    saveDisplay: false,
    inputDisabled: false,
    productVersionDsiable: true,
    confirmodalDisplay: false,
    tipComfirmModalDisplay: false,
    buttonDisabled: false,
    clickData: {},
    productVersionIndex: 0,
    amount: 0,
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
  touchstartProdcutVersion: function (e) {
    console.log("touchstartProdcutVersion");
    this.setProductVersionPickerDisabled();
  },
  setProductVersionPickerDisabled: function (e) {
    var materialColor = this.data.removalInventoryData.materialColor;
    console.log(materialColor)
    console.log(materialColor.length <= 0 && !this.data.editDisplay)
    if (materialColor.length <= 0 && !this.data.editDisplay) {
      this.setData({
        productVersionDsiable: false
      })
    } else {
      this.setData({
        productVersionDsiable: true
      })
    }
  },
  commitForm: function (e) {
    var formObject = e.detail.value;
    console.log("内容不能为空" + e);
    console.log(formObject.category+""+formObject.productVersion)
    if (formObject.price == "" || formObject.total == "" || formObject.contactPerson == "" || formObject.organization == "" || formObject.address == "" || formObject.telephone == "" || formObject.productName == ""  || this.data.removalInventoryData.materialColor.length <= 0) {
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
    } else if (e.target.dataset.text == "cancel") {
      console.log("delete");
      this.cancelButton(e);
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
  cancelButton: function (e) {
    console.log("deleteForm");
    console.log(e.currentTarget.id);
    var guid = e.currentTarget.id;
    var self = this;
    wx.request({
      url: host + 'admin/removalInventory/cancelRemovalInventoryByGuid?guid=' + guid,

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
            util.showMsgToash("取消出库成功，归还库存")
            wx.navigateBack({
              delta: 1
            })
          } else {
            console.log("请求失败")
            util.showMsgToash("取消出库失败")
          }
        } else {
          util.resultOper(result)
        }

      }
    })
  },
  deleteButton: function (e) {
    console.log("deleteForm");
    console.log(e.currentTarget.id);
    var guid = e.currentTarget.id;
    var self = this;
    wx.request({
      url: host + 'admin/removalInventory/deleteRemovalInventoryByGuid?guid=' + guid,

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
    var url = host + 'admin/removalInventory/updateRemovalInventoryByGuid';

    console.log("url" + url);
    var materialColorObject = this.data.removalInventoryData.materialColor;
    var materialColorString = JSON.stringify(materialColorObject);
    console.log(materialColorString);
    e.detail.value.materialColor = materialColorString;
    e.detail.value.guid = this.data.removalInventoryData.guid;
    e.detail.value.productVersion = this.data.productVersionArray[this.data.productVersionIndex]
    e.detail.value.category = this.data.categoryGuidArray[this.data.categoryIndex]
    console.log(e.detail.value);
    if (guid == "submitForm") {
      e.detail.value.guid = ""
      url = host + 'admin/removalInventory/insertRemovalInventoryInfo';
    }
    wx.request({
      url: url,
      data: e.detail.value,
      header: {
        "Content-Type": "application/json",
        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        console.log("insert成功" + result);
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
    console.log("输入框值改变" + e.detail);
    var amount = e.detail.value;
    var updateMaterialColorInfo = this.data.materialColorInfo[this.data.index];

    if (amount == "") {
      console.log("==================")
      amount = 0;
    }

    console.log(amount)
    console.log(updateMaterialColorInfo);
    this.setData({

      amount: amount
    })
  },
  bindProductVersionPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerIndex = e.detail.value;

    this.setData({
      productVersionIndex: pickerIndex,

    })

    this.setMaterialColorInfo(this.data.productVersionArray[this.data.productVersionIndex])

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

    var updateMaterialColor = this.data.removalInventoryData.materialColor;
    var materialColorInfo = this.data.materialColorInfo;
    var currentMaterialColorInfo = {};

    materialColorInfo.id = this.data.materialColorIdArray[pickerIndex];
    materialColorInfo.color = this.data.materialColorNameArray[pickerIndex];
    materialColorInfo.number = parseInt(this.data.materialColorNumberArray[pickerIndex]);
    console.log(JSON.stringify(materialColorInfo));

    currentMaterialColorInfo.id = this.data.materialColorIdArray[pickerIndex];
    currentMaterialColorInfo.color = this.data.materialColorNameArray[pickerIndex];
    currentMaterialColorInfo.number = parseInt(this.data.materialColorNumberArray[pickerIndex]);
    this.setData({
      index: e.detail.value,
      materialColorInfo: materialColorInfo,
      currentMaterialColorInfo: currentMaterialColorInfo

    })
    console.log(this.data.materialColorInfo)
  },
  addMaterialColor: function () {
    var updateMaterialColorArray = this.data.materialColorInfo;
    var updateMaterialColorInfo = this.data.currentMaterialColorInfo;
    var updateremovalInventoryData = this.data.removalInventoryData;
    var updateMaterialColor = updateremovalInventoryData.materialColor;
    var isPushMaterialColor = true;
    var totalQuantity = 0;
    var amount = this.data.amount;
    console.log(amount + "" + updateMaterialColorInfo.number)
    console.log(updateMaterialColorInfo)
    if (amount > updateMaterialColorArray[this.data.index].number) {
      util.showMsgToash("您已超出库存");
    } else {

      updateMaterialColorInfo.number = amount;

      if (updateremovalInventoryData.quantity) {
        totalQuantity = updateremovalInventoryData.quantity;
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
      console.log(updateMaterialColorInfo)
      if (isPushMaterialColor) {
        updateMaterialColor.push(updateMaterialColorInfo);
        totalQuantity += parseInt(updateMaterialColorInfo.number)
      }
      var updatePrice = updateremovalInventoryData.price;
      console.log(updatePrice);
      if (updatePrice == "" || updatePrice == undefined) {
        updatePrice = 0;
      }
      updateremovalInventoryData.total = updatePrice * totalQuantity;
      console.log(updateremovalInventoryData);
      updateremovalInventoryData.materialColor = updateMaterialColor;
      updateremovalInventoryData.quantity = totalQuantity;
      var currentNumber = updateMaterialColorArray[this.data.index].number;
      var inventoryAmount = currentNumber - amount;
      console.log(inventoryAmount)
      updateMaterialColorArray[this.data.index].number = inventoryAmount;
      this.setData({
        removalInventoryData: updateremovalInventoryData,
        materialColorInfo: updateMaterialColorArray,

      });
      this.setProductVersionPickerDisabled();
    }
  },
  deleteMaterialColor: function (e) {
    this.setProductVersionPickerDisabled();
    console.log(e.detail);
    console.log(e.target.id);
    console.log(this.data.removalInventoryData)
    console.log(this.data.removalInventoryData.materialColor);
    var index = e.target.id;
    var updateremovalInventoryData = this.data.removalInventoryData;
    var updateMaterialColor = updateremovalInventoryData.materialColor;
    var quantity = updateMaterialColor[index].number;
    console.log(quantity);
    var totalQuantity = updateremovalInventoryData.quantity;
    console.log(totalQuantity);
    var resultQuantity = totalQuantity - quantity;
    console.log(resultQuantity);
    updateremovalInventoryData.quantity = resultQuantity;

    var updateMaterialColorArray = this.data.materialColorInfo;
    console.log(updateMaterialColorArray)
    console.log(updateMaterialColor)
    for (var i = 0; i < updateMaterialColor.length; i++) {
      var materialColorId = updateMaterialColor[i].id;
      var materialColorInfoId = updateMaterialColorArray[i].id;
      if (materialColorId == materialColorInfoId) {
        var sum = parseInt(updateMaterialColor[i].number) + parseInt(updateMaterialColorArray[i].number);
        updateMaterialColorArray[i].number = sum;

        break;
      }
    }
    console.log(updateMaterialColorArray)
    console.log(updateMaterialColor)

    updateMaterialColor.splice(index, 1);

    var updatePrice = updateremovalInventoryData.price;
    console.log(updatePrice);
    if (updatePrice == "" || updatePrice == undefined) {
      updatePrice = 0;
    }
    updateremovalInventoryData.total = updatePrice * resultQuantity;
    console.log(updateMaterialColor);
    updateremovalInventoryData.materialColor = updateMaterialColor;


    this.setData({
      removalInventoryData: updateremovalInventoryData,
      materialColorInfo: updateMaterialColorArray

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
        if (result.statusCode == "200") {
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
        if (result.statusCode = '200') {
          if (result.data.success) {

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
      url: host + 'admin/removalInventory/selectRemovalInventoryByGuid?guid=' + options.guid,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      data: 'guid =' + options.guid,
      success: function (result) {

        console.log('request success', result);
        if (result.statusCode == '200') {
          if (result.data.success) {

            if (result.data.data != null && result.data.data != "") {

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
                removalInventoryData: result.data.data,
                productVersionIndex: updateVersionProductIndex
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
        console.log(typeof (self.data.productVersionIndex))
        var productVersionArray = self.data.productVersionArray
        var productVersionIndex = self.data.productVersionIndex;
        console.log(productVersionArray)
        console.log(productVersionIndex)
        var numberIndex = parseInt(productVersionIndex + "")
        self.setMaterialColorInfo(productVersionArray[numberIndex])
        self.setProductVersionPickerDisabled();
      }
    });
  },
  setMaterialColorInfo: function (productVersion) {
    console.log(productVersion)
    var self = this;
    wx.request({
      url: host + 'info/selectInventoryByProductVersion?productVersion=' + productVersion,
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        console.log(result);
        if (result.statusCode = "200") {
          if (result.data.success) {

            var colorInfo = result.data.data.materialColor;
            var objectColor = JSON.parse(colorInfo);
            var nameArray = [];
            var idArray = [];
            var numberArray = [];
            for (var i = 0; i < objectColor.length; i++) {
              nameArray[i] = objectColor[i].color;
              idArray[i] = objectColor[i].id;
              numberArray[i] = objectColor[i].number
            }

            var materialColorInfo = {};
            materialColorInfo.id = idArray[0];
            materialColorInfo.color = nameArray[0];
            materialColorInfo.number = numberArray[0];
            self.setData({
              materialColorInfo: objectColor,
              materialColorNameArray: nameArray,
              materialColorIdArray: idArray,
              materialColorNumberArray: numberArray,
              currentMaterialColorInfo: materialColorInfo,

              index: 0
            });
          }else{
            util.resultOper(result)
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    });
  },
  nameChange: function (e) {
    console.log("nameChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.productName = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  outCodeChange: function (e) {
    console.log("outCode" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.outCode = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  versionChange: function (e) {
    console.log("versionChange" + e.detail.value);

    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.productVersion = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  categoryChange: function (e) {
    console.log("categoryChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.category = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  priceChange: function (e) {
    console.log(e);
    var price = e.detail.value;
    var updateremovalInventoryData = this.data.removalInventoryData;
    var updateQuantity = updateremovalInventoryData.quantity;
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
    updateremovalInventoryData.price = price;
    updateremovalInventoryData.total = total;
    this.setData({
      removalInventoryData: updateremovalInventoryData
    })
  },
  contactPersonChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.contactPerson = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  organizationChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.organization = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  addressChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.address = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  telephoneChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.telephone = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  detailChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var updateremovalInventoryData = this.data.removalInventoryData;
    updateremovalInventoryData.detail = e.detail.value;

    this.setData({
      removalInventoryData: updateremovalInventoryData
    });

    console.log(this.data.removalInventoryData);
  },
  generatorOutCode: function () {
    console.log(this.data.inputDisabled)
    if (!this.data.inputDisabled) {

      var self = this
      console.log("gengerator")
      wx.request({
        header: { "Cookie": app.getSession("adminSessionId") },
        url: host + 'admin/removalInventory/generatorOutCode',
        success: function (result) {
          console.log(result)
          if (result.statusCode == '200') {
            if (result.data.success) {
              var removalInventoryData = self.data.removalInventoryData
              removalInventoryData.outCode = result.data.info;
              self.setData({
                removalInventoryData: removalInventoryData
              })
            }else{
              util.resultOper(result)
            }
          } else {
            util.showMsgToash("网络异常")
          }
        }
      })
    }
  }
})