<template>
	<view class="page">
		<!-- 步骤条 -->
		<view class="steps-wrap">
			<up-steps
				:key="'physical-steps-' + currentStep"
				:current="currentStep - 1"
				activeColor="#2F7CF6"
				inactiveColor="#D0D5DD"
			>
				<up-steps-item title="实名认证" iconSize="32"></up-steps-item>
				<up-steps-item title="填写地址"></up-steps-item>
				<up-steps-item title="下单成功"></up-steps-item>	
			</up-steps>
		</view>

		<!-- 步骤一：实名认证 -->
		<template v-if="currentStep === 1">
			<view class="product-card">
				<image class="product-img" :src="productImg" mode="aspectFill"></image>
				<view class="product-info">
					<text class="product-name">{{ product.name }}</text>
					<text class="product-tag">新用户专享·免费包邮</text>
				</view>
			</view>

			<view class="form-card">
				<view class="form-row">
					<text class="form-label">真实姓名</text>
					<input
						class="form-input"
						v-model="authForm.name"
						placeholder="请输入真实姓名"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="form-row">
					<text class="form-label">身份证号码</text>
					<input
						class="form-input"
						v-model="authForm.idcard"
						placeholder="请输入18位身份证号码"
						placeholder-class="placeholder"
						maxlength="18"
					/>
				</view>
			</view>

			<text class="auth-tip">为保障活动权益及礼品正常发放，请先完成实名认证。认证成功后即可填写收货地址。身份信息仅用于核验活动领取资格，请确保信息真实有效。
</text>
		</template>

		<!-- 步骤二：填写地址 -->
		<template v-if="currentStep === 2">
			<view class="product-card">
				<image class="product-img" :src="productImg" mode="aspectFill"></image>
				<view class="product-info">
					<text class="product-name">{{ product.name }}</text>
					<text class="product-tag">新用户专享·免费包邮</text>
				</view>
			</view>

			<view class="form-card">
				<view class="form-row">
					<text class="form-label">收货人</text>
					<input
						class="form-input"
						v-model="addressForm.name"
						placeholder="请输入收货人姓名"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="form-row">
					<text class="form-label">手机号码</text>
					<input
						class="form-input"
						v-model="addressForm.phone"
						type="number"
						maxlength="11"
						placeholder="请输入11位手机号码"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="form-row">
					<text class="form-label">省份</text>
					<input
						class="form-input"
						v-model="addressForm.province"
						placeholder="请输入省份"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="form-row">
					<text class="form-label">所在地区</text>
					<input
						class="form-input"
						v-model="addressForm.region"
						placeholder="请输入所在地区"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="form-row form-row-area">
					<text class="form-label form-label-top">详细地址</text>
					<textarea
						class="form-textarea"
						v-model="addressForm.address"
						placeholder="请输入详细地址"
						placeholder-class="placeholder"
						:auto-height="false"
					/>
				</view>
			</view>
		</template>

		<!-- 步骤三：下单成功 -->
		<template v-if="currentStep === 3">
			<view class="success-wrap">
				<image class="success-icon" :src="$getStaticSrc('/static/new_index/success.png')" mode="aspectFit"></image>
				<text class="success-title">下单成功</text>
				<text class="success-desc">您的礼品订单已提交成功，我们将根据订单顺序尽快安排发货。您可前往【任务】-【礼品专区】-【购买记录】查看订单及物流信息。 
</text>
			</view>

			<view class="product-card">
				<image class="product-img" :src="productImg" mode="aspectFill"></image>
				<view class="product-info">
					<text class="product-name">{{ product.name }}</text>
					<text class="product-tag">新用户专享 · 免费包邮</text>
				</view>
			</view>

			<view class="order-card">
				<view class="order-row">
					<text class="order-label">订单编号</text>
					<text class="order-value">{{ orderInfo.orderNo }}</text>
				</view>
				<view class="order-row">
					<text class="order-label">收货人</text>
					<text class="order-value">{{ orderInfo.receiver }}</text>
				</view>
				<view class="order-row order-row-address">
					<text class="order-label">收货地址</text>
					<text class="order-value order-value-address">{{ orderInfo.fullAddress }}</text>
				</view>
			</view>
		</template>

		<!-- 底部按钮 -->
		<view class="footer">
			<button
				v-if="currentStep === 1"
				class="submit-btn"
				:loading="submitting"
				@click="submitAuth"
			>确认并完成认证</button>
			<button
				v-else-if="currentStep === 2"
				class="submit-btn"
				:loading="submitting"
				@click="submitAddress"
			>提交并免费领取</button>
			<button
				v-else
				class="submit-btn"
				@click="goHome"
			>返回首页</button>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex'

