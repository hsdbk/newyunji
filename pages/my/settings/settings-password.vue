<template>
	<view class="payment-change-container">
		<up-form class="form" ref="formRef" v-if="type == 1" :model="formData" :rules="formRules">
			<up-form-item borderBottom="true" label="真实姓名" prop="name" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.name"
					placeholder="输入真实姓名" />
			</up-form-item>
			<up-form-item borderBottom="true" label="身份证号码" prop="idcard" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.idcard"
					placeholder="输入有效身份证号码" />
			</up-form-item>
		</up-form>
		<view v-if="type == 1" class="auth-tip">
			<text class="auth-tip-text">实名信息仅用于身份验证、功能服务及账号安全保障。我们将严格保护您的信息安全，感谢您的信任。</text>
		</view>
		<up-form class="form" ref="formRef" v-else-if="type == 2" :model="changeData" :rules="changeRules">
			<up-form-item borderBottom="true" label="旧支付密码" prop="oldpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="changeData.oldpass"
					placeholder="输入旧的支付密码" />
				<view class="forget" @click="forgetPass">忘记密码？<span class="forget-t">找回</span></view>
			</up-form-item>
			<up-form-item borderBottom="true" label="新支付密码" prop="newpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="changeData.newpass"
					placeholder="输入新支付密码" />
			</up-form-item>
			<up-form-item borderBottom="true" label="确认支付密码" prop="confirmpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="changeData.confirmpass"
					placeholder="再次输入支付密码" />
			</up-form-item>
		</up-form>
		<up-form class="form" ref="formRef" v-else-if="type == 3" :model="recoverData" :rules="recoverRules">
			<!-- <up-form-item borderBottom="true" label="真实姓名" prop="name" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.name"
					placeholder="输入真实姓名" />
			</up-form-item>
			<up-form-item borderBottom="true" label="身份证号码" prop="card" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.card"
					placeholder="输入有效身份证号码" />
			</up-form-item> -->
			<!-- 图形验证码输入 -->
			<up-form-item borderBottom="true" label="图形验证码" prop="captcha" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.captcha"
					placeholder="输入图形验证码" />
				<template #right>
					<image class="captcha-image" :src="tcode" mode="aspectFit" @click="refreshCaptcha"></image>
				</template>
				
			</up-form-item>
			<up-form-item label="验证码" prop="code" labelWidth="200rpx" borderBottom>
				<up-input v-model="recoverData.code" border="none" placeholder="请填写验证码"></up-input>
				<up-code ref="uCode" @change="codeChange" seconds="60" @start="disabled = true"
					@end="disabled = false"></up-code>
				<template #right>
					<up-button class="getcode" @tap="getCode" :text="tips" type="success" size="mini" style="flex: 0.5;"
						:disabled="disabled"></up-button>
				</template>
				
			</up-form-item>
			<up-form-item borderBottom="true" label="新密码" prop="newpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.newpass"
					placeholder="输入新支付密码" />
			</up-form-item>
			<up-form-item borderBottom="true" label="确认密码" prop="confirmpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.confirmpass"
					placeholder="再次输入支付密码" />
			</up-form-item>
		</up-form>
		<up-form class="form" ref="formRef" v-else-if="type == 4" :model="recoverData" :rules="recoverRules">
			<!-- <up-form-item borderBottom="true" label="真实姓名" prop="name" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.name"
					placeholder="输入真实姓名" />
			</up-form-item>
			<up-form-item borderBottom="true" label="身份证号码" prop="card" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.card"
					placeholder="输入有效身份证号码" />
			</up-form-item> -->
			<!-- 图形验证码输入 -->
			<up-form-item borderBottom="true" label="图形验证码" prop="captcha" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.captcha"
					placeholder="输入图形验证码" />
				<template #right>
					<image class="captcha-image" :src="tcode" mode="aspectFit" @click="refreshCaptcha"></image>
				</template>
				
			</up-form-item>
			<up-form-item label="验证码" prop="code" labelWidth="200rpx" borderBottom>
				<up-input v-model="recoverData.code" border="none" placeholder="请填写验证码"></up-input>
				<up-code ref="uCode" @change="codeChange" seconds="60" @start="disabled = true"
					@end="disabled = false"></up-code>
				<template #right>
					<up-button class="getcode" @tap="getCode" :text="tips" type="success" size="mini" style="flex: 0.5;"
						:disabled="disabled"></up-button>
				</template>
				
			</up-form-item>
			<up-form-item borderBottom="true" label="新密码" prop="newpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.newpass"
					placeholder="输入新支付密码" />
			</up-form-item>
			<up-form-item borderBottom="true" label="确认密码" prop="confirmpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.confirmpass"
					placeholder="再次输入支付密码" />
			</up-form-item>
		</up-form>
		<up-form class="form" ref="formRef" v-else-if="type == 5" :model="recoverData" :rules="recoverRules">
			<!-- <up-form-item borderBottom="true" label="真实姓名" prop="name" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.name"
					placeholder="输入真实姓名" />
			</up-form-item>
			<up-form-item borderBottom="true" label="身份证号码" prop="card" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.card"
					placeholder="输入有效身份证号码" />
			</up-form-item> -->
			<!-- 图形验证码输入 -->
			<up-form-item borderBottom="true" label="图形验证码" prop="captcha" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.captcha"
					placeholder="输入图形验证码" />
				<template #right>
					<image class="captcha-image" :src="tcode" mode="aspectFit" @click="refreshCaptcha"></image>
				</template>
				
			</up-form-item>
			<up-form-item label="验证码" prop="code" labelWidth="200rpx" borderBottom>
				<up-input v-model="recoverData.code" border="none" placeholder="请填写验证码"></up-input>
				<up-code ref="uCode" @change="codeChange" seconds="60" @start="disabled = true"
					@end="disabled = false"></up-code>
				<template #right>
					<up-button class="getcode" @tap="getCode" :text="tips" type="success" size="mini" style="flex: 0.5;"
						:disabled="disabled"></up-button>
				</template>
				
			</up-form-item>
			<up-form-item borderBottom="true" label="新密码" prop="newpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.newpass"
					placeholder="输入新支付密码" />
			</up-form-item>
			<up-form-item borderBottom="true" label="确认密码" prop="confirmpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="recoverData.confirmpass"
					placeholder="再次输入支付密码" />
			</up-form-item>
		</up-form>
		<up-form class="form" ref="formRef" v-else-if="type == 6" :model="loginChangeData" :rules="loginChangeRules">
			<up-form-item borderBottom="true" label="旧登录密码" prop="pass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="loginChangeData.pass"
					placeholder="输入旧登录密码" />
				<view class="forget" @click="forgetLoginPass">忘记密码？<span class="forget-t">找回</span></view>
			</up-form-item>
			<up-form-item borderBottom="true" label="新登录密码" prop="newpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="loginChangeData.newpass"
					placeholder="输入新登录密码" />
			</up-form-item>
			<up-form-item borderBottom="true" label="确认登录密码" prop="confirmpass" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="loginChangeData.confirmpass"
					placeholder="再次输入登录密码" />
			</up-form-item>
		</up-form>
		<view class="confirm-btn">
			<view class="confirm-btn-container">
				<up-button type="primary" @click="confirmSubmit">确认</up-button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {
		test,
		toast,
		timeFormat
	} from '@/node_modules/uview-plus'
	
	export default {
		data() {
			return {
				disabled: false,
				formData: {
					name: '',
					idcard: ''
				},
				changeData:{
					oldpass:'',
					newpass:'',
					confirmpass:'',
				},
				recoverData:{
					name:'',
					card:'',
					captcha:'',
					code:'',
					newpass:'',
					confirmpass:''
				},
				loginData:{
					pass:'',
					confirmpass:'',
				},
				loginChangeData:{
					pass:'',
					newpass:'',
					confirmpass:''
				},
				type: '',
				status: '',
				tips: '',
				formRules: {
					name: [{
						required: true,
						message: '输入真实姓名',
						trigger: 'blur'
					}],
					idcard: [{
						required: true,
						message: '输入有效身份证号码',
						trigger: 'blur'
					}]
				},
				changeRules: {
					oldpass: [{
						required: true,
						message: '输入旧的支付密码',
						trigger: 'blur'
					}, {
						min: 6,
						max: 6,
						message: '支付密码必须为6位',
						trigger: 'blur'
					}],
					newpass: [{
						required: true,
						message: '输入新支付密码',
						trigger: 'blur'
					}, {
						min: 6,
						max: 6,
						message: '支付密码必须为6位',
						trigger: 'blur'
					}],
					confirmpass: [{
						required: true,
						message: '再次输入支付密码',
						trigger: 'blur'
					}, {
						min: 6,
						max: 6,
						message: '支付密码必须为6位',
						trigger: 'blur'
					}]
				},
				recoverRules:{
					// name: [{
					// 	required: true,
					// 	message: '输入真实姓名',
					// 	trigger: 'blur'
					// }],
					// card: [{
					// 	required: true,
					// 	message: '输入有效身份证号码',
					// 	trigger: 'blur'
					// }],
					code: [{
						required: true,
						message: '请填写验证码',
						trigger: 'blur'
					}],
					newpass: [{
						required: true,
						message: '输入新支付密码',
						trigger: 'blur'
					}],
					confirmpass: [{
						required: true,
						message: '再次输入支付密码',
						trigger: 'blur'
					}]
				},
				loginRules:{
					pass: [{
						required: true,
						message: '输入登录密码',
						trigger: 'blur'
					}],
					confirmpass: [{
						required: true,
						message: '再次输入登录密码',
						trigger: 'blur'
					}]
				},
				loginChangeRules:{
					pass: [{
						required: true,
						message: '输入旧登录密码',
						trigger: 'blur'
					}],
					newpass: [{
						required: true,
						message: '输入新登录密码',
						trigger: 'blur'
					}],
					confirmpass: [{
						required: true,
						message: '再次输入登录密码',
						trigger: 'blur'
					}]
				},
				tcode:''
			}
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn'])
		},
		onLoad(e) {
			if (this.isLoggedIn) {
				this.$store.dispatch('updateUserInfo');
			}
			this.type = e.type
			this.status = e.status
			
			if (e.type == 1) {
				uni.setNavigationBarTitle({
					title: '实名认证'
				});
			} else if (e.type == 2) {
				uni.setNavigationBarTitle({
					title: '更换支付密码 '
				});
			}else if (e.type == 3) {
				uni.setNavigationBarTitle({
					title: '设置支付密码'
				});
			}else if (e.type == 4) {
				uni.setNavigationBarTitle({
					title: '找回支付密码'
				});
			}else if (e.type == 5) {
				uni.setNavigationBarTitle({
					title: '找回登录密码'
				});
			}else if (e.type == 6) {
				uni.setNavigationBarTitle({
					title: '更改登录密码'
				});
			}
			console.log(this.userInfo)
		},
		onShow() {
			this.getCaptcha()
		},
		methods: {
			getCaptcha(){
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
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						// toast('验证码已发送');
						this.sendCode()
						// // 通知验证码组件内部开始倒计时
						// this.$refs.uCode.start();
					}, 2000);
				} else {
					toast('倒计时结束后再发送');
				}
			},
			sendCode(){
				// 支付密码3
				// 登录密码4
				this.$http(
					'/api/api/code', {
					mobile: this.userInfo.mobile,
					type: 'forgetpaypwd',
					image_code: this.recoverData.captcha
				}, "POST").then(res => {
					if(res.code == 200){
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
						toast('验证码发送成功');
					}else{
						toast(res.msg);
					}
				})
			},
			forgetPass(){
				uni.navigateTo({ url: '/pages/my/settings/settings-password?type=3' })
			},
			forgetLoginPass(){
				uni.navigateTo({ url: '/pages/my/settings/settings-password?type=5' })
			},
			confirmSubmit() {
				this.$refs.formRef.validate().then(() => {
					// 表单验证通过，这里可以添加提交数据的逻辑
					// uni.showToast({
					// 	title: '提交成功',
					// 	icon: 'success'
					// });
					if (this.type == 1) {
						this.changeCard()
					}else if (this.type == 2) {
						this.changePassword()
					}else if (this.type == 3) {
						this.forgetPayPassword()
					}else if (this.type == 4) {
						this.forgetPayPassword()
					}else if (this.type == 5) {
						this.forgetLoginPassword()
					}else if (this.type == 6) {
						this.changeLoginPassword()
					}
					
					// 可以在这里调用API提交数据
					// 提交成功后返回上一页
					// uni.navigateBack();
				}).catch(error => {
					console.log('表单验证失败', error);
				});
			},
			changeCard(){
				this.$http(
					'/user/info/auth', this.formData, "POST").then(res => {
						uni.showToast({
						    title: '更新成功',
						    icon: 'success'
						})
						setTimeout(() => {
						    uni.navigateBack()
						}, 1500)
				})
			},
			changePassword(){
				// changeData:{
				// 	oldpass:'',
				// 	newpass:'',
				// 	confirmpass:'',
				// },
				// console.log('recoverData~',this.recoverData)
				var date = {
					passwd:this.changeData.oldpass,
					npasswd:this.changeData.newpass,
				}
				this.$http(
					'/user/info/updatepaypwd', date, "POST").then(res => {
						uni.showToast({
						    title: '更新成功',
						    icon: 'success'
						})
						setTimeout(() => {
						    uni.navigateBack()
						}, 1500)
				})
			},
			forgetPayPassword(){
				console.log('recoverData~',this.recoverData)
				var date = {
					// username:this.userInfo.name,
					// idcard:this.userInfo.card,
					code:this.recoverData.code,
					passwd:this.recoverData.confirmpass
				}
				this.$http(
					'/user/info/forgetpaypwd', date, "POST").then(res => {
						uni.showToast({
						    title: '更新成功',
						    icon: 'success'
						})
						setTimeout(() => {
						    uni.navigateBack()
						}, 1500)
				})
			},
			forgetLoginPassword(){
				console.log('userInfo',this.userInfo)
				var date = {
					// username:this.userInfo.name,
					password:this.recoverData.newpass,
					code:this.recoverData.code
				}
				this.$http(
					'/api/api/forgetpwd', date, "POST").then(res => {
						uni.showToast({
						    title: '更新成功',
						    icon: 'success'
						})
						setTimeout(() => {
						    uni.navigateBack()
						}, 1500)
				})
			},
			changeLoginPassword(){
				var date = {
					passwd:this.loginChangeData.pass,
					npasswd:this.loginChangeData.newpass
				}
				this.$http(
					'/user/info/repasswd', date, "POST").then(res => {
						uni.showToast({
						    title: '更新成功',
						    icon: 'success'
						})
						setTimeout(() => {
						    uni.navigateBack()
						}, 1500)
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background: #f5f5f5;
	}

	.payment-change-container {
		padding: 30rpx;
		box-sizing: border-box;
	}
	/* 验证码输入框样式 */
	.captcha-image {
	  width: 160rpx;
	  height: 60rpx;
	}
	.confirm-btn {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.confirm-btn-container {
		width: 500rpx;
		height: 70rpx;
		border-radius: 30rpx;
		margin-top: 256rpx;
	}

	.form {
		background-color: #fff;
		border-radius: 30rpx;
		padding: 0 23rpx 20rpx;
		position: relative;
	}

	.auth-tip {
		margin-top: 24rpx;
		padding: 0 8rpx;
	}

	.auth-tip-text {
		font-size: 24rpx;
		color: #888888;
		line-height: 1.65;
	}

	.u-form-item__body {
		padding: 0 !important;
	}


	.u-button {
		background-color: #000;
		border-radius: 44rpx;
		height: 88rpx;
		line-height: 88rpx;
	}

	.u-button--primary {
		background-color: #000;
	}

	.u-button--primary:after {
		border: none;
	}

	.forget {
		font-size: 28rpx;
		color: #A4A4A4;
		position: absolute;
		right: 20rpx;
		top: 40rpx;
	}

	.forget-t {
		color: #FF481C;
	}
	.getcode{
		height:60rpx;
	}
</style>