<template>
	<view class="container">
		<view class="task-item">
		  <view class="task-info">
		    <image class="task-icon" :src="$getStaticSrc('/static/index/gold.png')" mode="aspectFit"></image>
		    <view class="task-text">
		      <text class="task-title">邀请计划</text>
		      <text class="task-desc">让您的收获持续增长！</text>
		    </view>
		  </view>
		</view>
		<view class="label-title">我的邀请码</view>
		<!-- 邀请链接区域 -->
   <!-- <view class="invite-link-container">
      <view class="link-wrapper">
        <text class="invite-link">{{ inviteLink }}</text>
        <button class="copy-btn" @click="copyLink">复制链接</button>
      </view>
	  <image class="qrcode" :src="qrcodeUrl" mode="aspectFit"></image>
    </view> -->
    
    <!-- 邀请码区域 -->
    <view class="invite-code-container">
      <view class="code-wrapper">
        <text class="invite-code">{{ inviteCode }}</text>
        <button class="copy-btn" @click="copyCode">复制邀请码</button>
      </view>
    </view>
    
    <!-- 分享提示 -->
    <text class="share-tip">点击复制您的邀请码分享给好友</text>
    
    <!-- 如何参与区域 -->
    <view class="participate-section">
      <text class="section-title">如何邀请</text>
      <view class="steps-container">
        <view class="step-item">
          <view class="step-number">1</view>
          <text class="step-text">发送您的邀请码</text>
        </view>
        <view class="step-item">
          <view class="step-number">2</view>
          <text class="step-text">好友下载并登录</text>
        </view>
        <view class="step-item">
          <view class="step-number">3</view>
          <text class="step-text">完成绑定并参与</text>
        </view>
      </view>
    </view>
    
    <!-- 奖励说明区域 -->
    <view class="reward-section">
      <text class="section-title">邀请说明</text>
      <view class="reward-item">
		<scroll-view scroll-y style="height: 400rpx;">
		    <up-parse :content="$completeImageUrls(config.invite_firends)"></up-parse>
		</scroll-view>
        <!-- <view class="reward-desc">1、当您升级至 VIP1(钛钢会员)或更高级别即可解锁【邀请有奖】权益。</view> -->
        <!-- <view class="reward-desc">2、一级奖励（2%）：您直接邀请的好友成功参与，您将获得其每次参与金额的2%作为奖励</view> -->
        <!-- <view class="reward-desc">3、二级奖励（1%）：您的好友（一级）邀请的新用户成功参与您将获得该新用户每次参与金额的1%作为奖励。</view> -->
      </view>
    </view>
    
    <!-- 邀请任务区域 -->
    <view class="task-section" v-if="status == 1" @click="handleInviteFriends">
      <view class="task-header">
        <text class="section-title">邀请任务</text>
        <image class="more-icon" :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit"></image>
      </view>
      <view class="task-items">
        <view class="task-infos">
			<view class="task-names">完成10位好友</view>
        	<view class="task-progress">进度 2/10</view>
		</view>
        <view class="progress-bar">
          <view class="progress-fill" style="width: 20%;"></view>
        </view>
      </view>
      <view class="task-items">
        <view class="task-infos">
			<view class="task-names">完成10位好友</view>
        	<view class="task-progress">进度 2/10</view>
		</view>
        <view class="progress-bar">
          <view class="progress-fill" style="width: 20%;"></view>
        </view>
      </view>
      <view class="task-items">
        <view class="task-infos">
			<view class="task-names">完成10位好友</view>
        	<view class="task-progress">进度 2/10</view>
		</view>
        <view class="progress-bar">
          <view class="progress-fill" style="width: 20%;"></view>
        </view>
      </view>
    </view>
    
    <!-- 立即邀请按钮 -->
    <!-- <view class="invite-button-container">
      <button class="invite-btn" @click="handleInvite">立即邀请</button>
    </view> -->
	<view class="tips" v-if="tipsShow">{{ tips }}</view>
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
      inviteLink: '',
      inviteCode: '',
      inviter: '',
      invitee: '',
      tips: '',
      tipsShow: false,
	  status:0,
	  qrcodeUrl:''
    };
  },
  onShow() {
	  this.$store.dispatch('getConfig');
  	this.initInviteinfo()
	
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },
    initInviteinfo(){
    	// 编辑地址
    	this.$http(
    		'/user/info/invite', {}, "GET").then(res => {
                
                // 使用 window.location.origin 获取当前H5页面的域名
				let path = '';
				// #ifdef H5
				const urlObj = new URL(res.data.share_url);
				path = urlObj.pathname + urlObj.search;
				this.inviteLink = window.location.origin + '/#/pages/login/register?inviteCode='+res.data.mobile;
				// #endif
				// #ifdef APP
				// APP端直接使用完整的分享链接
				this.inviteLink = res.data.share_url;
				// #endif
				this.qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=`+this.inviteLink;
                
                // 设置邀请码
                if(res.data.mobile){
                    this.inviteCode = res.data.mobile;
                } else if(res.data.invite_code){
                    // 兼容处理，如果mobile不存在则使用invite_code
                    this.inviteCode = res.data.invite_code;
                } else {
                    this.inviteCode = '';
                }
                
				console.log('inviteCode',this.inviteCode)
                this.inviter = res.data.inviter_reward || 0;
                this.invitee = res.data.invitee_reward || 0;
                
    	}).catch(err => {
            console.error('获取邀请信息失败:', err);
            this.inviteCode = '';
        })
    },
    // 复制邀请链接
    copyLink() {
      uni.setClipboardData({
        data: this.inviteLink,
        success: () => {
          this.tips = '链接已复制';
		  this.tipsShow = true;
		  setTimeout(() => {
			this.tipsShow = false;
		  }, 3000);
        }
      });
    },
    
    // 复制邀请码
    copyCode() {
      uni.setClipboardData({
        data: this.inviteCode,
        success: () => {
		  this.tips = '邀请码已复制';
		  this.tipsShow = true;
		  setTimeout(() => {
			this.tipsShow = false;
		  }, 3000);
        }
      });
    },
    handleInviteFriends(){
		
		uni.navigateTo({
			url: '/pages/index/invite-ranking'
		});
	},
    // 处理邀请
    handleInvite() {
		uni.navigateTo({ url: '/pages/recommend/share' });
      // // 这里可以添加分享逻辑
      // uni.showToast({
      //   title: '打开分享面板',
      //   icon: 'none'
      // });
    }
  }
};
</script>

<style scoped>
	page {
		background: #f5f5f5;
	}
	
	.container {
		padding: 30rpx;
		box-sizing: border-box;
	}
	.task-item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding: 30rpx;
	  border-bottom: 1rpx solid #EEEEEE;
	  background-color: #ffffff;
	  border-radius: 30rpx;
	}
	
	.task-item:last-child {
	  border-bottom: none;
	}
	
	.task-info {
	  display: flex;
	  align-items: center;
	  flex: 1;
	}
	
	.task-icon {
	  width: 64rpx;
	  height: 61rpx;
	  margin-right: 20rpx;
	}
	
	.task-text {
	  flex: 1;
	}
	
	.task-title {
	  color:#D54E3A;
	  font-size: 30rpx;
	  font-weight: bold;
	  display: block;
	  margin-bottom: 5rpx;
	}
	
	.task-desc {
	  color: #999999;
	  font-size: 24rpx;
	}
	.label-title{
	 font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	padding:20rpx 35rpx;
	}
	.task-btn {
	  width: 160rpx;
	  height: 70rpx;
	  line-height: 70rpx;
	  background-color: #000;
	  color: #ffffff;
	  border: none;
	  border-radius: 35rpx;
	  font-size: 26rpx;
	}
	/* 邀请链接区域 */
.invite-link-container{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.invite-code-container {
  margin-bottom: 20rpx;
}

.link-wrapper,
.code-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.invite-link,
.invite-code {
  flex: 1;
  color: #000;
  font-size: 28rpx;
  margin-right: 20rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 25rpx 30rpx;
  background-color: #ffffff;
   border-radius: 30rpx;
}

.copy-btn {
  width: 180rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 30rpx;
  font-size: 24rpx;
}

/* 分享提示 */
.share-tip {
  display: block;
  color: #D54E3A;
  font-size: 24rpx;
  margin-bottom: 40rpx;
  line-height: 1.5;
  margin-left:35rpx;
}

/* 区域标题 */
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
  display: block;
}

/* 如何参与区域 */
.participate-section {
  margin-bottom: 40rpx;
  background-color: #ffffff;
   box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
   padding: 30rpx;
    border-radius: 30rpx;
}
.qrcode{
	width:200rpx;
	height:200rpx;
}
.steps-container {
  display: flex;
  justify-content: space-between;
}

.step-item {
	flex:1;
  width:195rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FEEEE5;
  border-radius: 30rpx;
  padding:20rpx;
  margin-right: 10rpx;
}

.step-number {
    width: 50rpx;
height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  color: #993018;
  border-radius: 50%;
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 15rpx;

background: #FFFFFF;
}

.step-text {
  font-size: 22rpx;
  color: #993018;
  text-align: center;
}

/* 奖励说明区域 */
.reward-section {
  margin-bottom: 40rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.reward-item {
  background-color: #F3F3F3;
  border-radius: 30rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.reward-info {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.reward-text {
  color: #333333;
  font-size: 24rpx;
  margin-right: 10rpx;
}

.reward-role {
  color: #993018;
  font-size: 20rpx;
  margin-right: 10rpx;
  background-color: #FEEEE5;
  padding: 5rpx 10rpx;
  border-radius: 15rpx;
}

.reward-amount {
  color: #D54E3A;
  font-size: 30rpx;
  font-weight: bold;
}

.reward-desc {
  color: #666666;
  font-size: 24rpx;
  line-height: 1.5;
  margin:10rpx 0;
}

/* 邀请任务区域 */
.task-section {
  margin-bottom: 60rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-icon {
  width: 12rpx;
  height: 24rpx;
}

.task-items {
  background-color: #F3F3F3;
  border-radius: 30rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
.task-infos{
	display: flex;
	justify-content: space-between;
}
.task-names {
  display: block;
  color: #333333;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.task-status {
  display: block;
  color: #993018;
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.task-progress {
  display: block;
  color: #666666;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.progress-bar {
  width: 100%;
  height: 10rpx;
  background-color: #EEEEEE;
  border-radius: 5rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #FFCC00;
  border-radius: 5rpx;
}

.progress-fill.full {
  width: 100%;
}

/* 立即邀请按钮 */
.invite-button-container {
  display: flex;
  justify-content: center;
}

.invite-btn {
  width: 500rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 35rpx;
  font-size: 24rpx;
}
.tips{
	position: absolute;
	left: 161rpx;
	top:297rpx;
	width: 429rpx;
	height: 100rpx;
	line-height: 100rpx;
	font-size: 28rpx;
	color: #9B361F;
	border-radius: 40rpx;
	background-color: #FEEEE5;
	text-align: center;
	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.3);
}
</style>