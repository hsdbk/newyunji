<template>
	<view>
		<up-navbar title="个人中心" @rightClick="showAddPayPopup" :autoBack="true" rightText="修改">
		</up-navbar>
		<view class="container">
			<image class="avatar" :src="$baseUrl + avatarUrl" mode="scaleToFill" @tap="previewImage" />
		</view>
		<up-popup :customStyle="{'background-color': '#fff'}" :overlay="false" :show="selectedAddPayshow" :round="20"
			mode="bottom" @close="closeAddPayPopup">
			<view class="popup-content">
				<view class="popup-item" @tap="takePhoto">
					<text class="popup-item-text">拍照</text>
				</view>
				<view class="popup-item" @tap="chooseFromAlbum">
					<text class="popup-item-text">从手机相册选择</text>
				</view>
				<!-- <view class="popup-item" @tap="saveImage">
                <text class="popup-item-text">保存图片</text>
                </view> -->
				<view class="confirm-btn">
					<view class="confirm-btn-container">
						<up-button class="change" @click="closeAddPayPopup">关闭</up-button>
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				selectedAddPayshow: false,
				avatarUrl: '/static/my/vip.png',
				tempFilePath: '',
				avatarUpload: '',
			}
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn'])
		},
		onShow() {
			console.log(this.userInfo.avatar)
			this.init()
		},
		methods: {
			init() {
				console.log('信息~', this.userInfo)
				this.avatarUrl = this.userInfo.avatar
				console.log('头像', this.avatarUrl)
			},
			// 返回上一页
			showAddPayPopup() {
				this.selectedAddPayshow = true
			},
			closeAddPayPopup() {
				this.selectedAddPayshow = false
			},
			// 检查相册权限
			checkAlbumPermission() {
				return new Promise((resolve, reject) => {
					// 检查是否支持权限相关的API
					if (typeof uni.getSetting !== 'function' || typeof uni.authorize !== 'function') {
						// 如果不支持权限API，直接允许操作
						resolve(true)
						return
					}
					// 使用uni.getSetting获取权限设置
					uni.getSetting({
						success: (res) => {
							// 检查是否已经授权相册权限
							if (res.authSetting['scope.album'] || res.authSetting['scope.writePhotosAlbum']) {
								resolve(true)
							} else {
								// 如果尚未授权，请求权限
								uni.authorize({
									scope: 'scope.album',
									success: () => {
										resolve(true)
									},
									fail: (err) => {
										console.log('相册权限授权失败', err)
										reject(err)
									}
								})
							}
						},
						fail: (err) => {
							console.log('获取设置失败', err)
							resolve(true) // 如果获取设置失败，默认允许操作
						}
					})
				})
			},
			// 检查相机权限
			checkCameraPermission() {
				return new Promise((resolve, reject) => {
					// 检查是否支持权限相关的API
					if (typeof uni.getSetting !== 'function' || typeof uni.authorize !== 'function') {
						// 如果不支持权限API，直接允许操作
						resolve(true)
						return
					}
					// 使用uni.getSetting获取权限设置
					uni.getSetting({
						success: (res) => {
							// 检查是否已经授权相机权限
							if (res.authSetting['scope.camera']) {
								resolve(true)
							} else {
								// 如果尚未授权，请求权限
								uni.authorize({
									scope: 'scope.camera',
									success: () => {
										resolve(true)
									},
									fail: (err) => {
										console.log('相机权限授权失败', err)
										reject(err)
									}
								})
							}
						},
						fail: (err) => {
							console.log('获取设置失败', err)
							resolve(true) // 如果获取设置失败，默认允许操作
						}
					})
				})
			},
			// 拍照功能
			takePhoto() {
				// 先关闭弹窗
				this.closeAddPayPopup()

				// 检查相机权限
				this.checkCameraPermission().then(() => {
					// 调用UniApp拍照API
					uni.chooseImage({
						count: 1, // 最多选择1张图片
						sizeType: ['compressed'], // 压缩图
						sourceType: ['camera'], // 来源为相机
						success: (res) => {
							// 保存临时文件路径
							this.tempFilePath = res.tempFilePaths[0]
							// 更新头像显示
							this.avatarUrl = this.tempFilePath
							// 可以在这里调用上传API将图片上传到服务器
							this.uploadImage(this.tempFilePath)
						},
						fail: (err) => {
							console.log('拍照失败', err)
							// 如果用户取消操作，不显示提示
							if (err.errMsg !== 'chooseImage:fail cancel') {
								uni.showToast({
									title: '拍照失败',
									icon: 'none'
								})
							}
						}
					})
				}).catch((err) => {
					console.log('相机权限检查失败', err)
					this.handleAuthDeny('拍照需要您授权访问相机权限')
				})
			},

			// 从相册选择图片
			chooseFromAlbum() {
				// 先关闭弹窗
				this.closeAddPayPopup()

				// 检查相册权限
				this.checkAlbumPermission().then(() => {
					// 调用UniApp选择图片API
					uni.chooseImage({
						count: 1, // 最多选择1张图片
						sizeType: ['original', 'compressed'], // 原图或压缩图
						sourceType: ['album'], // 来源为相册
						success: (res) => {
							// 保存临时文件路径
							this.tempFilePath = res.tempFilePaths[0]
							// 更新头像显示
							this.avatarUrl = this.tempFilePath
							// 可以在这里调用上传API将图片上传到服务器
							this.uploadImage(this.tempFilePath)
						},
						fail: (err) => {
							console.log('选择图片失败', err)
							// 如果用户取消操作，不显示提示
							if (err.errMsg !== 'chooseImage:fail cancel') {
								uni.showToast({
									title: '选择图片失败',
									icon: 'none'
								})
							}
						}
					})
				}).catch((err) => {
					console.log('相册权限检查失败', err)
					this.handleAuthDeny('选择图片需要您授权访问相册权限')
				})
			},

			// 保存图片到相册
			saveImage() {
				// 先关闭弹窗
				this.closeAddPayPopup()

				// 调用UniApp保存图片API
				uni.saveImageToPhotosAlbum({
					filePath: this.avatarUrl,
					success: () => {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						})
					},
					fail: (err) => {
						console.log('保存图片失败', err)
						// 如果是因为权限被拒绝，提示用户打开权限
						if (err.errMsg.indexOf('auth deny') >= 0) {
							this.handleAuthDeny('保存图片需要您授权访问相册权限')
						} else {
							uni.showToast({
								title: '保存图片失败',
								icon: 'none'
							})
						}
					}
				})
			},

			// 预览图片
			previewImage() {
				uni.previewImage({
					urls: [this.avatarUrl],
					current: 0
				})
			},

			// 上传图片到服务器
			uploadImage(filePath) {
				let ssid = uni.getStorageSync('ssid');
				// 这里是示例代码，实际项目中需要替换为真实的上传接口
				uni.uploadFile({
					url: this.$baseUrl + '/api/api/upload', // 上传接口地址
					filePath: filePath,
					name: 'file', // 文件对应的key
					formData: {
						'ssid': ssid
					},
					success: (uploadFileRes) => {
						// console.log('上传成功', JSON.parse(uploadFileRes.data))
						const data = JSON.parse(uploadFileRes.data)
						// console.log('上传成功~data', data.data.file)
						this.avatarUpload = data.data.file
						this.updataUserinfo()
					},
					fail: (err) => {
						console.log('上传失败', err)
						uni.showToast({
							title: '图片上传失败',
							icon: 'none'
						})
					}
				})
			},
			updataUserinfo() {
				// 创建一个过滤后的对象，只包含非空值的字段
				const filteredFormData = {};
				if (this.avatarUpload) {
					filteredFormData.avatar = this.avatarUpload
				}
				this.$http(
					'/user/info/update', filteredFormData, "POST").then(res => {
					uni.showToast({
						title: '更新成功',
						icon: 'success'
					})
					this.$store.dispatch('updateUserInfo').then(() => {
						// 在store更新完成后再调用init()
						this.init()
					})
				})
			},
			// 处理权限被拒绝的情况
			handleAuthDeny(msg) {
				uni.showModal({
					title: '提示',
					content: msg,
					success: (res) => {
						if (res.confirm) {
							// 尝试打开应用设置，如果不支持则提示用户手动打开
							try {
								// 优先尝试使用 uni.openSetting
								if (typeof uni.openSetting === 'function') {
									uni.openSetting({
										success: (settingRes) => {
											console.log('设置结果', settingRes)
										}
									})
								} else {
									// 如果不支持 uni.openSetting，提示用户手动打开设置
									uni.showToast({
										title: '请您手动打开应用权限设置',
										icon: 'none'
									})
								}
							} catch (error) {
								console.error('打开设置失败:', error)
								uni.showToast({
									title: '请您手动打开应用权限设置',
									icon: 'none'
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F3F3F3;
	}

	.container {
		padding: 0 30rpx;
		margin-top: 80rpx;
	}

	.avatar {
		width: 100%;
		height: 916rpx;
	}

	.popup-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff;
	}

	.popup-item {
		display: flex;
		align-items: center;
		text-align: center;
		font-size: 30rpx;
		color: #000000;
		line-height: 60rpx;
		font-weight: bold;
	}

	.popup-item-text {
		text-align: center;
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
	}

	.change {
		background-color: #000000 !important;
		color: #fff !important;
		border-radius: 35rpx !important;
	}
</style>