<template>
	<view>
		<indexPage v-if="type=='home'" ref="indexPage"></indexPage>
		<farmPage v-if="type=='farm'" ref="farmPage"></farmPage>
		<taskPage v-if="type=='task'" ref="taskPage"></taskPage>
		<cartPage v-if="type=='cart'" ref="cartPage"></cartPage>
		<recommendPage v-if="type=='recommend'" ref="recommendPage"></recommendPage>
		<myPage v-if="type=='my'" ref="myPage"></myPage>
		<up-tabbar class="main-tabbar" :value="tabbarValue" @change="change" :fixed="true" :placeholder="true" activeColor="#1CB7FF"
			:safeAreaInsetBottom="true" style="z-index:9999;" :key="tabbarKey">
			<up-tabbar-item text="首页" name="home">
				<template #active-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/home1.png')" mode="aspectFit"></image>
				</template>
				<template #inactive-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/home.png')" mode="aspectFit"></image>
				</template>
			</up-tabbar-item>
			<up-tabbar-item text="任务" name="task">
				<template #active-icon>
						<image class="icon" :src="$getStaticSrc('/static/icon/task1.png')" mode="aspectFit"></image>
					</template>
					<template #inactive-icon>
						<image class="icon" :src="$getStaticSrc('/static/icon/task.png')" mode="aspectFit"></image>
					</template>
				</up-tabbar-item>
			<up-tabbar-item text="购物车" name="cart" v-if="config?.review_mode==1">
				<template #active-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/shop1.png')" mode="aspectFit"></image>
				</template>
				<template #inactive-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/shop.png')" mode="aspectFit"></image>
				</template>
			</up-tabbar-item>
			<up-tabbar-item text="客服" name="custom" v-if="config?.review_mode!=1 && isLoggedIn && userInfo.show_item && userInfo.show_licai==1">
				<template #active-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/custom.png')" mode="aspectFit"></image>
				</template>
				<template #inactive-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/custom.png')" mode="aspectFit"></image>
				</template>
			</up-tabbar-item>
			<up-tabbar-item text="分红" name="recommend"
				v-if="config?.review_mode!=1 && isLoggedIn && userInfo.show_item && userInfo.show_licai==1">
				<template #active-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/recommend1.png')" mode="aspectFit"></image>
				</template>
				<template #inactive-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/recommend.png')" mode="aspectFit"></image>
				</template>
			</up-tabbar-item>
			<up-tabbar-item text="我的" name="my">
				<template #active-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/my1.png')" mode="aspectFit"></image>
				</template>
				<template #inactive-icon>
					<image class="icon" :src="$getStaticSrc('/static/icon/my.png')" mode="aspectFit"></image>
				</template>
			</up-tabbar-item>
		</up-tabbar>
		<!-- 自定义下载进度弹窗 -->
		<up-popup :show="showDownloadProgressPopup" mode="center" :closeable="false">
			<view class="download-progress-popup">
				<view class="popup-title">正在下载</view>
				<view class="progress-info">
					<view class="progress-bar-container">
						<view class="progress-bar-bg">
							<view class="progress-bar-fill" :style="{ width: downloadProgress + '%' }"></view>
						</view>
					</view>
					<view class="progress-text">
						{{ downloadProgress }}% ({{ formatFileSize(downloadedSize) }}/{{ formatFileSize(totalSize) }})
					</view>
				</view>
			</view>
		</up-popup>
		<up-popup :show="bannerStatus" mode="center" :closeable="true" @close="closeBanner">
			<view class="banner-container">
				<up-swiper :list="banner" @click="hotActive" height="500rpx" radius="5" keyName="thumb" :circular="true" :autoplay="true" class="banner-swiper">
					<!-- <swiper-item v-for="(item,index) in banner" :key="index">
						<image :src="$baseUrl + item.thumb" mode="aspectFill" class="banner-image"></image>
					</swiper-item> -->
				</up-swiper>
			</view>
		</up-popup>
		
	</view>
	
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import indexPage from "/pages/index/index.vue";
	import farmPage from "/pages/farm/farm.vue";
	import shopPage from "/pages/shop/shop.vue";
	import taskPage from "/pages/farm/task.vue";
	import recommendPage from "/pages/recommend/recommend.vue";
	import myPage from "/pages/my/my.vue";
	import cartPage from "/pages/shop/cart.vue";

	export default {
		computed: {
			...mapState(['userInfo', 'isLoggedIn', 'config'])
		},
		components: {
			indexPage,
			farmPage,
			taskPage,
			shopPage,
			recommendPage,
			myPage,
			cartPage
		},
		data() {
			return {
				type: 'home',
				tabbarValue: 'home', // 用于控制tabbar选中状态的值
				tabbarKey: 0, // 用于控制tabbar的key，避免重新加载
				showSponsorTab: false, // 缓存赞助tab的显示状态
				// 下载进度相关变量
				showDownloadProgressPopup: false,
				downloadProgress: 0,
				downloadedSize: 0,
				totalSize: 0,
				currentVersion:'',
				ledui:0,
				bannerStatus:false,
				banner:[],
				// 新增：存储所有子页面的 ref 实例
			pageRefs: {
				home: null,
				farm: null,
				task: null,
				cart: null,
				recommend: null,
				my: null
			}
			}
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.refreshCurrentPage();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad(options) {
			// 检查URL参数，如果有tabType参数，设置对应的type值
			if (options.tabType) {
				// 由于tabbar使用字符串作为name，这里直接使用字符串类型
				const tabTypes = ['home', 'farm', 'shop', 'recommend', 'my','task'];
				const tabType = options.tabType;
				// 验证tabType是否有效
				if (tabTypes.includes(tabType)) {
					console.log('tabTypes~~',tabTypes)
					this.type = tabType;
					// 同步设置tabbarValue
					this.tabbarValue = tabType;
				}
			}
			
			// 只调用一次getConfig
			this.$store.dispatch('getConfig').then(() => {
				// console.log('config', this.config);
				// #ifdef APP
				this.goDownload();
				// #endif
			}).catch(error => {
				console.error('获取配置失败:', error);
			});
			
			// 初始化tabbarValue
			this.tabbarValue = this.type;
		},
		onShow() {
			
			// 页面显示时同步tabbarValue
			this.tabbarValue = this.type;

			// 如果当前是购物车页面，强制刷新cartPage组件
			if (this.type === 'cart') {
				// 通过更新tabbarKey来触发组件重新渲染
				this.tabbarKey++;
			}
			if (this.type == 'home' || this.type === 'recommend'){
				this.initBanner()
			}
			console.log('type!!!!!!!!!',this.type)
			if (this.type === 'custom') {
				this.type = 'home'
				this.tabbarValue = 'home';
			}
			// onShow中不再重复调用getConfig
		},
		created() {
			this.ledui = uni.getStorageSync('ledui')
			// 只有在用户真正登录状态下才获取用户信息
			// 避免刚退出时由于异步原因仍调用updateUserInfo
			if (this.isLoggedIn && this.userInfo && this.userInfo.id) {
				this.$store.dispatch('updateUserInfo');
			}
			console.log(uni.getStorageSync('banner'))
		},
		methods: {
			// 新增：统一刷新当前活跃页面的方法
		refreshCurrentPage() {
			// 根据不同页面类型调用对应的刷新方法
			switch(this.type) {
				case 'home':
					// 刷新首页
					const indexInstance = this.$refs.indexPage;
					if (indexInstance) {
						console.log('刷新首页');
						// 直接调用indexPage的初始化方法
						if (indexInstance.isLoggedIn) {
							indexInstance.getUserLocation();
						}
						indexInstance.initSearch();
					}
					break;
				case 'farm':
				case 'task':
				case 'recommend':
				case 'cart':
					// 这些页面主要依赖全局用户信息，切换时同步一次
					if (this.isLoggedIn && this.userInfo && this.userInfo.id) {
						this.$store.dispatch('updateUserInfo');
					}
					break;
				case 'my':
					// 刷新我的
					const myInstance = this.$refs.myPage;
					if (myInstance) {
						console.log('刷新我的');
						this.$store.dispatch('updateUserInfo');
					}
					break;
				// 可以添加其他页面的刷新逻辑
				default:
					console.log('不支持的页面类型:', this.type);
					break;
			}
		},
			initBanner(){
				
				this.$http(
					'/api/api/image', {
						type:'huodong'
					}, "GET").then(res => {
					console.log('数据',res.data)
					if(res.data.length != 0){
						if (this.isLoggedIn ) {
							this.bannerStatus = true
							// 为每个banner项的thumb添加$baseUrl前缀，并移除url中的#符号
							this.banner = res.data.map(item => {
								// 处理url，移除#符号
								let processedUrl = item.url || '';
								if (processedUrl.includes('#')) {
									processedUrl = processedUrl.replace(/#/g, '');
								}
								return {
									...item,
									thumb: this.$baseUrl + item.thumb,
									url: processedUrl
								};
							});
						}
						
					}else{
						this.bannerStatus = false
					}
					
				})
			},
			closeBanner(){
				this.bannerStatus = false
				uni.setStorageSync('banner',1)
			},
			hotActive(item){
				console.log(this.banner[item].url)
				if(this.banner[item].url){
					uni.navigateTo({
						url: '/pages/my/settings/question?type=hot&id='+this.banner[item].url
					})
				}
			},
			change(name) {

				console.log('name', name)

				// 修复登录检查逻辑
				if ((name === 'farm' || name === 'custom') && !this.isLoggedIn) {
					// if ((name === 'farm' || name === 'shop' || name === 'custom') && !this.isLoggedIn) {
					uni.$u.toast('请您先登录')
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1500)
					return false;
				}
				if (name === 'custom') {
					this.showHelp()
				}
				if (name == 'home' || name === 'recommend'){
					this.initBanner()
				}
				this.tabbarValue = name
				// 设置实际显示的页面
				this.type = name;
				// tab 内容切换时，手动触发当前页刷新（不依赖 onShow）
				this.$nextTick(() => {
					this.refreshCurrentPage();
				});

				// 切换标签页时，将页面滚动到顶部
				
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});

			},
			showHelp() {
				console.log('kefu_link', this.config.kefu_link)
				// 检查客服链接是否存在
				if (this.config && this.config.kefu_link) {
					const url = this.config.kefu_link;

					// 跳转到webview页面
					uni.navigateTo({
						url: `/pages/webview/webview`,
					});
				} else {
					uni.showToast({
						title: '客服链接暂不可用',
						icon: 'none'
					});
				}
			},
			goDownload() {
				// 检测当前安卓安装版本号并与配置版本对比自动更新
				console.log('开始版本检测...',this.config.version);
				if(this.config.version_forced){
					// 获取当前应用版本信息
					plus.runtime.getProperty(plus.runtime.appid, (inf) => {
						const currentVersion = inf.version;
						const configVersion = this.config && this.config.version ? this.config.version : '0.0.0';
						console.log('当前版本:', currentVersion);
						console.log('配置版本:', configVersion);
					
						// 比较版本号
						if (this.compareVersion(configVersion, currentVersion) > 0) {
							// 发现新版本
							uni.showModal({
								title: '版本更新',
								content: `发现新版本 ${configVersion}，是否立即更新？`,
								showCancel: true,
								cancelText: '稍后更新',
								confirmText: '立即更新',
								success: (res) => {
									if (res.confirm) {
										// 执行下载操作
										if (this.config && this.config.app_link) {
											this.downloadAndInstall(this.config.app_link);
										} else {
											uni.showToast({
												title: '下载地址未配置',
												icon: 'none'
											});
										}
									}
								}
							});
						}
					});
				}
				
			},
			// 比较版本号
			compareVersion(version1, version2) {
				const v1 = version1.split('.').map(Number);
				const v2 = version2.split('.').map(Number);

				for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
					const num1 = v1[i] || 0;
					const num2 = v2[i] || 0;

					if (num1 > num2) return 1;
					if (num1 < num2) return -1;
				}

				return 0;
			},

			// 下载并安装应用
			downloadAndInstall(downloadUrl) {
				// 显示自定义进度弹窗
				this.showDownloadProgressPopup = true;
				this.downloadProgress = 0;
				this.downloadedSize = 0;
				this.totalSize = 0;

				// 创建下载任务
				const downloadTask = uni.downloadFile({
					url: downloadUrl,
					success: (res) => {
						// 关闭自定义进度弹窗
						this.showDownloadProgressPopup = false;
						if (res.statusCode === 200) {
							// 下载成功，开始安装
							plus.runtime.install(res.tempFilePath, {
								force: false
							}, () => {
								uni.showModal({
									title: '安装成功',
									content: '应用已更新，是否立即重启？',
									showCancel: false,
									success: () => {
										plus.runtime.restart();
									}
								});
							}, (error) => {
								uni.showToast({
									title: '安装失败: ' + error.message,
									icon: 'none'
								});
							});
						} else {
							uni.showToast({
								title: '下载失败，状态码: ' + res.statusCode,
								icon: 'none'
							});
						}
					},
					fail: (error) => {
						// 关闭自定义进度弹窗
						this.showDownloadProgressPopup = false;
						uni.showToast({
							title: '下载失败: ' + error.errMsg,
							icon: 'none'
						});
					}
				});

				// 监听下载进度
				downloadTask.onProgressUpdate((res) => {
					console.log('下载进度: ' + res.progress + '%');
					console.log('已下载字节数: ' + res.totalBytesWritten);
					console.log('总字节数: ' + res.totalBytesExpectedToWrite);

					// 更新进度数据
					this.downloadProgress = res.progress;
					this.downloadedSize = res.totalBytesWritten;
					this.totalSize = res.totalBytesExpectedToWrite;
				});
			},
			// 格式化文件大小
			formatFileSize(bytes) {
				if (bytes === 0) return '0B';
				const k = 1024;
				const sizes = ['B', 'KB', 'MB', 'GB'];
				const i = Math.floor(Math.log(bytes) / Math.log(k));
				return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
			}
		}
	}
