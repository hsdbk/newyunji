<template>
  <view class="settings-container">
    <!-- 个人资料设置 -->
	<view class="title">基本信息</view>
    <view class="settings-group">
		
      <up-cell title="头像" :border="true" @click="navigateToAvatar">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/avatar-set.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">头像</text>
			</view>
		</template>
		<template #value>
		  <image :src="userInfo.avatar ? $baseUrl + userInfo.avatar : '/static/logo.png'" mode="aspectFit" class="avatar-icon"></image>
		</template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
	  <up-cell title="昵称" :border="false" @click="navigateToProfile(1)">
	    <template #title>
	  			<view class="u-slot-title">   
	            <image :src="$getStaticSrc('/static/my/nickname.png')" mode="aspectFit" class="icon"></image>
	  				<text class="u-cell-text">昵称</text>
	  			</view>
	  		</template>
	    <template #value>
	      <text class="auth-name">{{userInfo.nick_name}}</text>
	    </template>
	    <template #right-icon>
	      <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
	    </template>
	  </up-cell>
    </view>

    <!-- 密码相关设置 -->
	<view class="title">其他</view>
    <view class="settings-group">
      <up-cell title="邮箱地址" @click="navigateToProfile(2,userInfo.email?2:1)">
        <template #title>
			<view class="u-slot-title">   
                <image :src="$getStaticSrc('/static/my/email.png')" mode="aspectFit" class="icon"></image>
				<text class="u-cell-text">邮箱地址</text>
			</view>
		</template>
        <template #value>
          <text class="status-text">{{userInfo.email?'已设置':'未绑定'}}</text>
        </template>
        <template #right-icon>
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
        </template>
      </up-cell>
	  <up-cell title="QQ" @click="navigateToProfile(3,userInfo.qq?2:1)">
	    <template #title>
	  			<view class="u-slot-title">   
	            <image :src="$getStaticSrc('/static/my/qq.png')" mode="aspectFit" class="icon"></image>
	  				<text class="u-cell-text">QQ</text>
	  			</view>
	  		</template>
	    <template #value>
	      <text class="status-text">{{userInfo.qq?'已设置':'未绑定'}}</text>
	    </template>
	    <template #right-icon>
	      <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
	    </template>
	  </up-cell>
	  <up-cell title="微信" @click="navigateToProfile(4,userInfo.wechat?2:1)">
	    <template #title>
	  			<view class="u-slot-title">   
	            <image :src="$getStaticSrc('/static/my/wx-set.png')" mode="aspectFit" class="icon"></image>
	  				<text class="u-cell-text">微信</text>
	  			</view>
	  		</template>
	    <template #value>
	      <text class="status-text">{{userInfo.wechat?'已设置':'未绑定'}}</text>
	    </template>
	    <template #right-icon>
	      <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
	    </template>
	  </up-cell>
	  <!-- <up-cell title="手机号" :border="false" @click="navigateToProfile(5,userInfo.mobile?2:1)">
	    <template #title>
	  			<view class="u-slot-title">   
	            <image :src="$getStaticSrc('/static/my/mobile.png')" mode="aspectFit" class="icon"></image>
	  				<text class="u-cell-text">手机号</text>
	  			</view>
	  		</template>
	    <template #value>
	      <text class="status-text">{{userInfo.mobile?'已设置':'未绑定'}}</text>
	    </template>
	    <template #right-icon>
	      <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
	    </template>
	  </up-cell> -->
    </view>
  </view>
</template>

<script>
	import { mapState } from 'vuex'
  export default {
    data() {
      return {
        // 可以在这里添加页面所需的数据
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
      navigateToProfile(type,status = 1) {
		  // console.log(this.userInfo.qq)
		 uni.navigateTo({ url: '/pages/my/settings/settings-info?status='+status+'&type='+type })
        //
      },
	  // 跳转头像
      navigateToAvatar() {
        uni.navigateTo({ url: '/pages/my/settings/settings-avatar'})
      }
    }
  }
</script>

<style lang="scss">
	.title{
		font-size: 28rpx;
		color: #000000;
		margin-left: 22rpx;
		margin-top:38rpx;
		margin-bottom:12rpx;
		font-weight: 500;
	}
  .settings-container {
    padding: 30rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  .u-slot-title{
    display: flex;
    align-items: center;
  }
  .avatar-icon{
	  width:70rpx;
	  height:70rpx;
	  border-radius: 50%;
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
	padding:0 23rpx;
  }
  .u-cell__body{
	padding:13px 0 !important;  
  }
  // 自定义右侧箭头图标的样式
  .right-icon {
    width:12rpx;
    height: 24rpx;
	margin-left:10rpx;
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
</style>