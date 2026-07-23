<template>
	<view class="payment-change-container">
		<up-form class="form" ref="formRef" :model="formData" :rules="formRules">
			<up-form-item borderBottom="true" label="收货人" prop="name" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.name"
					placeholder="输入收件人姓名" />
			</up-form-item>
			<up-form-item borderBottom="true" label="联系方式" prop="tel" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.tel"
					placeholder="输入收件人联系方式" />
			</up-form-item>
			<up-form-item borderBottom="true" label="选择地区" prop="province" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.province"
					placeholder="请选择省份" />
				<template #right>
					<image :src="$getStaticSrc('/static/my/more.png')" @click="openProvincePicker" mode="aspectFit" class="right-icon">
					</image>
				</template>
				
			</up-form-item>
			<up-form-item borderBottom="true" label="出入城市" prop="city" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.city"
					placeholder="广州市/杭州市" />
			</up-form-item>
			<up-form-item label="详细地址" prop="addressDetail" labelWidth="190rpx">
				<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.addressDetail"
					placeholder="街道、楼栋/单元、门牌号等详细信息 详细地址不少于5个字" />
			</up-form-item>
		</up-form>
		<view class="default-set">
			<view class="default-set-icon" @click="toggleDefault">
				<view>设为默认地址</view>
				<image :src="formData.isDefault?'/static/my/place-check.png':'/static/my/place-check1.png'" mode="aspectFit"
					class="icon"></image>
			</view>
			<view>提醒：下单时会优先使用该地址</view>
		</view>
		<view class="add-button-container">
			<up-button type="primary" class="add-address-button" @click="confirmSubmit">
				{{this.id?'编辑收货地址':'新增收货地址'}}
			</up-button>
		</view>
		<up-picker ref="picker" :show="pickerShow" :columns="provinces" @confirm="selectProvince"
			@cancel="closeProvincePicker" @close="closeProvincePicker"></up-picker>
	</view>
</template>

<script>
	import {
		getAllProvinces,
		getProvinceByName
	} from '/stores/pro.js'
	export default {
		data() {
			return {
				id:'',
				formData: {
					name: '',
					tel: '',
					province: '',
					city: '',
					addressDetail: '',
					isDefault: false,
				},
				type: '',
				status: '',
				tips: '',
				formRules: {
					name: [{
						required: true,
						message: '请输入真实姓名',
						trigger: 'blur'
					}],
					tel: [{
						required: true,
						message: '请输入有效手机号',
						trigger: 'blur'
					}],
					province: [{
						required: true,
						message: '请选择省份',
						trigger: 'blur'
					}],
					city: [{
						required: true,
						message: '请输入城市',
						trigger: 'blur'
					}],
					addressDetail: [{
						required: true,
						message: '请输入详细地址',
						trigger: 'blur'
					}]
				},
				pickerShow: false,
				provinces: [], // 省份列表
			}
		},
		onLoad(e) {
			this.id = e.id
			if (e.id) {
				uni.setNavigationBarTitle({
					title: '编辑收货地址'
				});
				this.addressView()
			} else {
				uni.setNavigationBarTitle({
					title: '新增收货地址 '
				});
			}
			// 加载省份数据
			this.loadProvinces()
		},
		methods: {
			addressView(){
				// 编辑地址
				this.$http(
					'/user/address/view', {id:this.id}, "POST").then(res => {
					if (res.code == 200) {
						// formData: {
						// 	name: '',
						// 	tel: '',
						// 	province: '',
						// 	city: '',
						// 	addressDetail: '',
						// 	isDefault: false,
						// },
						console.log(res.data.view.is_default)
						this.formData.name = res.data.view.name
						this.formData.tel = res.data.view.tel
						this.formData.province = res.data.view.province
						this.formData.city = res.data.view.city
						this.formData.addressDetail = res.data.view.address
						this.formData.isDefault = res.data.view.is_default=='Y'?true:false
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				})
			},
			// 加载省份数据
			loadProvinces() {
				this.provinces = [getAllProvinces().map(province => province.name)];
			},
			// 打开省份选择器
			openProvincePicker() {
				this.pickerShow = true
			},

			// 关闭省份选择器
			closeProvincePicker() {
				this.pickerShow = false
			},
			// 选择省份
			selectProvince(e) {
				// e为选中的值，直接使用
				const selectedProvince = e;
				console.log(e)
				this.formData.province = selectedProvince.value[0];
				this.closeProvincePicker();
			},
			toggleDefault() {
				this.formData.isDefault = !this.formData.isDefault
			},
			confirmSubmit() {
				this.$refs.formRef.validate().then(() => {
					console.log('id',this.id)
					if (this.id) {
						this.formData.id = this.id
						console.log(this.formData)
						// 编辑地址
						this.$http(
							'/user/address/save', this.formData, "POST").then(res => {
							if (res.code == 200) {
								uni.showToast({
									title: '编辑成功',
									icon: 'success'
								});
								uni.navigateBack();
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							}
						})
					} else {
						
						// 新增地址
						this.$http(
							'/user/address/save', this.formData, "POST").then(res => {
							if (res.code == 200) {
								uni.showToast({
									title: '新增成功',
									icon: 'success'
								});
								uni.navigateBack();
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							}
						})
					}
					// 可以在这里调用API提交数据
					// 提交成功后返回上一页
					// uni.navigateBack();
				}).catch(error => {
					console.log('表单验证失败', error);
				});
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

	.form {
		background-color: #fff;
		border-radius: 30rpx;
		padding: 0 23rpx 20rpx;
		position: relative;
	}

	.add-button-container {
		position: fixed;
		bottom: 40rpx;
		left: 0;
		right: 0;
		padding: 0 40rpx;
	}

	.address-title {
		color: #fff;
	}

	.add-address-button {
		background-color: #000000;
		color: #ffffff;
		border-radius: 35rpx;
		font-size: 24rpx;
		height: 70rpx;
		width: 500rpx;
		line-height: 70rpx;
	}

	.right-icon {
		width: 12rpx;
		height: 24rpx;
	}

	.icon {
		width: 34rpx;
		height: 34rpx;
	}

	.default-set {
		background: linear-gradient(to left, #FF5827, #FF9B5A);
		padding: 33rpx 23rpx;
		border-radius: 20rpx;
		color: white;
		margin: 30rpx 0;
	}

	.default-set-icon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	/* 省份选择器触发样式 */
	.picker-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 80rpx;
	}

	.placeholder-text {
		color: #A4A4A4;
	}
</style>