</script>

<style>
	.icon {
		width: 50rpx;
		height: 50rpx;
	}
	.download-progress-popup {
		background-color: #ffffff;
		border-radius: 30rpx;
		width: 620rpx;
		padding: 60rpx 40rpx;
	}
	
	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 40rpx;
		color: #333333;
	}
	
	.progress-info {
		width: 100%;
	}
	
	.progress-bar-container {
		width: 100%;
		margin-bottom: 20rpx;
	}
	
	.progress-bar-bg {
		width: 100%;
		height: 12rpx;
		background-color: #E5E5E5;
		border-radius: 6rpx;
		overflow: hidden;
	}
	
	.progress-bar-fill {
		height: 100%;
		background-color: #FF6B35;
		border-radius: 6rpx;
		transition: width 0.3s ease;
	}
	
	.progress-text {
		font-size: 24rpx;
		color: #666666;
		text-align: center;
	}
	
	/* 删除弹窗样式 */
	.delete-popup {
		background-color: #ffffff;
		border-radius: 30rpx;
		width: 620rpx;
	}
	
	.delete-title {
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
		margin-top: 44rpx;
	}
	
	.delete-content {
		font-size: 28rpx;
		color: #666;
		text-align: center;
		margin: 120rpx 0;
	}
	
	.default-icon {
		width: 34rpx;
		height: 34rpx;
	}
	
	.delete-actions {
		display: flex;
		justify-content: space-between;
	}
	
	.delete-actions .u-button {
		width: 200rpx;
		margin-bottom: 40rpx;
	}
	
	.add-address-button {
		background-color: #000000 !important;
		color: #ffffff !important;
		border-radius: 35rpx !important;
		font-size: 24rpx;
		height: 70rpx;
		width: 400rpx !important;
		line-height: 70rpx;
	}
	
	.u-icon__icon {
		color: #000 !important;
	}
	.banner-container {
		width: 600rpx;
		position: relative;
		padding:30rpx;
		border-radius: 35rpx;
		
	}
	.banner-swiper {
		width: 100%;
		border-radius: 35rpx;
		background-color: transparent !important;
	}
	.banner-swiper .u-swiper {
		background-color: transparent !important;
	}
	.banner-swiper .u-swiper__item {
		background-color: transparent !important;
	}
	.banner-image {
		width: 100%;
	}
	.banner-text {
		position: absolute;
		top: 50%;
		left: 20rpx;
		transform: translateY(-50%);
		color: #fff;
	}
	.banner-title {
		font-size: 36rpx;
		font-weight: bold;
		display: block;
	}
		
	.banner-subtitle {
		font-size: 24rpx;
		display: block;
		margin-top: 10rpx;
	}
	.main-tabbar /deep/ .u-tabbar__content__item-wrapper,
	.main-tabbar /deep/ .up-tabbar__content__item-wrapper {
		height: 60px !important;
		min-height: 60px !important;
	}
	.main-tabbar /deep/ .u-tabbar-item__text,
	.main-tabbar /deep/ .up-tabbar-item__text {
		font-size: 14px !important;
	}
</style>