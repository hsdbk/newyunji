<template>
	<view class="page">
		<!-- 顶部 Banner -->
		<view class="banner">
			<image class="banner-img" :src="$getStaticSrc('/static/new_index/new-banner.png')" mode="aspectFill"></image>
		</view>

		<!-- 三项权益 -->
		<view class="benefits">
			<view class="benefit-item" v-for="(item, index) in benefits" :key="index">
				<view class="benefit-circle">
					<text class="benefit-value" :style="{ color: item.color }">{{ item.value }}</text>
				</view>
				<text class="benefit-label">{{ item.label }}</text>
			</view>
		</view>

		<!-- 礼品列表 -->
		<view class="gift-grid">
			<view
				class="gift-card"
				v-for="(item, index) in gifts"
				:key="item.id || index"
				@click="onClaim(item)"
			>
				<view class="gift-img-wrap">
					<image
						class="gift-img"
						:src="item.thumb ? $baseUrl + item.thumb : $getStaticSrc('/static/logo.png')"
						mode="aspectFill"
					></image>
				</view>
				<text class="gift-name">{{ item.title }}</text>
				<text class="gift-cta">免费领取</text>
			</view>
		</view>

		<!-- 温馨提示 -->
		<view class="tips">
			<image class="tips-icon" :src="$getStaticSrc('/static/new_index/notice.png')" mode="aspectFit"></image>
			<text class="tips-text">温馨提示：限时礼品正在领取中，先到先得，领完即止。具体库存及领取资格请以页面显示为准。
</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
export default {
	data() {
		return {
			benefits: [
				{ value: '6', label: '好礼六选一', color: '#E8A317' },
				{ value: '0元', label: '免费领取', color: '#5B9CF5' },
				{ value: '包邮', label: '包邮到家', color: '#9B7BE8' }
			],
			gifts: []
		}
	},
	computed: {
		...mapState(['userInfo', 'isLoggedIn', 'config']),
	},
	onLoad() {
		this.loadGifts()
	},
	methods: {
		loadGifts() {
			this.$http('/goods/info/search', {
				cat_id: 31
			}, 'GET').then(res => {
				this.gifts = res.data?.list || []
			})
		},
		onClaim(item) {
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false
			}
			const name = encodeURIComponent(item.title || '')
			const image = encodeURIComponent(item.thumb || '')
			const id = item.id || ''
			uni.navigateTo({
				url: `/pages/index/physical?id=${id}&name=${name}&image=${image}`
			})
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: #F0F4FA;
	padding-bottom: 60rpx;
	box-sizing: border-box;
}

.banner {
	width: 100%;
	height: 280rpx;
	overflow: hidden;
}

.banner-img {
	width: 100%;
	height: 100%;
	display: block;
}

.benefits {
	display: flex;
	justify-content: space-around;
	align-items: flex-start;
	padding: 40rpx 40rpx 20rpx;
}

.benefit-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 200rpx;
}

.benefit-circle {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 16rpx;
	box-sizing: border-box;
	background: #fff;
	border: none;
}

.benefit-value {
	font-size: 40rpx;
	font-weight: bold;
	line-height: 1;
}

.benefit-label {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.gift-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 20rpx 28rpx 0;
}

.gift-card {
	width: calc(50% - 12rpx);
	background: #fff;
	border-radius: 16rpx;
	padding: 16rpx;
	margin-bottom: 24rpx;
	box-sizing: border-box;
}

.gift-img-wrap {
	width: 100%;
	height: 260rpx;
	border-radius: 12rpx;
	border: 2rpx dashed #D0D5DD;
	overflow: hidden;
	background: #F7F8FA;
	box-sizing: border-box;
}

.gift-img {
	width: 100%;
	height: 100%;
	display: block;
}

.gift-name {
	display: block;
	margin-top: 16rpx;
	font-size: 30rpx;
	font-weight: bold;
	color: #1a1a1a;
	line-height: 1.3;
}

.gift-cta {
	display: block;
	margin-top: 8rpx;
	font-size: 26rpx;
	color: #E54D42;
	font-weight: 500;
}

.tips {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 20rpx 40rpx 0;
}

.tips-icon {
	width: 28rpx;
	height: 28rpx;
	margin-right: 8rpx;
	flex-shrink: 0;
	margin-top: 2rpx;
}

.tips-text {
	font-size: 22rpx;
	color: #999;
	line-height: 1.5;
}
</style>
