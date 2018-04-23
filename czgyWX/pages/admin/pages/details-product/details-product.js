const host = require('../../config').host
const imgSize = require('../../config').imgSize
var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    // text:"这是一个页面"
    tip: '',
    userName: '',
    psw: '',
    imageList: [],
    countIndex: 5,//最多上传图片的数量
    maxCount: 5,
    count: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    StoreProduct: {
      // guid:"",
      // productVersion:"",
      // price:9
      // picIndex:0
    },
    imageSize: imgSize,
    productVersionIndex: 0,
    submitDisplay: false,
    editDisplay: false,
    deleteDisplay: false,
    deleteImageDisplay: false,
    saveDisplay: false,
    addImageButtonDisplay: true,
    inputDisabled: false

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
  onLoad: function (options) {
    console.log(options.guid + "options")

    var self = this;
    var guid = options.guid;
    if (guid == 0) {
      self.setData({
        submitDisplay: !self.data.submitDisplay,
        guid: options.guid,
      });

    } else {
      self.setData({
        inputDisabled: !self.data.inputDisabled,
        editDisplay: !self.data.editDisplay,
      });
    }
    var StoreProduct = self.data.StoreProduct
    StoreProduct.guid = guid;
    self.setData({
      StoreProduct: StoreProduct
    })
    self.getAllProductVersion(self, options);
  },
  deleteButton: function (e) {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定要执行本次操作吗？',
      success: function (res) {
        if (res.confirm) {
          console.log("deleteForm");
          console.log(e.currentTarget.id);
          var guid = e.currentTarget.id;
          wx.request({
            url: host + 'admin/storeProduct/deleteStoreProductByPrimaryKey?guid=' + guid,

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
        } else {
          console.log("取消")
        }
      }
    })

  },
  productDetail: function (self, options) {
    var guid = options.guid;

    if (guid != 0) {
      wx.request({
        url: host + 'admin/storeProduct/selectStoreProductByPrimaryKey?guid=' + guid,
        header: {

          "Cookie": app.getSession("adminSessionId")
        },
        success: function (result) {
          if (result.statusCode == '200') {
            if (result.data.success) {

              console.log(result);
              var storeProduct = result.data.data;
              var newDate = new Date();
              var dateInfo = storeProduct.createDate;
              console.log(dateInfo);
              newDate.setTime(dateInfo);
              var formatDate = newDate.format("yyyy-MM-dd hh:mm:ss");
              console.log(formatDate);
              storeProduct.createDate = formatDate;
              console.log(storeProduct)
              self.getImageList(storeProduct)
            } else {
              util.resultOper(result);
            }
          } else {
            util.showMsgToash("网络异常")
          }
        }
      });
    }
  },
  getImageList: function (storeProduct) {
    console.log(storeProduct)
    var self = this;
    var productVersion = storeProduct.productVersion;
    var productVersionArray = self.data.productVersionArray;
    var index = productVersionArray.indexOf(productVersion);
    console.log(index)

    self.setData({
      productVersionIndex: index
    })
    console.log(storeProduct)
    var countIndex = self.data.countIndex;
    var imageArray = [];
    if (storeProduct.pic1 != "" && storeProduct.pic1 != null) {
      self.data.imageList.push(host + storeProduct.pic1);
      imageArray[0] = storeProduct.pic1;
      countIndex--;
    }
    if (storeProduct.pic2 != "" && storeProduct.pic2 != null) {
      self.data.imageList.push(host + storeProduct.pic2);
      imageArray[1] = storeProduct.pic2;
      countIndex--;
    }
    if (storeProduct.pic3 != "" && storeProduct.pic3 != null) {
      self.data.imageList.push(host + storeProduct.pic3);
      imageArray[2] = storeProduct.pic3;
      countIndex--;
    }
    if (storeProduct.pic4 != "" && storeProduct.pic4 != null) {
      self.data.imageList.push(host + storeProduct.pic4);
      imageArray[3] = storeProduct.pic4;
      countIndex--;
    }
    if (storeProduct.pic5 != "" && storeProduct.pic5 != null) {
      self.data.imageList.push(host + storeProduct.pic5);
      imageArray[4] = storeProduct.pic5;
      countIndex--;
    }
    delete storeProduct.pic1;
    delete storeProduct.pic2;
    delete storeProduct.pic3;
    delete storeProduct.pic4;
    delete storeProduct.pic5;
    delete storeProduct.pic6;
    delete storeProduct.pic7;
    delete storeProduct.pic8;
    delete storeProduct.pic9;


    storeProduct.imageArray = imageArray
    console.log(storeProduct)
    console.log(countIndex)
    console.log(self.data.imageList)
    self.setData({
      imageList: self.data.imageList,
      countIndex: countIndex,
      StoreProduct: storeProduct
    })
    if (self.data.imageList.length >= 5) {
      self.setData({
        addImageButtonDisplay: false
      })
    }

  },
  catchImageLongTap: function (e) {
    console.log(e)
  },
  deleteImage: function (e) {
    console.log(e)

    console.log(e.target.dataset.id)
    this.data.imageList.splice(e.target.dataset.id, 1)
    var StoreProduct = this.data.StoreProduct;
    if (StoreProduct.imageArray.length > e.target.dataset.id) {
      StoreProduct.imageArray.splice(e.target.dataset.id, 1)
    }

    console.log(StoreProduct)
    console.log(this.data.imageList)
    this.setData({
      imageList: this.data.imageList,
      StoreProduct: StoreProduct
    })
    if (this.data.imageList.length < 5) {
      this.setData({
        addImageButtonDisplay: true
      })
    }
  },
  deleteImageButtonShow: function (e) {
    if (!this.data.inputDisabled) {
      console.log(e)
      this.setData({
        deleteImageDisplay: !this.data.deleteImageDisplay
      })

    }
  },
  priceChange: function (e) {
    console.log(typeof e.detail.value)
    console.log(e.detail.value)
    var StoreProduct = this.data.StoreProduct;
    StoreProduct.price = e.detail.value;
    console.log(this.data.StoreProduct)
    this.setData({
      StoreProduct: StoreProduct
    })
  },
  bindProductVersionPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var pickerIndex = e.detail.value;
    var StoreProduct = this.data.StoreProduct;
    StoreProduct.productVersion = this.data.productVersionArray[pickerIndex];
    this.setData({
      productVersionIndex: pickerIndex,
      StoreProduct: StoreProduct
    })
  },
  chooseImage: function () {
    if (!this.data.inputDisabled) {


      this.setData({
        deleteImageDisplay: false
      })
      var self = this;
      wx.chooseImage({
        count: this.data.count[this.data.countIndex],
        success: function (res) {
          console.log(res)
          var countIndex = self.data.countIndex;
          var tempFile = res.tempFiles;
          var isPass = true;
          for (var i = 0; i < tempFile.length; i++) {
            if (tempFile[i].size > self.data.imageSize) {
              console.log(isPass)
              isPass = false;
              break;
            }
          }
          console.log(isPass)
          if (isPass) {

            for (var i = 0; i < res.tempFilePaths.length; i++) {
              self.data.imageList.push(res.tempFilePaths[i]);
              countIndex--;
            }
            console.log(countIndex)
            var StoreProduct = self.data.StoreProduct;
            StoreProduct.imageArray = self.data.imageList
            self.setData({
              StoreProduct: StoreProduct,
              imageList: self.data.imageList,
              countIndex: countIndex
            })
            if (self.data.imageList.length >= 5) {
              self.setData({
                addImageButtonDisplay: false
              })
            }
          } else {
            console.log("应小于"+self.data.imageSize/1024+"k")
            util.showMsgToash("应小于" + self.data.imageSize/1024 + "k")
          }
        }
      })
    }
  },
  uploadImage: function (StoreProduct, imageList, commitType) {

    console.log(StoreProduct)

    delete StoreProduct.user
    delete StoreProduct.inventory
    delete StoreProduct.category
    // delete StoreProduct.createDate
    var self = this;
    console.log(imageList)
    console.log(imageList[imageList.length - 1])
    var image = imageList.shift();
    console.log(image)
    console.log(image.indexOf("wxfile") != -1)
    if (image.indexOf("wxfile") != -1) {


      wx.uploadFile({
        url: host + 'admin/storeProduct/insertStoreProductImage',
        filePath: image,
        name: 'multipartFile',
        header: {
          "Content-Type": "multipart/form-data",
          "Cookie": app.getSession("adminSessionId")
        },
        formData: StoreProduct,
        success: function (result) {
          console.log(result)
          console.log(imageList.length)
          if (result.statusCode == '200') {
            var data = JSON.parse(result.data)

            if (imageList.length > 0) {
              StoreProduct.picIndex++;
              console.log(StoreProduct);
              self.uploadImage(StoreProduct, imageList, commitType)

            } else {
              if (data.success && commitType == "save") {
                self.setData({
                  editDisplay: true,
                  deleteDisplay: false,
                  saveDisplay: false,
                  inputDisabled: true,
                  deleteImageDisplay: false

                });
                util.showMsgToash("更新成功")

              } else if (data.success && commitType == "submit") {
                self.setData({
                  editDisplay: true,
                  deleteDisplay: false,
                  saveDisplay: false,
                });
                util.showMsgToash("添加成功")
                wx.navigateBack({
                  delta: 1
                })
              } else {
                console.log("请求失败")
                util.resultOper(result)
              }
            }
          } else {
            util.showMsgToash("网络异常")
          }
        }
      })
    } else {
      if (imageList.length > 0) {
        StoreProduct.picIndex++;
        self.uploadImage(StoreProduct, imageList, commitType)

      } else {
        console.log(commitType)
        if (commitType == "save") {
          self.setData({
            editDisplay: true,
            deleteDisplay: false,
            saveDisplay: false,
            inputDisabled: true,
            deleteImageDisplay: false
          });
          util.showMsgToash("更新成功")

        } else if (commitType == "submit") {
          self.setData({
            editDisplay: true,
            deleteDisplay: false,
            saveDisplay: false
          });
          util.showMsgToash("添加成功")
          wx.navigateBack({
            delta: 1
          })
        } else {
          console.log("请求失败")
          util.showMsgToash("删除失败")
        }
      }
    }
  },
  commitForm: function (e) {
    console.log(e)
    var commitType = e.detail.target.dataset.text;
    var url = "";
    if (commitType == 'submit') {
      url = host + 'admin/storeProduct/insertStoreProduct';
    } else if (commitType == 'save') {
      url = host + 'admin/storeProduct/updateStoreProductByPrimaryKey';
    }
    console.log(commitType)
    var self = this;
    var StoreProduct = this.data.StoreProduct;
    delete StoreProduct.pic1
    delete StoreProduct.pic2
    delete StoreProduct.pic3
    delete StoreProduct.pic4
    delete StoreProduct.pic5
    delete StoreProduct.pic6
    delete StoreProduct.pic7
    delete StoreProduct.pic8
    delete StoreProduct.pic9
    delete StoreProduct.createDate;
    StoreProduct.userId = "5215F269C44D484D9F278C6AF4F85631";

    this.setData({
      StoreProduct: StoreProduct
    })
    if (StoreProduct.price == "" || this.data.imageList.length == 0) {
      util.showMsgToash("输入信息存在空值")
    } else {
      console.log(e)
      console.log(this.data.imageList[0])
      this.data.StoreProduct.picIndex = 0;
      console.log(this.data.StoreProduct)
      wx.showModal({
        title: '提示',
        content: '确定要执行本次操作吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: url,
              data: self.data.StoreProduct,
              method: 'POST',
              header: {

                "Content-Type": "application/json",
                "Cookie": app.getSession("adminSessionId")
              },
              success: function (result) {
                console.log(result)
                console.log(result.data)
                if (result.statusCode == '200') {
                  if (result.data.success) {

                    var data = result.data.data
                    self.data.StoreProduct.guid = data.guid
                    console.log(self.data.StoreProduct);
                    var formImageList = [];
                    console.log(self.data.imageList)
                    for (var i = 0; i < self.data.imageList.length; i++) {
                      formImageList[i] = self.data.imageList[i]
                    }
                    console.log(formImageList)
                    self.uploadImage(self.data.StoreProduct, formImageList, commitType);

                  } else {
                    util.resultOper(result);
                  }
                } else {
                  util.showMsgToash("网络异常")
                }
              }
            })
          } else {
            console.log('用户点击取消')
          }

        }
      })

    }
  },
  previewImage: function (e) {
    console.log(this.data.inputDisabled)
    if (!this.data.inputDisabled) {

      var current = e.target.dataset.src
      wx.previewImage({
        current: current,
        urls: this.data.imageList
      })
    }
  },
  formBindsubmit: function (e) {
    if (e.detail.value.userName.length == 0 || e.detail.value.psw.length == 0) {
      this.setData({
        tip: '提示：用户名和密码不能为空！',
        userName: '',
        psw: ''
      })
    } else {
      this.setData({
        tip: '',
        userName: '用户名：' + e.detail.value.userName,
        psw: '密码：' + e.detail.value.psw
      })
    }
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },



  formReset: function () {
    this.setData({
      tip: '',
      userName: '',
      psw: ''
    })
  },
  getAllProductVersion: function (self, options) {
    wx.request({
      url: host + 'info/selectAllProductVersion',
      header: {

        "Cookie": app.getSession("adminSessionId")
      },
      success: function (result) {
        console.log(result)
        if (result.statusCode == '200') {
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
            self.data.StoreProduct.productVersion = productVersionArray[0];
            self.productDetail(self, options);
          } else {
            util.resultOper(result);
          }
        } else {
          util.showMsgToash("网络异常")
        }
      }
    });
  },
  onPullDownRefresh: function () {
    this.onLoad();
  },
  productNameChange: function (e) {
    console.log("nameChange" + e.detail.value);
    var StoreProduct = this.data.StoreProduct;
    StoreProduct.productName = e.detail.value;

    this.setData({
      StoreProduct: StoreProduct
    });

    console.log(this.data.inventoryData);
  },
  detailChange: function (e) {
    console.log("detailChange" + e.detail.value);
    var StoreProduct = this.data.StoreProduct;
    StoreProduct.detail = e.detail.value;

    this.setData({
      StoreProduct: StoreProduct
    });

    console.log(this.data.inventoryData);
  },
  isNewChange: function (e) {
    console.log("isNewChange" + e.detail.value);
    var isNew;
    if (e.detail.value) {
      isNew = 1;
    } else {
      isNew = 0
    }
    var StoreProduct = this.data.StoreProduct;
    StoreProduct.isNew = isNew;

    this.setData({
      StoreProduct: StoreProduct
    });

    console.log(this.data.inventoryData);
  }
})