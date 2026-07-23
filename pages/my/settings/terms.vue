<template>
	<view class="terms-webview-container">
		<web-view :src="termsUrl" @load="onWebLoad" @error="onWebError"></web-view>
		<view class="loading-overlay" v-if="showLoading">
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			termsUrl: '',
			showLoading: true
		};
	},
	onLoad(e) {
		this.type = e.type
		if(this.type == 'terms'){
			uni.setNavigationBarTitle({
				title: '用户协议'
			});
			this.termsUrl = "https://txt.whyzskj.top/newyuji_terms.html"
		}else if(this.type == 'privacy'){
			uni.setNavigationBarTitle({
				title: '隐私协议'
			});
			this.termsUrl = "https://txt.whyzskj.top/newyuji_privacy.html"
		}
	},
	methods: {
		onWebLoad() {
			this.showLoading = false;
		},
		onWebError() {
			this.showLoading = false;
			uni.showToast({
				title: '加载失败，请稍后重试',
				icon: 'none'
			});
		}
	}
};
</script>

<style scoped>
.terms-webview-container {
	width: 100%;
	height: 100vh;
	position: relative;
}

.loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.9);
	z-index: 10;
}

.loading-text {
	font-size: 28rpx;
	color: #666666;
}
</style>