<template>
    <view class="recharge-page">
        <!-- 支付方式选择 -->
		<view class="amount-section">
		    <text class="section-title" v-if="!codeShow">选择充值方式</text>
        <view class="payment-methods" v-for="(item,index) in channelList" :key="index">
            <!-- 银联/手机银行 -->
            <view class="payment-item bank-back" v-if="item.key== 'bank' && (!isSubmitted || selectedPayment === 'bank')" @click="selectPayment('bank')">
                <view class="payment-actions-2">
                    <image class="payment-check" :src="selectedPayment === 'bank' ? '/static/my/check.png' : '/static/my/uncheck.png'" mode="aspectFit"></image>
                </view>
                <image class="payment-icon" :src="$getStaticSrc('/static/my/pay.png')" mode="aspectFit"></image>
                <view class="payment-info">
                    <view class="payment-title">银联/手机银行入款</view>
                    <view class="payment-detail" v-if="accountStatus && selectedPayment === 'bank' && item.bank_card">
                        <view class="payment-detail-info">收款账户: {{item.bank_card}}</view>
                        <view class="copy-btn" @click.stop="copyText(item.bank_card)">复制</view>
                    </view>
                    <view class="payment-detail" v-if="accountStatus && selectedPayment === 'bank' && item.bank_user">
                        <view class="payment-detail-info">收款人:{{item.bank_user}}</view>
                        <view class="copy-btn" @click.stop="copyText(item.bank_user)">复制</view>
                    </view>
                    <view class="payment-detail" v-if="accountStatus && selectedPayment === 'bank' && item.bank_name">
                        <view class="payment-detail-info">开户行: {{item.bank_name}}</view>
                        <view class="copy-btn" @click.stop="copyText(item.bank_name)">复制</view>
                    </view>
                </view>
                <view class="payment-actions" @click="showBankPopup" v-if="!auto">
                    <image class="payment-checkbox" :src="$getStaticSrc('/static/my/right-more.png')" mode="aspectFit"></image>
                </view>
            </view>

            <!-- 支付宝 -->
            <view class="payment-item zfb-back" v-if="item.key== 'alipay' && (payShow || (isSubmitted && selectedPayment === 'alipay'))" @click="selectPayment('alipay')">
                <view class="payment-actions-2">
                    <image class="payment-check" :src="selectedPayment === 'alipay' ? '/static/my/check.png' : '/static/my/uncheck.png'" mode="aspectFit"></image>
                </view>
                <image class="payment-icon" :src="$getStaticSrc('/static/my/zfb.png')" mode="aspectFit"></image>
                <view class="payment-info">
                    <view class="payment-title">支付宝支付</view>
                    <!-- <view class="payment-detail" v-if="item.image">
                        <view @click="previewImage($baseUrl + item.image)">
							<image class="payment-pay" :src="$baseUrl + item.image" mode="aspectFit"></image>
						</view>
                    </view> -->
                </view>
                <view class="payment-actions" @click="showZfbPopup" v-if="!auto">
                    <image class="payment-checkbox" :src="$getStaticSrc('/static/my/right-more.png')" mode="aspectFit"></image>
                </view>
            </view>
			<view class="pay-show" v-if="codeShow" @click="saveImage($baseUrl + codeUrl)">
				<!-- 加载动画 -->
				<view class="image-loading" v-if="isImageLoading">
					<u-loading-icon mode="circle" size="40"></u-loading-icon>
				</view>
				<image 
					style="width:600rpx;height:600rpx;" 
					:src="$baseUrl + codeUrl" 
					mode="aspectFit"
					@load="isImageLoading = false"
					@error="isImageLoading = false"
					v-show="!isImageLoading"
				></image>
			</view>
			<view class="payment-item wx-back" v-if="item.key== 'wx'" @click="selectPayment('wx')">
			    <view class="payment-actions-2">
			        <image class="payment-check" :src="selectedPayment === 'wx' ? '/static/my/check.png' : '/static/my/uncheck.png'" mode="aspectFit"></image>
			    </view>
			    <image class="payment-icon" :src="$getStaticSrc('/static/my/wx.png')" mode="aspectFit"></image>
			    <view class="payment-info" v-if="item.image">
			        <view class="payment-title">微信支付</view>
			        <view class="payment-detail">
			            <view @click="previewImage($baseUrl + item.image)">
			        		<image class="payment-pay" :src="$baseUrl + item.image" mode="aspectFit"></image>
			        	</view>
			        </view>
			    </view>
			    <view class="payment-actions" @click="showZfbPopup" v-if="!auto">
			        <image class="payment-checkbox" :src="$getStaticSrc('/static/my/right-more.png')" mode="aspectFit"></image>
			    </view>
			</view>
            <!-- 欧意USDT -->
            <view class="payment-item OKpay-back" v-if="item.key== 'USDT'" @click="selectPayment('ouyi')">
                <view class="payment-actions-2">
                    <image class="payment-check" :src="selectedPayment === 'ouyi' ? '/static/my/check.png' : '/static/my/uncheck.png'" mode="aspectFit"></image>
                </view>
                <image class="payment-icon" :src="$getStaticSrc('/static/my/USDT.png')" mode="aspectFit"></image>
                <view class="payment-info">
                    <view class="payment-title">欧意USDT入款2%手续费立返</view>
                    <view class="payment-detail">
                        <view class="payment-detail-info">地址: xxx3xxx4xxx5x2xxx</view>
                        <view class="copy-btn" @click.stop="copyText('xxx3xxx4xxx5x2xxx')">复制</view>
                    </view>
                </view>
                <view class="payment-actions" v-if="!auto">
                    <image class="payment-checkbox" :src="$getStaticSrc('/static/my/right-more.png')" mode="aspectFit"></image>
                </view>
            </view>

            <!-- OKpay -->
            <view class="payment-item" v-if="item.key== 'OKpay'"  @click="selectPayment('okpay')">
                <view class="payment-actions-2">
                    <image class="payment-check" :src="selectedPayment === 'okpay' ? '/static/my/check.png' : '/static/my/uncheck.png'" mode="aspectFit"></image>
                </view>
                <image class="payment-back" :src="$getStaticSrc('/static/my/OKpay-back.png')" mode="aspectFit"></image>
                <image class="payment-icon" :src="$getStaticSrc('/static/my/OKpay.png')" mode="aspectFit"></image>
                <view class="payment-info">
                    <view class="payment-title">OKpay入款2%手续费立返</view>
                    <view class="payment-detail">
                        <view class="payment-detail-info">地址: xxx3xxx4xxx5x2xxx</view>
                        <view class="copy-btn" @click.stop="copyText('xxx3xxx4xxx5x2xxx')">复制</view>
                    </view>
                </view>
                <view class="payment-actions" v-if="!auto">
                    <image class="payment-checkbox" :src="$getStaticSrc('/static/my/right-more.png')" mode="aspectFit"></image>
                </view>
            </view>
        </view>
        </view>
		
		<!-- <view class="amount-section" v-if="accountStatus">
		    <text class="section-title">订单号</text>
		    <view class="amount-display">
				<text class="amount-cny"></text>
				<input type="text" value="" placeholder="请输入订单号后四位" v-model="pay_account"/>
		    </view>
		</view> -->
        <!-- 充值金额 -->
        <view class="amount-section">
            <text class="section-title">充值金额</text>
            <view class="amount-display">
                <text class="amount-cny">¥</text>
				<input type="number" value="" placeholder="请输入充值金额" v-model="channelPirce" :disabled="isAmountFixed"/>
            </view>
        </view>

        <!-- 附言 -->
        <!-- <view class="remark-section">
            <text class="section-title">附言</text>
            <textarea class="remark-input" placeholder="请输入附言" v-model="remark"></textarea>
        </view> -->

        <!-- 联系客服提示 -->
        <view class="contact-tip">
            <text class="contact-text">{{invest_help}}</text>
        </view>

        <!-- 提交按钮 -->
        <view class="submit-section" v-if="payShow">
            <u-button class="submit-btn" @click="firstRecharge">提交充值</u-button>
        </view>
		<view class="submit-section" v-if="!payShow">
		    <u-button class="submit-btn" @click="finishRecharge">完成充值</u-button>
		</view>
        
        <!-- 如何使用欧意USDT入款教程 -->
        <view class="tips-section" v-if="selectedPayment === 'ouyi'">
            <text class="section-title" style="text-align: center;">如何使用欧意USDT入款教程</text>
            <view class="tips-content">
                <up-parse :content="content"></up-parse>
            </view>
        </view>
        <!-- 小贴士 -->
        <view class="tips-section">
            <text class="section-title">小贴士</text>
            <text class="tips-content">请保持支付金额与提交的充值金额一致，否则系统无法自动审核入账。如需申请复核请联系<text class="contact-text">在线客服</text></text>
        </view>
        <up-popup :show="selectedBankshow" :round="10" mode="bottom" @close="this.selectedBankshow = false">
            <view class="popup-content">
                <text class="section-title" style="text-align: center;">选择充值账户</text>
                <view class="popup-items" v-for="(item, index) in selectedBankMethods" :key="index" @click="selectZfb(index)">
                    <view class="popup-item">
                        <image class="payment-icon" :src="$getStaticSrc('/static/my/pay.png')" mode="aspectFit"></image>
                        <text class="popup-item-text">{{ item }}</text>
                    </view>
                    <image class="popup-item-check" v-if="selectedBank == index" :src="$getStaticSrc('/static/my/check-g.png')" mode="aspectFit"></image>
                </view>
            </view>
        </up-popup>
        <up-popup :show="selectedZfbshow" :round="10" mode="bottom" @close="this.selectedZfbshow = false">
            <view class="popup-content">
                <text class="section-title" style="text-align: center;">选择充值账户</text>
                <view class="popup-items" v-for="(item, index) in selectedZfbMethods" :key="index" @click="selectZfb(index)">
                    <view class="popup-item">
                        <image class="payment-icon" :src="$getStaticSrc('/static/my/zfbs.png')" mode="aspectFit"></image>
                        <text class="popup-item-text">{{ item }}</text>
                    </view>
                    <image class="popup-item-check" v-if="selectedZfb == index" :src="$getStaticSrc('/static/my/check-g.png')" mode="aspectFit"></image>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            content: '<p>1. 登录欧意USDT钱包，点击“入款”按钮。</p><p>2. 输入您的欧意USDT地址，点击“下一步”。</p><p>3. 输入您要充值的金额，点击“下一步”。</p><p>4. 确认充值信息，点击“入款”。</p><p>5. 等待欧意USDT钱包确认入款，入款成功后，您的账户余额会自动更新。</p>',
            selectedPayment: '', // 默认选中银联支付
			pay_account:'',
            remark: '', // 附言内容
            selectedBankshow: false,
            selectedBankMethods: [
                '建设银行（8888）',
                '工商银行（6666）',
                '农业银行（5555）',
                '中国银行（4444）'
            ],
            selectedBank: 0,
            selectedZfbshow: false,
            selectedZfbMethods: [],
            selectedZfb: 0,
			channelList:[],
			channelPirce:'',
			pay_account:'',
			accountStatus:false,
			invest_help:'',
			codeShow:false,
			payShow:false,
			codeUrl:'',
			isImageLoading: true,
			auto:false,
			isAmountFixed: false, // 控制金额是否可编辑
			disabledNumber:false,
			invest_min_money:0,
			onlinePayLimit: 500,
			rechargeMode: '',
			isSubmitted: false
			// /upload/2025/12/14/20251214161113_d0b19416.png?rid=2188
        }
    },
	onShow() {
		this.initChannel()
	},
    methods: {
        // 返回上一页
        goBack() {
            uni.switchTab({
            	url:'/pages/my/my'
            })
        },
		initChannel(){
			// 编辑地址
			this.$http(
				'/user/invest/channel', {money:500}, "POST").then(res => {
				this.invest_help = res.data.invest_help
				this.invest_min_money = res.data.invest_min_money
				if(res.data.auto){
					if(res.data.channel.length==0){
						uni.showToast({
						  title: res.data.invest_help,
						  icon: 'none'
						});
					}
					
					this.codeShow = false
					this.accountStatus = false
					this.codeUrl = ""
					// 手动充值,显示充值页面
					this.channelList = res.data.channel
					// this.createOrder()
				}else{
					if(!res.data.channel){
						uni.showToast({
						  title: '暂无充值方式',
						  icon: 'none'
						});
					}
					if(res.data.channel.length==0){
						uni.showToast({
						  title: '请输入有效金额~',
						  icon: 'none'
						});
						return false;
					}
					
					if(res.data.channel){
						this.channelList = res.data.channel
						// 重置图片加载状态
						this.isImageLoading = true
						
						// 只针对支付宝通道生成可选账户
						if (res.data.channel[0].key === 'alipay' && res.data.channel[0].images) {
							const imagesLength = res.data.channel[0].images.length
							this.selectedZfbMethods = []
							for(let i = 0; i < imagesLength; i++){
								this.selectedZfbMethods.push(`支付宝${i + 1}`)
							}
						} else {
							this.selectedZfbMethods = []
						}
						
						// this.codeUrl = res.data.channel[0].images[this.selectedZfb]
						// this.codeShow = true
						this.payShow = true
						this.accountStatus = false
						// this.qrcodeOrder()
						// 
					}
					
					// 
					
				}
			})
		},
		previewImage(i){
			uni.previewImage({
				urls:[i],
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		// 保存图片功能（兼容App和H5）
		saveImage(imageUrl) {
			// 判断当前平台
			let platform = uni.getSystemInfoSync().platform;
			
			if (platform === 'web') {
				// H5平台：使用canvas绘制图片后触发下载
				this.saveImageForH5(imageUrl);
			} else {
				// App平台：直接保存到相册
				this.saveImageToAlbum(imageUrl);
			}
		},
		// App平台保存图片到相册
		saveImageToAlbum(imageUrl) {
			uni.showLoading({
				title: '保存中...'
			});
			
			// 下载图片
			uni.downloadFile({
				url: imageUrl,
				success: (res) => {
					if (res.statusCode === 200) {
						// 保存图片到相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								uni.hideLoading();
								this.$u.toast('图片保存成功');
							},
							fail: (err) => {
								uni.hideLoading();
								console.error('保存图片失败:', err);
								// 检查是否是用户拒绝了权限
								if (err.errMsg.indexOf('auth deny') !== -1 || err.errMsg.indexOf('permission denied') !== -1) {
									this.$u.toast('请在设置中开启保存图片权限');
								} else {
									this.$u.toast('图片保存失败');
								}
							}
						});
					} else {
						uni.hideLoading();
						this.$u.toast('图片下载失败');
					}
				},
				fail: (err) => {
					uni.hideLoading();
					console.error('下载图片失败:', err);
					this.$u.toast('图片下载失败');
				}
			});
		},
		// H5平台保存图片
		saveImageForH5(imageUrl) {
			uni.showLoading({
				title: '保存中...'
			});
			
			// 创建canvas
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			const img = new Image();
			
			// 允许跨域
			img.crossOrigin = 'Anonymous';
			
			img.onload = () => {
				// 设置canvas大小
				canvas.width = img.width;
				canvas.height = img.height;
				
				// 绘制图片
				ctx.drawImage(img, 0, 0, img.width, img.height);
				
				// 将canvas转换为blob
				canvas.toBlob((blob) => {
					// 创建下载链接
					const link = document.createElement('a');
					link.href = URL.createObjectURL(blob);
					// 设置文件名
					link.download = 'recharge-qrcode.png';
					// 触发下载
					link.click();
					// 释放URL对象
					URL.revokeObjectURL(link.href);
					
					uni.hideLoading();
					this.$u.toast('图片保存成功');
				});
			};
			
			img.onerror = () => {
				uni.hideLoading();
				console.error('图片加载失败');
				this.$u.toast('图片保存失败');
			};
			
			// 设置图片源
			img.src = imageUrl;
		},
        // 显示弹窗
        showBankPopup() {
            this.selectedBankshow = true
        },
        // 显示弹窗
        showZfbPopup() {
            this.selectedZfbshow = true
        },
        // 选择支付方式
        selectPayment(payment) {
            this.selectedPayment = payment
        },
        // 选择银行
        selectBank(index) {
            this.selectedBank = index
        },  
        // 选择支付宝
        selectZfb(index) {
            this.selectedZfb = index
			this.codeUrl = this.channelList[0].images[this.selectedZfb]
        },  
        // 复制文本到剪贴板
        copyText(text) {
            uni.setClipboardData({
                data: text,
                success: () => {
                    this.$u.toast('复制成功')
                },
                fail: () => {
                    this.$u.toast('复制失败')
                }
            })
		},
		firstRecharge(){
			this.submitRecharge()
		},
		finishRecharge() {
			this.selectedPayment = ''
			this.channelPirce = ''
			this.pay_account = ''
			this.remark = ''
			this.selectedBankshow = false
			this.selectedZfbshow = false
			this.selectedZfb = 0
			this.selectedBank = 0
			this.selectedZfbMethods = []
			this.codeUrl = ''
			this.codeShow = false
			this.payShow = false
			this.accountStatus = false
			this.isAmountFixed = false
			this.rechargeMode = ''
			this.channelList = []
			this.isSubmitted = false
			uni.navigateBack()
		},
        // 提交充值
        submitRecharge() {
			if (!this.selectedPayment) {
			    this.$u.toast('请选择支付方式')
			    return
			}
			if(!this.channelPirce){
				this.$u.toast('请输入充值金额')
				return
			}
			if(parseFloat(this.channelPirce) < parseFloat(this.invest_min_money)){
				this.$u.toast('最小充值金额为'+this.invest_min_money)
				return false;
			}
			// 金额输入完成后，禁止更改金额
			this.isAmountFixed = true;
			this.isSubmitted = true
			if (this.selectedPayment === 'bank') {
				this.rechargeMode = 'bank'
				this.codeShow = false
				this.payShow = false
				this.accountStatus = false
				this.$http(
					'/user/invest/channel', {
						money:this.channelPirce
					}, "GET").then(res => {
						this.invest_help = res.data.invest_help
						this.auto = res.data.auto
						
						if(!res.data.channel){
							uni.showToast({
							  title: '暂无充值方式',
							  icon: 'none'
							});
							return
						}
						if(res.data.channel.length==0){
							uni.showToast({
							  title: res.data.invest_help || '请输入有效金额~',
							  icon: 'none'
							});
							return false;
						}
						this.channelList = res.data.channel
						this.selectedZfbMethods = []
						this.codeUrl = ''
						this.codeShow = false
						this.payShow = false
						this.accountStatus = true
					})
				return
			}
			if (parseFloat(this.channelPirce) <= parseFloat(this.onlinePayLimit)) {
				this.rechargeMode = 'online'
				this.selectedPayment = 'alipay'
				this.codeShow = false
				this.payShow = false
				this.accountStatus = false
				this.createOrder('alipay')
				return
			}
			this.rechargeMode = 'scan'
			this.$http(
				'/user/invest/channel', {
					money:this.channelPirce
				}, "GET").then(res => {
					this.invest_help = res.data.invest_help
					this.auto = res.data.auto
					
					if(!res.data.channel){
						uni.showToast({
						  title: '暂无充值方式',
						  icon: 'none'
						});
						return
					}
					if(res.data.channel.length==0){
						uni.showToast({
						  title: res.data.invest_help || '请输入有效金额~',
						  icon: 'none'
						});
						return false;
					}
					this.channelList = res.data.channel
					// 重置图片加载状态
					this.isImageLoading = true
					// 只针对支付宝通道生成可选账户
					if (res.data.channel[0].key === 'alipay' && res.data.channel[0].images) {
						const imagesLength = res.data.channel[0].images.length
						this.selectedZfbMethods = []
						for(let i = 0; i < imagesLength; i++){
							this.selectedZfbMethods.push(`支付宝${i + 1}`)
						}
					} else {
						this.selectedZfbMethods = []
					}
					if (this.selectedPayment === 'bank') {
						this.codeUrl = ''
						this.codeShow = false
						this.payShow = false
						this.accountStatus = true
					} else {
						this.codeUrl = res.data.channel[0].images[this.selectedZfb]
						this.codeShow = true
						this.payShow = false
						this.accountStatus = true
					}
					// setTimeout(() => {
					//     this.pay_account = ""
					//     this.channelPirce = ""
					//     this.selectedPayment = ""
					//     this.remark = ""
					//     this.accountStatus = false
					// 	uni.navigateBack()
					// }, 3000);
				})
        },
		qrcodeOrder() {
			console.log(111)
			if (!this.selectedPayment) {
			    this.$u.toast('请选择支付方式')
			    return
			}
			// if(!this.pay_account){
			// 	this.$u.toast('请输入充值订单号后四位')
			// 	return
			// }
			if(!this.channelPirce){
				this.$u.toast('请输入充值金额')
				return
			}
			this.$http(
				'/user/invest/apply', {
					money:this.channelPirce,
					channel:this.selectedPayment,
					pay_account:this.pay_account,
					remark:this.remark,
				}, "POST").then(res => {
				if(res.code == 200){
					uni.showToast({
					  title: '充值提交成功',
					  icon: 'none'
					});
					// setTimeout(() => {
					//     this.pay_account = ""
					//     this.channelPirce = ""
					//     this.selectedPayment = ""
					//     this.remark = ""
					//     this.accountStatus = false
					// 	// uni.navigateBack()
					// }, 3000);
					
				}
			})
		},
		createOrder(paymentType = 'alipay') {
			var that = this
			if(!that.channelPirce){
				that.$u.toast('请输入充值金额')
				return
			}
			const payType = that.getPayType()
			that.$http(
				'/api/pay/create', {
					money:that.channelPirce,
					type:paymentType,
					is_new:1,
					pay_type:payType,
					remark:that.remark,
				}, "POST").then(res => {
					console.log('充值提交',res)
				if(res.code == 200){
					var url = res.data.url
					var orderString = res.data.order_string
					// that.onPurchase(that.channelPirce,that.remark)
					// #ifdef APP
					console.log('plus!!@@')
						if (orderString) {
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: orderString,
								success: (payRes) => {
									console.log('支付宝支付成功', payRes)
								},
								fail: (payErr) => {
									console.log('支付宝支付失败', payErr)
									if (url) {
										uni.navigateTo({
										  url: `/pages/webview/webview?url=` + url,
										});
									} else {
										that.$u.toast('支付宝拉起失败')
									}
								}
							})
						} else if (url) {
							uni.navigateTo({
							  url: `/pages/webview/webview?url=` + url,
							});
						} else {
							that.$u.toast('未获取到支付信息')
						}
					// #endif
					// #ifdef H5
						that.openOnlinePay(orderString || url, url);
					// #endif
					// // 跨平台解决方案
					// if (window.plus) {
					//   // 使用5+ runtime API
					//   plus.runtime.openURL(url, (result) => {
					//     console.log('成功打开支付链接');
					//   }, (error) => {
					//     console.error('打开支付链接失败:', error);
					//     uni.showToast({
					//       title: '打开支付链接失败',
					//       icon: 'none'
					//     });
					//   });
					// } else if (typeof window.open === 'function') {
					//   // Web平台使用window.open
					  
					// } else {
					//   // 兜底方案
					//   uni.showToast({
					//     title: '请复制支付链接: ' + url,
					//     icon: 'none',
					//     duration: 3000
					//   });
					// }
				}
			})
		},
		getPayType() {
			let payType = 'app'
			// #ifdef H5
			payType = 'h5'
			// #endif
			// #ifdef APP-PLUS
			payType = 'app'
			// #endif
			return payType
		},
		openOnlinePay(payTarget, fallbackUrl) {
			try {
				if (typeof window !== 'undefined' && typeof document !== 'undefined' && payTarget) {
					const iframe = document.createElement('iframe')
					iframe.style.display = 'none'
					iframe.src = payTarget
					document.body.appendChild(iframe)
					setTimeout(() => {
						if (iframe.parentNode) {
							iframe.parentNode.removeChild(iframe)
						}
						if (payTarget.indexOf('http') === 0 || payTarget.indexOf('alipays://') === 0 || payTarget.indexOf('intent://') === 0) {
							window.location.href = payTarget
						} else if (fallbackUrl) {
							window.open(fallbackUrl, '_blank')
						}
					}, 1200)
					return
				}
			} catch (err) {
				console.log('H5拉起支付宝失败，使用现有逻辑兜底', err)
			}
			if (fallbackUrl) {
				window.open(fallbackUrl, '_blank')
			}
		},
		onPurchase(money,remark) {//这个方法可以在支付成功的回调里面调用
			let dysdk = uni.requireNativePlugin('lilu-dysdk-transform');
			console.log('dysdk!~~~~~~~~~~~~',dysdk)
			dysdk.onEventPurchase("充值", '充值', "1001", 1, "ptb", "¥", true, money);//根据自己实际场景替换参数，可参考API
		}

    }
}
</script>

