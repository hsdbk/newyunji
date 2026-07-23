<template>
	<view class="video-player-page">
		<!-- 视频播放器 -->
		<video
			class="video"
			:src="videoUrl"
			:poster="videoCover"
			:controls="false"
			:autoplay="true"
			@loadedmetadata="onLoadedMetadata"
			@timeupdate="onTimeUpdate"
			@waiting="onWaiting"
			@play="onPlay"
			@pause="onPause"
			@ended="onEnded"
			@exitfullscreen="onExitFullScreen"
			ref="videoPlayer"
		></video>
		
		<!-- 自定义控制层 -->
		<view class="custom-controls" v-if="isVideoLoaded">
			<!-- 进度条 -->
			<view class="progress-bar" @click="onProgressBarClick">
				<view class="progress-played" :style="{ width: playedPercent + '%' }"></view>
				<view class="progress-thumb" :style="{ left: playedPercent + '%' }"></view>
			</view>
			
			<!-- 控制按钮组 -->
			<view class="controls-group">
				<text class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</text>
				<view class="btn-group">
					<button class="control-btn" @click="togglePlayPause">
						<text class="iconfont">isPlaying</text>
					</button>
					<button class="control-btn" @click="toggleScreenOrientation">
						<text class="iconfont">isLandscape</text>
					</button>
				</view>
			</view>
		</view>
		
		<!-- 加载动画 -->
		<view class="loading-mask" v-if="isLoading">
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 视频源 (使用在线示例视频)
			videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
			// 视频封面图
			videoCover: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/hello-uniapp.jpg',
			
			// 视频状态
			isVideoLoaded: false,
			isPlaying: false,
			isLoading: false,
			isLandscape: true, // 默认为横屏
			
			// 视频进度
			currentTime: 0,
			duration: 0,
			playedPercent: 0,
			
			videoContext: null
		};
	},
	onReady() {
		// 获取 video 组件上下文
		this.videoContext = uni.createVideoContext('videoPlayer', this);
		
		// 页面加载后自动请求全屏（默认为横屏）
		this.requestFullScreen(true);
	},
	methods: {
		/**
		 * 请求全屏播放
		 * @param {boolean} isLandscape - 是否为横屏
		 */
		requestFullScreen(isLandscape) {
			this.isLandscape = isLandscape;
			const direction = isLandscape ? 90 : 0; // 90=横屏, 0=竖屏
			this.videoContext.requestFullScreen({ direction });
		},
		
		/**
		 * 切换屏幕方向（横屏/竖屏）
		 */
		toggleScreenOrientation() {
			console.log('toggleScreenOrientation')
			// 关键：先退出全屏，再以相反的方向重新进入全屏
			this.videoContext.exitfullscreen();
			
			// 使用 setTimeout 确保退出全屏的动画完成后再请求新的全屏
			setTimeout(() => {
				this.requestFullScreen(!this.isLandscape);
			}, 300);
		},
		
		/**
		 * 视频元数据加载完成
		 */
		onLoadedMetadata(e) {
			this.isVideoLoaded = true;
			this.duration = e.detail.duration;
		},
		
		/**
		 * 视频播放位置更新
		 */
		onTimeUpdate(e) {
			this.currentTime = e.detail.currentTime;
			this.playedPercent = (this.currentTime / this.duration) * 100;
		},
		
		/**
		 * 视频加载中
		 */
		onWaiting() {
			this.isLoading = true;
		},
		
		/**
		 * 视频播放
		 */
		onPlay() {
			this.isPlaying = true;
			this.isLoading = false;
		},
		
		/**
		 * 视频暂停
		 */
		onPause() {
			this.isPlaying = false;
		},
		
		/**
		 * 视频播放结束
		 */
		onEnded() {
			this.isPlaying = false;
			this.currentTime = 0;
			this.playedPercent = 0;
		},
		
		/**
		 * 退出全屏时触发
		 */
		onExitFullScreen() {
			console.log('已退出全屏');
			// 用户手动点击退出全屏按钮时，返回上一页
			uni.navigateBack({
				delta: 1
			});
		},
		
		/**
		 * 切换播放/暂停
		 */
		togglePlayPause() {
			this.isPlaying = !this.isPlaying
			this.isPlaying ? this.videoContext.pause() : this.videoContext.play();
		},
		
		/**
		 * 点击进度条跳转
		 */
		onProgressBarClick(e) {
			const { clientX, currentTarget } = e;
			const rect = currentTarget.getBoundingClientRect();
			const clickPercent = (clientX - rect.left) / rect.width;
			this.videoContext.seek(clickPercent * this.duration);
		},
		
		/**
		 * 格式化时间
		 */
		formatTime(seconds) {
			if (!seconds || isNaN(seconds)) return '00:00';
			const minutes = Math.floor(seconds / 60);
			const remainingSeconds = Math.floor(seconds % 60);
			return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
		}
	}
};
</script>

<style lang="scss" scoped>
.video-player-page {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000;
	overflow: hidden;
}

.video {
	width: 100%;
	height: 100%;
	object-fit: contain; /* 保持视频比例，避免拉伸 */
}

.loading-mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 10;
}

.custom-controls {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx;
	background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
	color: #fff;
	z-index: 5;
	
	.progress-bar {
		position: relative;
		height: 6rpx;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 3rpx;
		margin-bottom: 15rpx;
		
		.progress-played {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			background-color: #007aff;
			border-radius: 3rpx;
		}
		
		.progress-thumb {
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 16rpx;
			height: 16rpx;
			background-color: #007aff;
			border-radius: 50%;
			box-shadow: 0 0 10rpx rgba(0, 122, 255, 0.8);
		}
	}
	
	.controls-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.time-display {
			font-size: 24rpx;
			color: #eee;
			/* 在竖屏时可能会溢出，添加省略号 */
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		
		.btn-group {
			display: flex;
		}
		
		.control-btn {
			background: none;
			border: none;
			color: #fff;
			padding: 0;
			margin-left: 25rpx;
			
			.iconfont {
				font-size: 36rpx;
				font-family: "iconfont" !important;
				font-style: normal;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}
		}
	}
}
</style>