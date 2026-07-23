<template>
  <view class="vip-container">
    <up-navbar
      title="我的会员"
      :autoBack="true"
      bgColor="transparent"
    >
    </up-navbar>
	
    <image class="back" :src="$getStaticSrc('/static/my/vip/back.png')" mode="aspectFit"></image>
    <!-- 当前会员等级展示区 -->
    <view class="current-vip-section">
		
      <view class="vip-card">
		<image class="vip-back" v-if="userInfo.vip_info.level==0" :src="$getStaticSrc('/static/my/vip/1-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==1" :src="$getStaticSrc('/static/my/vip/1-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==2" :src="$getStaticSrc('/static/my/vip/2-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==3" :src="$getStaticSrc('/static/my/vip/3-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==4" :src="$getStaticSrc('/static/my/vip/4-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==5" :src="$getStaticSrc('/static/my/vip/5-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==6" :src="$getStaticSrc('/static/my/vip/6-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==7" :src="$getStaticSrc('/static/my/vip/7-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==8" :src="$getStaticSrc('/static/my/vip/8-c.png')" mode="aspectFit"></image>
		<image class="vip-back" v-if="userInfo.vip_info.level==9" :src="$getStaticSrc('/static/my/vip/9-c.png')" mode="aspectFit"></image>
        <view class="vip-header">
          <view class="vip-level-info">
            <text class="vip-level-text">我的会员等级</text>
            <text class="vip-level-value">Lv.{{userInfo.vip_info.level}}{{userInfo.vip_info.show_name}}</text>
          </view>
          <image class="vip-icon" v-if="userInfo.vip_info.level==0" :src="$getStaticSrc('/static/my/vip/1.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==1" :src="$getStaticSrc('/static/my/vip/1.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==2" :src="$getStaticSrc('/static/my/vip/2.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==3" :src="$getStaticSrc('/static/my/vip/3.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==4" :src="$getStaticSrc('/static/my/vip/4.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==5" :src="$getStaticSrc('/static/my/vip/5.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==6" :src="$getStaticSrc('/static/my/vip/6.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==7" :src="$getStaticSrc('/static/my/vip/7.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==8" :src="$getStaticSrc('/static/my/vip/8.png')" mode="aspectFit"></image>
          <image class="vip-icon" v-if="userInfo.vip_info.level==9" :src="$getStaticSrc('/static/my/vip/9.png')" mode="aspectFit"></image>
        </view>
        
        <view class="vip-privileges">
          <!-- <view class="privilege-item">
            购物75折
          </view>
          <view class="privilege-item">
            私人贵宾服务
          </view>
          <view class="privilege-item">
            线下专属体验
          </view>
          <view class="privilege-item">
            年度豪华礼包
          </view> -->
        </view>
        
        <view class="growth-progress">
          
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: '100%' }"></view>
          </view>
		  <view class="growth-text">
		    <text class="growth-value">成长值{{userInfo.credit}}/{{userInfo.vip_info.next.credit}}，距离Lv.{{userInfo.vip_info.next.level}}{{userInfo.vip_info.next.show_name}}还差{{userInfo.vip_info.next.credit - userInfo.credit}}</text>
		  </view>
        </view>
      </view>
    </view>
    
    <!-- 会员等级列表 -->
    <view class="vip-levels-section">
      
      <!-- 会员等级网格 -->
      <view class="vip-levels-grid">
        <!-- Lv.1 铜牌会员 -->
        <view class="vip-level-card" v-for="(item,index) in vip" :key="index">
          <image class="level-back" :src="'/static/my/vip/'+index+'-b.png'" mode="aspectFit"></image>
          <image class="level-icon" :src="'/static/my/vip/'+index+'.png'" mode="aspectFit"></image>
          <view class="level-info">
			  <text class="level-name">{{item.name}}{{item.show_name}}</text>
			  <!-- <view class="level-privileges" v-for="(i,k) in item.label" :key="k">
			    <text class="privilege-text">{{i}}</text>
			  </view> -->
		  </view>
        </view>
        
      </view>
    </view>
    <view class="add-button-container">
        <up-button type="primary" class="add-address-button" @click="goRecharge">去升级</up-button>
        <up-button type="primary" class="add-address-button" @click="vipShow = true">会员权益</up-button>
    </view>
	<up-popup :show="vipShow" :safeAreaInsetTop="false" :safeAreaInsetBottom="false" :round="10" mode="center" :closeable="true" @close="this.vipShow = false" overlayStyle="{'touch-action':'none'}">
    <view class="pay-content">
		<view class="pay-content-title">会员权益</view>
        <scroll-view scroll-y style="height: 100%;">
            <up-parse :content="$completeImageUrls(config.vip_info)"></up-parse>
        </scroll-view>
    </view>
