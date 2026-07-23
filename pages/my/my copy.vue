<template>
	<view class="my-page">
		<!-- 顶部信息区域 -->
		<view class="header-section">
			<!-- 头像和用户信息 -->
			<view class="user-info">
				<image class="avatar" :src="userInfo.avatar ? $baseUrl + userInfo.avatar : '/static/logo.png'" mode="aspectFit"></image>
				<view class="user-details">
					<view class="user-name-section" >
						<text class="user-name" @click="goLogin">{{userInfo.nick_name}}</text>
						<image class="vip-icon" @click="goVip" :src="$getStaticSrc('/static/my/vip-t.png')" mode="aspectFit" v-if="userInfo.show_item"></image>
						<image v-if="userInfo.show_item" style="width:20rpx;height:24rpx;" @click="goVip" :src="userInfo.vip_info.level ? '/static/my/'+userInfo.vip_info.level+'.png' : '/static/my/0.png'" mode="aspectFit"></image>
					</view>
					<text class="user-id">ID: {{userInfo.id}}</text>
				</view>
				<image class="settings-icon" @click="goSettings" :src="$getStaticSrc('/static/my/set.png')" mode="aspectFit"></image>
			</view>

			<!-- 账户信息卡片 -->
			<view class="account-card" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
				<view class="account-row">
					<view class="account-item" @click="goFundsLog">
						<text class="account-value">¥{{userInfo.money}}</text>
						<view class="account-label-container">
							<image class="account-icon" :src="$getStaticSrc('/static/my/balance.png')" mode="aspectFit"></image>
							<text class="account-label">余额</text>
						</view>
					</view>
					<!-- <view class="account-item" @click="goGoldLog" v-if="!userInfo.show_item">
						<text class="account-value" >{{$formatPrice(userInfo.gold,1,0)}}</text>
						<view class="account-label-container">
							<image class="account-icon" src="/static/my/coins.png" mode="aspectFit"></image>
							<text class="account-label">当前雨滴</text>
						</view>
					</view> -->
					<view class="account-item" @click="goEranLog">
						<text class="account-value">¥{{userInfo.total_profit}}</text>
						<view class="account-label-container">
							<image class="account-icon" :src="$getStaticSrc('/static/my/profit.png')" mode="aspectFit"></image>
							<text class="account-label">累计收益</text>
						</view>
					</view>
					<view class="account-item" @click="goCoupon">
						<text class="account-value">{{userInfo.my_tickets_count}}</text>
						<view class="account-label-container">
							<image class="account-icon" :src="$getStaticSrc('/static/my/wallet.png')" mode="aspectFit"></image>
							<text class="account-label">我的券包</text>
						</view>
					</view>
				</view>
				
			</view>
			<!-- 账户信息卡片 -->
			<view class="account-card" style="margin-top: 20rpx;">
				<view class="account-row">
					<view class="account-item1">
						<image class="coin-pool-icon" :src="$getStaticSrc('/static/my/rain.png')" mode="aspectFit"></image>
						<text class="account-value" style="font-weight: 500;">雨滴</text>
					</view>
					<view class="account-item" @click="goGoldLog">
						<text class="account-value" style="font-weight: 500;">{{$formatPrice(userInfo.gold,1,0)}}</text>
					</view>
					<view class="account-item" @click="goShop">
						<view class="exchange-btn">前往兑换</view>
					</view>
				</view>
			</view>
			<!-- 账户信息卡片 -->
			<!-- <view class="account-card" v-if="!userInfo.show_item || config?.review_mode != 1&& userInfo.show_licai!=1">
				<view class="account-row" style="justify-content: flex-start;width:100%;">
					<view class="account-item" @click="goGoldLog">
						<text class="account-value">{{userInfo.gold}}</text>
						<view class="account-label-container">
							<image class="account-icon" src="/static/my/coins.png" mode="aspectFit"></image>
							<text class="account-label">当前雨滴</text>
						</view>
					</view> -->
					<!-- <view class="account-item" @click="goCoupon">
						<text class="account-value">{{userInfo.my_tickets_count}}</text>
						<view class="account-label-container">
							<image class="account-icon" src="/static/my/wallet.png" mode="aspectFit"></image>
							<text class="account-label">我的卡包</text>
						</view>
					</view> -->
			<!-- 	</view>
			</view> -->
		</view>
		<!-- 金币兑换区域 -->
		<!-- <view class="change" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
			<view class="change-header">
				<view class="change-item" @click="goGoldLog">
					<text class="change-label">当前雨滴</text>
					<view class="change-value balance-value">¥{{ userInfo.gold || 0 }}</view>
				</view>
				<view class="change-item">
					<view class="change-label">当前余额</view>
					<view class="change-value balance-value">¥{{ userInfo.coin || 0 }}</view>
				</view>
				<view class="change-item">
					<view class="change-label">可提现金额</view>
					<view class="change-value balance-value">¥{{ userInfo.withdraw_coin || 0 }}</view>
				</view>
			</view>
			<view class="change-content">
				<view class="change-input-group">
					<input 
						class="change-input" 
						v-model.number="exchangeAmount" 
						type="number" 
						placeholder="请输入兑换数量"
						placeholder-style="color: #999; font-size: 28rpx;"
					/>
					<text class="exchange-rate">100雨滴=¥1</text>
				</view>
				<view>
					<button class="exchange-btn" @click="handleExchange">立即兑换</button>
				</view>
			</view>
			<button class="change-btn" @click="handleChange">余额转入可提现余额</button>
		</view> -->
		<!-- 会员信息区域 -->
		<view class="member-card" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
			<image class="member-badge" :src="$getStaticSrc('/static/my/vip.png')" mode="aspectFit"></image>
			<view class="member-info">
				<text class="member-title">{{userInfo.vip_info.show_name}}</text>
				<text class="current-level">当前成长值:{{userInfo.vip_info.credit}} </text>
				<view class="progress-section">
					<view class="progress-container">
						<image :src="$getStaticSrc('/static/my/line-progress.png')" mode="aspectFill" class="progress-bg"></image>
						<image :src="$getStaticSrc('/static/my/line-progress-active.png')" mode="aspectFill" class="progress-active"
							:style="{ width: Math.min(userInfo.vip_info.credit/userInfo.vip_info.next.credit, 1) * 100 + '%' }"></image>
						<text class="progress-text-card">{{userInfo.vip_info.credit}}/{{userInfo.vip_info.next.credit}}</text>
					</view>
				</view>
				<view class="member-badge-section" @click="goVip">
					<view class="member-button">会员权益</view>
				</view>
			</view>
		</view>

		<!-- 快捷功能区 -->
		<view class="quick-functions" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
			<view class="function-row">
				<view class="function-item" @click="goRecharge">
					<view class="function-item-icon">
						<image :src="$getStaticSrc('/static/my/recharge.png')" mode="aspectFit"></image>
					</view>
					<text>快速充值</text>
				</view>
				<view class="function-item" @click="goWithdraw">
					<view class="function-item-icon">
						<image :src="$getStaticSrc('/static/my/cash.png')" mode="aspectFit"></image>
					</view>
					<text>快速提现</text>
				</view>
				<view class="function-item" @click="goInvestLog">
					<view class="function-item-icon">
						<image :src="$getStaticSrc('/static/my/log.png')" mode="aspectFit"></image>
					</view>
					<text>项目明细</text>
				</view>
				<view class="function-item" @click="goMessage">
					<view class="function-item-icon">
						<image :src="$getStaticSrc('/static/my/account.png')" mode="aspectFit"></image>
					</view>
					<text>我的消息</text>
					<view class="message-status" v-if="syncInfo.is_open_notice_dialog"></view>
				</view>
			</view>
		</view>

		<!-- 会员活动区域 -->
		<view class="activity-section" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
			<u-swipe-action :show="true" :options="swipeOptions">
				<view slot="content">
					<view class="activity-banner">
						<image :src="$baseUrl + banner" mode="aspectFill" class="banner-image"></image>
						<!-- <image src="/static/my/vip-invite.png" mode="aspectFill"></image> -->
					</view>
				</view>
			</u-swipe-action>
		</view>

		<!-- 常用功能区 -->
		<view class="common-functions">
			<view class="function-section-title">常用功能</view>
			<view class="function-grid">
				<view class="common-function-item" @click="goTips" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
					<image :src="$getStaticSrc('/static/my/team.png')" mode="aspectFit"></image>
					<text>我的团队</text>
				</view>
				<view class="common-function-item" @click="goInvite" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
					<image :src="$getStaticSrc('/static/my/invite.png')" mode="aspectFit"></image>
					<text>邀请好友</text>
				</view>
				<view class="common-function-item" @click="goQuestion">
					<image :src="$getStaticSrc('/static/my/question.png')" mode="aspectFit"></image>
					<text>常见问题</text>
				</view>
				<view class="common-function-item" @click="goAgreement('terms')">
					<image :src="$getStaticSrc('/static/my/user.png')" mode="aspectFit"></image>
					<text>用户协议</text>
				</view>
				<view class="common-function-item" @click="goAgreement('privacy')">
					<image :src="$getStaticSrc('/static/my/privacy.png')" mode="aspectFit"></image>
					<text>隐私政策</text>
				</view>
				<view class="common-function-item" @click="goAgreement('about')">
					<image :src="$getStaticSrc('/static/my/aboutus.png')" mode="aspectFit"></image>
					<text>关于我们</text>
				</view>
				<!-- <view class="common-function-item" @click="goAgreement('zzf')" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
					<image src="/static/my/zzf.png" mode="aspectFit"></image>
					<text>赞助方</text>
				</view> -->
				<view class="common-function-item" @click="showHelp">
					<image :src="$getStaticSrc('/static/my/customer.png')" mode="aspectFit"></image>
					<text>在线客服</text>
				</view>
				<view class="common-function-item" @click="showQuestion" v-if="userInfo.show_item && config?.review_mode == 1&& userInfo.show_licai==1">
					<image :src="$getStaticSrc('/static/my/customer.png')" mode="aspectFit"></image>
					<text>客服</text>
				</view>
				<view class="common-function-item" @click="goAgreement('auth')" v-if="userInfo.show_item && config?.review_mode == 1&& userInfo.show_licai==1">
					<image :src="$getStaticSrc('/static/my/permissions.png')" mode="aspectFit"></image>
					<text>应用权限</text>
				</view>
				<view class="common-function-item" @click="goDown" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
					<image :src="$getStaticSrc('/static/my/down.png')" mode="aspectFit"></image>
					<text>下载APP</text>
				</view>
				// #ifdef APP
				<view class="common-function-item" @click="goDownload" >
					<image :src="$getStaticSrc('/static/my/down.png')" mode="aspectFit"></image>
					<text>版本更新</text>
					<view class="message-status" v-if="currentForced"></view>
				</view>
				// #endif
				<view class="common-function-item" @click="deletePopupShow = true">
					<image :src="$getStaticSrc('/static/my/quit.png')" mode="aspectFit"></image>
					<text>退出账号</text>
				</view>
			</view>
		</view>
		<!-- 确认注销弹窗 -->
		<up-popup :show="deletePopupShow" mode="center" @close="deletePopupShow = false" :closeable="true">
			<view class="delete-popup">
				<view class="delete-title">是否退出</view>
				<view class="delete-content">确认操作后将退出登录</view>
				<view class="delete-actions">
					<up-button type="primary" class="add-address-button" @click="confirmQuit">确定</up-button>
				</view>
			</view>
		</up-popup>
		<!-- 自定义下载进度弹窗 -->
		<up-popup :show="showDownloadProgressPopup" mode="center" :closeable="false">
			<view class="download-progress-popup">
				<view class="popup-title">正在下载</view>
				<view class="progress-info">
					<view class="progress-bar-container">
						<view class="progress-bar-bg">
							<view class="progress-bar-fill" :style="{ width: downloadProgress + '%' }"></view>
						</view>
					</view>
					<view class="progress-text">
						{{ downloadProgress }}% ({{ formatFileSize(downloadedSize) }}/{{ formatFileSize(totalSize) }})
					</view>
				</view>
			</view>
		</up-popup>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	data() {
		return {
			auth: true,
			swipeOptions: [
				{
					text: '查看更多',
					style: {
						backgroundColor: '#FF6B3B'
					}

				}
			],
			progressValue: 40, // 动态进度值，可以从数据源获取
			progressWidth: '40%',
			deletePopupShow: false,
			banner:'',
			exchangeAmount: '',
			// 下载进度相关变量
			showDownloadProgressPopup: false,
			downloadProgress: 0,
			downloadedSize: 0,
			totalSize: 0,
			currentVersion:'1.0.0',
			currentForced:false,
			syncInfo:{}
		}
	},
	computed: {
		...mapState(['userInfo', 'isLoggedIn','isAuth','config'])
	},
	created() {
		// 每次进入页面都刷新用户信息
		console.log('用户信息:', this.userInfo);
		console.log('登录状态:', this.isLoggedIn);
		if (this.isLoggedIn) {
			this.$store.dispatch('updateUserInfo');
		}
		// #ifdef APP
		plus.navigator.setFullscreen(true);
		const systemInfo = uni.getSystemInfoSync();
		const currentVersion = systemInfo.appWgtVersion
		const configVersion = this.config && this.config.version ? this.config.version : '0.0.0';
		if(this.compareVersion(configVersion, currentVersion) > 0){
			this.currentForced = true
		}
		console.log('currentVersion~~~',this.currentVersion)
		console.log('config.version~~~',this.config.version)
		// #endif
		// 在created钩子中调用getConfig，无论登录状态
		this.$store.dispatch('getConfig');
		this.initBanner()
		
		
		// if (this.isLoggedIn && !this.userInfoPolling) {
		// 	this.startUserInfoPolling();
		// }
		// else{
		// 	uni.navigateTo({
        //         url: '/pages/login/login'
        //       })
		// }
		this.syncInfo = uni.getStorageSync('syncInfo');
		console.log('onShow syncInfo:', this.syncInfo);
		console.log('用户信息:', this.userInfo);
		console.log('登录状态:', this.isLoggedIn);

	},
	onShow() {
		// 用户信息轮询已迁移到icon页面
		// 每次页面显示时重新获取syncInfo，确保消息提示能动态更新
		this.syncInfo = uni.getStorageSync('syncInfo');
		console.log('onShow syncInfo:', this.syncInfo);
	},
	onHide() {
		console.log(111111111)
		// 用户信息轮询已迁移到icon页面
	},
	onUnload() {
		// 用户信息轮询已迁移到icon页面
	},
	methods: {
		// 处理兑换金币
		handleExchange() {
			if (!this.exchangeAmount || this.exchangeAmount <= 0) {
				uni.showToast({
					title: '请输入有效数量',
					icon: 'none'
				});
				return;
			}
			
			// 验证金币是否足够
			if (this.exchangeAmount > this.currentGold) {
				uni.showToast({
					title: '金币数量不足',
					icon: 'none'
				});
				return;
			}
			
			// 显示加载中
			uni.showLoading({
				title: '兑换中...'
			});
			// 编辑地址
			this.$http(
				'/user/exchange/apply', {
					gold_amount: this.exchangeAmount,
				}, "POST").then(res => {
					this.$store.dispatch('updateUserInfo');
				// 隐藏加载并显示成功提示
				this.exchangeAmount = ""
				uni.hideLoading();
				uni.showToast({
					title: '兑换成功',
					icon: 'success'
				});
		
			})
		},
		handleChange(){
			console.log('coin',this.userInfo.coin)
			const exchangeMoney = parseFloat(this.userInfo.coin) || 0;
			if (exchangeMoney < 1000) {
				uni.showToast({
					title: '满1000才可转入',
					icon: 'none'
				});
				return;
			}
			// 显示加载中
			uni.showLoading({
				title: '兑换中...'
			});
			// 编辑地址
			this.$http(
				'/user/funds/transferWithdrawCoin', {
					amount: exchangeMoney,
				}, "POST").then(res => {
				// 隐藏加载并显示成功提示
				this.exchangeAmount = ""
				this.$store.dispatch('updateUserInfo');
				uni.hideLoading();
				uni.showToast({
					title: '兑换成功',
					icon: 'success'
				});
					
			})
		},
		goArticle() {
			uni.navigateTo({
				url: '/pages/my/article'
			})
		},
		// 加载商品数据
		initBanner() {
			// 编辑地址
			this.$http(
				'/api/api/banner', {
					url:'me'
				}, "GET").then(res => {
				console.log('数据',res.data)
				this.banner = res.data[0].thumb;
			})
		},
		// 用户信息轮询已迁移到icon页面
		
		goRecharge() {
			if(!this.isAuth){
				
				// 使用优惠券的逻辑
				uni.showToast({
					title: '用户未实名',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({ url: `/pages/my/settings/settings-password?type=1` });
				}, 3000);
				return false;
			}
			uni.navigateTo({
				url: '/pages/my/recharge'
			})
		},
		goWithdraw() {
			// 前往提现页面
			uni.navigateTo({
				url: '/pages/my/withdraw'
			})
		},
		// 邀请好友活动
		goInvite() {
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false;
			}
			// if (this.userInfo.vip_info.level < 1) {
			// 	uni.$u.toast('当您升级至 VIP1(钛钢会员)或更高级别即可解锁【邀请好友】功能。')
			// 	return false;
			// }
			uni.navigateTo({
				url: '/pages/index/invite'
			});
			// 这里可以添加跳转到邀请页面的逻辑
		},
		goFundsLog() {
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false;
			}
			uni.navigateTo({
				url: '/pages/my/funds-log'
			})
		},
		goEranLog(){
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false;
			}
			uni.navigateTo({
				url: '/pages/my/eran-log'
			})
		},
		goMessage() {
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false;
			}
			uni.navigateTo({
				url: '/pages/my/message'
			})
		},
		goSettings() {
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false;
			}
			uni.navigateTo({
				url: '/pages/my/settings'
			})
		},
		goQuestion() {
			uni.navigateTo({
				url: '/pages/my/settings/question?type=question'
			})
		},
		goAgreement(e) {
			uni.navigateTo({
				url: '/pages/my/settings/agreement?type='+e
			})
		},
		goVip() {
			uni.navigateTo({
				url: '/pages/my/settings/vip'
			})
		},
		goLogin() {
			if (!this.isLoggedIn) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
			
		},
		goGoldLog() {
			if (this.isLoggedIn) {
				uni.navigateTo({
					url: '/pages/my/gold-log'
				})
			}
			
		},
		goShop(){
			if (this.isLoggedIn) {
				uni.navigateTo({
					url: '/pages/shop/shop'
				})
			}
		},
		goInvestLog() {
			if (this.isLoggedIn) {
				uni.navigateTo({
					url: '/pages/my/invest-log'
				})
			}
			
		},
		goCoupon(){
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false;
			}
			uni.navigateTo({ url: '/pages/recommend/coupon' });
		},
		showQuestion(){
			uni.navigateTo({ url: '/pages/my/question' });
		},
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
		goTips() {
			uni.showToast({
				title: '暂未开发',
				icon: 'fail'
			})
			
		},
		goDown(){
			uni.navigateTo({ url: '/pages/my/download' });
		},
		goDownload(){
			// 检测当前安卓安装版本号并与配置版本对比自动更新
			console.log('开始版本检测...');
			
			// 获取当前应用版本信息
			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				const currentVersion = inf.version;
				const configVersion = this.config && this.config.version ? this.config.version : '0.0.0';
				this.currentVersion = currentVersion
				console.log('当前版本:', currentVersion);
				console.log('配置版本:', configVersion);
				
				// 比较版本号
				if (this.compareVersion(configVersion, currentVersion) > 0) {
					// 发现新版本
					uni.showModal({
						title: '版本更新',
						content: `发现新版本 ${configVersion}，是否立即更新？`,
						showCancel: true,
						cancelText: '稍后更新',
						confirmText: '立即更新',
						success: (res) => {
							if (res.confirm) {
								// 执行下载操作
								if (this.config && this.config.app_link) {
									this.downloadAndInstall(this.config.app_link);
								} else {
									uni.showToast({
										title: '下载地址未配置',
										icon: 'none'
									});
								}
							}
						}
					});
				} else {
					// 当前已是最新版本
					uni.showToast({
						title: '当前已是最新版本',
						icon: 'success'
					});
				}
			});
		},
		// 比较版本号
		compareVersion(version1, version2) {
			const v1 = version1.split('.').map(Number);
			const v2 = version2.split('.').map(Number);
			
			for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
				const num1 = v1[i] || 0;
				const num2 = v2[i] || 0;
				
				if (num1 > num2) return 1;
				if (num1 < num2) return -1;
			}
			
			return 0;
		},
		
		// 下载并安装应用
		downloadAndInstall(downloadUrl) {
			// 显示自定义进度弹窗
			this.showDownloadProgressPopup = true;
			this.downloadProgress = 0;
			this.downloadedSize = 0;
			this.totalSize = 0;

			// 创建下载任务
			const downloadTask = uni.downloadFile({
				url: downloadUrl,
				success: (res) => {
					// 关闭自定义进度弹窗
					this.showDownloadProgressPopup = false;
					if (res.statusCode === 200) {
						// 下载成功，开始安装
						plus.runtime.install(res.tempFilePath, {
							force: false
						}, () => {
							uni.showModal({
								title: '安装成功',
								content: '应用已更新，是否立即重启？',
								showCancel: false,
								success: () => {
									plus.runtime.restart();
								}
							});
						}, (error) => {
							uni.showToast({
								title: '安装失败: ' + error.message,
								icon: 'none'
							});
						});
				} else {
					uni.showToast({
						title: '下载失败，状态码: ' + res.statusCode,
						icon: 'none'
					});
				}
			},
			fail: (error) => {
				// 关闭自定义进度弹窗
				this.showDownloadProgressPopup = false;
				uni.showToast({
					title: '下载失败: ' + error.errMsg,
					icon: 'none'
				});
			}
		});

			// 监听下载进度
			downloadTask.onProgressUpdate((res) => {
				console.log('下载进度: ' + res.progress + '%');
				console.log('已下载字节数: ' + res.totalBytesWritten);
				console.log('总字节数: ' + res.totalBytesExpectedToWrite);
				
				// 更新进度数据
				this.downloadProgress = res.progress;
				this.downloadedSize = res.totalBytesWritten;
				this.totalSize = res.totalBytesExpectedToWrite;
			});
		},
		// 格式化文件大小
		formatFileSize(bytes) {
			if (bytes === 0) return '0B';
			const k = 1024;
			const sizes = ['B', 'KB', 'MB', 'GB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},

		confirmQuit() {
			// 1. 首先调用logout接口
			this.$http(
				'/api/api/logout', {
				username: this.phone,
				password: this.password
			}, "POST").then(async res => {
				// 2. 清除本地存储的用户信息
				uni.removeStorageSync('ssid');
                uni.removeStorageSync('expire_time');
                uni.removeStorageSync('reset_time');
                
                // 4. 重新生成新的ssid
                try {
                    await this.$getSsidAsync;
                    console.log('重新生成了新的ssid');
                    
                    // 5. 只有在新ssid生成后，才设置用户登出状态并跳转到icon页面
                    this.$store.commit('setUserLoggedOut');
                    
                    setTimeout(() => {
						uni.hideLoading()
						this.deletePopupShow = false
						uni.showToast({
							title: '退出账号',
							icon: 'success'
							})

						// 退出成功后跳转到icon页面，并设置tab为0（首页）
							setTimeout(() => {
								
							uni.navigateTo({
									url: '/pages/icon/icon'
								})
								}, 1500)
						}, 1500)
                } catch (error) {
                    console.error('重新生成ssid失败:', error);
                    // 即使生成失败，也要设置用户登出状态
                    this.$store.commit('setUserLoggedOut');
                    uni.hideLoading();
                    uni.showToast({
                        title: '退出账号',
                        icon: 'success'
                    });
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/icon/icon'
                        })
                    }, 1500);
                }
			}).catch(error => {
				console.error('登录失败:', error);
				uni.hideLoading();
				uni.showToast({
					title: '退出失败，请重试',
					icon: 'none'
				});
			});
		}
		// 其他方法...
	}
}
</script>

