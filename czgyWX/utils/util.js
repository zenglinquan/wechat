

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Date.prototype.format = function (format) {

  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
};

function showMsgToash(text) {
  console.log(text);
  wx.showToast({
    title: text,
    icon: 'succes',
    duration: 1000,
    mask: true
  })
}

function resultOperation(result) {
  var state = result.data.state;
  var stateInfo = result.data.stateInfo;
  if (stateInfo != null || stateInfo != "") {

    switch (state) {
      case 1: break;
      case 0: 
        wx.redirectTo({
          url: '../login/login?stateInfo=' + stateInfo,
        });
        break;
      case -1: break;
      case -2:
        wx.redirectTo({
          url: '../login/login?stateInfo='+stateInfo,
        })
        break;
      case -3: break;
      case -4: break;
      case -5: break;
    }
      showMsgToash(stateInfo)
  }else{
      showMsgToash(result.data.info)
  }
};

function storeRequest(url, data, method='GET', header = { "storeToken": 'wx249fe9623340c4b2f62d914a728af8d20b42531eea2ecd37' },){
  wx.request({
    header:header,
    url: url,
    method:method,
    data:data,
    success:function(result){
      return result;
    }
  })
}
module.exports = {
  formatTime: formatTime,
  showMsgToash: showMsgToash,
  resultOper: resultOperation,
  storeRequest: storeRequest
}