<style lang="scss" scoped>
page {
    background-color: #f5f5f5;
    min-height: 100vh;
}


/* 支付方式 */
.payment-methods {
    margin:0 0 10rpx;
    overflow: hidden;
}

.payment-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    position: relative;
    border-radius: 30rpx;
	
    &:last-child {
        border-bottom: none;
    }

    &.active {
        background-color: rgba(255, 107, 59, 0.05);
    }
}
.bank-back{
	background-image: url('/static/my/pay-back.png');
	background-size: 100% 100%;
}
.zfb-back{
	background-image: url('/static/my/zfb-back.png');
	background-size: 100% 100%;
}
.wx-back{
	background-image: url('/static/my/wx-back.png');
	background-size: 100% 100%;
}
.OKpay-back{
	background-image: url('/static/my/OKpay-back.png');
	background-size: 100% 100%;
}
.payment-pay{
	width:100rpx;
	height:100rpx;
}
.payment-back {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
}

.payment-icon {
    width: 90rpx;
    height: 64rpx;
    z-index: 3;
    margin:0 10rpx;
}

.payment-info {
    flex: 1;
    z-index: 3;
}

.payment-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    margin-bottom: 10rpx;
    display: block;
}

.payment-detail {
    font-size: 24rpx;
    color: #fff;
    display: block;
    margin-bottom: 5rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.payment-detail-info {
    width: 50vw;
}
.payment-actions-2 {
    width:4vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 3;
}
.payment-actions {
    width:8vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 3;
}
.payment-check{
    width:35rpx;
    height:35rpx;
}
.payment-checkbox {
    width: 13.03rpx;
    height: 24rpx;
}

.copy-btn {
    width: 90rpx;
    height: 30rpx;
    border-radius: 15rpx;
    background-color: #fff;
    color: #002A65;
    font-size: 20rpx;
    text-align: center;
    line-height: 30rpx;
}

.payment-checkbox {
    margin-top: 10rpx;
}

/* 充值金额 */
.amount-section {
    // background-color: #ffffff;
    // border-radius: 20rpx;
    padding: 30rpx;
}



.amount-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10rpx;
     background-color: #ffffff;
    border-radius: 40rpx;
    padding:25rpx 40rpx;
	text-align: right;
}

