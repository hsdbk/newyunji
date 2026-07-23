<template>
  <view class="task-container">
    <!-- 雨滴区域 -->
	<view class="top-section">
		<view class="sunshine-section" @click="goLog">
		  <image class="sunshine-icon" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
		  <view class="sunshine-info">
		    <text class="sunshine-label">雨滴</text>
		    <text class="sunshine-value">{{$formatPrice(userInfo.gold,1,0)}}</text>
		  </view>
		</view>
		<view class="sunshine-section">
		  <image class="gift-icon" :src="$getStaticSrc('/static/task/yun-gift.png')" mode="aspectFit"></image>
		  <view class="gift-info">
			<view class="sunshine-label" style="margin-top:20rpx;">礼品专区</view>
			<view class="top-exchange-btn" @click="goShop">
				<text>兑换</text>
			</view>
		  </view>
		</view>
	</view>
    <view class="sign-section" @click="goSignIn">
    	<view class="sign-section-title">每日签到</view>
    	<view class="sign-section-label">连续签到，奖励天天有</view>
    	<view class="sign-section-btn">
    		<text>立即签到</text>
    	</view>
    </view>
    
    <!-- 每日任务 -->
    <view class="today-task">
		
      <view class="task-help">
		  <text class="task-title">任务大厅</text>
		  <text class="task-title" style="padding-right: 90rpx;" @click="hotActive">规则</text>
		  <!-- <up-icon name="question-circle" size="30" @click="hotActive"></up-icon> -->
	  </view>
	  <view class="task-item" v-if="!isAuth && showQuickGift">
	    <view class="task-info">
	      <image class="task-icon" :src="$getStaticSrc('/static/task/change.png')" mode="aspectFit"></image>
	      <view class="task-detail">
	        <view class="task-name">{{ config?.xinshouduihuan_title || '新人有礼' }}</view>
	       <view>
				<view class="task-desc">新人福利限时开放</view>
				<view class="task-desc">免费领取精选好礼</view>
			</view>
	      </view>
	    </view>
	  		
	    <view class="physical-btn-red" @click="goChangeAuth">
	    	<text>去领取</text>
	    </view>
	  </view>
      <view class="task-item" v-if="config?.show_auth_task && userInfo.is_auth != 'Y'">
        <view class="task-info">
          <image class="task-icon" :src="$getStaticSrc('/static/farm/auth.png')" mode="aspectFit"></image>
          <view class="task-detail">
            <text class="task-name">实名认证</text>
            <text class="task-desc">完成实名认证立得好礼</text>
            <text class="task-desc">{{config.auth_text}}</text>
          </view>
        </view>
        <view class="physical-btn" @click="goAuth">
        	<text>去完成</text>
        </view>
      </view>
      <!-- 每日签到 -->
      <!-- <view class="task-item">
        <view class="task-info">
          <image class="task-icon" :src="$getStaticSrc('/static/task/yun-sign.png')" mode="aspectFit"></image>
          <view class="task-detail">
            <text class="task-name">每日签到</text>
            <text class="task-desc">坚持签到，轻松兑换</text>
            <text class="task-desc">参与立即兑换精美礼品</text>
          </view>
        </view>
        <view class="physical-btn" @click="goSignIn">
        	<text>去完成</text>
        </view>
      </view> -->
      
      <!-- 查看天气 -->
      <view class="task-item">
        <view class="task-info">
          <image class="task-icon" :src="$getStaticSrc('/static/task/yun-weather.png')" mode="aspectFit"></image>
          <view class="task-detail">
            <text class="task-name">查看天气</text>
            <text class="task-desc">实时掌握天气变化</text>
            <text class="task-desc">轻松收集每日小雨滴</text>
          </view>
        </view>
        <view class="physical-btn" @click="goWeather">
        	<text>去完成</text>
        </view>
      </view>
      
		<!-- 快乐农场 -->
		<view class="task-item">
		  <view class="task-info">
		    <image class="task-icon" :src="$getStaticSrc('/static/task/yun-farm.png')" mode="aspectFit"></image>
		    <view class="task-detail">
		      <text class="task-name">快乐农场</text>
		      <text class="task-desc">种的越多，收获越多</text>
		      <text class="task-desc">最高可获得999+雨滴</text>
		    </view>
		  </view>
		  <view class="physical-btn" @click="goFarm">
		  	<text>去完成</text>
		  </view>
		</view>
	  
      <!-- 成语填空 -->
      <view class="task-item">
        <view class="task-info">
          <image class="task-icon" :src="$getStaticSrc('/static/task/yun-chain.png')" mode="aspectFit"></image>
          <view class="task-detail">
            <text class="task-name">成语填空</text>
            <text class="task-desc">边学边玩更有趣</text>
            <text class="task-desc">挑战越多，收获越多</text>
          </view>
        </view>
        <view class="physical-btn" @click="goChain">
        	<text>去完成</text>
        </view>
      </view>
      
      
    
	  <view class="task-item" v-if="config?.show_model_task && config?.review_mode!=1 && isLoggedIn && userInfo.show_item && userInfo.show_licai==1">
	    <view class="task-info">
	      <image class="task-icon" :src="$getStaticSrc('/static/task/ai.png')" mode="aspectFit"></image>
	      <view class="task-detail">
	        <text class="task-name">参与模型</text>
	        <text class="task-desc">参与气象模型，享模型分成</text>
	        <text class="task-desc">首次参与可获得现金奖励</text>
	      </view>
	    </view>
	    <view class="physical-btn" @click="goRecommend">
	    	<text>去完成</text>
	    </view>
	  </view>
	  
	  
    </view>
	<up-popup :show="goldShow" mode="center"  @close="goldShow = false" :closeable="true">
			<view class="sign-popup">
				<image class="sign-popup-icon3" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
        <view class="sign-popup-content">获得雨滴奖励</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button" @click="goldShow = false">确定</up-button>
				</view>
			</view>
		</up-popup>
  </view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
  data() {
    return {
      // 任务数据可以在这里定义
	  goldShow:false
    };
  },
  computed: {
  	...mapState(['isAuth','userInfo', 'isLoggedIn','config']),
	showQuickGift() {
		const switchOn = this.config?.xinshouduihuan_switch == 1 || this.config?.xinshouduihuan_switch === true || this.config?.xinshouduihuan_switch === '1'
		const userShow = this.userInfo?.xinshouduihuan != 1 || this.userInfo?.xinshouduihuan != '1'
		return !!(switchOn && userShow)
	},
  },
  created() {
  	this.$store.dispatch('getConfig');
	if (this.isLoggedIn) {
		this.$store.dispatch('updateUserInfo')
	}
	this.initCheckinfo()
	console.log('1110',this.config.show_auth_task)
  },
  onLoad() {
	  
  },
  methods: {
	  hotActive(){
	  	uni.navigateTo({
	  		url: '/pages/my/settings/question?type=rule'
	  	})
	  },
	goShop(){
		if (!this.isLoggedIn) {
			uni.$u.toast('请您先登录')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}, 1500)
			return false
		}
		if (this.config?.gift_auth_switch && this.userInfo.is_auth != 'Y') {
			uni.showToast({
				title: '完成实名认证，解锁完整商城服务。',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
			}, 3000)
			return false
		}
		uni.navigateTo({
			url: '/pages/shop/shop'
		})
	},
	goLog(){
		if (this.isLoggedIn) {
			uni.navigateTo({
				url: '/pages/my/gold-log'
			})
		}
	},
	initCheckinfo(){
		// 编辑地址
		this.$http(
			'/user/info/checkinfo', {}, "GET").then(res => {

	            this.info = res.data
              
				// this.helpContent = res.data.sign_rule
		})
	},
    goSignIn() {
    	if (!this.isLoggedIn) {
    		uni.$u.toast('请您先登录')
    		setTimeout(() => {
    			uni.redirectTo({
    				url: '/pages/login/login'
    			})
    		}, 1500)
    		return false;
    	}
		if (this.config?.sign_auth_switch && this.userInfo.is_auth != 'Y') {
			uni.showToast({
				title: '完成实名认证，解锁完整签到服务，领取专属礼品',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
			}, 3000)
			return false
		}
		// uni.navigateTo({
		// 	url: '/pages/index/signin'
		// })
    	this.handleSignin()
    },
	handleSignin() {
		// this.goldShow = true;
		// 编辑地址
		this.$http(
			'/user/info/checkin', {}, "POST").then(res => {
		    this.goldShow = true;
		})
    },
	goWeather() {
		if (!this.isLoggedIn) {
			uni.$u.toast('请您先登录')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}, 1500)
			return false;
		}
		if (this.config?.weather_auth_switch && this.userInfo.is_auth != 'Y') {
			uni.showToast({
				title: '完成实名认证，解锁完整天气服务，领取专属礼品',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
			}, 3000)
			return false
		}
		uni.navigateTo({
			url: '/pages/index/weather'
		})
	},
	goChain(){
		if (!this.isLoggedIn) {
			uni.$u.toast('请您先登录')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}, 1500)
			return false;
		}
		console.log('isAuth',this.isAuth)
		if(!this.isAuth){
			
			// 使用优惠券的逻辑
			uni.showToast({
				title: '完成实名认证，解锁完整成语游戏。',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({ url: `/pages/my/settings/settings-password?type=1` });
			}, 3000);
			return false;
		}
		uni.navigateTo({
			url: '/pages/index/idiom-chain/index'
		});
	},
	// 快乐农场
	goFarm() {
		if (!this.isLoggedIn) {
			uni.$u.toast('请您先登录')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}, 1500)
			return false;
		}
		console.log('isAuth',this.isAuth)
		if(!this.isAuth){
			
			// 使用优惠券的逻辑
			uni.showToast({
				title: '完成实名认证，解锁完整农场功能。',
				icon: 'none'
			})
			setTimeout(() => {
				uni.navigateTo({ url: `/pages/my/settings/settings-password?type=1` });
			}, 3000);
			return false;
		}
		uni.navigateTo({
			url: '/pages/farm/farm'
		});
	},
	goAuth(){
		if (!this.isLoggedIn) {
			uni.$u.toast('请您先登录')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}, 1500)
			return false;
		}
		if(this.userInfo.is_auth != "Y"){
			uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
		}
		// uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
	},
	goChangeAuth(){
		if (!this.isLoggedIn) {
			uni.$u.toast('请您先登录')
			setTimeout(() => {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}, 1500)
			return false;
		}
		uni.navigateTo({
			url: '/pages/index/new'
		})
	},
	goRecommend(){
		// uni.navigateTo({ url: '/pages/shop/project-detail?id=138' })
		uni.navigateTo({ url: '/pages/shop/project-detail?id='+this.config.model_item_id })
		
	},
    // 兑换按钮点击事件
    goToExchange() {
      // 跳转到兑换页面
      // uni.navigateTo({ url: '/pages/shop/exchange' });
    }
  }
};
</script>

