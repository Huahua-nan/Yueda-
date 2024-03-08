// pages/weather/weather.js
const APIKEY = "0cfe25a486654aed9a6ffdb76dbe5acb";// 和风天气的KEY
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLocation()

  },
// //获取天气图片
//   getweathericon(){
//     db.collection('weather').where({}).get({
//       success:res=>{
//         console.log(res)
//         this.setData({
//           weatherList:res.data
//         })
//       }
//     })
//   },
//获取定位
  getLocation() {
  var that = this
  wx.getLocation({
    type: 'gcj02',//地图坐标格式
    success(res) {
      that.setData({
        location: res.longitude + "," + res.latitude
      })
      that.getWeather()
      that.getCityByLoaction()
    }, fail(err) {
      wx.showModal({
        title: '获取定位信息失败',
        content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
        success(mRes) {
          if (mRes.confirm) {
            wx.openSetting({
              success: function (data) {
                if (data.authSetting["scope.userLocation"] === true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 1000
                  })
                  that.getLocation()
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                    duration: 1000
                  })
                  that.setData({
                    location: "地理位置"
                  })
                  that.getWeather()
                  that.getCityByLoaction()
                }
              }, fail(err) {
                console.log(err)
                wx.showToast({
                  title: '唤起设置页失败，请手动打开',
                  icon: 'none',
                  duration: 1000
                })
                that.setData({
                  location: "地理位置"
                })
                that.getWeather()
                that.getCityByLoaction()
              }
            })
          } else if (mRes.cancel) {
            that.setData({
              location: "地理位置"
            })
            that.getWeather()
            that.getCityByLoaction()
          }
        }
      })
    }
  })
},
//获取天气
  getWeather() {
  var that = this
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/now?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      //console.log(res)
      that.setData({
        now: res.now
      })
    }
  })
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/24h?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      //console.log(res)
      res.hourly.forEach(function (item) {
        item.time = that.formatTime(new Date(item.fxTime)).hourly
      })
      that.setData({
        hourly: res.hourly
      })
    }
  })
  wx.request({
    url: 'https://devapi.qweather.com/v7/weather/7d?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      //console.log(res)
      res.daily.forEach(function (item) {
        item.date = that.formatTime(new Date(item.fxDate)).daily
        item.dateToString = that.formatTime(new Date(item.fxDate)).dailyToString
      })
      that.setData({
        daily: res.daily
      })
      wx.hideLoading()
    }
  })
},
//选择定位
selectLocation() {
  var that = this
  wx.chooseLocation({
    success(res) {
      //console.log(res)
      that.setData({
        location: res.longitude + "," + res.latitude
      })
      that.getWeather()
      that.getCityByLoaction()
    }
    , fail() {
      wx.getLocation({
        type: 'gcj02',
        fail() {
          wx.showModal({
            title: '获取地图位置失败',
            content: '为了给您提供准确的天气预报服务,请在设置中授权【位置信息】',
            success(mRes) {
              if (mRes.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.userLocation"] === true) {
                      that.selectLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }, fail(err) {
                    console.log(err)
                    wx.showToast({
                      title: '唤起设置页失败，请手动打开',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                })
              }
            }
          })
        }
      })

    }
  })
},
//获取城市
getCityByLoaction() {
  var that = this
  wx.request({
    url: 'https://geoapi.qweather.com/v2/city/lookup?key=' + APIKEY + "&location=" + that.data.location,
    success(result) {
      var res = result.data
      if (res.code == "200") {
        var data = res.location[0]
        that.setData({
          City: data.adm2,
          County: data.name
        })
      } else {
        wx.showToast({
          title: '获取城市信息失败',
          icon: 'none'
        })
      }

    }
  })
},
// 格式时间
formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  const isToday = date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
  return {
    hourly: [hour, minute].map(this.formatNumber).join(":"),
    daily: [month, day].map(this.formatNumber).join("-"),
    dailyToString: isToday ? "今天" : weekArray[date.getDay()]
  }
},
// 补零
formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})