</up-popup>
  </view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
	computed: {
		...mapState(['userInfo', 'isLoggedIn','config'])
	},
  data() {
    return {
        level:1,
		vipShow:false,
      vip:[
		  // {
		  // 'level':'Lv.1',
		  // 'name':'铜牌会员',
		  // 'label':['基础购物功能','参与普通活动'],
		  // 'avatar':'/static/my/vip/1.png',
		  // 'back':'/static/my/vip/1-b.png',
		  // },{
		  // 'level':'Lv.2',
		  // 'name':'白银会员',
		  // 'label':['购物98折','生日礼包'],
		  // 'avatar':'/static/my/vip/2.png',
		  // 'back':'/static/my/vip/2-b.png',
		  // },{
		  // 'level':'Lv.3',
		  // 'name':'黄金会员',
		  // 'label':['购物95折','专属优惠券','优先抢购'],
		  // 'avatar':'/static/my/vip/3.png',
		  // 'back':'/static/my/vip/3-b.png',
		  // },{
		  // 'level':'Lv.4',
		  // 'name':'铂金会员',
		  // 'label':['购物9折','专属身份标识','活动优先参与'],
		  // 'avatar':'/static/my/vip/4.png',
		  // 'back':'/static/my/vip/4-b.png',
		  // },{
		  // 'level':'Lv.5',
		  // 'name':'钻石会员',
		  // 'label':['购物88折','每月积分奖励','专属客服经理'],
		  // 'avatar':'/static/my/vip/5.png',
		  // 'back':'/static/my/vip/5-b.png',
		  // },{
		  // 'level':'Lv.6',
		  // 'name':'红宝石会员',
		  // 'label':['购物85折','线下合作权益','季度礼包'],
		  // 'avatar':'/static/my/vip/6.png',
		  // 'back':'/static/my/vip/6-b.png',
		  // },
		  // {
		  // 'level':'Lv.7',
		  // 'name':'蓝宝石会员',
		  // 'label':['购物82折','年度盛典邀请','专属活动助力'],
		  // 'avatar':'/static/my/vip/7.png',
		  // 'back':'/static/my/vip/7-b.png',
		  // },
		  // {
		  // 'level':'Lv.8',
		  // 'name':'黑钻会员',
		  // 'label':['购物8折','专属客户经理','专属定制服务'],
		  // 'avatar':'/static/my/vip/8.png',
		  // 'back':'/static/my/vip/8-b.png',
		  // },
		  // {
		  // 'level':'Lv.9',
		  // 'name':'至尊会员',
		  // 'label':['购物75折','私人贵宾服务','线下专属体验','年度豪华礼包'],
		  // 'avatar':'/static/my/vip/9.png',
		  // 'back':'/static/my/vip/9-b.png',
		  // }
	  ]
    };
  },
  onShow() {
  	this.getLevel()
	this.$store.dispatch('getConfig');
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },
	getLevel(){
	  // 编辑地址
	  this.$http(
		'/user/info/level', {}, "POST").then(res => {
			console.log(res)
			this.vip = res.data
	  })
			  
	},
	goRecharge() {
		uni.navigateTo({
			url: '/pages/my/recharge'
		})
	},
	goVip(){
		
	}
    // 可以添加其他方法，如点击等级卡片查看详情等
  }
};
</script>