.amount-cny {
    font-size: 36rpx;
    font-weight: 600;
    color: #000;
	margin-right:20rpx;
}

.amount-exchange {
    font-size: 36rpx;
    color: #000;
}

.exchange-rate {
    font-size: 24rpx;
    color: #000000;
    margin-left: 41rpx;
}

/* 附言 */
.remark-section {
   
    padding: 30rpx 30rpx 16rpx;
    font-size: 30rpx;
    color: #000000;
}

.remark-input {
    width: 100%;
    height: 150rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 40rpx;
    padding: 29rpx 36rpx;
    font-size: 24rpx;
    color: #333333;
     background-color: #ffffff;
    box-sizing: border-box;
}

/* 联系客服提示 */
.contact-tip {
    margin: 0 20rpx 20rpx 20rpx;
    text-align: center;
}

.contact-text {
    font-size: 32rpx;
    color: #FF481C;
}
.pay-show{
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.image-loading{
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
/* 提交按钮 */
.submit-section {
    margin: 50rpx 20rpx 30rpx 20rpx;
}

.submit-btn {
    width:500rpx;
    background-color: #000000;
    color: #ffffff;
    border-radius: 100rpx;
    font-size: 24rpx;
    height: 70rpx;
    text-align: center;
    line-height: 70rpx;
}

/* 小贴士 */
.tips-section {
    padding: 30rpx;
    border-radius: 10rpx;
}

.tips-title {
    font-size: 26rpx;
    font-weight: 500;
    color: #ff9800;
    margin-bottom: 10rpx;
    display: block;
}

.tips-content {
    font-size: 24rpx;
    color: #979696;
    line-height: 36rpx;
}

</style>