<style lang="scss">
page {
	background: #F3F3F3;
}
/* 金币兑换样式 */
	.change {
		background-color: #fff;
		margin: 0 30rpx 30rpx; 
		padding: 20rpx 32rpx 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		position: relative;
	}
	
	.change-header {
		display: flex;
		justify-content: space-around;
		margin-bottom: 20rpx;
	}
	
	.change-item {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.change-label {
		font-size: 28rpx;
		color: #333;
		margin-right: 10rpx;
	}
	
	.change-value {
		font-size: 28rpx;
		font-weight: bold;
	}
	
	.gold-value {
		color: #333;
	}
	
	.balance-value {
		color: #333;
		
	}
	
	.change-record {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		font-size: 28rpx;
		color: #D54E3A;
	}
	
	.change-content {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.change-input-group {
		width: 66%;
		position: relative;
	}
	
	.input-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.change-input {
		width: 100%;
		height: 80rpx;
		border: 2rpx solid #E5E5E5;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		box-sizing: border-box;
	}
	
	.exchange-rate {
		display: block;
		font-size: 26rpx;
		color: #999;
		margin-bottom: 30rpx;
		text-align: center;
		position: absolute;
		top: 20rpx;
		right: 30rpx;
	}
	
	.exchange-btn {
		width:183rpx;
		height: 77rpx;
		display: flex;
		line-height: 77rpx;
		padding-bottom:5rpx;
		color: #fff;
		font-size: 30rpx;
		background-image: url('/static/my/btn-back.png');
		background-size: 100% 100%;
		text-align: center;
		align-items: center;
		justify-content: center;
	}
	.change-btn{
		height: 55rpx;
		line-height: 55rpx;
		background-color: #FF6B35;
		color: #fff;
		font-size: 28rpx;
		border-radius: 44rpx;
		border: none;
		margin-top:20rpx;
	}
	.exchange-btn:active {
		background-color: #E55A2A;
	}

	.dropdown-content {
		background-color: #fff;
		border-radius: 30rpx 30rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		animation: slideDown 0.3s ease;
	}
.my-page {
	background-color: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

/* 顶部信息区域 */
.header-section {
	padding: 100rpx 30rpx 40rpx;
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 3rpx solid #FFFFFF;
}

.user-details {
	flex: 1;
	margin-left: 20rpx;
}

.user-name-section {
	display: flex;
	align-items: center;
}

.user-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #000;
}

.vip-icon {
	width: 60rpx;
	height: 30rpx;
	margin-left: 10rpx;
	margin-right: 6rpx;
}

.user-id {
	font-size: 20rpx;
	color: #A4A4A4;
	opacity: 0.8;
	margin-top: 10rpx;
	display: block;
}

.settings-icon {
	width: 44rpx;
	height: 44rpx;
	padding-bottom: 40rpx;
}

/* 账户信息卡片 */
.account-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
}

.account-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.account-row:last-child {
	margin-bottom: 0;
}

.account-item {
	width:30%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 10rpx;
	flex: 1;
}
.account-item1 {
	width:30%;
	display: flex;
	align-items: center;
	padding: 0 15rpx;
	margin-bottom: 10rpx;
}
.account-value {
	font-size: 30rpx;
	font-weight: bold;
	color: #000;
}

.account-label-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.account-icon {
	width: 32rpx;
	height: 32rpx;
	margin-right: 8rpx;
}

.account-label {
	font-size: 24rpx;
	color: #000;
	opacity: 0.8;
}

/* 会员卡片 */
.member-card {
	position: relative;
	width: 100%;
	height: 250rpx;
	border-radius: 50rpx;
	overflow: hidden;
}

.member-badge {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.member-info {
	position: absolute;
	left: 0;
	top: 0;
	width: 80%;
	height: 100%;
	padding: 26rpx 68rpx 0;
}

.member-header {
	padding: 25rpx 30rpx;
}

.member-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.member-content {
	padding: 25rpx 30rpx;
}

.current-level {
	font-size: 24rpx;
	color: #fff;
	display: block;
}

.member-badge-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
}


.member-button {
	width: 200rpx;
	background-color: #FDEEB1;
	border-radius: 30rpx;
	font-size: 24rpx;
	height: 60rpx;
	line-height: 60rpx;
	font-weight: 600;
	color: #FE733F;
	text-align: center;
}

/* 快捷功能区 */
.quick-functions {
	border-radius: 20rpx;
	padding: 42rpx 30rpx;
}

.function-row {
	display: flex;
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	position: relative;
}
.message-status{
	position: absolute;
	top:0;
	right:40rpx;
	width: 20rpx;
	height: 20rpx;
	background-color: #ff6b35;
	border-radius: 50%;
}
.function-item-icon {
	width: 80rpx;
	height: 80rpx;
	background-color: #FFFFFF;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.function-item image {
	width: 42rpx;
	height: 42rpx;
}

.function-item text {
	font-size: 24rpx;
	color: #666666;
	margin-top: 18rpx;
}

/* 活动区域 */
.activity-section {
	margin: 0 30rpx 30rpx;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.activity-banner {
	width: 100%;
	height: 400rpx;
	overflow: hidden;
}

.activity-banner image {
	width: 100%;
	height: 100%;
}

/* 常用功能区 */
.common-functions {
	
	margin: 0 30rpx 90rpx;
	
}

.function-section-title {
	padding: 25rpx 0;
	// border-bottom: 1rpx solid #F0F0F0;
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.function-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0;
	border-radius: 20rpx;
	background-color: #FFFFFF;
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.common-function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
	padding: 20rpx 0;
	position: relative;
}

.common-function-item image {
	width: 44rpx;
	height: 44rpx;
	margin-bottom: 10rpx;
}

.common-function-item text {
	font-size: 24rpx;
	color: #666666;
}

.progress-section {
	width: 50%;
	display: flex;
	justify-content: center;
}

.progress-container {
	position: relative;
	width: 100%;
	height: 30rpx;
	/* 设置固定高度 */
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	margin: 10rpx 0;
}

.progress-bg {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
	border-radius: 15rpx;
}

.progress-active {
	position: absolute;
	left: 0;
	width: 56%;
	height: 100%;
	z-index: 2;
	transition: width 0.3s ease;
	/* 确保进度条从左到右填充 */
	clip-path: inset(0 0 0 0);
	border-radius: 15rpx;
}

.progress-text-card {
	position: relative;
	z-index: 3;
	color: #fff;
	font-size: 20rpx;
	font-weight: bold;
	text-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.5);
}

.download-progress-popup {
	background-color: #ffffff;
	border-radius: 30rpx;
	width: 620rpx;
	padding: 60rpx 40rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
	color: #333333;
}

.progress-info {
	width: 100%;
}

.progress-bar-container {
	width: 100%;
	margin-bottom: 20rpx;
}

.progress-bar-bg {
	width: 100%;
	height: 12rpx;
	background-color: #E5E5E5;
	border-radius: 6rpx;
	overflow: hidden;
}

.progress-bar-fill {
	height: 100%;
	background-color: #FF6B35;
	border-radius: 6rpx;
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 24rpx;
	color: #666666;
	text-align: center;
}

/* 删除弹窗样式 */
.delete-popup {
	background-color: #ffffff;
	border-radius: 30rpx;
	width: 620rpx;
}

.delete-title {
	font-size: 30rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
	margin-top: 44rpx;
}

.delete-content {
	font-size: 28rpx;
	color: #666;
	text-align: center;
	margin: 120rpx 0;
}

.default-icon {
	width: 34rpx;
	height: 34rpx;
}

.delete-actions {
	display: flex;
	justify-content: space-between;
}

.delete-actions .u-button {
	width: 200rpx;
	margin-bottom: 40rpx;
}

.add-address-button {
	background-color: #000000 !important;
	color: #ffffff !important;
	border-radius: 35rpx !important;
	font-size: 24rpx;
	height: 70rpx;
	width: 400rpx !important;
	line-height: 70rpx;
}

.u-icon__icon {
	color: #000 !important;
}
.coin-pool-icon {
	width: 40rpx;
	height: 62rpx;
	margin-right: 30rpx;
}
</style>






