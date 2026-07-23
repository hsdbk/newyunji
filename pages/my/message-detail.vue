<template>
	<view class="message-detail-container">
		<!-- 消息标题 -->
		<view class="message-header">
			<view class="message-title">{{ message.name }}</view>
			<view class="message-time">{{ formatTime(message.addtime_date) }}</view>
		</view>
		
		<!-- 消息内容 -->
		<view class="message-content">
			<up-parse :content="$completeImageUrls(message.content)"></up-parse>
		</view>
		
		<!-- 加载提示 -->
		<u-loadmore 
			:status="loadStatus" 
			:load-text="{loading: '加载中...', complete: '加载完成', fail: '加载失败'}"
			v-if="loadStatus !== 'none'"
		>
		</u-loadmore>
	</view>
</template>

<script>

export default {
	data() {
		return {
			message: {
				title: '',
				content: '',
				create_time: '',
				is_read: 0
			},
			loadStatus: 'none' // none, loading, complete, fail
		}
	},
	onLoad(e) {
		// 设置导航栏标题
		uni.setNavigationBarTitle({
			title: '消息详情'
		});
		// this.message = uni.getStorageSync('read')
		// 调用接口获取消息详情
		this.getMessageDetail(e.id);
	},
	methods: {
		getMessageDetail(id) {
			this.loadStatus = 'loading';
			
			// 调用接口获取消息详情
			this.$http('/user/notice/view', { id }, "POST").then(res => {
				if (res.code === 200) {
					this.message = res.data.view;
					this.loadStatus = 'complete';
					
					// 如果消息未读，标记为已读
					if (this.message.is_read === 0) {
						this.markAsRead(id);
					}
				} else {
					uni.showToast({
						title: res.msg || '获取消息详情失败',
						icon: 'none'
					});
					this.loadStatus = 'fail';
				}
			}).catch(err => {
				console.error('获取消息详情失败:', err);
				uni.showToast({
					title: '网络错误，请稍后重试',
					icon: 'none'
				});
				this.loadStatus = 'fail';
			});
		},
		
		// 标记消息为已读
		markAsRead(id) {
			this.$http('/user/notice/read', { id }, "POST").then(res => {
				if (res.code === 200) {
					// 更新消息状态
					this.message.is_read = 1;
					// 触发页面刷新事件，让消息列表页面更新
					uni.$emit('messageRead', id);
				}
			}).catch(err => {
				console.error('标记消息为已读失败:', err);
			});
		},
		
		// 格式化时间
		formatTime(time) {
			if (!time) return '';
			const date = new Date(time);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		}
	}
}
</script>

<style scoped>
.message-detail-container {
	padding: 20rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.message-header {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.message-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
	word-break: break-word;
}

.message-time {
	font-size: 24rpx;
	color: #999;
}

.message-content {
	background-color: #fff;
	padding: 30rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 富文本内容样式 */
.message-content :deep(p) {
	margin-bottom: 20rpx;
	line-height: 1.6;
}

.message-content :deep(img) {
	max-width: 100%;
	height: auto;
	margin: 20rpx 0;
}

.message-content :deep(a) {
	color: #1989fa;
}
</style>