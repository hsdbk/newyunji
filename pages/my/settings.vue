<template>
  <view class="settings-container">
    <!-- 个人资料设置 -->
    <view class="settings-group">
      <up-cell title="个人资料" :border="false" @click="navigateToProfile">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/accent.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">个人资料</text>
			</view>
		</template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
    </view>

    <!-- 支付相关设置 -->
    <view class="settings-group" v-if="userInfo.show_item&& userInfo.show_licai==1">
      <up-cell title="添加提现方式" :border="false" @click="navigateToPaymentMethod">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/card-b.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">添加提现方式</text>
			</view>
		</template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
    </view>

    <!-- 实名认证设置 -->
    <view class="settings-group">
      <up-cell title="实名认证" :border="false" @click="navigateToRealNameAuth">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/auth.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">实名认证</text>
			</view>
		</template>
        <template #value>
          <text class="auth-name">{{userInfo.is_auth == 'Y'?userInfo.name:'未认证'}}</text>
        </template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
    </view>

    <!-- 密码相关设置 -->
    <view class="settings-group">
      <up-cell title="支付密码" :border="false" @click="navigateToPaymentPassword(userInfo.is_set_pay_passwd)">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/lock.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">支付密码</text>
			</view>
		</template>
        <template #value>
          <text class="status-text">{{userInfo.is_set_pay_passwd?'已设置':'未绑定'}}</text>
        </template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
    </view>
    <view class="settings-group">
      <up-cell title="登录密码" :border="false" @click="navigateToLoginPassword">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/lock.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">登录密码</text>
			</view>
		</template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
    </view>
    <!-- 收货地址设置 -->
    <view class="settings-group">
      <up-cell title="收货地址" :border="false" @click="navigateToAddress">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/location.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">收货地址</text>
			</view>
		</template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
    </view>
	<view class="settings-group" v-if="!userInfo.show_item">
	  <up-cell title="账户注销" :border="false" @click="deletePopupShow = true">
	    <template #title>
			<view class="u-slot-title">   
	            <image :src="$getStaticSrc('/static/my/quit.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">账户注销</text>
			</view>
		</template>
	    <template #right-icon>
	      <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
	    </template>
	  </up-cell>
	</view>
	<!-- 确认注销弹窗 -->
	<up-popup :show="deletePopupShow" mode="center" @close="deletePopupShow = false" :closeable="true">
		<view class="delete-popup">
			<view class="delete-title">是否注销</view>
			<view class="delete-content">确认操作后将注销登录</view>
			<view class="delete-actions">
				<up-button type="primary" class="add-address-button" @click="confirmQuit">确定</up-button>
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
        // 可以在这里添加页面所需的数据
		deletePopupShow:false
      }
    },
	computed: {
		...mapState(['userInfo', 'isLoggedIn'])
	},
	onShow() {
		if (this.isLoggedIn) {
			this.$store.dispatch('updateUserInfo');
		}
	},
    methods: {
      // 导航到个人资料页面
      navigateToProfile() {
        uni.navigateTo({ url: '/pages/my/settings/settings-profile' })
      },
      
      // 导航到添加支付方式页面
      navigateToPaymentMethod() {
        console.log('跳转到添加支付方式页面')
        uni.navigateTo({ url: '/pages/my/payment-method' })
      },
      
      // 导航到实名认证页面
      navigateToRealNameAuth() {
        console.log('跳转到实名认证页面')
		if(this.userInfo.is_auth != "Y"){
			uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
		}
      },
      
      // 导航到支付密码页面
      navigateToPaymentPassword(s) {
		  if(!s){
			   uni.navigateTo({ url: '/pages/my/settings/settings-password?type=3' })
		  }else{
			   uni.navigateTo({ url: '/pages/my/settings/settings-password?type=2' })
		  }
        console.log('跳转到支付密码页面')
       
      },
      
      // 导航到登录密码页面
      navigateToLoginPassword() {
        console.log('跳转到登录密码页面')
        uni.navigateTo({ url: '/pages/my/settings/settings-password?type=6' })
        // uni.navigateTo({ url: '/pages/my/settings/settings-password?type=5' })
      },
      
      // 导航到收货地址页面
      navigateToAddress() {
        console.log('跳转到收货地址页面')
		uni.navigateTo({ url: '/pages/my/settings/settings-place' })
      },
	  confirmQuit(){
	  console.log('userInfo~~~',this.userInfo)
	  // 记录被注销的账户信息
	  if (this.userInfo) {
		  
		  console.log('userInfo',this.userInfo)
	    let deletedAccounts = uni.getStorageSync('deletedAccounts') || [];
	    // 确保是数组类型
	    if (!Array.isArray(deletedAccounts)) {
	      deletedAccounts = [];
	    }
	    // 检查账户是否已在注销列表中
	    if (!deletedAccounts.includes(this.userInfo.mobile)) {
	      deletedAccounts.push(this.userInfo.mobile);
	      uni.setStorageSync('deletedAccounts', deletedAccounts);
	    }
	  }
	  
	  this.$http(
	  	'/api/api/logout', {}, "POST").then(res => {
	  	this.$store.commit('setUserLoggedOut');
	  	uni.removeStorageSync('ssid');
	      uni.removeStorageSync('expire_time');
	      uni.removeStorageSync('reset_time');
	  	setTimeout(() => {
	  
	  		uni.hideLoading()
	  		this.deletePopupShow = false
	  		uni.showToast({
	  		title: '账户已注销',
	  		icon: 'success'
	  		})
	  
	  		// 退出成功后跳转到icon页面，并设置tab为0（首页）
	  			setTimeout(() => {
	  			uni.navigateTo({
	  				url: '/pages/login/login'
	  			})
	  			}, 1500)
	  	}, 1500)
	  }).catch(error => {
	  	console.error('登录失败:', error);
	  	uni.hideLoading();
	  	uni.showToast({
	  		title: '退出失败，请重试',
	  		icon: 'none'
	  	});
	  });
	  }
    }
  }
