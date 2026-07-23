<template>
	<view class="logistics-container">

		<!-- 物流列表 -->
		<view class="logistics-list">
			<!-- 物流项 - 运输中 -->
			<view class="logistics-item" v-for="item in logisticsItems" :key="item.id">
				<view class="item-content">
					<view class="item-left">
						<image class="product-image" :src="item.image" mode="aspectFit"></image>
					</view>
					<view class="item-middle">
						<view class="status-badge transporting"
							v-if=" item.status != 'none' && item.status == 'transporting'">运输中</view>
						<view class="status-badge delivered" v-else-if="item.status == 'delivered'">已签收</view>
						<view class="view-title" v-if="item.status == 'none'">暂无物流信息</view>
						<text class="product-title">{{ item.title }}</text>
						<view class="view-logistics-btn" v-if="item.status == 'transporting'"
							@click="viewLogistics()">查看物流信息</view>
						<view class="view-logistics" v-if="item.status == 'delivered'">2025 03-15 15:25 已签收</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasMore: true,
				logisticsItems: [{
					id: 1,
					title: '您的快乐在路上',
					status: 'transporting', // 'transporting' 或 'delivered'
					image: '/static/logo.png'
				}],
				courier_id: '',
			};
		},
		methods: {
			viewLogistics(courierId) {
				// 查看物流详情
				console.log('查看物流详情', this.courier_id);
				// 这里可以添加跳转到物流详情页的逻辑
				uni.navigateTo({
					url: `/pages/shop/logistics-detail??kdsn=${this.courier_id}`
				});
			},
			initTicketsList() {
				// 编辑地址
				this.$http(
					'/goods/order/logisInfo', {
						courier_id: this.courier_id
					}, "GET").then(res => {
					
				}).catch(error => {
					console.error('获取优惠券列表失败:', error);
					// 即使出错也要设置加载状态为false，避免页面一直显示加载中
					this.isLoading = false;
					// 可以在这里显示错误提示
					this.tips = '获取优惠券失败，请稍后重试';
					this.tipsShow = true;
					setTimeout(() => {
						this.tipsShow = false;
					}, 3000);
				})
			},

		},
		onLoad(e) {
			// 页面加载时的逻辑
			this.courier_id = e.kdsn
			this.initTicketsList()
		},
		onReachBottom() {
			// 触底加载更多
			if (this.hasMore) {
				this.loadMoreData();
			}
		}
	};
</script>

<style scoped>
	page {
		background-color: #F3F3F3;
	}

	/* 全局样式 */
	.logistics-container {
		width: 100%;
		background-color: #F3F3F3;
	}


	/* 物流列表样式 */
	.logistics-list {
		padding: 20rpx;
	}

	.logistics-item {
		background-color: #ffffff;
		border-radius: 25rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.item-content {
		display: flex;
		align-items: center;
		padding: 20rpx;
	}

	.item-left {
		width: 200rpx;
		height: 200rpx;
		margin-right: 20rpx;
		background-color: #f9f9f9;
		border-radius: 25rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-image {
		width: 200rpx;
		height: 200rpx;
	}

	.item-middle {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.product-title {
		font-size: 28rpx;
		color: #000000;
		line-height: 40rpx;
		margin-bottom: 16rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.view-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.view-logistics {
		font-size: 20rpx;
		color: #000;
	}

	.view-logistics-btn {
		width: 180rpx;
		height: 40rpx;
		line-height: 40rpx;
		border: 1rpx solid #000000;
		border-radius: 25rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		color: #000000;
	}

	.item-right {
		margin-left: 20rpx;
	}

	.status-badge {
		padding: 8rpx 20rpx;
		border-radius: 16rpx;
		font-size: 24rpx;
		text-align: right;
	}

	.status-badge.transporting {
		color: #00AEFF;
	}

	.status-badge.delivered {
		color: #979696;
	}

	/* 加载更多样式 */
	.load-more {
		text-align: center;
		padding: 30rpx 0;
		color: #999999;
		font-size: 28rpx;
	}
</style>