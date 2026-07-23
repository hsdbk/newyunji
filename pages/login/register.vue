<template>
	<view class="login-container register-page">
		<!-- 右上角问号图标 -->
		<image class="question-icon" src="/static/index/customer.png" mode="aspectFit" @click="showHelp"></image>
		<scroll-view class="register-scroll" scroll-y>
			<view class="logo-area">
				<image class="logo-image" :src="$getStaticSrc('/static/logo.png')" mode="aspectFill"></image>
				<text class="logo-title">看天气·知冷暖·懂生活</text>
			</view>

			<view class="form-container register-form">
				<!-- 手机号输入 -->
				<view class="input-item">
					<image class="input-icon" :src="$getStaticSrc('/static/login/mobile.png')" mode="aspectFit"></image>
					<input class="input" type="number" placeholder="请输入手机号码" v-model="phone" maxlength="11" />
				</view>

				<!-- 图形验证码输入 -->
				<view class="input-item">
					<image class="input-icon" :src="$getStaticSrc('/static/login/tcode.png')" mode="aspectFit"></image>
					<input class="input" type="text" placeholder="输入图形验证码" v-model="captcha" maxlength="6" />
					<image class="captcha-image" :src="tcode" mode="aspectFit" @click="refreshCaptcha"></image>
				</view>

				<!-- 手机验证码输入 -->
				<view class="input-item">
					<image class="input-icon" :src="$getStaticSrc('/static/login/mobile.png')" mode="aspectFit"></image>
					<input class="input" type="number" placeholder="输入手机验证码" v-model="smsCode" maxlength="6" />
					<button class="get-code-btn" :disabled="countdown > 0"
						@click="getVerificationCode">{{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}</button>
				</view>

				<!-- 密码输入 -->
				<view class="input-item">
					<image class="input-icon" :src="$getStaticSrc('/static/login/pass.png')" mode="aspectFit"></image>
					<input class="input" :type="showPassword ? 'text' : 'password'" placeholder="请输入登录密码"
						v-model="password" />
					<image class="eye-icon" @click="togglePasswordVisibility('showPassword')"
						:src="showPassword ? '/static/login/see.png' : '/static/login/nosee.png'" mode="aspectFit">
					</image>
				</view>

				<!-- 再次输入密码 -->
				<view class="input-item">
					<image class="input-icon" :src="$getStaticSrc('/static/login/pass.png')" mode="aspectFit"></image>
					<input class="input" :type="showConfirmPassword ? 'text' : 'password'" placeholder="再次输入登录密码"
						v-model="confirmPassword" />
					<image class="eye-icon" @click="togglePasswordVisibility('showConfirmPassword')"
						:src="showConfirmPassword ? '/static/login/see.png' : '/static/login/nosee.png'"
						mode="aspectFit">
					</image>
				</view>

				<!-- 邀请码输入 -->
				<view class="input-item">
					<image class="input-icon" :src="$getStaticSrc('/static/login/invite.png')" mode="aspectFit"></image>
					<input class="input" type="text" placeholder="请输入邀请码(选填)" v-model="inviteCode" maxlength="11" />
				</view>
			</view>
		</scroll-view>
		<view class="footer register-footer">
			<button class="register-btn" @click="handleRegister">注册</button>
			<button class="login-btn" @click="goLogin">登录</button>
			<view class="agreement-area">
				<image class="checkbox" :src="agree ? '/static/login/check.png' : '/static/login/uncheck.png'"
					mode="aspectFit" @click="agree = !agree"></image>
				<text class="agreement-text">我已经阅读 <text class="agreement-link" @click="goUserAgreement">《用户协议》</text> 和
					<text class="agreement-link" @click="goPrivacyAgreement">《隐私协议》</text></text>
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
				captcha: '',
				smsCode: '',
				password: '',
				confirmPassword: '',
				inviteCode: '',
				showPassword: false,
				showConfirmPassword: false,
				agree: false,
				countdown: 0,
				timer: null,
				tcode: "",
				oaid: "",

				isIos: false
			}
		},
		computed: {
			...mapState(['config'])
		},
		onUnload() {
			// 清除定时器
			if (this.timer) {
				clearInterval(this.timer)
			}
		},
		onLoad(e) {
			this.inviteCode = e.inviteCode
			// #ifdef APP
			this.isIos = (plus.os.name == "iOS")
			this.ensureRegisterDeviceInfo()
			// #endif
		},
		onShow() {
			this.getCaptcha()
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
			initAdSdk(onDone) {
				// #ifdef APP
				this.$initBytedanceConvertSdk(onDone)
				// #endif
				// #ifndef APP
				onDone && onDone(false)
				// #endif
			},
			ensureRegisterDeviceInfo() {
				this.$ensureAndroidIdRawCollected(this, 'activate', {
					afterCollect: () => {
						this.collectHarmonyOdid()
						this.initAdSdk((ok) => {
							console.log('注册页巨量SDK激活结果：', ok)
							console.log('注册页设备信息采集完成，AndroidID原始值：' + uni.getStorageSync('dev_android_id_raw'))
							console.log('注册页设备信息采集完成，AndroidID上报值：' + uni.getStorageSync('dev_android_id'))
						})
					}
				})
			},
			handleBack() {
				// 返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			// 显示帮助信息
			showHelp() {
				console.log('kefu_link', this.config.kefu_link)
				// 检查客服链接是否存在
				if (this.config && this.config.kefu_link) {
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

			// 切换密码显示状态
			togglePasswordVisibility(field) {
				this[field] = !this[field]
			},
			getCaptcha() {
				this.$http(
					'/api/api/imageCode', {}, "GET").then(res => {
					console.log(res)
					this.tcode = res.data.code
				})
			},
			// 刷新图形验证码
			refreshCaptcha() {
				this.getCaptcha()
			},
			sendCode() {
				// 支付密码3
				// 登录密码4
				this.$http(
					'/api/api/code', {
						mobile: this.phone,
						type: 'register',
						image_code: this.captcha
					}, "POST").then(res => {
					if (res.code == 200) {
						// 开始倒计时
						this.countdown = 60
						this.startCountdown()

						uni.showToast({
							title: '验证码已发送',
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			// 获取手机验证码
			getVerificationCode() {
				// 验证手机号
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}

				// 验证图形验证码
				if (!this.captcha) {
					uni.showToast({
						title: '请输入图形验证码',
						icon: 'none'
					})
					return
				}


				this.sendCode()
			},
			// 开始倒计时
			startCountdown() {
				if (this.timer) {
					clearInterval(this.timer)
				}

				this.timer = setInterval(() => {
					this.countdown--
					if (this.countdown <= 0) {
						clearInterval(this.timer)
					}
				}, 1000)
			},

			// 表单验证
			validateForm() {
				// 验证手机号
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return false
				}

				// 验证图形验证码
				if (!this.captcha) {
					uni.showToast({
						title: '请输入图形验证码',
						icon: 'none'
					})
					return false
				}

				// 验证手机验证码
				if (!this.smsCode || this.smsCode.length !== 6) {
					uni.showToast({
						title: '请输入6位手机验证码',
						icon: 'none'
					})
					return false
				}

				// 验证密码
				if (!this.password || this.password.length < 6) {
					uni.showToast({
						title: '密码长度不能少于6位',
						icon: 'none'
					})
					return false
				}

				// 验证两次密码是否一致
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					})
					return false
				}

				// 验证是否同意协议
				if (!this.agree) {
					uni.showToast({
						title: '请阅读并同意用户协议和隐私协议',
						icon: 'none'
					})
					return false
				}

				return true
			},

			// 注册处理
			handleRegister() {
				var that = this
				// #ifdef APP-PLUS
				if (plus.os.name === 'Android' && !uni.getStorageSync('dev_android_id_raw') && uni.getStorageSync('permission_read_phone_state') === 1) {
					this.$collectAndroidDeviceInfo()
				}
				// #endif
				// 模拟注册成功
				uni.showLoading({
					title: '注册中...'
				})

				let devNo = uni.getStorageSync("dev_no"),
					devType = uni.getStorageSync("dev_type"),
					devOaid = uni.getStorageSync("dev_oaid"),
					devOaid2 = uni.getStorageSync("dev_oaid2"), //device_getInfo
					devOdid = uni.getStorageSync('dev_odid'),
					devAndroidId = uni.getStorageSync("dev_android_id"),
					devAndroidIdRaw = uni.getStorageSync('dev_android_id_raw'),
					devClientId = uni.getStorageSync("dev_client_id"),
					deviceGetInfo = uni.getStorageSync("device_getInfo"),
					packageName = uni.getStorageSync("package_name"),
					devDeviceIdType = uni.getStorageSync("dev_device_id_type"),
					customerActiveTime = uni.getStorageSync("customer_active_time"),
					app_no = uni.getStorageSync('m_app_no'),
					app_version = uni.getStorageSync('app_version');

				const params = {
					mobile: this.phone,
					password: this.password,
					code: this.smsCode,
					t_mobile: this.inviteCode,
					dev_no: devNo,
					dev_type: devType,
					dev_oaid: devOaid,
					dev_odid: devOdid,
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

				this.$http(
					'/api/api/register', params, "POST").then(res => {
					uni.hideLoading()
					console.log(res)
					setTimeout(() => {
						if (res.code == 200) {
							uni.setStorageSync('register', this.phone)
							if (res.data != true) {
								uni.showToast({
									title: res.data,
									icon: 'success'
								})
							} else {
								uni.showToast({
									title: '注册成功',
								})
							}

							uni.setStorageSync("syncDevNoCount", 0)
							if (uni.getStorageSync('permission_read_phone_state') === 1) {
								setInterval(() => {
									that.$syncDevNo('register')
								}, 5000)
							}
							setTimeout(() => {
								that.onRegister()
							}, 1500)
						} else {
							uni.showToast({
								title: res.msg || '注册失败',
								icon: 'none'
							})
						}
					}, 1500)
				})

			},
			onRegister() {
				// #ifdef APP
				this.$reportBytedanceRegisterEvent('phone', (ok, res) => {
					console.log('=====reportRegister注册上报结果：', ok, res)
				})
				// #endif

				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
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

	.register-page {
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.register-scroll {
		flex: 1;
		height: 0;
		width: 100%;
	}

	.register-form {
		padding-bottom: 24rpx;
	}

	.register-footer {
		position: static;
		left: auto;
		right: auto;
		bottom: auto;
		flex-shrink: 0;
		width: 100%;
		padding: 0 50rpx calc(24rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.register-footer .register-btn,
	.register-footer .login-btn {
		margin-top: 16rpx;
	}

	.register-footer .register-btn {
		margin-top: 0;
	}

	.register-btn::after,
	.login-btn::after {
		border: none;
	}

	/* 验证码输入框样式 */
	.captcha-image {
		width: 160rpx;
		height: 60rpx;
	}

	/* 获取验证码按钮样式 */
	/* 验证码按钮样式 */
	.get-code-btn {
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		background-color: #000;
		color: #fff;
		padding: 0 20rpx;
		font-size: 24rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 10rpx;
	}

	/* 验证码按钮倒计时状态样式 */
	.get-code-btn:disabled {
		background-color: #000000;
		color: #ffffff;
		border: none;
	}

	.uni-button[disabled][type='default'],
	uni-button[disabled]:not([type]) {
		background-color: #000000;
		color: #ffffff;
		border: none;
	}
</style>