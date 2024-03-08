// components/test/test1.js
Component({
  /**
   * 组件的属性列表
   */
  //对外属性，接收外界传递到组件中的数据
  options:{
    pureDataPattern:/^_/  //意思是这“_”开头的就是纯数据字段 不用在页面中渲染 只需要进行运算就适合作为纯数据字段
  },
  observers:{
    'rgb.R,rgb.G,rgb.B':function(r,g,b){  //rgb.** 通配符 全检测
      //do something
      this.setData({
        fullColor:`${r},${g},${b}` //~键
      })
    }
  },
  properties: {
    max:Number,//简单声明
    Max:{//复杂声明 只能用这两种方式
      type:Number,
      value:10
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:0,
    _rgb:{
      R:0,
      G:0,
      B:0,
    },
    fullColor:'0,0,0',
    _b:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    add(){
      if(this.data.count>=this.properties.max)return
      this.setData({
        count:this.data.count+1
      })
    },
    changeR(){
      this.setData({
        '_rgb.R':this.data._rgb.R+5>=255?255:this.data._rgb.R+5
      })
    },
    changeG(){
      this.setData({
        '_rgb.G':this.data._rgb.G+5>=255?255:this.data._rgb.G+5
      })
    },
    changeB(){
      this.setData({
        '_rgb.B':this.data._rgb.B+5>=255?255:this.data._rgb.B+5
      })
    },
  }
})