 <template>
	<view class="weather-container">
		<up-navbar @leftClick="uni.navigateBack({delta: 1});" title="天气预报" titleStyle="color:#fff;" bgColor="transparent"
			:left-show="true" :right-show="false" :safeAreaInsetTop="true">

		</up-navbar>
		<!-- 位置信息 -->
		<view class="location">{{ locationInfo }}</view>

		<view class="info">
			<!-- 日期导航 -->
			<view class="date-nav">
				<view class="date-item" v-for="(date, index) in weatherData" :key="index">
					<view class="date-week" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.week }}</view>
					<view class="date-num" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.date }}</view>
					<image class="weather-icon" :src="getWeatherIcon(date.weatherIcon)" mode="aspectFit"></image>
					<view class="weather-desc" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.weather }}</view>
					<view class="temperature" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.tempMax }}°</view>
				</view>
			</view>

			<!-- 温度曲线图 -->
			<view class="temperature-chart">
				<!-- #ifdef H5 -->
				<view id="tempChart" class="chart-container"></view>
				<!-- #endif -->

				<!-- #ifdef APP -->
				<view style="height: 350rpx">
					<l-echart ref="chart"></l-echart>
				</view>
				<!-- #endif -->
			</view>

			<!-- 详细天气信息 -->
			<view class="weather-details">
				<view class="detail-item" v-for="(date, index) in weatherData" :key="index">
					<image class="detail-icon" :src="getWeatherIcon(date.nightWeatherIcon)" mode="aspectFit"></image>
					<view class="detail-desc" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.nightWeather }}
					</view>
					<view class="wind-info" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.wind }}</view>
					<view class="wind-level" :style="index === 0 ? {color: '#2C586C'} : {}">{{ date.windLevel }}级</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入ECharts
	import * as echarts from 'echarts';
	import dayjs from 'dayjs'; // 引入dayjs用于日期处理
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				weatherData: [],
				tianqiInfo: {}, // 用于存储实况天气数据
				locationInfo: '加载中...', // 位置信息
				lon: '108.962878',
				lat: '34.279847',
				chartInstance: null,
				option: {}
			};
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn', 'config'])
		},
		onShow() {
			var that = this
			// this.initData()
			// console.log('isLoggedIn',this.isLoggedIn)
			if (this.isLoggedIn) {
				this.initSign()
				this.getUserLocation();
			}
		},
		// 修改mounted方法，移除过早的图表初始化
		mounted() {
			var that = this
			// this.getUserLocation();
			// uni.getLocation({
			//   type: 'gcj02',
			//   success: function (res) {
			//     console.log(res)
			//     if(!res){
			//       uni.$u.toast('定位获取失败')
			//     }
			//     that.lon = res.longitude
			//     that.lat = res.latitude
			//     that.  ()
			//   },
			//   fail: function (res) {
			//     console.log('当前位置的经度：' + res);
			//     uni.$u.toast('定位获取失败')
			//   }
			// });
			
			
			// 不在这里初始化图表，因为数据还没有准备好
			// 图表初始化应该在数据获取成功后进行
		},
		// 移除错误放置的H5环境代码块
		methods: {
			/**
			 * 获取定位（兼容 App/小程序）
			 */
			/**
			 * 获取定位（兼容 App/小程序）
			 */
			getUserLocation() {
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
						console.log('定位成功：', res);
						// 业务逻辑：赋值/调用接口等
						this.lat = res.latitude;
						this.lon = res.longitude;
						this.initData()
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
			initData() {
				console.log('当前位置：', this.lat, this.lon);
				// 调用15天预报接口
				this.$http(
					'/api/tianqi/day', {
						lat: this.lat,
						lon: this.lon
					}, "POST").then(res => {
						console.log('7天',res.data)
					// 处理接口返回的数据，映射到页面需要的字段
					this.weatherData = this.processForecastData(res.data.forecast);
					this.locationInfo = res.data.city.name || '未知位置'
					// 重新初始化图表
					this.initECharts();
					// this.$nextTick(() => {
						
					// });
				}).catch(err => {
					console.error('获取天气预报失败:', err);
					uni.$u.toast('获取天气预报失败，请稍后重试');
				})
			},
			initSign() {
				this.$http(
					'/api/tianqi/sign', {}, "POST").then(res => {
					uni.$u.toast('天气打卡成功')
				})
			},
			// 处理预报数据，将接口字段映射到页面使用的字段
			processForecastData(data) {
				if (!data || !Array.isArray(data)) {
					console.error('无效的天气预报数据:', data);
					return [];
				}

				// 计算今天是星期几
				const today = new Date();
				const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

				// 只处理前7天的数据
				const limitedData = data.slice(0, 7);

				return limitedData.map((item, index) => {
					// 解析日期
					const date = new Date(item.predictDate);
					const dateStr = dayjs(date).format('MM/DD');

					// 计算星期
					let week;
					if (index === 0) {
						week = '今天';
					} else if (index === 1) {
						week = '明天';
					} else {
						week = weekDays[date.getDay()];
					}

					return {
						id: index + 1,
						week: week,
						date: dateStr,
						weather: item.conditionDay || '未知',
						weatherIcon: item.conditionIdDay || '未知',
						nightWeather: item.conditionNight || '未知',
						nightWeatherIcon: item.conditionIdNight || '未知',
						tempMax: item.tempDay || 0,
						tempMin: item.tempNight || 0,
						wind: item.windDirDay || '未知',
						windLevel: item.windLevelDay || '0级'
					};
				});
			},
			// 获取天气图标
			getWeatherIcon(conditionId) {
				return '/static/weather/W' + conditionId + '.png'; // 默认图标
			},
			// 获取空气质量样式类
			getAirQualityClass(quality) {
				switch (quality) {
					case '优':
						return 'air-excellent';
					case '良':
						return 'air-good';
					case '轻度污染':
						return 'air-moderate';
					default:
						return 'air-good';
				}
			},
			// 初始化ECharts
			// 修复initECharts方法
			initECharts() {
				
				// 准备数据
				const dates = this.weatherData.map(item => item.week);
				const maxTemps = this.weatherData.map(item => item.tempMax);
				const minTemps = this.weatherData.map(item => item.tempMin);
			
				// 配置图表
				this.option = {
					tooltip: {
						trigger: 'axis',
						formatter: function(params) {
							let result = params[0].axisValue + '<br/>';
							params.forEach(param => {
								result += `${param.marker} ${param.seriesName}: ${param.value}°C<br/>`;
							});
							return result;
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '15%', // 增加底部空间
						top: '15%', // 增加顶部空间
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: dates,
						axisLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						}
					},
					yAxis: {
						type: 'value',
						axisLine: {
							show: false
						},
						axisLabel: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false, // 隐藏y轴分割线
							lineStyle: {
								color: '#eee',
								type: 'solid'
							}
						}
					},
					series: [{
							name: '最高温度',
							type: 'line',
							data: maxTemps,
							smooth: true, // 平滑曲线
							lineStyle: {
								color: '#FFA500',
								width: 4
							},
							itemStyle: {
								color: '#FFA500',
								borderColor: '#fff',
								borderWidth: 2
							},
							symbolSize: 10,
							// 显示数据标签
							label: {
								show: true,
								position: 'top',
								color: '#333',
								formatter: '{c}°'
							}
						},
						{
							name: '最低温度',
							type: 'line',
							data: minTemps,
							smooth: true, // 平滑曲线
							lineStyle: {
								color: '#4682B4',
								width: 4
							},
							itemStyle: {
								color: '#4682B4',
								borderColor: '#fff',
								borderWidth: 2
							},
							symbolSize: 10,
							// 显示数据标签
							label: {
								show: true,
								position: 'bottom',
								color: '#333',
								formatter: '{c}°'
							}
						}
					]
				};
				console.log('option',this.option)
				// 渲染图表
				// #ifdef H5
				// 获取容器元素
				const chartContainer = document.getElementById('tempChart');
				if (!chartContainer) return;
							
				// 如果weatherData为空，不初始化图表
				if (!this.weatherData || this.weatherData.length === 0) {
					console.warn('没有天气数据，无法渲染温度曲线');
					return;
				}
				// 创建图表实例
				this.chartInstance = echarts.init(chartContainer);
				this.chartInstance.setOption(this.option); // 修复变量引用错误
				// 监听窗口大小变化，调整图表尺寸
				window.addEventListener('resize', () => {
					if (this.chartInstance) {
						this.chartInstance.resize();
					}
				});
				// #endif
				// #ifdef APP
				console.log('option',this.option)
				this.$refs.chart.init(echarts, chart=> {
					chart.setOption(this.option);
				});
				// #endif
			
				
			}
		}
	};