</script>

<style lang="scss">
  .settings-container {
    padding: 20rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  .u-slot-title{
    display: flex;
    align-items: center;
  }
  .icon{
    width: 36rpx;
    height: 36rpx;
    margin-right: 20rpx;
  }
  .settings-group {
    margin-bottom: 20rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
  }
  
  // 自定义右侧箭头图标的样式
  .right-icon {
    width: 30rpx;
    height: 30rpx;
  }
  
  // 实名认证姓名的样式
  .auth-name {
    color: #A4A4A4;
    font-size: 28rpx;
  }
  
  // 已设置状态的样式
  .status-text {
    color: #A4A4A4;
    font-size: 28rpx;
  }
  
  // 自定义up-cell的样式以匹配截图效果
  .up-cell {
    height: 120rpx;
    line-height: 120rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    
    .up-cell__title {
      font-size: 30rpx;
      color: #333333;
    }
    
    .up-cell__value {
      font-size: 28rpx;
    }
  }
  .delete-popup {
  	
  	background-color: #ffffff;
  	border-radius: 30rpx;
  	width:620rpx;
  }
  
  .delete-title {
  	font-size: 30rpx;
  	font-weight: bold;
  	text-align: center;
  	margin-bottom: 30rpx;
  	margin-top: 44rpx;
  }
  
  .delete-content {
  	font-size: 28rpx;
  	color: #666;
  	text-align: center;
  	margin: 120rpx 0;
  }
  
  .default-icon {
  	width: 34rpx;
  	height: 34rpx;
  }
  
  .delete-actions {
  	display: flex;
  	justify-content: space-between;
  }
  
  .delete-actions .u-button {
  	width: 200rpx;
  	margin-bottom: 40rpx;
  }
  .add-address-button {
  	background-color: #000000 !important;
  	color: #ffffff !important;
  	border-radius: 35rpx !important;
  	font-size: 24rpx;
  	height: 70rpx;
  	width: 400rpx !important;
  	line-height: 70rpx;
  }
</style>