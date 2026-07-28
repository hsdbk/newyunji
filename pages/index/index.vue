<template>
	<view class="index-container">
		<view class="hero-section">
			<view class="weather-top">
				<view class="location-row">
					<image class="location-icon" :src="$getStaticSrc('/static/index/location.png')" mode="aspectFit"></image>
					<text>{{tianqiInfo?.city?.pname}} {{tianqiInfo?.city?.name}}</text>
				</view>
				<view class="temp-text">{{tianqiInfo?.condition?.temp}}℃</view>
				<view class="condition-text">{{tianqiInfo?.condition?.condition || '多云'}}</view>
				<view class="date-text">{{ nowTimeText }}</view>
			</view>
			<view class="wind-pressure-row">
				<view class="mini-item">
					<image class="mini-icon" :src="$getStaticSrc('/static/new_index/sunc.png')" mode="aspectFit"></image>
					<view class="mini-content">
						<text class="mini-sub">日出</text>
						<text class="mini-main">{{ formatSunTime(tianqiInfo?.condition?.sunRise) }}</text>
					</view>
				</view>
				<view class="mini-item">
					<image class="mini-icon" :src="$getStaticSrc('/static/new_index/sunl.png')" mode="aspectFit"></image>
					<view class="mini-content">
						<text class="mini-sub">日落</text>
						<text class="mini-main">{{ formatSunTime(tianqiInfo?.condition?.sunSet) }}</text>
					</view>
				</view>
			</view>
			<view class="forecast-section">
				<view class="rain-forecast-card">
					<image class="rain-forecast-icon" :src="getWeatherIcon(shortInfo?.sfc?.sfCondition)" mode="aspectFit"></image>
					<view class="rain-forecast-info">
						<text class="rain-forecast-tip">{{ shortInfo?.sfc?.notice }}</text>
					</view>
				</view>
				<view class="forecast-nav-row">
					<view class="forecast-nav-card forecast-nav-hour" @tap="goHourWeather">
						<image class="forecast-icon" :src="$getStaticSrc('/static/new_index/24with.png')" mode="aspectFit"></image>
						<view class="forecast-nav-text">
							<text class="forecast-nav-title">查看24小时天气</text>
							<text class="forecast-nav-sub">查看逐小时天气详情</text>
						</view>
					</view>
					<view class="forecast-nav-card forecast-nav-day" @tap="goFutureWeather">
						<image class="forecast-icon" :src="$getStaticSrc('/static/new_index/7day.png')" mode="aspectFit"></image>
						<view class="forecast-nav-text">
							<text class="forecast-nav-title">查看未来7天天气</text>
							<text class="forecast-nav-sub">查看未来7天天气趋势</text>
						</view>
					</view>
				</view>
			</view>
			<view class="main-content">
				<view class="core-card">
					<view class="card-info">
						<image class="card-icon" :src="$getStaticSrc('/static/new_index/change.png')" mode="aspectFit"></image>
						<view class="card-title">{{tianqiInfo?.condition?.tips}}</view>
					</view>
					<view class="indicator-grid">
						<view class="indicator-item">
							<image class="indicator-icon" :src="$getStaticSrc('/static/new_index/humidity.png')" mode="aspectFit"></image>
							<text class="indicator-value">{{ tianqiInfo?.condition?.humidity || '--' }}%</text>
							<text class="indicator-label">湿度</text>
						</view>
						<view class="indicator-item">
							<image class="indicator-icon" :src="$getStaticSrc('/static/new_index/windDir.png')" mode="aspectFit"></image>
							<text class="indicator-value">{{ tianqiInfo?.condition?.windLevel || '--' }}级</text>
							<text class="indicator-label">{{ tianqiInfo?.condition?.windDir || '东风' }}</text>
						</view>
						<view class="indicator-item">
							<image class="indicator-icon" :src="$getStaticSrc('/static/new_index/uvi.png')" mode="aspectFit"></image>
							<text class="indicator-value">{{ tianqiInfo?.condition?.uvi || '--' }}级</text>
							<text class="indicator-label">紫外线</text>
						</view>
						<view class="indicator-item">
							<image class="indicator-icon" :src="$getStaticSrc('/static/new_index/hpa.png')" mode="aspectFit"></image>
							<text class="indicator-value">{{ tianqiInfo?.condition?.pressure || '--' }}</text>
							<text class="indicator-label">hpa</text>
						</view>
						<view class="indicator-item">
							<image class="indicator-icon" :src="$getStaticSrc('/static/new_index/rain.png')" mode="aspectFit"></image>
							<text class="indicator-value">{{ tianqiInfo?.condition?.humidity || '--' }}%</text>
							<text class="indicator-label">降水概率</text>
						</view>
						<view class="indicator-item">
							<image class="indicator-icon" :src="$getStaticSrc('/static/new_index/realFeel.png')" mode="aspectFit"></image>
							<text class="indicator-value">{{ tianqiInfo?.condition?.realFeel || '--' }}℃</text>
							<text class="indicator-label">体感温度</text>
						</view>
					</view>
				</view>
				<view class="quick-card">
					<!-- <view class="quick-title">快捷功能</view> -->
					<view class="quick-layout" :class="{ 'quick-layout-full': !showQuickGift }">
						<view class="quick-left">
							<view class="quick-row quick-sign-back" @click="goSignIn">
								<image class="quick-btn" :src="$getStaticSrc('/static/new_index/sign.png')" mode="aspectFit"></image>
								<view class="quick-info">
									<view class="quick-info-t">每日签到</view>
									<view class="quick-info-d">签到得奖励</view>
								</view>
							</view>
							<view class="quick-row quick-new-back" @click="goNewGuide">
								<image class="quick-btn" :src="$getStaticSrc('/static/new_index/new.png')" mode="aspectFit"></image>
								<view class="quick-info">
									<view class="quick-info-t">新手引导</view>
									<view class="quick-info-d">快速了解玩法</view>
								</view>
							</view>
						</view>
						<view class="quick-gift" v-if="showQuickGift" @click="goNewGift">
							<image class="quick-gift-img" :src="$getStaticSrc('/static/new_index/new-gift.png')" mode="aspectFill"></image>
							<view class="quick-gift-text">
								<view class="quick-gift-title" v-if="config?.xinshouduihuan_title">{{ config.xinshouduihuan_title }}</view>
								<view class="quick-gift-sub">限时领取</view>
							</view>
						</view>
					</view>
				</view>
				<view class="news-wrap">
					<view class="news-header">今日资讯</view>
					<view class="news-list">
						<view class="news-item" v-for="(news, index) in newsList.slice(0, 3)" :key="index">
							<image class="news-thumb" @tap="goNewsDetail(news.id)" :src="news.thumb ? $baseUrl + news.thumb : '/static/new_index/info-back.png'" mode="aspectFill"></image>
							<!-- <view class="news-info">
								<view class="news-main">
									<text class="news-title">{{ news.title || '天气资讯' }}</text>
									<text class="news-desc">{{ news.description || news.intro || '了解紫外线、风向与降雨趋势，及时安排出行。' }}</text>
								</view>
								<view class="detail-btn" @tap="goNewsDetail(news.id)">查看详情</view>
							</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<up-popup :show="bannerStatus" bgColor="transparent" mode="center">
			<view class="banner-container">
				<!-- <view class="banner-bg"></view> -->
				<image class="banner-bg" :src="$getStaticSrc('/static/index/bg.png')" mode="aspectFit"></image>
				<!-- <image class="banner-bg" :src="config?.home_logo?$baseUrl + config?.home_logo:''" mode="aspectFit"></image> -->
				<image class="live-icon" @click="goRegister" :src="$getStaticSrc('/static/index/home_live.png')" mode="aspectFit"></image>
				<image class="close-icon" @click="closeBanner" :src="$getStaticSrc('/static/index/close.png')" mode="aspectFit"></image>

			</view>
		</up-popup>
		<view class="kefu-float-btn" @click="showHelp">
			<!-- <image class="kefu-float-icon" src="/static/index/customer.png" mode="aspectFit"></image> -->
			<!-- <text class="kefu-float-text">客服</text> -->
		</view>
	</view>
