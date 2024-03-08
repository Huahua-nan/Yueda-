// pages/share/share.js
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //colorList:[],
    // username:'zs'
    commentList:[],
    page:0,
    pagesize:10,
    total:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getcolors()
    this.getComments()
  },

  // db.collection('todos')
  // .where({
  //   _openid: 'xxx', // 填入当前用户 openid
  // })
  // .skip(10) // 跳过结果集中的前 10 条，从第 11 条开始返回
  // .limit(10) // 限制返回数量为 10 条
  // .get()
  // .then(res => {
  //   console.log(res.data)
  // })
  // .catch(err => {
  //   console.error(err)
  // })
  getcolors(){//获取颜色
    db.collection('color').where({color:db.command.neq(null)}).get({
      success:res=>{
        console.log("获取颜色数据成功",res)
        // const firstColor = res.data[0].colour;
        this.setData({
          colorList:res.data
        }),
        console.log(this.data.colorList)
      },fail(err){
        console.error('获取颜色数据失败', err)
    }
    })
  },
  //获取评论数据
  getComments(){
    db.collection('comment').limit(this.data.pagesize).skip(this.data.page).get({
      success:res=>{
        console.log(res)
        this.setData({
          commentList:res.data,
          total:res.data.length
        }),
        console.log(this.data.commentList)
      }
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
    console.log('触发了上拉触底事件')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:function() {
    console.log("触发了上拉触底事件")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})