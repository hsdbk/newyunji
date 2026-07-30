<template>
	<view class="login-container">
		<image class="question-icon" src="/static/index/customer.png" mode="aspectFit" @click="showHelp"></image>
		<view class="logo-area">
			<image class="logo-image" :src="$getStaticSrc('/static/logo.png')" mode="aspectFill"></image>
			<text class="logo-title">看天气·知冷暖·懂生活</text>
		</view>

		<view class="form-container">
			<view class="input-item">
				<image class="input-icon" :src="$getStaticSrc('/static/login/mobile.png')" mode="aspectFit"></image>
				<input class="input" type="number" placeholder="请输入手机号码" v-model="phone" maxlength="11" />
			</view>

			<view class="input-item">
				<image class="input-icon" :src="$getStaticSrc('/static/login/pass.png')" mode="aspectFit"></image>
				<input class="input" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码"
					v-model="password" />
				<text class="forgot-inline" @click="goForgotPassword">忘记?</text>
				<image class="eye-icon" @click="togglePassword"
					:src="showPassword ? '/static/login/see.png' : '/static/login/nosee.png'" mode="aspectFit"></image>
			</view>
			<view class="footer">
				<button class="login-btn" @click="handleLogin">登录</button>
				<button class="register-btn" @click="goRegister">注册</button>
				<!-- <view class="link-area">
					<text class="link right" @click="goRegister">注册</text>
				</view> -->
				<view class="agreement-area">
					<image class="checkbox" :src="agree ? '/static/login/check.png' : '/static/login/uncheck.png'"
						mode="aspectFit" @click="agree = !agree"></image>
					<text class="agreement-text">我已经阅读 <text class="agreement-link" @click="goUserAgreement">《用户协议》</text> 和 <text class="agreement-link" @click="goPrivacyAgreement">《隐私协议》</text></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-HARMONY
	import { getOdidInfo } from '@/uni_modules/harmony-device-id'
	// #endif
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				phone: '',
				password: '',
				showPassword: false,
				agree: false,
				ledui: 0
			}
		},
		computed: {
			...mapState(['config'])
		},
		onLoad() {
			// #ifdef APP
			this.ledui = uni.getStorageSync('ledui')
			// this.$requestAndroidPermission('android.permission.READ_PHONE_STATE').then(res => {
			// 	console.log("授权状态android====", res)
			// 	if (res === 1){
			// 		setInterval(() => {
			// 			this.$syncDevNo()
			// 		}, 5000);
			// 	}
			// })
			// #endif
		},
		onShow() {
			if (uni.getStorageSync('register')) {
				this.phone = uni.getStorageSync('register')
			}
			this.$store.dispatch('getConfig');
		},
		methods: {
			collectHarmonyOdid() {
				// #ifdef APP-HARMONY
				try {
					const device = getOdidInfo()
					console.log('ODID获取成功:', device.device_id, device.package_name)
					this.$saveOdidDevice(device)
				} catch (e) {
					console.log('getOdid failed: ' + JSON.stringify(e))
				}
				// #endif
			},
			handleBack() {
				// 返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			// 切换密码显示状态
			togglePassword() {
				this.showPassword = !this.showPassword
			},

			// 显示帮助信息
			showHelp() {
				console.log('showHelp方法被调用')
				console.log('kefu_link', this.config.kefu_link)
				// 检查客服链接是否存在
				if (this.config && this.config.kefu_link) {
					console.log('客服链接存在，跳转到webview页面')
					uni.navigateTo({
						url: `/pages/webview/webview`,
					});


				} else {
					console.log('客服链接不存在')
					uni.showToast({
						title: '客服链接暂不可用',
						icon: 'none'
					});
				}
			},

			// 登录处理
			handleLogin() {
				uni.showLoading()
				// 简单验证
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}

				if (!this.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
					return
				}

				if (!this.agree) {
					uni.showToast({
						title: '请阅读并同意用户协议和隐私协议',
						icon: 'none'
					})
					return
				}

				// 检查账户是否已被注销
				let deletedAccounts = uni.getStorageSync('deletedAccounts') || [];
				console.log('deletedAccounts', deletedAccounts)
				// 确保是数组类型
				if (!Array.isArray(deletedAccounts)) {
					deletedAccounts = [];
				}

				// 检查当前手机号是否在已注销列表中
				if (deletedAccounts.includes(this.phone)) {
					uni.showToast({
						title: '该账户已被注销',
						icon: 'none',
						duration: 2000
					});
					return;
				}

				// 这里添加实际登录逻辑
				console.log('登录信息:', {
					phone: this.phone,
					password: this.password
				});
				// 在handleLogin方法中添加
				console.log('this.$http存在吗？', !!this.$http);

				let devNo = uni.getStorageSync("dev_no"),
					devType = uni.getStorageSync("dev_type"),
					devOaid = uni.getStorageSync("dev_oaid"),
					devOaid2 = uni.getStorageSync("dev_oaid2"),	//device_getInfo
					devAndroidId = uni.getStorageSync("dev_android_id"),
					devAndroidIdRaw = uni.getStorageSync("dev_android_id_raw"),
					devClientId = uni.getStorageSync("dev_client_id"),
					deviceGetInfo = uni.getStorageSync("device_getInfo"),
					packageName = uni.getStorageSync("package_name"),
					devDeviceIdType = uni.getStorageSync("dev_device_id_type"),
					customerActiveTime = uni.getStorageSync("customer_active_time"),
					app_no = uni.getStorageSync('m_app_no'),
					app_version = uni.getStorageSync('app_version');
					console.log('获取到的dev_android_id',devAndroidId)
				const params = {
				  username: this.phone,
				  password: this.password,

				  dev_no: devNo,
				  dev_type: devType,
				  dev_oaid: devOaid,
				  dev_oaid2: devOaid2,
				  device_get_info: deviceGetInfo,
				  app_no: app_no,
				  dev_android_id: devAndroidId,
				  dev_android_id_raw: devAndroidIdRaw,
				  dev_client_id: devClientId,
				  package_name: packageName,
				  dev_device_id_type: devDeviceIdType,
				  customer_active_time: customerActiveTime,
				  app_version: app_version
				};

				// 模拟登录成功
				this.$http(
					'/api/api/login', params, "POST").then(res => {
					console.log('登录结果:', res.data)
					if (res.data.footer === 'n2') {
						this.$store.commit('setUserLoggedIn');
						uni.setStorageSync('register', "")
						this.$store.dispatch('updateUserInfo');

						const goHome = () => {
							uni.hideLoading()
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							})
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/icon/icon'
								})
							}, 1500)
						}

						// #ifdef APP
						this.$requestDeviceAuthAndCollect(this, 'login', {
							afterCollect: () => {
								this.collectHarmonyOdid()
								this.$initBytedanceConvertSdk((ok) => {
									console.log('登录后巨量SDK激活结果：', ok)
								})
							},
							onDone: (granted) => {
								if (!granted) {
									uni.hideLoading()
									// uni.showToast({
									// 	title: '未授权，已停留在登录页',
									// 	icon: 'none'
									// })
									return
								}
								setInterval(() => {
									this.$syncDevNo('login')
								}, 5000)
								goHome()
							},
							repeatOnDeny: false,
							quitOnDenied: false
						})
						// #endif
						// #ifndef APP
						goHome()
						// #endif
					} else {
						uni.hideLoading()
					}
				}).catch(error => {
					console.error('登录失败:', error);
					uni.hideLoading();
					uni.showToast({
						title: '登录失败，请重试',
						icon: 'none'
					});
				});
			},

			// 跳转到注册页面
			goRegister() {
				uni.navigateTo({
					url: '/pages/login/register'
				})
			},

			// 跳转到忘记密码页面
			goForgotPassword() {
				uni.navigateTo({
					url: '/pages/login/password'
				})
			},

			// 查看用户协议
			goUserAgreement() {
				uni.navigateTo({
					url: '/pages/my/settings/terms?type=terms'
				})
			},

			// 查看隐私协议
			goPrivacyAgreement() {
				uni.navigateTo({
					url: '/pages/my/settings/terms?type=privacy'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./default.css";
	.forgot-inline {
		font-size: 28rpx;
		color: #1b2a3b;
		margin-right: 14rpx;
	}
</style>
