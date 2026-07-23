<template>
	<view class="day-container">
		<up-navbar @leftClick="goBack" title="24小时天气" titleStyle="color:#fff;" bgColor="transparent"
			:left-show="true" :right-show="false" :safeAreaInsetTop="true"></up-navbar>

		<view class="page-content">
			<view class="alert-card" v-if="alertInfo">
				<view class="alert-top">
					<view class="alert-col alert-level-col">
						<image class="alert-icon" :src="getAlertIcon(alertInfo.infoid)" mode="aspectFit"></image>
						<view class="alert-level-text">
							<text class="alert-label">预警等级</text>
							<text class="alert-level" :style="{ color: alertLevelColor }">{{ alertInfo.level || '--' }}</text>
						</view>
					</view>
					<view class="alert-col">
						<text class="alert-label">预警名称</text>
						<text class="alert-value">{{ alertInfo.name || '--' }}</text>
					</view>
					<view class="alert-col">
						<text class="alert-label">发布时间</text>
						<text class="alert-value">{{ alertInfo.pubTime || '--' }}</text>
					</view>
				</view>
				<view class="alert-bottom">
					<view class="alert-col alert-title-col">
						<text class="alert-label">标题</text>
						<text class="alert-value alert-value-multi">{{ alertInfo.title || '--' }}</text>
					</view>
					<view class="alert-col alert-type-col">
						<text class="alert-label">预警类型</text>
						<text class="alert-value">{{ alertInfo.type || '--' }}</text>
					</view>
				</view>
			</view>

			<view class="glass-card hour-card">
				<view class="card-header">
					<image class="card-header-icon" :src="$getStaticSrc('/static/new-weather/hour.png')" mode="aspectFit"></image>
					<text class="card-header-title">24小时天气</text>
				</view>
				<view class="hour-full-wrap">
					<view class="hour-row">
						<view class="hour-item" v-for="(item, index) in displayHourList" :key="'hour-' + index">
							<text class="hour-time">{{ item.time }}</text>
							<image class="hour-icon" :src="getWeatherIcon(item.iconDay)" mode="aspectFit"></image>
							<text class="hour-temp">{{ item.temp }}°</text>
						</view>
					</view>
				</view>
				<view class="hour-chart">
					<!-- #ifdef H5 -->
					<view id="hourChart" class="chart-container"></view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view class="chart-wrap">
						<l-echart ref="hourChart"></l-echart>
					</view>
					<!-- #endif -->
					<!-- #ifndef H5 || APP -->
					<view class="chart-wrap">
						<l-echart ref="hourChart"></l-echart>
					</view>
					<!-- #endif -->
				</view>
				<view class="hour-full-wrap hour-pop-wrap">
					<view class="hour-row">
						<view class="hour-item" v-for="(item, index) in displayHourList" :key="'pop-' + index">
							<text class="hour-pop">{{ item.pop }}%</text>
						</view>
					</view>
				</view>
			</view>

			<view class="glass-card detail-card">
				<view class="detail-panel">
					<view class="card-header">
						<image class="card-header-icon" :src="$getStaticSrc('/static/new-weather/wind.png')" mode="aspectFit"></image>
						<text class="card-header-title">气象详情</text>
					</view>
					<view class="detail-grid">
						<view class="detail-item" v-for="(item, index) in detailList" :key="index">
							<image class="detail-icon" :src="$getStaticSrc('/static/new-weather/' + item.icon)" mode="aspectFit"></image>
							<view class="detail-text">
								<text class="detail-label">{{ item.label }}</text>
								<text class="detail-value">{{ item.value }}</text>
								<text class="detail-sub">{{ item.sub }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as echarts from 'echarts'
	import dayjs from 'dayjs'; // 引入dayjs用于日期处理
	import {
		mapState
	} from 'vuex'
	const MOCK_ALERT = {
		content: '东城区气象台29日16时31分发布寒潮蓝色预警，受强冷空气影响，预计11月30日至12月1日，东城区将出现寒潮天气，最低气温降幅8℃左右，12月1日夜间气温降至-5℃左右，请注意防范。（预警信息来源：国家预警信息发布中心）',
		infoid: 56,
		level: '蓝色',
		name: '寒潮',
		pub_time: '2025-11-29 16:31:00',
		title: '东城区气象台发布寒潮蓝色预警[IV/一般]',
		type: '寒潮蓝色',
		update_time: '2025-11-29 16:34:35'
	}

	export default {
		data() {
			return {
				hourInfo: {},
				hourList: [],
				alertInfo: null,
				lon: '108.962878',
				lat: '34.279847',
				chartOption: {},
				chartInstance: null
			}
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn', 'config']),
			displayHourList() {
				const list = Array.isArray(this.hourList) ? this.hourList : []
				return list.filter((_, index) => index % 2 === 0)
			},
			alertLevelColor() {
				const level = String(this.alertInfo?.level || '')
				if (level.includes('红')) return '#e53935'
				if (level.includes('橙')) return '#ff9800'
				if (level.includes('黄')) return '#f5a623'
				if (level.includes('蓝')) return '#2f9bff'
				return '#f5a623'
			},
			detailList() {
				const c = this.hourInfo || {}
				return [{
					label: '降水概率',
					value: this.formatValue(c.pop ?? c.rainPercent, '%'),
					sub: '未来2小时',
					icon: 'rain.png'
				}, {
					label: '体感温度',
					value: this.formatValue(c.realFeel, '°C'),
					sub: '与昨日接近',
					icon: 'realFeel.png'
				}, {
					label: '风向风速',
					value: `${c.windDir || '--'} ${c.windlevel || '--'}级`,
					sub: c.windSpeed ? `${c.windSpeed} km/h` : '--',
					icon: 'windDir.png'
				}, {
					label: '相对湿度',
					value: this.formatValue(c.humidity, '%'),
					sub: '体感舒适',
					icon: 'humidity.png'
				}, {
					label: '气压',
					value: c.pressure ? `${c.pressure} hPa` : '--',
					sub: '标准',
					icon: 'hpa.png'
				}, {
					label: '紫外线强度',
					value: c.uvi ? `${c.uvi} 级` : '--',
					sub: '标准',
					icon: 'uvi.png'
				}]
			}
		},
		onShow() {
			var that = this
			// this.initData()
			// this.initAlert()
			// console.log('isLoggedIn',this.isLoggedIn)
			if (this.isLoggedIn) {
				this.getUserLocation();
			}
		},
		methods: {
			/**
			 * 获取定位（兼容 App/小程序）
			 */
			getUserLocation() {
				// 判断运行环境
				const platform = uni.getSystemInfoSync().platform;
				console.log(platform)
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
						console.log('定位成功：', res);
						// 业务逻辑：赋值/调用接口等
						this.lat = res.latitude;
						this.lon = res.longitude;
						this.initData()
						this.initAlert()
					},
					fail: (err) => {
						console.error('获取定位失败：', err);
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
			goBack() {
				uni.navigateBack({ delta: 1 })
			},
			formatValue(value, suffix = '') {
				if (value === undefined || value === null || value === '') return '--'
				return `${value}${suffix}`
			},
			getWeatherIcon(conditionId) {
				const id = conditionId ?? 0
				return this.$getStaticSrc('/static/weather/W' + id + '.png')
			},
			formatHourTime(hour) {
				if (hour === undefined || hour === null || hour === '') return '--'
				const str = String(hour).trim()
				if (str.includes(':')) {
					const parts = str.split(':')
					return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`
				}
				return `${str.padStart(2, '0')}:00`
			},
			getAlertIcon(infoid) {
				const id = infoid ?? 0
				const ext = Number(id) === 88 ? 'jpg' : 'png'
				return this.$getStaticSrc(`/static/icon-weather/icon_weather_warning_${id}.${ext}`)
			},
			parseAlert(data) {
				let alert = null
				if (Array.isArray(data?.alert) && data.alert.length) {
					alert = data.alert[0]
				} else if (data?.alert && typeof data.alert === 'object') {
					alert = data.alert
				} else if (Array.isArray(data?.alerts) && data.alerts.length) {
					alert = data.alerts[0]
				} else if (data?.warning) {
					alert = data.warning
				}
				if (!alert) {
					// alert = MOCK_ALERT
					
				}
				return {
					infoid: alert.infoid ?? 0,
					level: alert.level || '--',
					name: alert.name || '--',
					pubTime: alert.pub_time || alert.pubTime || alert.publishTime || '--',
					title: alert.title || '--',
					type: alert.type || '--',
					content: alert.content || ''
				}
			},
			processHourList(data) {
				const list = data?.hourly || data?.hour || data?.hours || data?.forecast || []
				if (!Array.isArray(list)) return []
				return list.slice(0, 24).map(item => ({
					time: this.formatHourTime(item.hour ?? item.time),
					temp: item.temp ?? item.temperature ?? item.tempDay ?? '--',
					conditionId: item.conditionId ?? item.weatherIcon ?? item.icon ?? item.conditionCode ?? 0,
					pop: item.pop ?? item.precipitation ?? item.rainPercent ?? item.probability ?? '--'
				}))
			},
			initData() {
				this.$http('/api/tianqi/hour', {
					lat: this.lat,
					lon: this.lon
				}, 'POST').then(res => {
					const data = res.data || {}
					const hourly = Array.isArray(data.hourly) ? data.hourly : []
					this.hourInfo = hourly[0] || {}
					this.hourList = this.processHourList(data)
					this.initChart()
				}).catch(() => {
					this.hourList = []
					uni.$u.toast('获取24小时天气失败')
				})
			},
			initAlert() {
				this.$http('/api/tianqi/alert', {
					lat: this.lat,
					lon: this.lon
				}, 'POST').then(res => {
					const data = res.data || {}
					this.alertInfo = this.parseAlert(data)
					
				})
			},
			
			initChart() {
				const list = this.displayHourList || []
				if (!list.length) return
				const times = list.map(item => item.time)
				const temps = list.map(item => Number(item.temp) || 0)
				this.chartOption = {
					grid: {
						left: '4%',
						right: '4%',
						top: '12%',
						bottom: '8%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: times,
						axisLine: { show: false },
						axisTick: { show: false },
						axisLabel: { show: false }
					},
					yAxis: {
						type: 'value',
						axisLine: { show: false },
						axisTick: { show: false },
						axisLabel: { show: false },
						splitLine: { show: false }
					},
					series: [{
						type: 'line',
						data: temps,
						smooth: true,
						symbol: 'circle',
						symbolSize: 6,
						lineStyle: {
							color: '#2f9bff',
							width: 3
						},
						itemStyle: {
							color: '#2f9bff'
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(47, 155, 255, 0.35)'
							}, {
								offset: 1,
								color: 'rgba(47, 155, 255, 0.02)'
							}])
						}
					}]
				}
				this.$nextTick(() => {
					// #ifdef H5
					const chartDom = document.getElementById('hourChart')
					if (!chartDom) return
					if (this.chartInstance) {
						this.chartInstance.dispose()
					}
					this.chartInstance = echarts.init(chartDom)
					this.chartInstance.setOption(this.chartOption)
					// #endif
					// #ifdef APP
					if (this.$refs.hourChart) {
						this.$refs.hourChart.init(echarts, chart => {
							chart.setOption(this.chartOption)
						})
					}
					// #endif
					// #ifndef H5 || APP
					if (this.$refs.hourChart) {
						this.$refs.hourChart.init(echarts, chart => {
							chart.setOption(this.chartOption)
						})
					}
					// #endif
				})
			}
		}
	}
</script>

<style scoped>
	.day-container {
		min-height: 100vh;
		background-image: url('/static/new_index/nback.png');
		background-size: cover;
		background-position: center top;
		background-color: #8ecde8;
	}

	.u-icon__icon {
		color: #ffffff !important;
	}

	.page-content {
		padding: 320rpx 24rpx 40rpx;
		box-sizing: border-box;
		background-image: url('/static/new-weather/back.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.alert-card {
		background-image: url('/static/new-weather/yujing-back.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 24rpx;
		padding: 28rpx 20rpx;
		margin-bottom: 20rpx;
		box-sizing: border-box;
	}

	.alert-top,
	.alert-bottom {
		display: flex;
		align-items: stretch;
	}

	.alert-col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 14rpx;
	}

	.alert-level-col {
		flex: 1.15;
		flex-direction: row;
		align-items: center;
		padding-left: 0;
	}

	.alert-level-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		margin-left: 10rpx;
	}

	.alert-title-col {
		flex: 2;
		margin-top:40rpx;
	}

	.alert-type-col {
		flex: 1;
        margin-left:20rpx;
	}

	.alert-icon {
		width: 100rpx;
		height: 100rpx;
		flex-shrink: 0;
	}

	.alert-divider-v {
		width: 1rpx;
		background: rgba(180, 190, 200, 0.55);
		flex-shrink: 0;
	}

	.alert-divider-h {
		height: 1rpx;
		background: rgba(180, 190, 200, 0.55);
		margin: 20rpx 0;
	}

	.alert-label {
		font-size: 22rpx;
		color: #8a96a3;
		line-height: 1.3;
	}

	.alert-level {
		margin-top: 6rpx;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 1.2;
	}

	.alert-value {
		margin-top: 6rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #1e2a35;
		line-height: 1.35;
	}

	.alert-value-multi {
		font-weight: 500;
		word-break: break-all;
	}

	.glass-card {;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		backdrop-filter: blur(8px);
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 18rpx;
	}

	.card-header-icon {
		width: 34rpx;
		height: 34rpx;
		margin-right: 10rpx;
	}

	.card-header-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #2f3a45;
	}

	.hour-card {
		overflow: hidden;
		background-image: url('/static/new-weather/hour-back.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.hour-full-wrap {
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}

	.hour-pop-wrap {
		margin-top: 4rpx;
	}

	.hour-row {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;
	}

	.hour-item {
		flex: 1;
		min-width: 0;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
	}

	.hour-time {
		font-size: 18rpx;
		color: #6d7b88;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hour-icon {
		width: 36rpx;
		height: 36rpx;
		margin: 6rpx 0;
	}

	.hour-temp {
		font-size: 22rpx;
		font-weight: 600;
		color: #2f3a45;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.hour-chart {
		width: 100%;
		margin-top: 8rpx;
		margin-bottom: 4rpx;
		overflow: hidden;
	}

	.chart-container,
	.chart-wrap {
		width: 100%;
		height: 180rpx;
	}

	.hour-pop {
		font-size: 18rpx;
		color: #6d7b88;
		padding-top: 8rpx;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.detail-card {
		background: transparent;
		padding: 0;
		backdrop-filter: none;
	}

	.detail-panel {
		width: 100%;
		background-image: url('/static/new-weather/info-back.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		border-radius: 24rpx;
		padding: 28rpx 22rpx 24rpx;
		box-sizing: border-box;
	}

	.detail-panel .card-header {
		margin-bottom: 0;
		padding-left: 4rpx;
	}

	.detail-grid {
		margin-top: 22rpx;
		height: 300rpx;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		column-gap: 10rpx;
		row-gap: 16rpx;
		box-sizing: border-box;
	}

	.detail-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding: 0 4rpx 0 8rpx;
		min-width: 0;
		overflow: hidden;
	}

	.detail-icon {
		width: 56rpx;
		height: 56rpx;
		flex-shrink: 0;
		margin-right: 6rpx;
	}

	.detail-text {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.detail-label {
		font-size: 20rpx;
		color: #5f6d7a;
		line-height: 1.2;
	}

	.detail-value {
		margin-top: 2rpx;
		font-size: 26rpx;
		font-weight: 600;
		color: #1e2a35;
		line-height: 1.2;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.detail-sub {
		margin-top: 2rpx;
		font-size: 18rpx;
		color: #8a96a3;
		line-height: 1.2;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