<style scoped>
page{
    background-color: #f5f5f5;
}
.vip-container {
  padding-bottom: 60rpx;
  background-color: #f5f5f5;
  position: relative;
}
.back{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 622rpx;
}
/* 当前会员等级区域 */
.current-vip-section {
  padding: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 110rpx;
}

.vip-card {
  border-radius: 20rpx;
  width:640rpx;
  height:300rpx;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}
.vip-back{
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
}
.vip-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200rpx;
  height: 200rpx;
  background: url('/static/my/vip/back.png') no-repeat center;
  background-size: contain;
  opacity: 0.2;
}

.vip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.vip-level-info {
  flex: 1;
  margin-left:51rpx;
}

.vip-level-text {
  font-size: 28rpx;
  opacity: 0.9;
}

.vip-level-value {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}

.vip-icon {
  width: 155rpx;
  height: 120rpx;
  margin-right:81rpx;
  margin-top:20rpx;
}



.vip-privileges {
    width:50vw;
  display: flex;
  margin-left:51rpx;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
  position: relative;
  /* 确保最多显示两行 */
  max-height: 140rpx;
  overflow: hidden;
}

.privilege-item {
  border-radius: 20rpx;
  /* 设置每个特权项的宽度为大约45%，确保一行显示两个 */
  width: calc(50% - 10rpx);
  text-align: left;
  color: #fff;
  font-size: 24rpx;
}

/* 移除第2个和第4个项目的右侧边距 */
.privilege-item:nth-child(2n) {
  margin-right: 0;
}

.growth-progress {
    margin-left:51rpx;
    width:540rpx;
	position: relative;
	  border-radius: 10rpx;
}

.growth-text {
	text-align: center;
  margin-bottom: 10rpx;
}

.growth-value {
  font-size: 20rpx;
}

.progress-bar {
  height: 10rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #ffffff;
  transition: width 0.3s ease;
}

/* 会员等级列表区域 */
.vip-levels-section {
  padding: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333333;
}

.vip-levels-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.vip-level-card {
  width: 335rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
  height:183rpx;
  transition: all 0.3s ease;
}

.vip-level-card:active {
  transform: scale(0.98);
}

.vip-level-card.current-level {
  border: 2rpx solid #FFD700;
  box-shadow: 0 0 15rpx rgba(255, 215, 0, 0.3);
}
.level-back{
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
}
.level-info{
	position: absolute;
	left:15rpx;
	top:12rpx;
	margin-top: 0;
}
.level-icon {
	position: absolute;
	right:27rpx;
	top:12rpx;
	  width: 100rpx;
	  height: 100rpx;
	  margin: 0 auto 15rpx;
	  display: block;
}

.level-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #fff;
  text-align: center;
  display: block;
  margin-bottom: 15rpx;
  position: relative;
}

.level-privileges {
  text-align: center;
  position: relative;
}

.privilege-text {
  font-size: 22rpx;
  color: #fff;
  display: block;
}

.current-tag {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  background-color: #FFD700;
  color: #ffffff;
  font-size: 20rpx;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
}
.add-button-container {
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    padding: 0 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-around;
}
.add-address-button {
    background-color: #000000 !important;
    color: #ffffff !important;
    border-radius: 35rpx !important;
    font-size: 24rpx !important;
    height: 70rpx !important;
    width: 300rpx !important;
    line-height: 70rpx !important;
    border: 0 !important;
}
.pay-content{
	width:90vw;
    height:100%;
    max-height: 1000rpx;
    padding:70rpx 30rpx;
    font-size: 30rpx;
    color: #000000;
    overflow-y: auto;
    text-align: center;
}
</style>