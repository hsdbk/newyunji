<template>
	<view class="ad-container">
		<view class="video-wrapper">
			<!-- :controls="false" -->
			<video id="myVideo" ref="videoRef" :src="cover" :autoplay="false" :loop="true" class="fullscreen-video"
				@error="videoErrorCallback" @play="onVideoPlay" @pause="onVideoPause" @ended="onVideoEnd"
				@loadedmetadata="onLoadedMetadata" @waiting="onVideoWaiting" @loadeddata="onVideoLoadedData"
				@timeupdate="onTimeUpdate"></video>
			<view class="countdownSeconds">
				<!-- 添加返回按钮 -->
				<view class="back-button">
					<image class="back-icon" :src="$getStaticSrc('/static/my/back.png')" @click="goBack"></image>
				</view>

				<view class="countdown-content" v-if="showCountdown">
						{{ countdownSeconds }}
						<text class="countdown-label">秒后获得奖励</text>
					</view>
				<view class="countdown-content" v-if="showSkipButton" @click="skipVideo">跳过</view>
			</view>

			<!-- 添加用户交互播放按钮 -->
			<!-- <view class="play-overlay" @tap="triggerPlay">
                <view class="play-button">
                    <text>点击播放</text>
                </view>
            </view> -->
			<!-- 加载遮罩 -->
			<view class="loading-overlay" v-if="isLoading">
				<text>广告加载中...</text>
			</view>
			<!-- 错误提示 -->
			<view class="error-overlay" v-if="hasError">
				<text>{{ errorMessage }}</text>
				<button @tap="retryLoadVideo" class="retry-button">重试</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 倒计时相关
				countdownSeconds: 0, // 广告播放时长（秒）
				totalSeconds: 0, // 总时长（用于计算进度）
				countdownTimer: null, // 倒计时定时器
				duration_sec: 0, // 广告播放时长（秒）
				skipTimer: null, // 控制跳过按钮显示的定时器
				// 状态控制
				isLoading: true, // 广告加载状态，初始设为true
				canClaimReward: false, // 是否可以领取奖励
				hasClaimedReward: false, // 是否已领取奖励
				hasVideoSource: false, // 是否有视频源
				showSkipButton: false, // 是否显示跳过按钮
				hasError: false, // 是否有错误
				errorMessage: '', // 错误信息
				autoplay: true, // 是否自动播放
				showPlayPrompt: false, // 是否显示播放提示
				videoAttempts: 0, // 视频加载尝试次数
				maxAttempts: 3, // 最大尝试次数
				showCountdown: true, // 是否显示倒计时区域

				// 奖励信息
				rewardAmount: 100, // 奖励金币数量

				// 进度条百分比
				progressPercentage: 0,
				// 默认测试视频源
				defaultVideoSrcs: [
					'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
				],
				currentSrcIndex: 0,
				cover: '',
				watch: 0,
				type: 0,
				ad_id: 0,
				uniq_key: '',
			};
		},

		onLoad(e) {
			// 获取广告视频
		
			this.watch = e.watch;
			this.type = e.type;
			// 监听屏幕方向变化
			uni.onWindowResize(this.onWindowResize);
		},
		onShow() {
			this.taskBtn(this.watch,this.type);
		},

		onUnload() {
			// 清除定时器，防止内存泄漏
			if (this.skipTimer) {
				clearTimeout(this.skipTimer);
				this.skipTimer = null;
			}
			// 移除屏幕方向监听
			uni.offWindowResize(this.onWindowResize);
		},

		methods: {
			// 添加返回上级页面的方法
			// 修改goBack方法，添加奖励获取状态判断
			goBack() {
				// 判断是否已经获得奖励或可以领取奖励
				if (!this.hasClaimedReward && !this.canClaimReward) {
					// 如果还没有获得奖励，显示确认对话框
					uni.showModal({
						title: '确认退出',
						content: '您还没有获得奖励，确定要退出吗？',
						success: (res) => {
							if (res.confirm) {
								// 用户确认退出，执行返回操作
								uni.navigateBack();
							}
							// 用户取消退出，则不执行任何操作
						}
					});
				} else {
					// 已经获得奖励或倒计时已结束，可以直接返回
					uni.navigateBack();
				}
			},
			taskBtn(w, t) {
				this.isLoading = true;
				this.hasError = false;
				this.showPlayPrompt = false;

				// 编辑地址
				this.$http(
						'/api/ad/next', {
							watch_tier: w,
							type: t
						}, "GET")
					.then(res => {
						this.isLoading = false;
						// 验证返回的数据是否有效
						// if (res.data && res.data.ad && res.data.ad.cover) {
						if (res.data && res.data.ad) {
							this.cover = this.$baseUrl + res.data.ad.video_url;
							console.log('cover', this.cover)
							this.duration_sec = res.data.ad.skip_after_sec;
							this.totalSeconds = res.data.ad.duration_sec; // 确保totalSeconds初始化为广告时长
							this.countdownSeconds = this.totalSeconds; // 同步更新countdownSeconds
							this.ad_id = res.data.ad.id;
							this.uniq_key = res.data.uniq_key;
							// 重置尝试次数
							this.videoAttempts = 0;
							// 尝试播放视频
							this.attemptPlay();
						} else {
							// 如果API返回的数据无效，使用默认视频源
							console.warn('API returned invalid ad data, using default video');
							this.handleVideoError('广告数据无效，使用默认视频');
						}
					})
					.catch(err => {
						this.isLoading = false;
						console.error('Failed to load ad:', err);
						// 显示错误信息并保持使用默认视频源
						this.handleVideoError('广告加载失败，使用默认视频');
					});
			},

			videoErrorCallback: function(e) {
				// const errorMsg = e.target.errMsg || '视频播放错误';
				// console.error('Video error:', errorMsg);

				// // 增加错误处理的详细信息
				// let detailedErrorMsg = '视频播放错误';
				// if (errorMsg.includes('MEDIA_ERR_SRC_NOT_SUPPORTED')) {
				//     detailedErrorMsg = '视频格式不支持，请尝试其他视频';
				//     this.switchToNextDefaultSrc();
				// } else if (errorMsg.includes('MEDIA_ERR_DECODE')) {
				//     detailedErrorMsg = '视频解码失败，请重试';
				// } else if (errorMsg.includes('MEDIA_ERR_NETWORK')) {
				//     detailedErrorMsg = '网络连接异常，请检查网络';
				// }

				// this.handleVideoError(detailedErrorMsg);

				// 显示错误提示
				// uni.showModal({
				//     content: detailedErrorMsg,
				//     showCancel: false
				// });
			},

			// 处理视频错误
			handleVideoError(message) {
				this.hasError = true;
				this.errorMessage = message;
				this.showPlayPrompt = true;

				// 如果当前不是默认视频源，则切换到默认视频源
				if (!this.defaultVideoSrcs.includes(this.cover)) {
					this.cover = this.defaultVideoSrcs[this.currentSrcIndex];
				}
			},

			// 切换到下一个默认视频源
			switchToNextDefaultSrc() {
				this.videoAttempts++;
				if (this.videoAttempts < this.maxAttempts) {
					this.currentSrcIndex = (this.currentSrcIndex + 1) % this.defaultVideoSrcs.length;
					this.cover = this.defaultVideoSrcs[this.currentSrcIndex];
					// 延迟后尝试播放
					setTimeout(() => {
						this.attemptPlay();
					}, 1000);
				} else {
					this.handleVideoError('所有视频源均无法播放，请稍后再试');
				}
			},

			// 尝试播放视频
			attemptPlay() {
				// 先停止任何正在播放的视频
				this.stopVideo();

				// 延迟一小段时间后尝试播放，确保视频元素已准备好
				setTimeout(() => {
					this.triggerPlay();
				}, 500);
			},

			// 触发播放（通过用户交互）
			triggerPlay() {
				// 隐藏错误和播放提示
				this.hasError = false;
				this.showPlayPrompt = false;
				this.countdownSeconds = this.totalSeconds;
				// 使用refs获取视频元素并尝试播放
				if (this.$refs.videoRef) {
					const videoContext = uni.createVideoContext('myVideo', this);
					videoContext.play().catch(err => {
						console.error('Play failed:', err);
						this.handleVideoError('视频播放失败，请点击重试');
					});
				} else {
					console.warn('Video element not found');
					this.handleVideoError('视频元素未找到');
				}
			},
			loadAdverties() {
				this.isLoading = true;
				this.hasClaimedReward = true;
				this.canClaimReward = true;
				// 编辑地址
				this.$http(
					'/api/ad/complete', {
						ad_id: this.ad_id,
						watch_tier: this.watch,
						uniq_key: this.uniq_key,
					}, "POST").then(res => {
					this.isLoading = false;
					uni.showToast({
						title: '领取成功~',
						icon: 'none'
					});
					// setTimeout(() => {
					//     uni.navigateBack();
					// }, 3000);


				})
			},
			// 停止视频播放
			stopVideo() {
				if (this.$refs.videoRef) {
					const videoContext = uni.createVideoContext('myVideo', this);
					videoContext.stop();
				}
			},

			// 重试加载视频
			retryLoadVideo() {
				// 重置状态
				this.videoAttempts = 0;
				this.currentSrcIndex = 0;
				this.cover = this.defaultVideoSrcs[0];

				// 重新加载当前页面
				uni.redirectTo({
					url: '/pages/index/video.vue'
				});
			},

			// 视频开始播放
			// 修改onVideoPlay方法，添加跳过按钮显示的逻辑
			onVideoPlay() {
				console.log('视频开始播放');
				this.hasError = false;
				this.showPlayPrompt = false;

				// 初始隐藏跳过按钮
				this.showSkipButton = false;

				// 初始化倒计时
				if (this.totalSeconds > 0) {
					this.countdownSeconds = this.totalSeconds;

					// 清除之前的定时器（如果存在）
					if (this.countdownTimer) {
						clearInterval(this.countdownTimer);
						this.countdownTimer = null;
					}
					if (this.skipTimer) {
						clearTimeout(this.skipTimer);
					}

					// 设置跳过按钮显示的定时器
					// 如果duration_sec大于0，则使用它；否则默认5秒后显示跳过按钮
					const skipDelay = this.duration_sec > 0 ? this.duration_sec : 20;
					this.skipTimer = setTimeout(() => {
						this.showSkipButton = true;
						// this.skipVideo()
						this.loadAdverties();
					}, skipDelay * 1000);
				}

				// 自动旋转到合适的方向
				this.autoRotateScreen();
			},
			// 添加跳过视频的方法
			skipVideo() {
				// 清除定时器
				if (this.skipTimer) {
					clearTimeout(this.skipTimer);
					this.skipTimer = null;
				}
				console.log('111')
				uni.navigateBack();
				// this.loadAdverties();
			},

			// 修改onVideoPause方法，暂停时清除定时器
			onVideoPause() {
				console.log('视频暂停');
				// 暂停时清除跳过按钮定时器
				if (this.skipTimer) {
					clearTimeout(this.skipTimer);
					this.skipTimer = null;
				}
			},

			// 修改onVideoEnd方法，结束时清除定时器
			onVideoEnd() {
				console.log('视频播放结束');
				// 清除定时器
				if (this.skipTimer) {
					clearTimeout(this.skipTimer);
					this.skipTimer = null;
				}
				// 可以在这里处理视频结束后的逻辑，比如显示奖励领取按钮
				this.canClaimReward = true;
				this.showSkipButton = false; // 视频结束后隐藏跳过按钮
				this.countdownSeconds = 0; // 确保倒计时显示为0
				this.showCountdown = false; // 隐藏倒计时显示区域
			},

			// 视频元数据加载完成
			onLoadedMetadata(e) {
				console.log('视频元数据加载完成', e);
				this.hasVideoSource = true;
				// 获取视频实际时长
				if (e.detail && e.detail.duration) {
					this.totalSeconds = Math.ceil(e.detail.duration);
					this.countdownSeconds = this.totalSeconds;
				}
			},

			// 视频加载中
			onVideoWaiting() {
				console.log('视频加载中...');
			},

			// 视频数据加载完成
			onVideoLoadedData() {
				console.log('视频数据加载完成');
			},

			// 视频播放时间更新
			// 完善onTimeUpdate方法的倒计时逻辑
			onTimeUpdate(e) {
				if (e.detail && e.detail.currentTime && this.totalSeconds > 0) {
					// 更新进度条百分比
					this.progressPercentage = (e.detail.currentTime / this.totalSeconds) * 100;

					// 使用视频实际播放时间更新倒计时
					const remainingSeconds = Math.max(0, Math.floor(this.totalSeconds - e.detail.currentTime));
					if (remainingSeconds !== this.countdownSeconds) {
						this.countdownSeconds = remainingSeconds;
						// 当倒计时为0时，可以显示奖励领取按钮
						if (remainingSeconds === 0) {
							this.canClaimReward = true;
							// 隐藏倒计时显示区域
							this.showCountdown = false;
							// 清除定时器
							if (this.countdownTimer) {
								clearInterval(this.countdownTimer);
								this.countdownTimer = null;
							}
						}
					}
				}
			},

			// 屏幕尺寸变化
			onWindowResize() {
				// 调整视频尺寸以适应屏幕变化
				this.resizeVideo();
			},

			// 自动旋转屏幕到合适的方向
			autoRotateScreen() {
				// 这里可以添加根据视频宽高比自动旋转屏幕的逻辑
				// 由于不同平台的实现差异，具体实现可能需要根据实际需求调整
			},

			// 调整视频尺寸
			resizeVideo() {
				// 在uni-app中，尽量使用uni.createSelectorQuery替代document.getElementById
				uni.createSelectorQuery().select('#myVideo').boundingClientRect(res => {
					if (res) {
						// 可以在这里添加更复杂的视频尺寸调整逻辑
						console.log('Video dimensions:', res.width, res.height);
					}
				}).exec();
			}
		}
	};
