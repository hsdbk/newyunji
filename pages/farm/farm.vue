<template>
	<view class="farm-container">
		<up-navbar @leftClick="uni.navigateBack({delta: 1});" title="" titleStyle="color:#fff;" bgColor="transparent" :left-show="true" :right-show="false" :safeAreaInsetTop="true">
		
		</up-navbar>
		<!-- 加载中显示 -->
		<view v-if="isLoading" class="loading-container">
			<view class="loading-spinner">
				<image :src="$getStaticSrc('/static/farm/loading.png')" mode="aspectFit" class="loading-icon"></image>
			</view>
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 农场主背景 -->
		<image class="farm-background" @click="closeFriendPopup" :src="$getStaticSrc('/static/farm/back1.png')" mode="aspectFill"></image>

		<!-- 兔子角色 -->
		<!-- <image class="rabbit" src="/static/farm/rabbit.png" mode="aspectFit" :animation="rabbitAnimationData"></image> -->
		<!-- <image class="rabbit-back" src="/static/farm/rabbit-back.png" mode="aspectFit"></image> -->
		<view class="line-progress-info">
			<view class="line-progress">
				<view class="progress-container">
					<image :src="$getStaticSrc('/static/farm/line-progress.png')" mode="aspectFill" class="progress-bg"></image>
					<image :src="$getStaticSrc('/static/farm/line-progress-active.png')" mode="aspectFill" class="progress-active"
						:style="{ width: progressWidth }"></image>
					<text class="progress-text">{{ progressValue }}%</text>
				</view>
				<!-- 植物生长区域 -->
				<view class="plant-area">
					<image v-if="isTreeDataLoaded" :src="currentTreeImage" mode="aspectFit" class="tree"
						:animation="treeAnimationData" :style="treeSize">
					</image>

					<!-- <image v-if="showWaterAnimation" src="/static/farm/water1.png" mode="aspectFit" class="water-animation">
          </image> -->
					<!-- 雨滴显示 -->
					<view v-if="showWaterAnimation" class="droplets-container">
						<image v-for="(droplet, index) in droplets" :key="droplet.id" :src="$getStaticSrc('/static/farm/droplet.png')"
							mode="aspectFit" class="droplet" :style="{ left: droplet.left, top: droplet.top }"
							:animation="droplet.animation"></image>
					</view>
					<!-- 金币显示 - 仅在植物成熟时显示 -->
					<view v-if="plantStage === 5" class="coins-container" @click.stop="coinsChange">
						<image v-for="(coin, index) in coins" :key="coin.id" :src="$getStaticSrc('/static/task/yun-rain.png')"
							mode="aspectFit" class="coin" :style="{ left: coin.left, top: coin.top }"
							:animation="coin.animation"></image>
					</view>
				</view>
			</view>
			<view class="line-progress-time">剩余成熟时间: {{ remainingTime }}</view>
		</view>


		<!-- 底部功能按钮 -->
		<view class="water-button" @click="waterChange">
			<image :src="$getStaticSrc('/static/farm/water1.png')" mode="aspectFit" class="water-teapot-icon" :animation="waterTeapotAnimationData"></image>
			<view class="water-text-container">
				<image :src="$getStaticSrc('/static/farm/water-back.png')" mode="aspectFit" class="water-bg-icon"></image>
				<text class="water-text">浇水</text>
			</view>
			<text class="water-countdown">{{ remainingWaterTime }}</text>
		</view>

		<view class="friend-button">
			<view class="friend-box">
				<view class="friend-info" @click="showFriendList = !showFriendList">
					<image :src="$getStaticSrc('/static/farm/friend-back-more.png')" mode="aspectFit" class="friend-icon"></image>
					<view class="friend-box"><text class="friend-text">好友列表</text></view>
				</view>
				<view v-if="showFriendList" class="friend-more-box">
					<image :src="$getStaticSrc('/static/farm/more.png')" mode="aspectFit" class="friend-more"></image>
				</view>
				<view v-if="showFriendList" class="friend-list">
					<image class="friend-list-bg" :src="$getStaticSrc('/static/farm/friend-back.png')" mode="aspectFit"></image>
					<view class="friend-items">
						<view v-for="(friend, index) in friends" :key="index" class="friend-item"
							@click="showFriendPopup(index, friend)">
							<image :src="friend.avatar ? $baseUrl + friend.avatar : '/static/logo.png'"
								mode="aspectFit" class="friend-avatar"></image>
							<image v-if="friend.need_help" class="friend-tips" :src="$getStaticSrc('/static/farm/message-tip.png')">
							</image>
							<text class="friend-name">{{friend.nick_name}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 好友列表 -->

		<!-- 好友弹窗 -->
		<view v-if="showFriendPopupFlag" class="friend-popup" :style="popupStyle">
			<image class="friend-popup-bg" :src="$getStaticSrc('/static/farm/message.png')" mode="aspectFit"></image>
			<view class="friend-popup-box">
				<view class="friend-popup-item" @click="showFriendHelpSuccessMessage">
					<image class="friend-popup-icon" :src="$getStaticSrc('/static/farm/help.png')" mode="aspectFit"></image>
					<text>求助</text>
				</view>
				<view class="friend-popup-item" @click="showFriendFreeWateringMessage">
					<image class="friend-popup-icon" :src="$getStaticSrc('/static/farm/gift.png')" mode="aspectFit"></image>
					<text>赠送</text>
				</view>
				<view class="friend-popup-item" @click="showFriendHelpWateringMessage">
					<image class="friend-popup-icon" :src="$getStaticSrc('/static/farm/water.png')" mode="aspectFit"></image>
					<text>帮助</text>
				</view>
			</view>
		</view>
		<!-- 树苗升级/成熟弹窗 -->
		<view v-if="showTreePopup" class="coin-popup">
			<view class="coin-popup-content">
				<view class="coin-popup-close" @click="closeTreePopup">×</view>
				<view class="coin-popup-icon">
					<image :src="currentTreeImage" mode="aspectFit" class="tree"></image>
				</view>
				<text class="coin-popup-text" v-if="!isTreeMature">树苗升级啦</text>
				<text class="coin-popup-text" v-else>植物成熟啦</text>
				<button class="coin-popup-button" @click="closeTreePopup">确认</button>
			</view>
		</view>
		<!-- 金币收集成功弹窗 -->
		<view v-if="showCoinPopup" class="coin-popup">
			<view class="coin-popup-content">
				<view class="coin-popup-close" @click="closeCoinPopup">×</view>
				<view class="coin-popup-icon">
					<image :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
				</view>
				<text class="coin-popup-text">获得 {{ collectedCoins }} 雨滴</text>
				<button class="coin-popup-button" @click="closeCoinPopup">确认</button>
			</view>
		</view>
		<view class="tips-container" v-if="showTips">
			<view class="tips">
				<text>{{showFriendText}}</text>
			</view>
		</view>
		<!-- 右上角问号帮助按钮 -->
		<view class="level-button">当前植物生长阶段：{{ plantStage }}</view>
		<image class="help-button" :src="$getStaticSrc('/static/farm/question.png')" mode="aspectFit" @click="showHelp"></image>
		<!-- 自定义帮助弹窗 -->
		<view v-if="showHelpPopup" class="help-popup" @click="closeHelpPopup">
			<view class="help-popup-content" @click.stop>
				<view class="help-popup-header">
					<text class="help-popup-title">规则说明</text>
					<view class="help-popup-close" @click="closeHelpPopup">×</view>
				</view>
				<view class="help-popup-body">
					<rich-text :nodes="helpContent"></rich-text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			// 计算弹窗样式
			popupStyle() {
				return {
					left: this.popupPosition.x + 'px',
					top: this.popupPosition.y + 'px'
				};
			},
			// 从Vuex获取登录状态
			isLoggedIn() {
				return this.$store.state.isLoggedIn;
			},
			// 根据植物生长阶段返回对应的图片
			currentTreeImage() {
				const treeImages = [
					'/static/farm/tree.png', // 阶段 0
					'/static/farm/tree2.png', // 阶段 1
					'/static/farm/tree3.png', // 阶段 2
					'/static/farm/tree4.png', // 阶段 3
					'/static/farm/tree5.png', // 阶段 4
					'/static/farm/tree6.png' // 阶段 5
				]
				return treeImages[this.plantStage]
			},
			// 根据植物生长阶段返回对应的大小样式
			treeSize() {
				// 为每个生长阶段定义不同的尺寸（单位：rpx）
				const sizes = [{
						width: '119rpx',
						height: '229rpx'
					}, // 阶段 0: 最小的树苗
					{
						width: '178rpx',
						height: '375rpx'
					}, // 阶段 1: 小树苗
					{
						width: '244rpx',
						height: '445rpx'
					}, // 阶段 2: 中等树苗
					{
						width: '316rpx',
						height: '513rpx'
					}, // 阶段 3: 大树苗
					{
						width: '486rpx',
						height: '523rpx'
					}, // 阶段 4: 接近成熟的树
					{
						width: '486rpx',
						height: '523rpx'
					} // 阶段 5: 完全成熟的树
				]
				return sizes[this.plantStage] || sizes[0]
			}
		},
		data() {
			return {
				// 添加加载状态
				isLoading: true,
				isTreeDataLoaded: false,
				// 植物生长状态 (0-5 表示不同阶段)
				plantStage: 0,
				// 倒计时相关
				totalSeconds: 60,
				treeSeconds: 0,
				water: 0,
				maxSeconds: 50,
				remainingTime: '02:00',
				config: {},
				timer: null,
				// 浇水状态
				showWaterAnimation: false,
				droplets: [], // 添加雨滴数组
				// 好友列表状态
				showFriendList: false,
				showFriendText: '',
				friends: [],
				remainingWaterTime: '00:00:00',
				waterTimeSeconds: 0,
				waterTimer: null,
				// 浇水茶壶动画
				_waterTeapotAnimation: null,
				waterTeapotAnimationData: {},
				isTeapotAnimating: false,
				// 金币相关数据
				coins: [],
				isCollecting: false,
				// 弹窗相关状态
				showFriendPopupFlag: false,
				currentFriendIndex: -1,
				currentFriendName: '',
				// 添加弹窗位置信息
				popupPosition: {
					x: 0,
					y: 0
				},
				progressValue: 100, // 动态进度值，可以从数据源获取
				progressWidth: '100%',
				showTreePopup: false, // 控制树苗升级弹窗显示
				isTreeMature: false,
				showCoinPopup: false, // 控制金币弹窗显示
				collectedCoins: 9999, // 收集的金币数量
				showHelpPopup: false, // 控制
				helpContent: `
        <div style="font-size: 28rpx; color: #333; line-height: 1.6; padding: 10rpx 0;">
          <p style="margin-bottom: 20rpx;">1. 树的生命周期分为5个阶段: 树苗 → 幼树 → 小树 → 大树 → 果树。</p>
          <p style="margin-bottom: 20rpx;">2. 每个阶段都有成长目标(需要的浇水次数/成长值)。</p>
          <p style="margin-bottom: 20rpx;">3. 达到目标后，自动解锁下一阶段。</p>
          <p style="margin-bottom: 20rpx;">4. 点击植物或浇水按钮可以给植物浇水，加速生长。</p>
          <p style="margin-bottom: 20rpx;">5. 植物成熟后可以收获金币。</p>
          <p style="margin-bottom: 20rpx;">6. 可以邀请好友帮忙浇水，加速植物生长。</p>
        </div>
      `,
				showTips: false,
				// 添加缺失的动画数据属性
				treeAnimationData: {},
				rabbitAnimationData: {}
			}
		},

		created() {
			// 首先预加载所有图片
			this.preloadImages().then(() => {
				// 所有图片加载完成后，再进行数据渲染
				this.isLoading = false
				console.log('isLoadingAPP',this.isLoading)
				this.startTimer()
				this.startWaterTimer() // 启动浇水倒计时
				this.initAnimations()
				// 初始化浇水茶壶动画
				this.initWaterTeapotAnimation()

			})
			// #ifdef APP
			plus.navigator.setFullscreen(true);
			// #endif
			// 只有登录用户才初始化树和好友数据
			if (this.isLoggedIn) {
				this.initTree()
				this.initFriends()
			}
		},
		destroyed() {
			console.log('组件销毁', destroyed)
			if (this.timer) {
				clearInterval(this.timer)
			}
			if (this.waterTimer) {
				clearInterval(this.waterTimer)
			}
		},
		onUnload() {
			console.log('组件卸载', onUnload)
			if (this.timer) {
				clearInterval(this.timer)
			}
			if (this.waterTimer) {
				clearInterval(this.waterTimer)
			}
		},
		methods: {
			initTree() {
				// 编辑地址
				this.$http(
					'/api/api/tree', {}, "GET").then(res => {
					// console.log('数据',res.data)
					// 应用处理后的内容
					this.helpContent = this.$noteChange(res.data.tree_rule.note);
					
					if (res.data.status == "D") {
						// 状态为D时，设置树直接成熟
						this.plantStage = 5; // 5表示成熟阶段
						this.totalSeconds = 0; // 设置倒计时为0
						this.progressValue = 100; // 设置进度为100%
						this.progressWidth = '100%'; // 设置进度条宽度为100%
						this.remainingTime = '已成熟'; // 更新剩余时间显示
						// 植物已成熟，生成随机金币
						this.generateRandomCoins()
						this.isTreeMature = true // 是成熟提示
						this.showTreePopup = true
					} else {
						
						// 原有的逻辑保持不变
						this.plantStage = parseInt((res.data.type || '').toString().match(/\d+/g)?.join('') || '0',
							10)
					}
					console.log('next_self_water',res.data.next_self_water)
					
					// 计算当前时间戳和next_self_water的时间差（秒）
					const now = Math.floor(Date.now() / 1000); // 获取当前时间戳（毫秒）
					console.log('now:', now);
					const timeDifferenceSeconds = res.data.next_self_water - now ; // 计算差值并转换为秒
					console.log('时间差（秒）:', timeDifferenceSeconds);
					if(timeDifferenceSeconds > 0){
						this.waterTimeSeconds = timeDifferenceSeconds
					}else{
						this.waterTimeSeconds = 0
					}
					this.config = res.data.config
					// 为每个tree对象添加total字段
					let accumulatedTotal = 0;
					for (let i = 1; i <= 5; i++) {
						const treeKey = 'tree' + i;
						if (this.config[treeKey] && typeof this.config[treeKey].value === 'number') {
							// 当前阶段的total = 上一个阶段的total + 当前阶段的value
							accumulatedTotal += this.config[treeKey].value;
							// 添加total字段
							this.config[treeKey].total = accumulatedTotal;
						}
					}
					// 只有当树未成熟时才计算剩余时间
					if (this.plantStage <= 5) {
						var stage = this.plantStage + 1

						// var config = {
						//   tree1:{
						//     name:"阶段1",
						//     value:6,
						//     total:6,
						//   },
						//   tree2:{
						//     name:"阶段2",
						//     value:6,
						//     total:12,
						//   }
						//   ,tree3:{
						//     name:"阶段3",
						//     total:18
						//   }
						//   ,tree4:{
						//     name:"阶段4",
						//     value:6,
						//     total:24
						//   }
						//   ,tree5:{
						//     name:"阶段5",
						//     value:6,
						//     total:30
						//   }
						// }
						// this.config = config
						

						const tree = 'tree' + stage
						this.maxSeconds = this.config['tree' + this.plantStage].total
						this.totalSeconds = this.maxSeconds - Number(res.data.grown)
						this.treeSeconds = this.config['tree' + this.plantStage].value
						this.water = res.data.water
					}

					this.isTreeDataLoaded = true

				})
			},
			initFriends() {
				// 编辑地址
				this.$http(
					'/user/friends/index', {}, "GET").then(res => {
					console.log('数据', res.data)
					this.friends = res.data.list
				})
			},
			// 显示求助成功提示，并在5秒后自动隐藏
			showFriendHelpSuccessMessage() {
				console.log('当前求助用户', this.currentFriendIndex)

				// 编辑地址
				this.$http(
					'/user/friends/requestHelp', {
						friend_id: this.currentFriendIndex
					}, "POST").then(res => {
					console.log(res)
					if (res.code == 200) {
						this.showTips = true;
						this.showFriendText = '求助玩家' + this.currentFriendName + '成功'
						// 设置5秒后自动隐藏
						setTimeout(() => {
							this.showTips = false;
							this.checkIfTipsEmpty();
						}, 3000);
					}
				})

			},

			showFriendFreeWateringMessage() {
				// 编辑地址
				this.$http(
					'/user/friends/giveWater', {
						friend_id: this.currentFriendIndex
					}, "POST").then(res => {
					console.log('赠送', res.data)
					if (res.code == 200) {
						this.showTips = true;
						this.showFriendText = '赠送玩家1次浇水机会'
						setTimeout(() => {
							this.showTips = false;
						}, 3000);
					}
				})

			},

			showFriendHelpWateringMessage() {
				// 编辑地址
				this.$http(
					'/user/friends/assistWater', {
						friend_id: this.currentFriendIndex
					}, "POST").then(res => {
					if (res.code == 200) {
						this.showTips = true;
						this.showFriendText = '帮助玩家1次浇水机会'
						setTimeout(() => {
							this.showTips = false;
						}, 3000);
					}
				})

			},

			// 更新进度值的方法
			updateProgress(newValue) {
				// 确保newValue在0到100之间，避免出现负值或超过100%的情况
				const validProgress = Math.max(0, Math.min(100, Number(newValue) || 0));
				this.progressValue = validProgress.toFixed(2);
				this.progressWidth = validProgress + '%';
			},
			// 预加载所有图片资源
			preloadImages() {
				return new Promise((resolve) => {
					// 列出所有需要预加载的图片路径
					const imagePaths = [
						'/static/farm/back.png',
						'/static/farm/rabbit.png',
						'/static/farm/rabbit-back.png',
						'/static/farm/tree.png',
						'/static/farm/tree2.png',
						'/static/farm/tree3.png',
						'/static/farm/tree4.png',
						'/static/farm/tree5.png',
						'/static/farm/tree6.png',
						'/static/farm/water1.png',
						'/static/farm/water-back.png',
						'/static/farm/friend-back-more.png',
						'/static/farm/friend-back.png',
						'/static/farm/avatar.png',
						'/static/farm/more.png',
						'/static/farm/message.png',
						'/static/farm/help.png',
						'/static/farm/question.png',
						'/static/farm/gold.png'
					]

					let loadedCount = 0
					const totalCount = imagePaths.length
					
					console.log('开始预加载图片，总数:', totalCount)

					// 如果没有图片需要加载，直接resolve
					if (totalCount === 0) {
						console.log('没有图片需要加载')
						resolve()
						return
					}

					// 逐一加载图片
					imagePaths.forEach((path) => {
						// #ifdef APP
						// 在APP端使用uni.getImageInfo获取图片信息来预加载
						uni.getImageInfo({
							src: path,
							success: () => {
								loadedCount++
								console.log(`图片加载成功: ${path} (${loadedCount}/${totalCount})`)
								if (loadedCount === totalCount) {
									console.log('所有图片加载完成')
									resolve()
								}
							},
							fail: () => {
								loadedCount++
								console.warn(`图片加载失败: ${path} (${loadedCount}/${totalCount})`)
								if (loadedCount === totalCount) {
									console.log('所有图片处理完成（包含失败）')
									resolve()
								}
							}
						})
						// #endif
						
						// #ifndef APP
						// 在H5端使用传统Image对象预加载
						const img = new Image()
						img.src = path

						// 图片加载完成或失败都视为已处理
						const onLoad = () => {
							loadedCount++
							console.log(`图片加载完成: ${path} (${loadedCount}/${totalCount})`)
							if (loadedCount === totalCount) {
								console.log('所有图片加载完成')
								resolve()
							}
						}

						img.onload = onLoad
						img.onerror = onLoad
						// #endif
					})
				})
			},
			// 初始化动画
			initAnimations() {
				// 兔子呼吸动画 - 创建动画实例
				this._rabbitAnimation = uni.createAnimation({
					duration: 2000,
					timingFunction: 'ease-in-out',
					delay: 0,
					transformOrigin: '50% 50%'
				})

				// 循环播放兔子动画
				setInterval(() => {
					this._rabbitAnimation.scale(1.05).step()
					this._rabbitAnimation.scale(1).step()
					this.$nextTick(() => {
						this.rabbitAnimationData = this._rabbitAnimation.export()
					})
				}, 2000)

				// 小树轻微摇摆动画 - 创建动画实例
				this._treeAnimation = uni.createAnimation({
					duration: 3000,
					timingFunction: 'ease-in-out',
					delay: 0,
					transformOrigin: '50% 10%'
				})

				// 循环播放树木动画
				setInterval(() => {
					this._treeAnimation.rotate(-2).step()
					this._treeAnimation.rotate(2).step()
					this._treeAnimation.rotate(0).step()
					this.$nextTick(() => {
						this.treeAnimationData = this._treeAnimation.export()
					})
				}, 3000)
			},

			// 开始倒计时
			startTimer() {
				this.updateTimeDisplay() // 初始更新进度条
				this.timer = setInterval(() => {
					this.totalSeconds--
					if (this.totalSeconds <= 0) {
						clearInterval(this.timer)
						this.plantGrow()
						// 重置倒计时，进入下一个生长阶段
						if (this.plantStage < 5) {
							console.log('下阶段', this.plantStage)
							// 使用当前plantStage获取对应阶段的配置
							var stage = this.plantStage
							const tree = 'tree' + stage
							// 确保配置存在
							if (this.config[tree] && typeof this.config[tree].value === 'number') {
								this.treeSeconds = this.config[tree].value
								this.maxSeconds = this.config[tree].value
								
								console.log('treeSeconds~~', this.treeSeconds, '对应阶段:', stage)
								this.totalSeconds = this.maxSeconds
								this.startTimer()
							} else {
								console.error('未找到阶段配置或配置值无效:', tree)
								// 如果配置不存在，使用默认值300秒(5分钟)
								this.treeSeconds = 300
								this.maxSeconds = 300
								this.totalSeconds = 300
								this.startTimer()
							}
						} else {
							// this.remainingTime = '已成熟'
							// console.log('倒计时结束，植物已成熟')
							this.initTree()
							// // 确保调用生成金币方法
							// this.generateRandomCoins()
							
							// // 植物成熟时进度条设为100%
							// this.updateProgress(100)
							
							// 状态为D时，设置树直接成熟
							
						}
					} else {
						this.updateTimeDisplay()
					}
				}, 1000)
			},

			// 更新时间显示
			updateTimeDisplay() {
				// 转换为时分秒格式
				const hours = Math.floor(this.totalSeconds / 3600);
				const minutes = Math.floor((this.totalSeconds % 3600) / 60);
				const seconds = this.totalSeconds % 60;

				// 格式化时间字符串，小时不限制位数，分钟和秒数保持两位
				this.remainingTime =
					hours.toString() + ':' +
					minutes.toString().padStart(2, '0') + ':' +
					seconds.toString().padStart(2, '0');

				// 计算进度值 (0% - 100%)
				// 对于大数值的情况，我们需要调整进度条计算逻辑
				// 假设每个生长阶段的总时长是动态的或从其他地方获取
				// 这里我们简单地保持原有的进度条逻辑，但实际应用中可能需要根据业务需求调整
				// const maxSeconds = 60; // 这个值可能需要根据实际情况动态设置
				// console.log('maxSeconds',this.maxSeconds)
				// console.log('treeSeconds',this.treeSeconds)
				// console.log('totalSeconds',this.totalSeconds)
				const progressPercent = 100 - (this.totalSeconds / this.treeSeconds) * 100;

				// 更新进度条
				this.updateProgress(progressPercent);
			},
			// 更新浇水时间显示
			// 更新浇水时间显示
			updateWaterTimeDisplay() {
				if(this.waterTimeSeconds <= 0){
					this.remainingWaterTime = '00:00:00'
					// 启动浇水茶壶晃动动画
					if (!this.isTeapotAnimating) {
						this.startWaterTeapotAnimation()
					}
					return
				}
				const hours = Math.floor(this.waterTimeSeconds / 3600)
				const minutes = Math.floor((this.waterTimeSeconds % 3600) / 60)
				const seconds = this.waterTimeSeconds % 60

				// 确保小时数也使用两位显示格式，当waterTimeSeconds为0时显示为00:00:00
				this.remainingWaterTime =
					hours.toString().padStart(2, '0') + ':' +
					minutes.toString().padStart(2, '0') + ':' +
					seconds.toString().padStart(2, '0')
				
				// 停止浇水茶壶动画
				if (this.isTeapotAnimating) {
					this.stopWaterTeapotAnimation()
				}
			},

			// 启动浇水倒计时
			startWaterTimer() {
				// 清除现有的定时器
				if (this.waterTimer) {
					clearInterval(this.waterTimer)
				}

				// 更新显示
				this.updateWaterTimeDisplay()

				// 设置新的定时器
				this.waterTimer = setInterval(() => {
					this.waterTimeSeconds--
					if (this.waterTimeSeconds <= 0) {
						clearInterval(this.waterTimer)
						// 可以在这里添加时间到后的处理逻辑
						console.log('浇水倒计时结束')
					}
					this.updateWaterTimeDisplay()
				}, 1000)
			},

			// 重置浇水时间
			resetWaterTimer() {
				// 编辑地址
				this.$http(
					'/api/api/tree', {}, "GET").then(res => {
					// console.log('数据',res.data)
					// var rules = JSON.parse(res.data.tree_rule)
					console.log('next_self_water',res.data.next_self_water)
					
					// 计算当前时间戳和next_self_water的时间差（秒）
					const now = Math.floor(Date.now() / 1000); // 获取当前时间戳（毫秒）
					console.log('now:', now);
					const timeDifferenceSeconds = res.data.next_self_water - now ; // 计算差值并转换为秒
					console.log('时间差（秒）:', timeDifferenceSeconds);
					if(timeDifferenceSeconds > 0){
						this.waterTimeSeconds = timeDifferenceSeconds
					}else{
						this.waterTimeSeconds = 0
					}
					this.startWaterTimer()
					// 停止浇水茶壶动画
					if (this.isTeapotAnimating) {
						this.stopWaterTeapotAnimation()
					}
				})
				
			},
			
			// 初始化浇水茶壶动画
			initWaterTeapotAnimation() {
				// 创建动画实例
				this._waterTeapotAnimation = uni.createAnimation({
					duration: 500,
					timingFunction: 'ease-in-out',
					delay: 0,
					transformOrigin: '50% 50%'
				})
			},
			
			// 启动浇水茶壶晃动动画
			startWaterTeapotAnimation() {
				if (!this._waterTeapotAnimation) {
					this.initWaterTeapotAnimation()
				}
				
				this.isTeapotAnimating = true
				
				// 循环播放左右晃动动画
				const animate = () => {
					if (!this.isTeapotAnimating) return
					
					this._waterTeapotAnimation.rotate(-10).step()
					this._waterTeapotAnimation.rotate(10).step()
					this._waterTeapotAnimation.rotate(-10).step()
					this._waterTeapotAnimation.rotate(0).step()
					
					this.$nextTick(() => {
						this.waterTeapotAnimationData = this._waterTeapotAnimation.export()
					})
					
					// 动画结束后继续播放
					setTimeout(() => {
						if (this.isTeapotAnimating) {
							animate()
						}
					}, 2000) // 动画间隔时间
				}
				
				// 开始动画
				animate()
			},
			
			// 停止浇水茶壶动画
			stopWaterTeapotAnimation() {
				this.isTeapotAnimating = false
				// 重置动画到初始状态
				if (this._waterTeapotAnimation) {
					this._waterTeapotAnimation.rotate(0).step({ duration: 200 })
					this.$nextTick(() => {
						this.waterTeapotAnimationData = this._waterTeapotAnimation.export()
					})
				}
			},
			// 植物生长
			plantGrow() {
				if (this.plantStage < 5) {
					this.plantStage++
					console.log('植物生长到阶段:', this.plantStage)
					// 添加生长动画
					const growAnim = uni.createAnimation({
						duration: 1000,
						timingFunction: 'ease-out'
					})
					growAnim.scale(1.2).step()
					growAnim.scale(1).step()
					this.treeAnimationData = growAnim.export()

					// 显示树苗升级弹窗
					this.isTreeMature = false // 不是成熟提示
					if (this.plantStage === 5) {
						this.isTreeMature = true
					}
					this.showTreePopup = true
				} else {
					console.log('植物已成熟，在plantGrow中调用generateRandomCoins')
					// 植物已成熟，生成随机金币
					this.generateRandomCoins()

					// 显示植物成熟弹窗
					this.isTreeMature = true // 是成熟提示
					this.showTreePopup = true
				}
			},

			// 修改浇水方法，添加重置浇水时间的逻辑
			waterPlant() {

				if (this.plantStage <= 5) {
					// 显示浇水动画
					this.showWaterAnimation = true
					// 生成随机雨滴
					this.generateRandomDroplets()
					// 加速生长 (减少10秒)
					if (this.totalSeconds > 10) {
						this.totalSeconds -= 10
						this.updateTimeDisplay()
					} else {
						this.totalSeconds = 0
					}

					// 重置浇水时间为15分钟(900秒)
					this.resetWaterTimer()
					
					// 1秒后隐藏浇水动画
					setTimeout(() => {
						this.showWaterAnimation = false
						this.droplets = []
					}, 1000)
					this.initTree()
					this.initFriends()
				} else {
					uni.showToast({
						title: '植物已成熟，点击金币可以收集',
						icon: 'none'
					})
				}
			},
			waterChange() {
				if (!this.water) {
					uni.showToast({
						title: '浇水次数不足~',
						icon: 'fail'
					})
					return false;
				}
				console.log('waterTimeSeconds',this.waterTimeSeconds)
				if (this.waterTimeSeconds > 0) {
					uni.showToast({
						title: '浇水冷却中~',
						icon: 'fail'
					})
					return false;
				}
				// 编辑地址
				this.$http(
					'/user/tree/start', {}, "POST").then(res => {
					if (res.code == 200) {
						this.waterPlant()
					}
				})
			},
			// 生成随机雨滴
			generateRandomDroplets() {
				this.droplets = []

				// 获取当前植物阶段的实际尺寸
				const currentTreeSize = this.treeSize
				// 转换字符串尺寸为数值
				const treeWidth = parseInt(currentTreeSize.width)
				const treeHeight = parseInt(currentTreeSize.height)
				const dropletCount = 10 // 生成10个雨滴

				for (let i = 0; i < dropletCount; i++) {
					// 随机位置在树的范围内
					const left = Math.random() * (treeWidth - 40) + 'rpx'
					const top = Math.random() * (treeHeight * 0.6) + 'rpx' // 主要在树的上半部分

					// 为每个雨滴创建下落动画
					const dropAnim = uni.createAnimation({
						duration: 600 + Math.random() * 400, // 随机动画持续时间
						timingFunction: 'ease-in',
						delay: Math.random() * 300, // 随机延迟开始
					})

					dropAnim.translateY(80).opacity(0).step()

					this.droplets.push({
						id: i,
						left: left,
						top: top,
						animation: dropAnim.export()
					})
				}
			},
			// 生成随机金币
			generateRandomCoins() {
				console.log('开始生成随机金币')
				// 清除现有金币
				this.coins = []

				// 获取树的实际尺寸和位置参数
				const treeWidth = 486 // 修改为实际树的宽度（rpx）
				const treeHeight = 523 // 修改为实际树的高度（rpx）
				const coinSize = 72 // 金币尺寸设置为72rpx
				const coinCount = 12 // 固定生成12个金币

				console.log('生成金币数量:', coinCount)

				// 用于存储已生成的金币位置，用于碰撞检测
				const existingCoins = []

				// 定义金币之间的最小间距（防止重叠）
				const minDistance = coinSize * 1.2 // 金币直径的1.2倍

				// 最大尝试次数，防止无限循环
				const maxAttempts = 100
				// 缩小金币可显示范围，确保完全在树内
				const maxOffsetX = (treeWidth - coinSize) * 0.3 // 左右各30%的范围
				const maxOffsetY = (treeHeight - coinSize) * 0.25 // 上下各25%的范围

				// 生成12个金币
				for (let i = 0; i < coinCount; i++) {
					let coinPosition = null
					let attempts = 0

					while (!coinPosition && attempts < maxAttempts) {
						attempts++

						// 树的中心点坐标（相对于plant-area容器）
						const centerX = treeWidth / 2
						const centerY = treeHeight / 2

						// 随机位置偏移，让金币分布在树的不同位置
						const getGaussianRandom = (mean, stdDev) => {
							let u = 0,
								v = 0;
							while (u === 0) u = Math.random();
							while (v === 0) v = Math.random();
							return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
						}

						// 主要集中在树的上半部分和中间区域
						const offsetX = getGaussianRandom(0, maxOffsetX)
						const offsetY = getGaussianRandom(-maxOffsetY * 0.4, maxOffsetY * 0.5) // 偏向树的上半部分

						// 加强边界检查，确保金币完全在树的范围内
						const clampedLeft = Math.max(coinSize / 2, Math.min(treeWidth - coinSize / 2, centerX + offsetX))
						const clampedTop = Math.max(coinSize / 2, Math.min(treeHeight - coinSize / 2, centerY + offsetY))
						// 检查是否与现有金币重叠
						let isOverlapping = false
						for (const existingCoin of existingCoins) {
							const distance = Math.sqrt(
								Math.pow(clampedLeft - existingCoin.x, 2) +
								Math.pow(clampedTop - existingCoin.y, 2)
							)
							if (distance < minDistance) {
								isOverlapping = true
								break
							}
						}

						// 如果不重叠，则使用这个位置
						if (!isOverlapping) {
							coinPosition = {
								x: clampedLeft,
								y: clampedTop
							}
							existingCoins.push(coinPosition)
						}
					}

					// 即使尝试次数用完，也确保生成金币
					if (!coinPosition && attempts >= maxAttempts) {
						// 如果无法找到不重叠的位置，就使用最后一次尝试的位置
						coinPosition = {
							x: treeWidth / 2 + (Math.random() - 0.5) * maxOffsetX,
							y: treeHeight / 2 + (Math.random() - 0.5) * maxOffsetY
						}
					}

					// 计算最终显示位置
					const left = (coinPosition.x - coinSize / 2) + 'rpx'
					const top = (coinPosition.y - coinSize / 2) + 'rpx'
					// 为每个金币创建动画
					const coinAnimation = uni.createAnimation({
						duration: 2000,
						timingFunction: 'ease-in-out'
					})

					this.coins.push({
						id: i,
						left,
						top,
						animation: coinAnimation.export()
					})
				}

				// 启动金币漂浮动画
				// this.startCoinAnimations()
			},

			// 启动金币漂浮动画
			startCoinAnimations() {
				console.log('金币数量', this.coins.length)
				this.coins.forEach((coin, index) => {
					setInterval(() => {
						const coinAnimation = uni.createAnimation({
							duration: 2000,
							timingFunction: 'ease-in-out'
						})

						// 轻微上下漂浮效果
						coinAnimation.translateY(-10).step()
						coinAnimation.translateY(0).step()

						// 更新特定金币的动画
						this.$set(this.coins, index, {
							...coin,
							animation: coinAnimation.export()
						})
					}, 2000 + index * 500) // 错开每个金币的动画时间
				})
			},
			coinsChange() {
				// 编辑地址
				this.$http(
					'/user/tree/pluck', {}, "POST").then(res => {
					if (res.code == 200) {
						this.collectedCoins = res.data.gold
						this.collectAllCoins()
					}
				})
			},
			// 收集金币
			collectAllCoins() {
				// 防止重复收集
				if (this.isCollecting) return;
				this.isCollecting = true;

				// 创建收集动画
				this.coins.forEach((coin, index) => {
					const collectAnim = uni.createAnimation({
						duration: 500,
						timingFunction: 'ease-out'
					})

					collectAnim.scale(1.5).opacity(0).step()

					// 更新金币动画
					this.$set(this.coins, index, {
						...this.coins[index],
						animation: collectAnim.export()
					})
				})

				// 动画结束后显示弹窗
				setTimeout(() => {
					// 显示金币收集弹窗
					this.showCoinPopup = true;
				}, 500)
			},

			// 关闭金币弹窗并重置植物
			closeCoinPopup() {
				this.showCoinPopup = false;
				this.coins = [];

				// 重置植物，重新生长
				setTimeout(() => {
					this.initTree()
					this.startTimer();

					// this.plantStage = 0; // 重置为第一阶段
					// const tree = 'tree'+(this.plantStage+1)
					// this.totalSeconds = this.config[tree].value; // 设置初始倒计时
					// this.remainingTime = this.formatTime(this.totalSeconds); // 更新时间显示
					// this.startTimer(); // 开始新的生长周期
					// this.isCollecting = false;
				}, 300)
			},
			// 关闭金币弹窗并重置植物
			closeTreePopup() {
				this.showTreePopup = false;
			},
			// 显示帮助信息
			showHelp() {
				this.showHelpPopup = true;
			},

			// 关闭帮助弹窗
			closeHelpPopup() {
				this.showHelpPopup = false;
			},
			// 显示好友弹窗
			showFriendPopup(index, friend) {
				this.showFriendPopupFlag = true;
				// console.log(index)
				// console.log('friend',friend)
				this.currentFriendIndex = friend.uid;
				this.currentFriendName = friend.nick_name;

				// 使用更精确的元素定位方式获取friend-item的位置
				const query = uni.createSelectorQuery().in(this);
				query.select(`.friend-item:nth-child(${index + 1})`).boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						const itemRect = res[0];
						// 弹窗宽度为377rpx（约188.5px）
						// 弹窗高度为138rpx（约69px）

						// 计算弹窗位置：在friend-item左侧，且垂直居中对齐
						this.popupPosition = {
							// 左侧位置 = item的左侧位置 - 弹窗宽度 - 10px间距
							x: itemRect.left - 188.5 - 20,
							// 垂直位置 = item的顶部位置 + (item高度/2) - (弹窗高度/2)
							y: itemRect.top + (itemRect.height / 2) - 44
						};
						console.log('弹窗位置:', this.popupPosition);
					}
				});
			},
			// 关闭好友弹窗
			closeFriendPopup() {
				this.showFriendPopupFlag = false;
				this.currentFriendIndex = -1;
				this.currentFriendName = '';
			}
		}
	}
