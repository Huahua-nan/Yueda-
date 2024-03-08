// pages/home/home.js
const db=wx.cloud.database()
const APIKEY = "0cfe25a486654aed9a6ffdb76dbe5acb";// 和风天气的KEY
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // info:'hello world',
    // RandomNum1:Math.random()*10,//获得一个10以内的随机数
    // RandomNum2:Math.random().toFixed(2) ,//取两位小数
    // count:0,
    // msg:'你好，',
    // type:1,
    // flag:true,
    // arr1:['苹果','华为','小米'],
    // userlist:[
    //   {id:1,name:'小红'},
    //   {id:2,name:'小huang'},
    //   {id:3,name:'小lan'}
    // ],
    mglist:[],
    adviserbg:[]
  },

//   //定义按钮的事件处理函数
//   btnTapHandler(e){
//   console.log(e)
// },
//   //+1按钮的点击事件处理函数
//   countchange(e){
//     this.setData({//为当前data中的值赋值
//       count:this.data.count /*当前count的值*/+1
//     })
//   },
//   //+2按钮的点击事件处理函数
//   btnTap2(e){
//     this.setData({
//       count:this.data.count+e.target.dataset.info
//     })
//   },
//   //input输入框事件处理函数
//   inputHandler(e){
//     // console.log(e.detail.value)
//     this.setData({
//       msg:e.detail.value
//     })
//   },
  //发起GET请求
  // getInfo(){
  //   wx.request({
  //     url: '',
  //     method='GET',
  //     data:{
  //       name:'zs',
  //       age:20
  //     },
  //     success:(res)=>{
  //       console.log(res)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSwiperList(),
    //this.Gotoweather(),
    this.MainFunction(),
    this.getLocation()
  },
  //获取轮播图数据
  getSwiperList(){
  db.collection('banner').where({_id:'63ca5b1365e282bd00518ad66a81a5fb'}).get({
    success:res=>{
      console.log(res)
      this.setData({
        mglist:res.data
      })
    },fail(err){
      console.log('请求失败',err)
    }
  })
},
//获取建议版块数据
  getadviser(){
  db.collection('adviser').where({_id:'2da1518365e29cd20053f8a16bda077e'}).get({
    success:res=>{
      console.log(res)
      this.setData({
        adviserbg:res.data
      })
    }
  })
},
//主要建议功能算法
  MainFunction(){

},
//获取定位
  getLocation() {
  var that = this
  wx.getLocation({
    type: 'gcj02',
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
//生成穿搭建议
  Adviser(){
    
},
  //跳转天气页面
  Gotoweather(){
    wx.navigateTo({
      url: '../weather/weather',
    })
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