</script>

<style lang="scss">
	/* 全局样式重置 */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/* 页面容器设置为全屏 */
	page {
		width: 100vw;
		height: 100vh;
		background-color: #000;
	}

	.ad-container {
		width: 100vw;
		height: 100vh;
		background-color: #000;
		overflow: hidden;
	}

	.video-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 视频样式设置为自适应全屏 */
	.fullscreen-video {
		width: 100vw;
		height: 100vh;
		object-fit: contain;
		/* 保持视频原始比例，适配屏幕 */
		background-color: #000;
	}

	/* 加载遮罩样式 */
	.loading-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.loading-indicator {
		color: #fff;
		font-size: 32rpx;
	}

	/* 错误提示样式 */
	.error-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		padding: 30rpx;
		border-radius: 10rpx;
		text-align: center;
		z-index: 1000;
	}

	.retry-button,
	.play-button {
		margin-top: 20rpx;
		background-color: #007aff;
		color: #fff;
		border: none;
		padding: 10rpx 30rpx;
		border-radius: 5rpx;
		font-size: 28rpx;
	}

	.play-button {
		margin-left: 20rpx;
	}

	/* 播放提示样式 */
	.play-prompt {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 998;
	}

	.big-play-button {
		background-color: rgba(0, 0, 0, 0.6);
		color: #fff;
		border: 2rpx solid #fff;
		padding: 40rpx 80rpx;
		border-radius: 15rpx;
		font-size: 36rpx;
	}

	.countdownSeconds {
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 12;
		background-color: rgba(255, 255, 255, 0.8);
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	/* 添加返回按钮样式 */
	.back-button {
		padding: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-arrow {
		font-size: 48rpx;
		color: #333;
		font-weight: bold;
	}

	.countdown-content {
		padding: 20rpx 40rpx;
		font-size: 36rpx;
		color: #333;
	}

	.play-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	.play-button {
		position: fixed;
		bottom: 200rpx;
		left: 0;
		width: 200rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;

	}

	.play-button text {
		color: #333;
		font-size: 28rpx;
	}

	.loading-overlay {
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

	.loading-overlay text {
		color: white;
		font-size: 32rpx;
	}

	.error-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 10;
		padding: 40rpx;
	}

	.error-overlay text {
		color: white;
		font-size: 32rpx;
		margin-bottom: 40rpx;
		text-align: center;
	}

	.retry-button {
		background-color: #07c160;
		color: white;
		padding: 20rpx 40rpx;
		border-radius: 8rpx;
	}

	/* 适配横屏和竖屏 */
	@media (orientation: landscape) {
		.fullscreen-video {
			/* 横屏时的特殊样式 */
			max-width: 100vh;
			/* 防止在宽屏设备上视频过宽 */
		}
	}

	@media (orientation: portrait) {
		.fullscreen-video {
			/* 竖屏时的特殊样式 */
			max-height: 100vh;
		}
	}

	/* 适配不同尺寸的设备 */
	@media screen and (max-width: 320px) {

		.loading-indicator,
		.error-message,
		.big-play-button {
			font-size: 28rpx;
		}
	}

	@media screen and (min-width: 768px) {

		.loading-indicator,
		.error-message,
		.big-play-button {
			font-size: 36rpx;
		}
	}

	.back-icon {
		width: 12rpx;
		height: 24rpx;
	}
</style>