</script>

<style scoped>
	.loading-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		overflow: hidden;
	}

	.loading-spinner {
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 20rpx;
		animation: spin 1s linear infinite;
	}

	.loading-icon {
		width: 100%;
		height: 100%;
	}

	.loading-text {
		font-size: 32rpx;
		color: #333;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.farm-container {
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}

	.farm-background {
		width: 100%;
		height: 100%;
		z-index: 0;
	}

	.top-bar {
		position: absolute;
		top: 40rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		padding: 0 40rpx;
		z-index: 10;
	}

	.time-container {
		background: rgba(255, 255, 255, 0.7);
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
	}

	.time-text {
		color: #ff6b00;
		font-weight: bold;
		font-size: 24rpx;
	}

	.gold-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.rabbit {
		position: absolute;
		bottom: 350rpx;
		left: 80rpx;
		width: 120rpx;
		height: 240rpx;
		z-index: 5;
	}

	.rabbit-back {
		position: absolute;
		bottom: 300rpx;
		left: -50rpx;
		width: 380rpx;
		height: 100rpx;
		z-index: 1;
	}

	.plant-area {
		position: absolute;
		bottom: 50rpx;
		/* 位于line-progress上方，留出一点间距 */
		/* width: 100%; */
		/* height: 330rpx; */
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.line-progress-info {
		position: absolute;
		bottom: 28%;
		left: 220rpx;
		width: 323rpx;
	}

	.line-progress-time {
		font-size: 30rpx;
		color: #FFFFFF;
		text-stroke: 0.2rpx #C76A05;
		text-align: center;
		text-transform: none;
		-webkit-text-stroke: 0.2rpx #C76A05;
	}

	.line-progress {
		position: relative;
		width: 323rpx;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2;
	}

	.progress-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.progress-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		border-radius: 15rpx;
	}

	.progress-active {
		position: absolute;
		left: 0;
		height: 100%;
		z-index: 2;
		transition: width 0.3s ease;
		/* 确保进度条从左到右填充 */
		clip-path: inset(0 0 0 0);
		border-radius: 15rpx;
	}

	.progress-text {
		position: relative;
		z-index: 3;
		color: #fff;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 0;
		text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.5);
	}

	.tree {
		width: 300rpx;
		/* 设为最小尺寸作为默认值 */
		height: 330rpx;
		z-index: 1;
	}

	.water-animation {
		position: absolute;
		bottom: 300rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 100rpx;
		height: 100rpx;
		z-index: 2;
	}

	/* 雨滴容器样式 */
	.droplets-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 3;
	}

	/* 雨滴样式 */
	.droplet {
		position: absolute;
		width: 20rpx;
		height: 28rpx;
		opacity: 0.8;
	}

	.coin {
		position: absolute;
		width: 72rpx;
		height: 72rpx;
		z-index: 3;
		transition: all 0.3s ease;
	}

	.coins-container {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 3;
	}

	.coin:active {
		transform: scale(1.2);
	}


	.water-button {
		position: absolute;
		bottom: 10%; /* 增加底部间距，防止被导航栏遮挡 */
		left: 38rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 10; /* 确保显示在最上层 */
	}

	.water-teapot-icon {
		width: 107rpx;
		height: 107rpx; /* 增加高度以完全显示水壶 */
		object-fit: contain; /* 确保图片完整显示 */
		margin-bottom: 5rpx;
	}

	.water-text-container {
		position: relative;
		width: 101rpx;
		height: 40rpx;
		margin-bottom: 5rpx;
	}

	.water-bg-icon {
		width: 101rpx;
		height: 48rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.water-text {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		font-family: OPPOSans, OPPOSans;
		font-weight: normal;
		font-size: 24rpx;
		color: #D54E3A;
		font-style: normal;
		text-transform: none;
		text-align: center;
		line-height: 48rpx;
		width: 101rpx;
	}

	.water-countdown {
		font-size: 28rpx;
		color: #FFFFFF;
		padding: 0;
		border-radius: 10rpx;
		padding: 2rpx 10rpx;
	}

	.friend-button {
		position: absolute;
		bottom: 10%;
		right: 16rpx;
	}

	.friend-info {
		position: relative;
	}

	.friend-icon {
		width: 137rpx;
		height: 58rpx;
		position: absolute;
		bottom: 0;
		right: 0;
	}

	.friend-box {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 137rpx;
		height: 58rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.friend-text {
		font-family: OPPOSans, OPPOSans;
		font-weight: normal;
		font-size: 24rpx;
		color: #D54E3A;
		font-style: normal;
		text-transform: none;
		/* 确保文本完全居中的样式 */
		width: 100%;
		text-align: center;
		line-height: 58rpx;
		margin: 0;
		padding: 0;
		/* 针对flex容器内的文本额外处理 */
		display: inline-block;
		white-space: nowrap;
	}

	.friend-box {
		position: relative;
	}

	.friend-list {
		position: absolute;
		right: 0;
		top: -967rpx;
		z-index: 20;
		/* 确保好友列表不会超出容器 */
		max-height: calc(100vh - 308rpx - 100rpx);
	}

	.friend-list-bg {
		width: 137rpx;
		height: 937rpx;
	}

	.friend-items {
		position: absolute;
		top: 40rpx;
		/* 将px改为rpx单位 */
		left: 0;
		right: 10rpx;
		overflow-y: auto;
		max-height: 870rpx;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	/* 自定义滚动条样式（可选） */
	.friend-items::-webkit-scrollbar {
		width: 0;
		/* Chrome, Safari, Edge */
		display: none;
	}

	.friend-items::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 3rpx;
		display: none;
	}

	.friend-items::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 3rpx;
		display: none;
	}

	.friend-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.friend-avatar {
		width: 80rpx;
		height: 80rpx;
		background: #AADFF9;
		border: 4rpx solid #FFFFFF;
		/* width: 92rpx; */
		/* height: 92rpx; */
		border-radius: 50%;
	}

	.friend-tips {
		width: 28rpx;
		height: 28rpx;
		position: absolute;
		top: 0;
		right: 16rpx;
		z-index: 10;
	}

	.friend-name {
		margin-left: 10rpx;
		margin-bottom: 12rpx;
		font-size: 18rpx;
		color: #333;
		/* 确保文本截断和省略号显示的关键样式 */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 70rpx;
		display: inline-block;
	}

	.friend-more-box {
		position: absolute;
		top: -30rpx;
		right: 50rpx;
	}

	.friend-more {

		width: 35rpx;
		height: 29rpx;
	}

	.gift-icon {
		width: 30rpx;
		height: 30rpx;
	}

	.level-button {
		position: absolute;
		// #ifdef APP
		top: 170rpx;
		// #endif
		// #ifdef H5
		top: 100rpx;
		// #endif
		left: 30rpx;
		color: #fff;
		z-index: 10;
	}

	.help-button {
		position: absolute;
		// #ifdef APP
		top: 170rpx;
		// #endif
		// #ifdef H5
		top: 100rpx;
		// #endif
		right: 100rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 10;
	}

	.friend-popup {
		position: absolute;
		background-color: transparent;
		/* 移除背景遮罩 */
		z-index: 1000;
	}

	.friend-popup-bg {
		position: absolute;
		width: 377rpx;
		height: 138rpx;
	}

	.friend-popup-box {
		position: absolute;
		width: 350rpx;
		height: 138rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.friend-popup-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.friend-popup-icon {
		width: 49rpx;
		height: 45rpx;
	}

	.gift {
		width: 49rpx;
		height: 50rpx;
	}

	.water {
		width: 57rpx;
		height: 48rpx;
	}

	/* 金币收集成功弹窗样式 */
	.coin-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.coin-popup-content {
		width: 620rpx;
		height: 500rpx;
		background-color: white;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
		position: relative;
	}

	.coin-popup-close {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		font-size: 40rpx;
		color: #000;
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	.coin-popup-close:active {
		background-color: #e0e0e0;
	}

	.coin-popup-icon {
		width: 179rpx;
		height: 170rpx;
		margin-bottom: 37rpx;
		margin-top: 78rpx;
	}

	.coin-popup-icon image {
		width: 100%;
		height: 100%;
	}

	.coin-popup-text {
		font-family: OPPOSans, OPPOSans;
		font-weight: normal;
		font-size: 30rpx;
		color: #000000;
		text-align: center;
		font-style: normal;
		text-transform: none;
		margin-bottom: 76rpx;
	}

	.coin-popup-button {
		width: 400rpx;
		height: 80rpx;
		background-color: #000;
		color: white;
		border-radius: 40rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		border: none;
		margin-bottom: 40rpx;
	}

	.tips-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		z-index: 400;
		animation: tipsSlideUp 0.5s ease-out;
	}

	.tips {
		position: relative;
		top: 0;
		left: 0;
		transform: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 440rpx;
		height: 60rpx;
		font-family: OPPOSans, OPPOSans;
		font-weight: normal;
		font-size: 30rpx;
		color: #D54E3A;
		text-align: center;
		font-style: normal;
		text-transform: none;
		line-height: 60rpx;
		opacity: 0;
		transform: translateY(20rpx);
		animation: tipFadeIn 0.3s ease-out forwards;
		background-image: url('/static/farm/tips.png');
		background-size: 100% 100%;

	}

	/* 为每个tips添加不同的动画延迟 */
	.tips:nth-child(1) {
		animation-delay: 0s;
	}

	.tips:nth-child(2) {
		animation-delay: 0.1s;
	}

	.tips:nth-child(3) {
		animation-delay: 0.2s;
	}

	/* 容器滑入动画 */
	@keyframes tipsSlideUp {
		from {
			opacity: 0;
			transform: translate(-50%, -40%);
		}

		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	/* 单个tip淡入动画 */
	@keyframes tipFadeIn {
		from {
			opacity: 0;
			transform: translateY(20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* 保持其他样式不变 */
	.tips-icon {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 440rpx;
		height: 60rpx;
	}

	.tips text {
		position: relative;
		z-index: 1;
	}

	/* 自定义帮助弹窗样式 */
	.help-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.help-popup-content {
		width: 650rpx;
		max-height: 700rpx;
		background-color: white;
		border-radius: 20rpx;
		overflow: hidden;
		box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.2);
	}

	.help-popup-header {
		position: relative;
		padding: 30rpx;
		border-bottom: 1px solid #eee;
		text-align: center;
	}

	.help-popup-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.help-popup-close {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		font-size: 40rpx;
		color: #666;
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
	}

	.help-popup-close:active {
		background-color: #e0e0e0;
	}

	.help-popup-body {
		padding: 30rpx;
		max-height: 60vh;
		overflow-y: auto;
	}

	.help-popup-body rich-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
	}

	/* 自定义滚动条样式 */
	.help-popup-body::-webkit-scrollbar {
		width: 6rpx;
	}

	.help-popup-body::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3rpx;
	}

	.help-popup-body::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 3rpx;
	}

	.help-popup-body::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>