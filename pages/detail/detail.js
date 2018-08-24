// pages/detail/detail.js
let {list_data} = require('../../datas/list-data.js')
let appData = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
   detailData: {}, 
   index: null,
   isCollected: false,
   isMusicPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let index = options.index
    this.setData({
      detailData: list_data[index],
      index
    })

    // 页面加载时读取相应的storage数据
    let resultStorage = wx.getStorageSync('isCollected')

    // 当第一读取缓存时需要将obj设置为空对象
    // if(!resultStorage){
    //   wx.setStorageSync('isCollected',{})
    // }
    // 判断当前页面是否收藏过
    if (resultStorage[index]){
      this.setData({
        isCollected: true
      })
    }

    //监听音乐播放
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isMusicPlay: true
      })
      appData.data.isPlay = true
      appData.data.pageIndex = index
    })

    // 判断当前音乐是否在播放
    if (appData.data.isPlay && appData.data.pageIndex === index){
      this.setData({
        isMusicPlay: true
      })
    }

    // 监听音乐结束
    wx.onBackgroundAudioPause(() => {
      this.setData({
        isMusicPlay: false
      })
      appData.data.isPlay = false
    })
  },

  handerCollection () {
    let isCollected = !this.data.isCollected;
    let index = this.data.index
    this.setData({
      isCollected
    })
    appData.data.isPlay = !appData.data.isPlay
    let title = isCollected ? '收藏成功' : '取消收藏';
    wx.showToast({
      title,
      icon: 'success'
    });
    // 读取storage中的数据
    wx.getStorage({
      key: 'isCollected',
      success: (result) => {
        // 当首次进入时还未收藏，将obj设置为空对象
        let obj = result.data || {}
        obj[index] = isCollected

        // 保存收藏的状态到storage中
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success: (result) => {
            console.log(result, "set缓存成功")
          }
        })
      }
    })
  },
  handlerMusic () {
    let isMusicPlay = !this.data.isMusicPlay;
    this.setData({
      isMusicPlay
    })
    let index = this.data.index
    let {dataUrl, title } = list_data[index].music
    if (isMusicPlay){
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    } else {
      wx.pauseBackgroundAudio()
    }
  },
  // 实现点击分享时分享
  handlerShare () {
    wx.showActionSheet({
      itemList: ['分享到朋友圈','分享到QQ空间', '分享到微博']
    })
  }
})