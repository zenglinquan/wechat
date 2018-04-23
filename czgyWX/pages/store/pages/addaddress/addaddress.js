const host = require('../..//config').host
var app = getApp()
var util = require("../../utils/util.js");
var area = require('../../js/area')
var p = 0, c = 0, d = 0
Page({
  data: {
    provinceName: [],
    provinceCode: [],
    provinceSelIndex: '',
    cityName: [],
    cityCode: [],
    citySelIndex: '',
    districtName: [],
    districtCode: [],
    districtSelIndex: '',
    cityEnabled: false,
    districtEnabled: false,
    showMessage: false,
    messageContent: '',
    addressData: {

    }
  },
  onLoad: function (options) {
    this.setData({
      openType: options.guid
    })

    this.setAreaData();
    this.loadAddressInfo(options.guid);
  },
  loadAddressInfo(guid){
    
    var self = this;
    self.setData({
      addressData: {}
    })
    if (guid!=0){
      wx.request({
        url: host +'store/address/selectByPrimaryKey?guid='+guid,
        success:function(result){
          console.log(result)
          if(result.statusCode=='200'){
            if(result.data.data!= null){
              var addressData = result.data.data;
              var addressInfo = addressData.addressInfo;
              var addressArr = addressInfo.split(",");
              addressData.address = addressArr[3]
              self.setData({
                addressData: addressData
              })
              var provinceNameArr = self.data.provinceName;
              
            
              provinceNameArr.forEach(function(proviceName,index){
                if (proviceName == addressArr[0]){
                  self.setAreaData('province', index)
                  self.setData({
                    provinceSelIndex:index
                  })
                }
              })
              var cityNameArr = self.data.cityName;
              cityNameArr.forEach(function (cityName, index) {
                if (cityName == addressArr[1]) {
                  self.setAreaData('city', self.data.provinceSelIndex, index)
                  self.setData({
                    citySelIndex: index
                  })
                }
              })
              var districtNameArr = self.data.districtName;
              districtNameArr.forEach(function (districtName, index) {
                if (districtName == addressArr[2]) {
                  self.setAreaData('district', self.data.provinceSelIndex, self.data.citySelIndex, index)
                  self.setData({
                    districtSelIndex: index
                  })
                }
              })
            }
          }else{
            util.showMsgToash("网络异常")
          }
        }
      })
    }
  },
  nameChange: function (e) {
    console.log(e)
    var addressData = this.data.addressData;
    addressData.consignee = e.detail.value
    this.setData({
      addressData: addressData
    })
  },
  telephoneChange: function (e) {
    console.log(e)
    var addressData = this.data.addressData;
    addressData.telephone = e.detail.value
    this.setData({
      addressData: addressData
    })
  },
  addressChange:function(e){
    console.log(e)
    var addressData = this.data.addressData;
    addressData.address = e.detail.value
    this.setData({
      addressData: addressData
    })
  },
  // 选择省
  changeProvince: function (e) {
    console.log(e)
    this.resetAreaData('province')
    p = e.detail.value
    this.setAreaData('province', p)
  },
  // 选择市
  changeCity: function (e) {
    console.log(e)
    this.resetAreaData()
    c = e.detail.value
    this.setAreaData('city', p, c)
  },
  // 选择区
  changeDistrict: function (e) {
    console.log(this.data.provinceName + "" + this.data.provinceCode)
    d = e.detail.value
    this.setAreaData('district', p, c, d)
  },
  setAreaData: function (t, p, c, d) {
    switch (t) {
      case 'province':
        this.setData({
          provinceSelIndex: p,
          cityEnabled: true
        })
        break;
      case 'city':
        this.setData({
          citySelIndex: c,
          districtEnabled: true
        })
        break;
      case 'district':
        this.setData({
          districtSelIndex: d
        })
    }

    var p = p || 0 // provinceSelIndex
    var c = c || 0 // citySelIndex
    var d = d || 0 // districtSelIndex
    // 设置省的数据
    var province = area['100000']
    var provinceName = [];
    var provinceCode = [];
    for (var item in province) {
      provinceName.push(province[item])
      provinceCode.push(item)
    }
    this.setData({
      provinceName: provinceName,
      provinceCode: provinceCode
    })
    // 设置市的数据
    var city = area[provinceCode[p]]
    var cityName = [];
    var cityCode = [];
    for (var item in city) {
      cityName.push(city[item])
      cityCode.push(item)
    }
    this.setData({
      cityName: cityName,
      cityCode: cityCode
    })
    // 设置区的数据
    var district = area[cityCode[c]]
    var districtName = [];
    var districtCode = [];
    for (var item in district) {
      districtName.push(district[item])
      districtCode.push(item)
    }
    this.setData({
      districtName: districtName,
      districtCode: districtCode
    })

  },
  // 重置数据
  resetAreaData: function (type) {
    this.setData({
      districtName: [],
      districtCode: [],
      districtSelIndex: '',
      districtEnabled: false
    })
    if (type == 'province') {
      this.setData({
        cityName: [],
        cityCode: [],
        citySelIndex: ''
      })
    }
  },
  savePersonInfo: function (e) {
    var data = e.detail.value
    var telRule = /^1[3|4|5|7|8]\d{9}$/
    if (data.name == '') {
      this.showMessage('请输入姓名')
    } else if (data.tel == '') {
      this.showMessage('请输入手机号码')
    } else if (!telRule.test(data.tel)) {
      this.showMessage('手机号码格式不正确')
    } else if (data.province == '') {
      this.showMessage('请选择所在省')
    } else if (data.city == '') {
      this.showMessage('请选择所在市')
    } else if (data.district == '') {
      this.showMessage('请选择所在区')
    } else if (data.address == '') {
      this.showMessage('请输入详细地址')
    } else {
      var detailAddressInfo = data.province + "," + data.city + "," +data.district+","+data.address
      this.data.addressData.addressInfo = detailAddressInfo
      console.log(this.data.addressData)
      var url = host + 'store/address/insertSelective'
      if (this.data.openType != 0) {
        url = host + 'store/address/updateByPrimaryKeySelective';
      }
    
      wx.request({
        url: url,
        method:'POST',
        header:{
          "openid":app.getSession("openid")
        },
        data: this.data.addressData,
        success:function(result){
          console.log(result)
          if(result.statusCode=='200'){
            if(result.data.success){
              util.resultOper(result)
            }else{
              util.resultOper(result)
            }
          }else{
            util.showMsgToash("网络异常")
          }
        }
      })
      
      console.log(data)
    }
  },
  showMessage: function (text) {
    var that = this
    that.setData({
      showMessage: true,
      messageContent: text
    })
    setTimeout(function () {
      that.setData({
        showMessage: false,
        messageContent: ''
      })
    }, 3000)
  }
})