</script>

<style scoped>
	.weather-container {
		background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
		min-height: 100vh;
		padding: 30rpx;
		box-sizing: border-box;
		background-image: url('/static/weather/back.png');
		background-size: 100% 100%;
	}

	.u-icon__icon {
		color: #ffffff !important
	}

	.location {
		font-size: 36rpx;
		font-weight: bold;
		color: #fff;
		margin-top: 345rpx;
		margin-bottom: 30rpx;
	}

	/* 实况天气样式 */
	.current-weather {
		text-align: center;
		margin-bottom: 30rpx;
		color: #fff;
	}

	.current-temp {
		font-size: 120rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.current-condition {
		font-size: 36rpx;
		margin-bottom: 20rpx;
	}

	.current-detail {
		display: flex;
		justify-content: center;
		gap: 30rpx;
		font-size: 28rpx;
		opacity: 0.9;
	}

	.current-detail .detail-item {
		display: inline-block;
	}

	.info {
		background-color: rgba(255, 255, 255, 0.5);
		padding: 30rpx;
		border-radius: 30rpx;
		background-image: url('/static/weather/weather-back.png');
		background-size: 100% 100%;
		color: #fff;
	}

	.date-nav {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;

	}

	.date-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 15%;
	}

	.date-week {
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}

	.date-num {
		font-size: 24rpx;
		margin-bottom: 15rpx;
	}

	.weather-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}

	.weather-desc {
		font-size: 24rpx;
		margin-bottom: 10rpx;
	}

	.temperature {
		font-size: 28rpx;
		font-weight: bold;
	}

	.temperature-chart {
		height: 280rpx;
		/* 增加高度以容纳标签 */
		margin-bottom: 40rpx;
	}

	/* ECharts容器样式 */
	.chart-container {
		width: 100%;
		height: 100%;
	}

	.weather-details {
		display: flex;
		justify-content: space-between;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 15%;
	}

	.detail-icon {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 10rpx;
	}

	.detail-desc {
		font-size: 24rpx;
		margin-bottom: 10rpx;
	}

	.wind-info {
		font-size: 22rpx;
		margin-bottom: 5rpx;
	}

	.wind-level {
		font-size: 22rpx;
		margin-bottom: 15rpx;
	}

	.air-quality {
		padding: 5rpx 15rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		color: white;
	}

	.air-excellent {
		background-color: #08D925;
	}

	.air-good {
		background-color: #EECF15;
	}

	.air-moderate {
		background-color: #FFA500;
	}
</style>