const STEP_TITLES = ['实名认证', '填写收货地址', '下单完成']

export default {
	computed: {
		...mapState(['userInfo', 'isLoggedIn', 'isAuth']),
		productImg() {
			const img = this.product.image
			if (!img) return this.$getStaticSrc('/static/logo.png')
			if (img.startsWith('http') || img.startsWith('/static')) {
				return img.startsWith('/static') ? this.$getStaticSrc(img) : img
			}
			return this.$baseUrl + img
		}
	},
	data() {
		return {
			currentStep: 1,
			submitting: false,
			product: {
				id: '',
				name: '',
				image: ''
			},
			authForm: {
				name: '',
				idcard: ''
			},
			addressForm: {
				name: '',
				phone: '',
				province: '',
				region: '',
				address: ''
			},
			orderInfo: {
				orderNo: '',
				receiver: '',
				fullAddress: ''
			}
		}
	},
	onLoad(options) {
		if (options.id) {
			this.product.id = options.id
		}
		if (options.name) {
			this.product.name = decodeURIComponent(options.name)
		}
		if (options.image) {
			this.product.image = decodeURIComponent(options.image)
		}
		uni.setNavigationBarTitle({ title: STEP_TITLES[this.currentStep - 1] })
	},
	onShow() {
		if (this.isLoggedIn) {
			this.$store.dispatch('updateUserInfo').then(() => {
				if (this.isAuth && this.currentStep === 1) {
					this.currentStep = 2
					this.prefillAddress()
				}
			})
		}
	},
	watch: {
		currentStep(val) {
			uni.setNavigationBarTitle({ title: STEP_TITLES[val - 1] })
		}
	},
	methods: {
		prefillAddress() {
			if (this.userInfo?.name) {
				this.addressForm.name = this.userInfo.name
			}
			if (this.userInfo?.mobile) {
				this.addressForm.phone = this.userInfo.mobile
			}
		},
		validateAuth() {
			if (!this.authForm.name.trim()) {
				uni.showToast({ title: '请输入真实姓名', icon: 'none' })
				return false
			}
			if (!/^\d{17}[\dXx]$/.test(this.authForm.idcard)) {
				uni.showToast({ title: '请输入18位身份证号码', icon: 'none' })
				return false
			}
			return true
		},
		validateAddress() {
			if (!this.addressForm.name.trim()) {
				uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
				return false
			}
			if (!/^1\d{10}$/.test(this.addressForm.phone)) {
				uni.showToast({ title: '请输入11位手机号码', icon: 'none' })
				return false
			}
			if (!this.addressForm.province.trim()) {
				uni.showToast({ title: '请输入省份', icon: 'none' })
				return false
			}
			if (!this.addressForm.region.trim()) {
				uni.showToast({ title: '请输入所在地区', icon: 'none' })
				return false
			}
			if (!this.addressForm.address.trim() || this.addressForm.address.trim().length < 5) {
				uni.showToast({ title: '详细地址不少于5个字', icon: 'none' })
				return false
			}
			return true
		},
		maskPhone(phone) {
			if (!phone || phone.length < 7) return phone
			return phone.slice(0, 3) + '****' + phone.slice(-4)
		},
		genOrderNo() {
			return 'YL' + Date.now().toString().slice(-10)
		},
		submitAuth() {
			if (!this.validateAuth()) return
			this.submitting = true
			this.$http('/user/info/auth', this.authForm, 'POST').then(() => {
				return this.$store.dispatch('updateUserInfo')
			}).then(() => {
				this.currentStep = 2
				this.prefillAddress()
				if (!this.addressForm.name) {
					this.addressForm.name = this.authForm.name
				}
			}).finally(() => {
				this.submitting = false
			})
		},
		submitAddress() {
			if (!this.validateAddress()) return
			if (!this.product.id) {
				uni.showToast({ title: '商品信息缺失', icon: 'none' })
				return
			}
			this.submitting = true
			const fullAddress = this.addressForm.province + this.addressForm.region + this.addressForm.address
			const applyInfo = {
				id: this.product.id,
				name: this.addressForm.name,
				mobile: this.addressForm.phone,
				address: fullAddress,
				province: this.addressForm.province,
				city: this.addressForm.region,
				number: 1,
				passwd: '',
				task_code: '',
				redeem_code: ''
			}
			this.$http('/goods/order/apply', applyInfo, 'POST').then(res => {
				const data = res.data || {}
				this.orderInfo = {
					orderNo: data.order_no || data.order_sn || data.sn || this.genOrderNo(),
					receiver: this.addressForm.name + this.maskPhone(this.addressForm.phone),
					fullAddress: fullAddress
				}
				this.currentStep = 3
			}).finally(() => {
				this.submitting = false
			})
		},
		goHome() {
			uni.reLaunch({ url: '/pages/icon/icon' })
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: #F0F4FA;
	padding: 30rpx 28rpx 180rpx;
	box-sizing: border-box;
}

/* 步骤条 */
.steps-wrap {
	padding: 10rpx 0 36rpx;
	background: #F0F4FA;
}

.steps-wrap :deep(.u-steps-item__content__title) {
	font-size: 34rpx !important;
	color: #7f7f7f !important;
}

.steps-wrap :deep(.u-steps-item--process .u-steps-item__content__title) {
	color: #1f1f1f !important;
	font-weight: 600;
}

.steps-wrap :deep(.u-steps-item__wrapper__circle) {
	width: 36rpx !important;
	height: 36rpx !important;
}

.steps-wrap :deep(.u-steps-item__wrapper__circle__text) {
	font-size: 30rpx !important;
	line-height: 22rpx !important;
}

/* 商品卡片 */
.product-card {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
}

.product-img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	flex-shrink: 0;
	background: #F7F8FA;
}

.product-info {
	margin-left: 20rpx;
	flex: 1;
}

.product-name {
	display: block;
	font-size: 32rpx;
	font-weight: bold;
	color: #1a1a1a;
	line-height: 1.3;
}

.product-tag {
	display: block;
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #E54D42;
}

/* 表单 */
.form-card {
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
}

.form-row {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.form-row:last-child {
	border-bottom: none;
}

.form-row-area {
	flex-direction: column;
	align-items: flex-start;
}

.form-label {
	font-size: 28rpx;
	color: #333;
	width: 160rpx;
	flex-shrink: 0;
}

.form-label-top {
	width: auto;
	margin-bottom: 16rpx;
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}

.form-textarea {
	width: 100%;
	height: 120rpx;
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

.placeholder {
	color: #C0C4CC;
	font-size: 28rpx;
}

.auth-tip {
	display: block;
	text-align: center;
	font-size: 22rpx;
	color: #999;
	line-height: 1.6;
	padding: 0 20rpx;
}

/* 成功页 */
.success-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 20rpx 50rpx;
}

.success-icon {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 30rpx;
}

.success-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #1a1a1a;
	margin-bottom: 16rpx;
}

.success-desc {
	font-size: 26rpx;
	color: #999;
	text-align: center;
	line-height: 1.6;
	padding: 0 20rpx;
}

/* 订单信息 */
.order-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 8rpx 24rpx;
	margin-top: 24rpx;
}

.order-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.order-row:last-child {
	border-bottom: none;
}

.order-label {
	font-size: 28rpx;
	color: #999;
	flex-shrink: 0;
	margin-right: 20rpx;
}

.order-value {
	font-size: 28rpx;
	color: #333;
	text-align: right;
	flex: 1;
}

.order-value-address {
	line-height: 1.5;
}

/* 底部按钮 */
.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 20rpx 40rpx calc(20rpx + env(safe-area-inset-bottom));
	background: #F0F4FA;
}

.submit-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: #2F7CF6;
	color: #fff;
	font-size: 32rpx;
	font-weight: 500;
	border-radius: 44rpx;
	border: none;
}

.submit-btn::after {
	border: none;
}
</style>