</template>

<script>
	// 仅在App环境下加载原生插件
	let dysdk = null;
	const platform = uni.getSystemInfoSync().platform;
	// console.log('抖音SDKplatform:', platform);

	// import * as tencentChannelSdk from "@/uni_modules/lilu-tencent-channel"

	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				newsList: [],
				tianqiInfo: {},
				shortInfo:{},
				loading: true,
				lon: '',
				lat: '',
				bannerStatus: false,
				nowTimeText: '',
				timeTimer: null
			};
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn', 'config']),
			showQuickGift() {
				const switchOn = this.config?.xinshouduihuan_switch == 1 || this.config?.xinshouduihuan_switch === true || this.config?.xinshouduihuan_switch === '1'
				const userShow = this.userInfo?.xinshouduihuan != 1 || this.userInfo?.xinshouduihuan != '1'
				// console.log('switchOn',switchOn)
				// console.log('userShow',userShow)
				return !!(switchOn && userShow)
			},
			rainForecastStatus() {
				const shortRain = this.tianqiInfo?.shortRain
				if (shortRain?.desc) return shortRain.desc
				if (shortRain?.summary) return shortRain.summary
				const condition = this.tianqiInfo?.condition?.condition || ''
				if (condition.includes('雨')) return '当前有降雨，请注意出行'
				return '预计30分钟后有小雨'
			},
			rainForecastTip() {
				const condition = this.tianqiInfo?.condition?.condition || ''
				if (condition.includes('雨') || condition.includes('雪')) return '建议携带雨具出行'
				return '建议携带雨具出行'
			}
		},
		created() {
			// 只调用一次getConfig
			this.$store.dispatch('getConfig').then(() => {
				// console.log('config', this.config);

				// 执行初始化操作
				this.initApp();
				this.updateNowTime();
				// 按当前 APP 启动会话判断是否显示 banner
				const currentSessionId = uni.getStorageSync('banner_session_id')
				const closedSessionId = uni.getStorageSync('banner_closed_session_id')
				this.bannerStatus = !!(this.config?.home_status && currentSessionId && currentSessionId !== closedSessionId)
				// console.log('bannerStatus:', this.bannerStatus)

			}).catch(error => {
				console.error('获取配置失败:', error);
				// 即使获取配置失败，也执行基本初始化
				this.initApp();
			});

			// this.initDySdk();
			// this.getTencentChannel();
		},
		onLoad() {
			// onLoad中不再重复执行初始化操作
			// 所有初始化都在created的getConfig回调中执行
		},
		onShow() {
			console.log('页面切换了')
			if (this.timeTimer) {
				clearInterval(this.timeTimer);
			}
			if (this.isLoggedIn) {
				this.$store.dispatch('updateUserInfo')
			}
		},
		onUnload() {
			if (this.timeTimer) {
				clearInterval(this.timeTimer);
				this.timeTimer = null;
			}
		},
		methods: {
			getWeatherIcon(conditionId) {
				const id = conditionId ?? 0
				return this.$getStaticSrc('/static/weather/W' + id + '.png')
			},
			formatSunTime(value) {
				// console.log('时间',value)
				if (value === undefined || value === null || value === '') return '--'
				const str = String(value).trim()
				const timePart = str.includes(' ') ? str.split(' ').pop() : str
				const match = timePart.match(/^(\d{1,2}:\d{2})/)
				return match ? match[1] : '--'
			},
			/** 当前日期，格式：2026.01.01 周一 */
			formatNowDateWithWeek(date = new Date()) {
				const d = date instanceof Date ? date : new Date(date);
				const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				const y = d.getFullYear();
				const m = String(d.getMonth() + 1).padStart(2, '0');
				const day = String(d.getDate()).padStart(2, '0');
				return `${y}.${m}.${day} ${weekNames[d.getDay()]}`;
			},
			updateNowTime() {
				this.nowTimeText = this.formatNowDateWithWeek();
			},
			// 初始化应用
			initApp() {
				if (this.isLoggedIn) {
					this.getUserLocation();
				} else {
					this.loading = false
				}
				// 保存抖音渠道
				this.saveDyChannel();
				// 初始化搜索
				this.initSearch();
			},
			hasLocation() {
				const lat = Number(this.lat)
				const lon = Number(this.lon)
				return this.lat !== '' && this.lon !== '' && !Number.isNaN(lat) && !Number.isNaN(lon)
			},
			getTencentChannel() {
				// let channel = tencentChannelSdk.getChannel();
				// console.log('tencent channel: ' + channel);
			},
			initDySdk() {
				if (!dysdk) {
					console.log('抖音SDK未加载，跳过初始化');
					return;
				}
				dysdk.customEvent()
				let code = dysdk.checkPhonePermission();
				console.log('code:', code);

				if (code === '1') { //已经授权
					dysdk.init({
					    enablePlaySession: true,
					    playSessionInterval: 60000
					});

				} else { //未授权
					// 手机信息授权仅在注册页/登录后触发，首页不弹
					// let showPermission = uni.getStorageSync('showPermission') || '0'
					// if (showPermission !== '1') {
					// 	uni.setStorageSync('showPermission', '1');
					// 	dysdk.requestPhonePermission();
					// }
				}
			},
			saveDyChannel() {
				if (!dysdk) {
					// console.log('抖音SDK未加载，跳过渠道号获取');
					return;
				}
				//获取抖音分包的渠道号
				let dyChannel = dysdk.getDyChannel();
				console.log('dyChannel', dyChannel)
				uni.setStorageSync('dyChannel', dyChannel);
			},
			// 根据天气状况获取兔子图片
			getRabbitImage(condition) {
				if (!condition) return '/static/rabbit/default.png';

				// 晴天
				if (['晴', '晴天', '晴间多云'].includes(condition)) {
					return '/static/rabbit/default.png';
				}
				// 多云/阴天
				else if (['多云', '少云', '阴'].includes(condition)) {
					return '/static/rabbit/cloudy.png';
				}
				// 局部阵雨/强阵雨/雷阵雨
				else if (['局部阵雨', '强阵雨', '雷阵雨'].includes(condition)) {
					return '/static/rabbit/cloudy-day.png';
				}
				// 雾/霾等
				else if (['雾', '霾', '冻雾', '扬沙'].includes(condition)) {
					return '/static/rabbit/haze.png';
				}
				// 各种雨
				else if (['阵雨', '小阵雨', '雷电', '雷阵雨伴有冰雹', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨', '冻雨', '小到中雨', '中到大雨',
						'大到暴雨'
					].includes(condition)) {
					return '/static/rabbit/rainy-day.png';
				}
				// 各种雪
				else if (['小雪', '中雪', '大雪', '阵雪', '小阵雪', '冰雹', '冰针', '冰粒', '雨夹雪', '暴雪', '小到中雪', '中到大雪', '大到暴雪'].includes(
						condition)) {
					return '/static/rabbit/snowy-day.png';
				}
				// 沙尘暴等强风天气
				else if (['沙尘暴', '浮尘', '尘卷风', '强沙尘暴'].includes(condition)) {
					return '/static/rabbit/strong-wind.png';
				}
				// 默认情况
				else {
					return '/static/rabbit/default.png';
				}
			},
			/**
			 * 获取定位（兼容 App/小程序）
			 */
			getUserLocation() {
				if (!this.isLoggedIn) {
					return
				}
				// 判断运行环境
				const platform = uni.getSystemInfoSync().platform;

				// 1. 小程序端（使用 uni 官方 API）
				if (platform === 'mp-weixin' || platform === 'mp-alipay' || platform === 'mp-baidu') {
					uni.getSetting({
						success: (res) => {
							if (res.authSetting['scope.userLocation']) {
								this.getLocationData();
							} else {
								uni.authorize({
									scope: 'scope.userLocation',
									success: () => this.getLocationData(),
									fail: () => this.handlePermissionDenied()
								});
							}
						}
					});
				}
				// 2. App 端（使用 5+ API 处理权限）
				else if (platform === 'android' || platform === 'ios') {
					try {
						// 检查并请求定位权限
						const hasPermission = this.checkAppLocationPermission();
						if (hasPermission) {
							this.getLocationData();
						} else {
							this.handlePermissionDenied();
						}
					} catch (err) {
						console.error('App 权限检查失败：', err);
						uni.showToast({
							title: '权限检查异常',
							icon: 'none'
						});
					}
				}
			},

			/**
			 * App 端检查定位权限（核心方法）
			 * @returns {Promise<boolean>} 是否有权限
			 */
			checkAppLocationPermission() {
				return new Promise((resolve) => {
					const platform = uni.getSystemInfoSync().platform;
					// #ifdef APP
					// Android 端权限检查
					if (platform === 'android') {
						const Context = plus.android.importClass('android.content.Context');
						const Activity = plus.android.runtimeMainActivity();
						const Permission = plus.android.importClass('android.Manifest');

						// 检查精确定位权限（Android 10+ 区分粗略/精确定位）
						const hasFineLoc = Activity.checkSelfPermission(Permission.ACCESS_FINE_LOCATION) ===
							Context.PERMISSION_GRANTED;
						const hasCoarseLoc = Activity.checkSelfPermission(Permission.ACCESS_COARSE_LOCATION) ===
							Context.PERMISSION_GRANTED;

						if (hasFineLoc || hasCoarseLoc) {
							resolve(true);
						} else {
							// 请求权限
							Activity.requestPermissions([
								Permission.ACCESS_FINE_LOCATION,
								Permission.ACCESS_COARSE_LOCATION
							], 1001); // 1001 是请求码，自定义即可

							// 监听权限请求结果（Android 回调）
							plus.android.implements('android.app.Activity.OnRequestPermissionsResultCallback', {
								onRequestPermissionsResult: (requestCode, permissions, grantResults) => {
									if (requestCode === 1001) {
										const granted = grantResults[0] === Context.PERMISSION_GRANTED;
										resolve(granted);
									}
								}
							});
						}
					}

					// iOS 端权限检查
					else if (platform === 'ios') {
						const cllocationManager = plus.ios.importClass('CLLocationManager');
						const locationManager = new cllocationManager();
						const status = locationManager.authorizationStatus();

						plus.ios.deleteObject(locationManager); // 释放对象，避免内存泄漏

						// iOS 权限状态枚举：
						// 0: 未决定 1: 受限 2: 拒绝 3: 允许使用期间 4: 始终允许
						if (status === 3 || status === 4) {
							resolve(true);
						} else if (status === 0) {
							// 首次请求权限，直接调用 uni.getLocation 会触发系统弹窗
							this.getLocationData();
							resolve(false); // 先返回 false，等待用户授权后 getLocationData 处理结果
						} else {
							resolve(false); // 已拒绝
						}


					}
					// #endif
				});
			},

			/**
			 * 处理权限被拒绝的情况（引导到设置页）
			 */
			handlePermissionDenied() {
				uni.showModal({
					title: '定位权限未开启',
					content: '需要获取您的定位权限才能使用该功能，请前往系统设置开启',
					confirmText: '去设置',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							// 打开 App 系统设置页（5+ API）
							if (plus.os.name === 'Android') {
								const Intent = plus.android.importClass('android.content.Intent');
								const Settings = plus.android.importClass('android.provider.Settings');
								const Uri = plus.android.importClass('android.net.Uri');
								const activity = plus.android.runtimeMainActivity();
								const intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
								const uri = Uri.fromParts('package', activity.getPackageName(), null);
								intent.setData(uri);
								activity.startActivity(intent);
							} else if (plus.os.name === 'iOS') {
								plus.runtime.openURL('app-settings:'); // iOS 打开设置页
							}
						}
					}
				});
			},
			/**
			 * 实际获取定位数据（通用方法）
			 */
			getLocationData() {
				uni.getLocation({
					type: 'gcj02', // 国内地图推荐火星坐标系
					success: (res) => {
						// console.log('定位成功：', res);
						// 业务逻辑：赋值/调用接口等
						this.lat = res.latitude;
						this.lon = res.longitude;
						this.initData()
						this.initDay()
					},
					fail: (err) => {
						// console.error('获取定位失败：', err);
						// 区分失败原因：权限拒绝/定位服务未开/网络问题
						if (err.errMsg.includes('getLocation:fail 获取定位权限失败')) {
							this.handlePermissionDenied();
						} else {
							uni.showToast({
								title: '获取定位失败，请检查定位服务',
								icon: 'none'
							});
						}
					}
				});
			},
			initData() {
				if (!this.hasLocation()) {
					console.log('定位信息未获取，跳过天气接口请求')
					return
				}
				var that = this
				that.$http(
					'/api/tianqi/now', {
						lat: that.lat,
						lon: that.lon
					}, "POST").then(res => {
					console.log('111', res)
					that.tianqiInfo = res.data
					that.loading = false
				})
			},
			initDay() {
				if (!this.hasLocation()) {
					console.log('定位信息未获取，跳过短时预报接口请求')
					return
				}
				var that = this
				that.$http(
					'/api/tianqi/short', {
						lat: that.lat,
						lon: that.lon
					}, "POST").then(res => {
					console.log('111', res)
					that.shortInfo = res.data
					that.loading = false
				})
			
			},
			initSearch() {
				// 34.279847,108.962878
				this.$http(
					'/article/tianqi/search', {
						lat: '34.279847',
						lon: '108.962878'
					}, "POST").then(res => {
					this.newsList = res.data.list
				})
			},
			goNewGuide() {
				uni.navigateTo({
					url: '/pages/my/settings/question?type=guide'
				})
			},
			goNewGift() {
				uni.navigateTo({
					url: '/pages/index/new'
				})
			},
			goSignIn() {

				// 跳转到农场页面
				uni.redirectTo({
					url: '/pages/icon/icon?tabType=task'
				})
				// if (!this.isLoggedIn) {
				// 	uni.$u.toast('请您先登录')
				// 	setTimeout(() => {
				// 		uni.redirectTo({
				// 			url: '/pages/login/login'
				// 		})
				// 	}, 1500)
				// 	return false;
				// }
				// uni.navigateTo({
				// 	url: '/pages/index/signin'
				// })
			},
			goFutureWeather() {
				if (!this.isLoggedIn) {
					uni.$u.toast('请您先登录')
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}, 1500)
					return false;
				}
				if (this.config?.weather_auth_switch && this.userInfo.is_auth != 'Y') {
					uni.showToast({
						title: '完成实名认证，解锁完整天气服务，领取专属礼品。',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
					}, 3000)
					return false
				}
				uni.navigateTo({
					url: '/pages/index/weather'
				});
			},
			goHourWeather() {
				if (!this.isLoggedIn) {
					uni.$u.toast('请您先登录')
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login/login'
						})
					}, 1500)
					return false;
				}
				if (this.config?.weather_auth_switch && this.userInfo.is_auth != 'Y') {
					uni.showToast({
						title: '完成实名认证，解锁完整天气服务，领取专属礼品',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
					}, 3000)
					return false
				}
				uni.navigateTo({
					url: '/pages/index/day'
				});
			},
			goNewsDetail(newsId) {
				// 跳转到资讯详情页面
				uni.navigateTo({
					url: '/pages/my/settings/agreement?type=tianqi&id=' + newsId
				});
			},
			goRegister() {
				// 跳转到未来7天天气页面
				uni.navigateTo({
					url: '/pages/login/register'
				});
			},
			showHelp() {
				
				uni.navigateTo({
					// url: '/pages/webview/webview?url='+'https://wqz1w.dsqcu.com/chatlink.html'
					url: '/pages/webview/webview?url='+this.config.kefu_link
				});
			},
			closeBanner() {
				this.bannerStatus = false
				// 仅记录本次启动会话已关闭，下次重新打开 APP 再展示
				const currentSessionId = uni.getStorageSync('banner_session_id')
				if (currentSessionId) {
					uni.setStorageSync('banner_closed_session_id', currentSessionId)
				}
				console.log('banner已关闭，设置会话状态')
			}
		}
	};