<style scoped>
.task-container {
  background-color: #f3f3f3;
  min-height: 100vh;
  padding:40rpx 30rpx 0;
}
.top-section{
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
  // #ifdef APP
  margin-top: 80rpx;
  // #endif
  margin-top: 30rpx;
  margin-bottom: 20rpx;
  background-image: url('/static/task/yun-back.png');
  background-size: 100% 100%;
}
/* 雨滴区域 */
.sunshine-section {
	width: calc(50% - 10rpx);
  display: flex;
  align-items: center;
  border-radius: 20rpx;
  height: 150rpx;
  padding: 16rpx 20rpx;
  
}

.sunshine-icon {
  width: 104rpx;
  height: 115rpx;
  margin-right: 16rpx;
  padding:0 20rpx;
}

.sunshine-info {
  flex: 1;
}
.gift-info{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.sunshine-label {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
  line-height: 1.1;
  margin-left:10rpx;
  margin-bottom: 8rpx;
}

.sunshine-value {
  font-size: 36rpx;
  font-weight: bold;
  margin-left:10rpx;
  line-height: 1;
}

.progress-text {
  font-size: 24rpx;
  color: #fff;
  position: absolute;
  top: 10rpx;
  right: 20rpx;
}

/* 礼品中心 */
.gift-section {
	width: calc(50% - 10rpx);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #22b5ff 0%, #3f86ff 100%);
  border-radius: 20rpx;
  padding: 12rpx 16rpx;
  box-sizing: border-box;
}


.gift-section::before {
  top: -10rpx;
  left: -10rpx;
}

.gift-section::after {
  top: -10rpx;
  right: -10rpx;
}

.gift-icon {
  width: 94rpx;
  height: 101rpx;
  margin-right: 12rpx;
}

.gift-label {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 12rpx;
}

.top-exchange-btn {
	width: 179rpx;
	height: 64rpx;
	background-image: url('/static/task/yun-btn-back.png');
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 8rpx;
}

.top-exchange-btn text {
	font-size: 24rpx;
	color: #fff;
	font-weight: 0;
}

/* 今日任务 */
.today-task {
  
  border-radius: 10rpx;
  padding: 20rpx 0;
  
}

.task-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

/* 任务项 */
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 15rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  border-radius: 30rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.task-item:last-child {
  margin-bottom: 0;
}

.task-info {
  display: flex;
  align-items: center;
}

.task-icon {
  width: 110rpx;
  height: 110rpx;
  margin-right: 20rpx;
}

.task-detail {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 5rpx;
}

.task-desc {
  font-size: 28rpx;
  color: #666;
}

.go-btn {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  font-weight: bold;
}

.physical-btn {
	width: 179rpx;
	height: 64rpx;
	background-image: url('/static/task/yun-btn-back.png');
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 10rpx;
	margin-top: 10rpx;
}
.physical-btn-red {
	width: 179rpx;
	height: 64rpx;
	background-image: url('/static/task/yun-btn-red.png');
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 10rpx;
	margin-top: 10rpx;
}
.physical-unbtn {
	width: 179rpx;
	height: 64rpx;
	background-image: url('/static/farm/unbtn-back.png');
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 10rpx;
	margin-top: 10rpx;
}
.physical-unbtn  text {
	margin-bottom: 5px;
	font-size: 28rpx;
	color: #fff;
}
.physical-btn text {
	font-size: 24rpx;
	color: #fff;
	line-height: 1;
}
.physical-btn-red text {
	font-size: 24rpx;
	color: #fff;
	line-height: 1;
}
.task-help{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}
.help-button {
	width: 60rpx;
	height: 60rpx;
	z-index: 10;
}
.sign-section{
	height:200rpx;
	background-image: url('/static/task/yun-sign.png');
	background-size: 100% 100%;
}
.sign-section-title{
	color: #fff;
	font-size: 36rpx;
	padding:10rpx 30rpx 0;
}
.sign-section-label{
	color: #fff;
	font-size: 30rpx;
	padding:0 30rpx 0;
}
.sign-section-btn{
	color: #fff;
	font-size: 24rpx;
	margin-left: 30rpx;
	margin-top: 10rpx;
	width: 179rpx;
	height: 65rpx;
	background-image: url('/static/task/btn-back.png');
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 8rpx;
}

.sign-popup {
    background-color: #ffffff;
    border-radius: 16rpx;
    width: 620rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .sign-popup-icon3{
    width: 128rpx;
    height: 122rpx;
    margin-top: 66rpx;
  }
  .sign-popup-content{
  font-size: 30rpx;
  color: #000000;
  margin-top:10rpx;
  }
  .sign-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .sign-actions .u-button {
    width: 200rpx;
  }
  .sign-popup-button{
    width: 400rpx !important;
    height: 70rpx;
    line-height: 70rpx;
    background-color: #000;
    color: #ffffff;
    border: none;
    border-radius: 35rpx;
    font-size: 26rpx;
    margin-top: 80rpx;
    margin-bottom: 40rpx;
  }
</style>