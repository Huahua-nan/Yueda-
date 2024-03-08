// miniprogram/components/cloudTipModal/index.js
const { isMac } = require('../../envList.js');

Component({
  options:{
    styleIsolation:'isolated'
  },//启用样式隔离 apply-shared 页面可以影响自定义组件，组件无法影响页面 shared 页面组件相互影响
  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    tipText: isMac ? 'sh ./uploadCloudFunction.sh' : './uploadCloudFunction.bat',
  },
  properties: {
    showUploadTipProps: Boolean
  },
  observers: {
    showUploadTipProps: function(showUploadTipProps) {
      this.setData({
        showUploadTip: showUploadTipProps
      });
    }
  },
  methods: {
    onChangeShowUploadTip() {
      this.setData({
        showUploadTip: !this.data.showUploadTip
      });
    },

    copyShell() {
      wx.setClipboardData({
        data: this.data.tipText,
      });
    },
  }

});