</script>

<style scoped>
	page {
		background: #dff4ff;
	}

	.index-container {
		background: linear-gradient(180deg, #9adbf3 0%, #e9f8ff 52%, #f5f8fb 100%);
		min-height: 100vh;
		padding-bottom: 36rpx;
	}

	.hero-section {
		padding: 92rpx 0 0;
		min-height: 600rpx;
		background-image: url('/static/new_index/nback.png');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center top;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.weather-top {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #ffffff;
	}

	.location-row {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.95);
	}

	.location-icon {
		width: 18rpx;
		height: 22rpx;
		margin-right: 8rpx;
	}

	.temp-text {
		margin-top: 24rpx;
		font-size: 88rpx;
		font-weight: 600;
		line-height: 1.05;
		color: #ffffff;
	}

	.condition-text {
		margin-top: 12rpx;
		font-size: 48rpx;
		font-weight: 600;
	}

	.date-text {
		margin-top: 16rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.92);
	}

	.future-weather-btn {
		width:300rpx;
		height:90rpx;
		margin: 30rpx 0;
		font-size: 30rpx;
		font-weight: bold;
		color: #ffffff;
		text-align: center;
		line-height:80rpx;
		border-radius: 36rpx;
		background-image: url('/static/new_index/btn-back.png');
		background-size: 100% 100%;
		/* background-repeat: no-repeat; */
		/* background-position: center top; */
	}

	.wind-pressure-row {
		width:600rpx;
		height:100rpx;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 24rpx;
		margin-top:20rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.mini-item {
		display: flex;
		align-items: center;
	}

	.mini-icon {
		width: 52rpx;
		height: 52rpx;
		margin-right: 10rpx;
	}

	.mini-content {
		
	}

	.mini-main {
		font-size: 24rpx;
		font-weight: 600;
		color: #3a4652;
		line-height: 1.1;
	}

	.mini-sub {
		margin-top: 4rpx;
		font-size: 24rpx;
		color: #3a4652;
		margin-right: 10rpx;
	}

	.mini-divider {
		width: 2rpx;
		height: 58rpx;
		background: #dbe5ef;
		margin: 0 16rpx;
	}

	.forecast-section {
		width: 660rpx;
		margin: 30rpx auto 0;
		box-sizing: border-box;
	}

	.rain-forecast-card {
		display: flex;
		align-items: center;
		padding: 24rpx 28rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.88);
		box-shadow: 0 4rpx 16rpx rgba(43, 145, 220, 0.12);
	}

	.rain-forecast-icon {
		width: 99rpx;
		height: 95rpx;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.rain-forecast-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.rain-forecast-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1e2a35;
		line-height: 1.3;
	}

	.rain-forecast-desc,
	.rain-forecast-tip {
		margin-top: 8rpx;
		font-size: 26rpx;
		color: #4a5866;
		line-height: 1.35;
	}

	.forecast-nav-row {
		display: flex;
		justify-content: space-between;
		margin-top: 16rpx;
		gap: 16rpx;
	}

	.forecast-nav-card {
		flex: 1;
		display: flex;
		align-items: center;
		padding: 22rpx 18rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(43, 145, 220, 0.14);
	}

	.forecast-nav-hour {
		background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
	}

	.forecast-nav-day {
		background: linear-gradient(135deg, #26c6a0 0%, #00bfa5 100%);
	}

	.forecast-icon{
		width:44rpx;
		height:44rpx;
	}
	
	.forecast-nav-text {
		flex: 1;
		margin-left: 14rpx;
		display: flex;
		flex-direction: column;
	}

	.forecast-nav-title {
		font-size: 26rpx;
		font-weight: 600;
		color: #ffffff;
		line-height: 1.3;
	}

	.forecast-nav-sub {
		margin-top: 6rpx;
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.88);
		line-height: 1.3;
	}

	.main-content {
		width: 660rpx;
		margin: 24rpx auto 0;
		box-sizing: border-box;
	}
	.card-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 18rpx;
	}
	.card-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #f4fdff;
		margin-bottom: 0;
		margin-left: 12rpx;
	}
	.card-icon {
		width: 37rpx;
		height: 39rpx;
		flex-shrink: 0;
	}
	.core-card {
		border-radius: 24rpx;
		background-image: url('/static/new_index/core-back.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center top;
		padding:20rpx;
	}

	.indicator-grid {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.indicator-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.indicator-icon {
		width: 74rpx;
		height: 74rpx;
		margin-bottom: 8rpx;
	}

	.indicator-value {
		font-size: 26rpx;
		font-weight: 600;
		color: #ffffff;
		line-height: 1.1;
	}

	.indicator-label {
		margin-top: 4rpx;
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.quick-card {
		margin-top: 20rpx;
		background-image: url('/static/new_index/new-menu.png');
		background-size: 100% 100%;
		background-position: center;
		border-radius: 24rpx;
		padding: 18rpx 14rpx 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(43, 145, 220, 0.16);
	}

	.quick-title {
		font-size: 30rpx;
		font-weight: 600;
		color: rgba(232, 247, 255, 0.95);
		margin-bottom: 14rpx;
	}

	.quick-layout {
		display: flex;
		align-items: stretch;
		gap: 14rpx;
	}

	.quick-left {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 14rpx;
	}

	.quick-layout-full .quick-left {
		flex-direction: row;
	}

	.quick-layout-full .quick-row {
		flex: 1;
		width: auto;
	}

	.quick-new-back {
		background-image: url('/static/new_index/new-back.png');
		background-size: 100% 100%;
		background-position: center;
	}

	.quick-sign-back {
		background-image: url('/static/new_index/sign-back.png');
		background-size: 100% 100%;
		background-position: center;
	}

	.quick-row {
		height: 148rpx;
		align-items: center;
		display: flex;
		justify-content: center;
		padding: 0 12rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.quick-btn {
		width: 80rpx;
		height: 85rpx;
		margin-right: 16rpx;
		border-radius: 18rpx;
		flex-shrink: 0;
	}

	.quick-info-t {
		font-size: 30rpx;
		color: #fff;
		font-weight: 600;
		line-height: 1.2;
	}

	.quick-info-d {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.92);
		margin-top: 6rpx;
	}

	.quick-gift {
		width: 280rpx;
		flex-shrink: 0;
		border-radius: 30rpx;
		overflow: hidden;
		height: 310rpx;
		margin-top: 5rpx;
		position: relative;
	}

	.quick-gift-img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.quick-gift-text {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 28rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 12rpx;
	}

	.quick-gift-title {
		text-align: center;
		font-size: 38rpx;
		font-weight: bold;
		color: #fff;
		line-height: 1.2;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
	}

	.quick-gift-sub {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.2;
		text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.18);
	}

	.news-wrap {
		margin-top: 20rpx;
		background: #ffffff;
		border-radius: 30rpx;
		padding: 18rpx;
		background-image: url('/static/new_index/info.png');
		background-size: 100% 100%;
		background-position: center;
	}

	.news-header {
		font-size: 30rpx;
		font-weight: 600;
		color: #222b35;
		margin-bottom: 14rpx;
	}

	.news-list {
		display: flex;
		flex-direction: column;
		gap: 14rpx;
	}

	.news-item {
		display: flex;
		align-items: center;
		background: #f5f7fa;
		border-radius: 18rpx;
		padding: 12rpx;
		position: relative;
		height: 100rpx;
	}

	.news-thumb {
		position: absolute;
		top:0;
		left:0;
		width: 100%;
		height: 100%;
		border-radius: 14rpx;
	}

	.news-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.news-main {
		flex: 1;
		padding-right: 12rpx;
	}

	.news-title {
		font-size: 24rpx;
		font-weight: 600;
		color: #303846;
	}

	.news-desc {
		display: block;
		margin-top: 8rpx;
		font-size: 22rpx;
		color: #8996a6;
	}

	.detail-btn {
		flex-shrink: 0;
		padding: 10rpx 16rpx;
		border-radius: 30rpx;
		background: #ffe4d0;
		color: #f57f3f;
		font-size: 22rpx;
	}
	.banner-container {
		width: 100vw;
		border-radius: 35rpx;
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
	}
	.banner-icon{
		width:100%;
		height:100%;
	}
	.banner-title{
		text-align: center;
	}
	.physical-btn {
		width: 211rpx;
		height: 82rpx;
		background-image: url('/static/game/btn-back.png');
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 10rpx;
		margin-top: 10rpx;
		color: #ffffff;
		margin: 20rpx 0;
	}
	.physical-unbtn  text {
		margin-bottom: 5px;
		font-size: 28rpx;
		color: #ffffff;
	}
	.banner-bg{
		width: 760rpx;
		height:928rpx;
		object-fit: cover;
	}
	.live-icon{
		width:600rpx;
		position: absolute;
		bottom:10rpx;
	}
	.close-icon{
		width:60rpx;
		height:60rpx;
	}
	.kefu-float-btn {
		position: fixed;
		right: 24rpx;
		bottom: 180rpx;
		width: 98rpx;
		height: 98rpx;
		background-image: url('/static/index/customer.png');
		background-size: 100% 100%;
		/* border-radius: 50rpx;
		background: rgba(255, 255, 255, 0.96); */
		/* box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12); */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 99;
	}
	.kefu-float-icon {
		width: 44rpx;
		height: 44rpx;
		margin-bottom: 6rpx;
	}
	.kefu-float-text {
		font-size: 20rpx;
		color: #333333;
		line-height: 1;
	}
</style>
