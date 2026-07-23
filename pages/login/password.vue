<template>
	<view class="login-container">
		<!-- 右上角问号图标 -->
		<image class="question-icon" src="/static/my/customer.png" mode="aspectFit" @click="showHelp"></image>
		<view class="logo-area">
			<image class="logo-image" :src="$getStaticSrc('/static/logo.png')" mode="aspectFill"></image>
			<text class="logo-title">看天气·知冷暖·懂生活</text>
		</view>

		<view class="form-container">
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
					:src="showPassword ? '/static/login/see.png' : '/static/login/nosee.png'" mode="aspectFit"></image>
			</view>

			<!-- 再次输入密码 -->
			<view class="input-item">
				<image class="input-icon" :src="$getStaticSrc('/static/login/pass.png')" mode="aspectFit"></image>
				<input class="input" :type="showConfirmPassword ? 'text' : 'password'" placeholder="再次输入登录密码"
					v-model="confirmPassword" />
				<image class="eye-icon" @click="togglePasswordVisibility('showConfirmPassword')"
					:src="showConfirmPassword ? '/static/login/see.png' : '/static/login/nosee.png'" mode="aspectFit">
				</image>
			</view>

			<!-- 注册按钮 -->
			

			<!-- 协议勾选 -->
			
			<view class="footer">
				<button class="login-btn" @click="handleLogin">重置密码</button>
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
				tcode: ""
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
		},
		onShow() {
			this.getCaptcha()
		},
		methods: {
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
					const url = this.config.kefu_link;

					// 跨平台解决方案
					if (window.plus) {
						// 使用5+ runtime API
						plus.runtime.openURL(url, (result) => {
							console.log('成功打开客服链接');
						}, (error) => {
							console.error('打开客服链接失败:', error);
							uni.showToast({
								title: '打开客服链接失败',
								icon: 'none'
							});
						});
					} else if (typeof window.open === 'function') {
						// Web平台使用window.open
						window.open(url, '_blank');
					} else {
						// 兜底方案
						uni.showToast({
							title: '请复制客服链接: ' + url,
							icon: 'none',
							duration: 3000
						});
					}
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
						type: 'forgetpwd',
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
						toast(res.msg);
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

				// 模拟发送验证码
				console.log('发送验证码到:', this.phone)

				
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
			handleLogin() {
				// 表单验证
				if (!this.validateForm()) {
					return
				}

				// 这里添加实际注册逻辑
				console.log('注册信息:', {
					phone: this.phone,
					captcha: this.captcha,
					smsCode: this.smsCode,
					password: this.password
				})

				// 模拟注册成功
				uni.showLoading({
					title: '找回密码中...'
				})
				this.$http(
					'/api/api/forgetpwd', {
						username: this.phone,
						password: this.password,
						code: this.smsCode
					}, "POST").then(res => {
					console.log(res)
					setTimeout(() => {
						uni.hideLoading()
						uni.showToast({
							title: '找回密码成功',
							icon: 'success'
						})

						// 注册成功后跳转到登录页面
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}, 1500)
					}, 1500)
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