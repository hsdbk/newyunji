<script>
import { warmupBaseDomain, getBaseUrl } from './stores/http.js'
import $store from './stores/index.js'
export default {
	onLaunch: function () {
		console.log('App Launch')
		uni.removeStorageSync('phone_auth_denied_quit')
		try {
			$store.commit('setBaseUrl', getBaseUrl())
		} catch (e) {}
		warmupBaseDomain()
		uni.setStorageSync('open_active', '1');
		uni.setStorageSync('dev_no', '');
		uni.setStorageSync('dev_type', '');
		uni.setStorageSync('dev_oaid', '');
		uni.setStorageSync('dev_android_id', '');
		uni.setStorageSync('dev_android_id_raw', '');
		uni.setStorageSync('package_name', '');
		uni.setStorageSync('dev_device_id_type', '');
		if (!uni.getStorageSync('customer_active_time')) {
			uni.setStorageSync('customer_active_time', Date.now())
		}
		uni.setStorageSync('dev_odid', '');
		uni.setStorageSync('step', 0);
		uni.setStorageSync('step_is_support', 0);
		uni.setStorageSync('android_version', '');
		uni.setStorageSync('in_iframe', '0');
		uni.setStorageSync('app_type', '0');
		uni.setStorageSync('m_app_no', '');
		this.syncDevNo();
	},
	onShow: function () {
		uni.setStorageSync('ledui', 1);
		this.syncDevNo();
		this.timer = setInterval(() => {
		  this.syncDevNo();
		}, 5000);
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	},
	methods: {
		getOAID(){
			plus.device.getOAID({
				success: function(e) {
					console.log('OAID获取成功:', e.oaid)
					uni.setStorageSync('dev_oaid', e.oaid)
				},
				fail: function(e) {
					console.log('getOAID failed: ' + JSON.stringify(e));
					uni.showModal({
						title: '授权提示',
						content: '应用需要获取设备识别码权限才能正常运行，是否允许？',
						confirmText: '允许',
						cancelText: '退出',
						success: function(res) {
							if (res.confirm) {
								plus.device.getOAID({
									success: function(e) {
										console.log('OAID获取成功:', e.oaid)
										uni.setStorageSync('dev_oaid', e.oaid)
									},
									fail: function(e) {
										console.log('再次获取OAID失败: ' + JSON.stringify(e));
										plus.runtime.quit();
									}
								});
							} else {
								plus.runtime.quit();
							}
						}
					});
				}
			});
		},
		getDeviceInfo(){
			plus.device.getInfo({
				success:function(e){
					console.log('getDeviceInfo success: '+JSON.stringify(e));
					uni.setStorageSync('uuid',e.uuid)
				},
				fail:function(e){
					console.log('getDeviceInfo failed: '+JSON.stringify(e));
				}
			});
		},
		getDeviceAppInfo(){
			// 1. 获取系统基础信息
			const systemInfo = uni.getSystemInfoSync();
			if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
			  // App 平台
			  uni.setStorageSync('dev_type',systemInfo.platform)
			} else if (uni.getAccountInfoSync) {
			  // 小程序平台
			  uni.setStorageSync('dev_type','miniProgram')
			} else {
			  // H5 平台
			  uni.setStorageSync('dev_type','h5')
			}
			
			if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
			  // App 平台：获取应用版本号
			  uni.setStorageSync('app_version',systemInfo.appWgtVersion || '')
			} else if (result.dev_type === 'miniProgram') {
			  // 小程序平台：获取小程序版本号
			  uni.setStorageSync('app_version',systemInfo.version || '')
			}
		},
		syncDevNo(type = 'activate') {
			if (this.$syncDevNo) {
				this.$syncDevNo(type)
			}
		},
	}
}
</script>

<style lang="scss">
@import "uview-plus/index.scss";

// 添加全局u-icon样式
.u-icon__icon {
	color: #000 !important;
	// 可以添加其他样式属性
}

.product-list {
	width: 90%;
	padding: 0 50rpx 20rpx;
}

.product-item {
	background-color: #fff;
	margin: 0 0 20rpx;
	border-radius: 30rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	position: relative;
	padding: 20rpx 0;
}

.product-image-container {

	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.product-watermark {
	position: absolute;
	bottom: 120rpx;
	right: 50rpx;
	width: 200rpx;
	height: 200rpx;
}

.product-image {
	width: 95%;
	height: 350rpx;
	border-radius: 10rpx;
}

.product-name {
	font-size: 34rpx;
	font-weight: 600;
	color: #000;
	display: block;
	margin: 10rpx;
}

.product-title {
	width: 95%;
	text-align: center;
	font-weight: bold;
	color: #fe8046;
	font-size: 36rpx;
	border: 1rpx solid #fe8046;
	padding: 10rpx 20rpx;
	margin-top: 10rpx;
	border-radius: 20rpx;
}

.product-info {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.product-desc {
	font-size: 32rpx;
	color: #FF481C;
	display: block;
	margin: 10rpx;
}

.product-sections {
	width: 80vw;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.product-sections-view {
	text-align: center;

}

.product-sections-title {
	color: #000;
	font-weight: bold;
	font-size: 28rpx;
}

.product-sections-desc {
	color: #fe8046;
	font-size: 34rpx;
}

.join-button {
	width: 500rpx;
	height: 70rpx;
	color: #fff;
	font-size: 30rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	margin: 20rpx 0;
	background-image: url('/static/my/place-back.png');
	background-size: 100% 100%;
}

// 新增一个容器来包裹两个product-stats，实现两列布局
.stats-container {
	display: flex;
	justify-content: space-between;
}

.product-stats {
	display: flex;
	flex-direction: column;
	// 移除之前的flex:1设置
	margin-bottom: 0;

	// 为第一个product-stats设置60%宽度
	&:first-child {
		width: 60%;
	}

	// 为第二个product-stats设置40%宽度
	&:nth-child(2) {
		width: 40%;
	}

	.stat-item {
		display: flex;
		// 调整间距
		margin-right: 0;
		margin-bottom: 10rpx;

		.stat-label {
			font-size: 24rpx;
			color: #979696;
		}

		.stat-value {
			font-size: 24rpx;
			color: #979696;
			margin-left: 10rpx;
		}
	}
}


.loading,
.no-more {
	padding: 90rpx 0 30rpx;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}

.popup-content {
	padding: 45rpx;
}

.popup-items {
	display: flex;

	justify-content: space-between;
}

.popup-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.popup-item-text {
	margin-left: 10rpx;
	font-size: 28rpx;
	color: #000000;
}

.popup-item-check {
	width: 28rpx;
	height: 19rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 500;
	color: #000;
	margin-bottom: 20rpx;
	display: block;
	font-weight: 800;
}

.product-info {
	// 添加flex布局和方向设置
	padding: 0 24rpx;
	display: flex;
	flex-direction: column;
	z-index: 3;
}

.product-progress {
	width: 90%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin: 10rpx 0;
}

.progress-text {
	font-size: 28rpx;
	color: #000;
	font-weight: bold;
	display: block;
	margin-bottom: 10rpx;
}

.progress-bar {
	width: 65%;
	height: 10rpx;
	background-color: #e0e0e0;
	border-radius: 5rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: #fe8046;
	border-radius: 5rpx;
}

/*每个页面公共css */
</style>