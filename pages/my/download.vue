<template>
	<view class="download-container">
		<!-- 主要内容区域 -->
		<view class="content">
			<!-- 标题 -->
			<view class="title-section">
				<text class="main-title">选择设备类型</text>
				<text class="sub-title">{{config.link_text}}</text>
			</view>

			<!-- 按钮区域 -->
			<view class="buttons-container">
				<!-- Android按钮 -->
				<view class="button-wrapper android-wrapper">
					<view class="device-button android-button" @click="handleAndroidAction">
						<image class="device-icon" :src="$getStaticSrc('/static/my/down.png')"></image>
						<text class="device-text">Android</text>
						<!-- 在APP版本中显示复制图标或文字提示 -->
						<!-- #ifdef APP -->
						<text class="copy-tip">复制地址</text>
						<!-- #endif -->
					</view>
				</view>

				<!-- iPhone按钮 -->
				<view class="button-wrapper ios-wrapper">
					<view class="device-button ios-button" @click="handleIosAction">
						<image class="device-icon" :src="$getStaticSrc('/static/my/down.png')"></image>
						<text class="device-text">iPhone</text>
						<!-- 在APP版本中显示复制图标或文字提示 -->
						<!-- #ifdef APP -->
						<text class="copy-tip">复制地址</text>
						<!-- #endif -->
					</view>
				</view>
			</view>

			<!-- 版本信息 -->
			<view class="version-info">
				<text>当前最新版本：v1.0.0</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
	data() {
		return {
			androidUrl: 'https://example.com/download/android',
			iosUrl: 'https://example.com/download/ios'
		};
	},
	computed: {
		...mapState(['config'])
	},
	onShow() {

		this.$store.dispatch('getConfig');

	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack();
		},

		// 复制文本到剪贴板
		copyToClipboard(text) {
			uni.setClipboardData({
				data: text,
				success: () => {
					uni.showToast({
						title: '下载地址已复制',
						icon: 'success'
					})
				},
				fail: () => {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					})
				}
			})
		},

		// Android按钮点击处理
		handleAndroidAction() {
			// #ifdef APP
			// APP版本复制下载地址
			if(this.config.android_link) {
				this.copyToClipboard(this.config.android_link);
			}
			// #endif

			// #ifdef H5
			// H5版本直接打开下载链接
			if(this.config.android_link) {
				window.open(this.config.android_link, '_blank');
			}
			// #endif
		},

		// iPhone按钮点击处理
		handleIosAction() {
			// #ifdef APP
			// APP版本复制下载地址
			if(this.config.ios_link) {
				this.copyToClipboard(this.config.ios_link);
			}
			// #endif

			// #ifdef H5
			// H5版本直接打开下载链接
			if(this.config.ios_link) {
				window.open(this.config.ios_link, '_blank');
			}
			// #endif
		}
	}
};
</script>

<style scoped>
.download-container {
	width: 100%;
	height: 100vh;
	background-color: #f8f8f8;
}

/* 导航栏样式 */
.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100rpx;
	background-color: #fff;
	padding: 0 30rpx;
}

.back-icon {
	width: 48rpx;
	height: 48rpx;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
}

.nav-right {
	width: 48rpx;
}

/* 内容区域样式 */
.content {
	padding: 60rpx 40rpx;
}

.title-section {
	text-align: center;
	margin-bottom: 80rpx;
}

.main-title {
	font-size: 44rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.sub-title {
	font-size: 28rpx;
	color: #666;
}

/* 按钮容器样式 */
.buttons-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 40rpx;
}

.button-wrapper {
	width: 600rpx;
	border-radius: 20rpx;
	padding: 8rpx;
}

/* Android按钮样式 */
.android-button {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fe8046;
	color: #fff;
	height: 120rpx;
	border-radius: 16rpx;
	gap: 20rpx;
}

/* iOS按钮样式 */
.ios-button {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fe8046;
	color: #fff;
	height: 120rpx;
	border-radius: 16rpx;
	gap: 20rpx;
}

.device-icon {
	width: 56rpx;
	height: 56rpx;
	/* 确保图标在深色背景上清晰可见 */
	filter: brightness(0) invert(1);
}

.device-text {
	font-size: 36rpx;
	font-weight: 600;
}

/* 版本信息样式 */
.version-info {
	text-align: center;
	margin-top: 80rpx;
	color: #999;
	font-size: 24rpx;
}

/* 响应式调整 */
@media (max-width: 375px) {
	.button-wrapper {
		width: 500rpx;
	}
	
	.device-text {
		font-size: 32rpx;
	}
}
</style>