<template>
	<view class="message-container">
		<!-- 消息列表 -->
		<view class="message-list">
			<!-- 下拉刷新区域 -->
			<scroll-view 
				class="message-scroll" 
				enable-back-to-top 
				@scrolltolower="loadMore"
				@refresherpulling="onPulling"
				@refresherrefresh="onRefresh"
				enable-refresher="true"
				scroll-y="true"
			>
				<!-- 消息列表项 -->
				<view 
					v-for="item in messages" 
					:key="item.id" 
					class="message-item"
					:class="{'read': item.read}"
					@click="viewMessage(item)"
				>
					<!-- 消息状态指示器 -->
					<view class="message-status" v-if="!item.is_read"></view>
					
					<!-- 消息内容 -->
					<view class="message-content">
						<view class="message-title">{{ item.name }}</view>
						<!-- <view class="message-body">{{ item.content }}</view> -->
						<view class="message-time">{{ formatTime(item.addtime_date) }}</view>
					</view>
				</view>

				<!-- 加载更多提示 -->
				<view class="load-more" v-if="hasMore">
					<text>{{ isLoading ? '加载中...' : '上拉加载更多' }}</text>
				</view>
				<view class="no-more" v-else-if="messages.length > 0">
					<text>没有更多消息了</text>
				</view>
				<view class="empty-message" v-else>
					<image :src="$getStaticSrc('/static/my/empty.png')" mode="aspectFit" class="empty-icon"></image>
					<text>暂无消息</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'

export default {
	data() {
		return {
			messages: [], // 消息列表
			currentPage: 1, // 当前页码
			pageSize: 10, // 每页条数
			hasMore: true, // 是否有更多数据
			isLoading: false, // 是否正在加载
			refreshing: false // 是否正在刷新
		}
	},
	computed: {
		...mapState(['userInfo', 'isLoggedIn', 'config'])
	},
	onLoad() {
		// 页面加载时获取消息列表
		// this.fetchMessages()
		
		// 监听消息已读事件
		uni.$on('messageRead', this.handleMessageRead)
	},
	
	onUnload() {
		// 页面卸载时移除事件监听
		uni.$off('messageRead', this.handleMessageRead)
	},
	onShow() {
		// 页面显示时重新加载最新消息列表，确保从详情页返回时数据刷新
		// 重置参数
		this.currentPage = 1
		this.hasMore = true
		this.isLoading = false
		
		// 强制重新获取数据
		this.fetchMessages()
	},
	methods: {
		// 返回上一页
		goBack() {
			uni.navigateBack()
		},
		
		// 格式化时间
		formatTime(time) {
			if (!time) return ''
			
			// 简化的时间格式化，实际项目中可以使用更完善的格式化方法
			const date = new Date(time)
			const now = new Date()
			const diff = now - date
			
			// 小于1分钟
			if (diff < 60 * 1000) {
				return '刚刚'
			}
			
			// 小于1小时
			if (diff < 60 * 60 * 1000) {
				return Math.floor(diff / (60 * 1000)) + '分钟前'
			}
			
			// 小于24小时
			if (diff < 24 * 60 * 60 * 1000) {
				return Math.floor(diff / (60 * 60 * 1000)) + '小时前'
			}
			
			// 小于7天
			if (diff < 7 * 24 * 60 * 60 * 1000) {
				return Math.floor(diff / (24 * 60 * 60 * 1000)) + '天前'
			}
			
			// 超过7天，显示完整日期
			return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
		},
		
		// 获取消息列表
		fetchMessages() {
			// 防止重复加载或没有更多数据时继续加载
			if (this.isLoading || !this.hasMore) return

			// 设置加载状态
			this.isLoading = true

			// 发送请求获取消息数据
			this.$http(
				'/user/noticeread/search', {
				page_num: this.pageSize,
				page_current: this.currentPage
			}, "GET")
				.then(res => {
					// 请求成功
					if (res && res.data && res.data.list) {
						// 如果是刷新，则替换数据；否则追加数据
						if (this.currentPage === 1) {
							this.messages = res.data.list
						} else {
							this.messages = [...this.messages, ...res.data.list]
						}

						// 判断是否还有更多数据
						this.hasMore = res.data.list.length === this.pageSize

						// 如果有更多数据，增加页码以便下次加载
						if (this.hasMore) {
							this.currentPage++
						}
					}
				}) 
				.catch(err => {
					console.error('获取消息列表失败:', err)
				}) 
				.finally(() => {
					// 结束加载状态
					this.isLoading = false
					this.refreshing = false
				})
		},
		
		// 加载更多
		loadMore() {
			if (!this.isLoading && this.hasMore) {
				this.fetchMessages()
			}
		},
		
		// 下拉刷新
		onPulling() {
			// 下拉刷新中...
		},
		
		onRefresh() {
			// 重置参数
			this.currentPage = 1
			this.hasMore = true
			this.refreshing = true
			
			// 重新获取数据
			this.fetchMessages()
		},
		
		// 查看消息详情
		viewMessage(item) {
			// 实际项目中可以跳转到消息详情页
			uni.navigateTo({
				url: '/pages/my/message-detail?id=' + item.cid
			})
		},
		
		// 处理消息已读事件
		handleMessageRead(cid) {
			// 找到对应的消息并更新状态
			const index = this.messages.findIndex(item => item.cid === cid)
			if (index !== -1) {
				// 更新本地消息状态为已读
				this.$set(this.messages[index], 'is_read', 1)
				this.$set(this.messages[index], 'read', true)
			}
		}
	}
}
</script>

<style scoped>
.message-container {
	width: 100%;
	min-height: 100vh;
	background-color: #f5f5f5;
}

/* 页面头部 */
.header {
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	box-sizing: border-box;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.header-left,
.header-right {
	width: 60rpx;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.back-icon {
	width: 30rpx;
	height: 30rpx;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
}

/* 消息列表 */
.message-list {
	padding: 20rpx;
	box-sizing: border-box;
}

.message-scroll {
	width: 100%;
	min-height: calc(100vh - 100rpx);
}

/* 消息列表项 */
.message-item {
	width: 100%;
	height: auto;
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-sizing: border-box;
	margin-bottom: 20rpx;
	display: flex;
	position: relative;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

/* 未读消息样式 */
.message-item:not(.read) {
	border-left: 8rpx solid #ff6b35;
}

/* 消息状态指示器 */
.message-status {
	width: 20rpx;
	height: 20rpx;
	background-color: #ff6b35;
	border-radius: 50%;
	position: absolute;
	top: 60rpx;
	right: 30rpx;
}

/* 消息内容 */
.message-content {
	width: 100%;
	margin-left: 20rpx;
}

.message-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.message-body {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 15rpx;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	line-height: 1.5;
}

.message-time {
	font-size: 24rpx;
	color: #999999;
}

/* 已读消息样式 */
.message-item.read .message-title {
	color: #999999;
}

.message-item.read .message-body {
	color: #999999;
}

/* 加载更多 */
.load-more,
.no-more {
	text-align: center;
	padding: 30rpx 0;
	font-size: 28rpx;
	color: #999999;
}

/* 空消息状态 */
.empty-message {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 100rpx 0;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 30rpx;
}

.empty-message text {
	font-size: 30rpx;
	color: #999999;
}
</style>