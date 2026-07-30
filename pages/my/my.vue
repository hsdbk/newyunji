<template>
	<view class="my-page">
		<view class="my-top-bg"></view>
		<view class="my-content">
			<view class="profile-card">
				<view class="profile-header">
					<view class="message-entry" @click="goMessage" >
						<view class="message-box" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
							<image class="profile-chat" :src="$getStaticSrc('/static/new-my/message.png')" mode="aspectFit" @click="goMessage"></image>
							<view class="message-t">站内信</view>
							<view class="message-status" v-if="syncInfo.is_open_notice_dialog"></view>
						</view>
						
					</view>
					<image class="avatar" :src="userInfo.avatar ? $baseUrl + userInfo.avatar : '/static/logo.png'" mode="aspectFill"></image>
					<image class="settings-icon" @click="goSettings" :src="$getStaticSrc('/static/my/set.png')" mode="aspectFit"></image>
				</view>
				<view class="user-info">
					<text class="user-name" @click="goLogin">{{ userInfo.nick_name || '昵称在这里' }}</text>
					<text class="user-id">ID: {{ userInfo.id || '--' }}</text>
				</view>
			</view>
			
			<view class="rain-card">
				<view class="rain-left" @click="goGoldLog">
					<image class="coin-pool-icon" :src="$getStaticSrc('/static/task/rain.png')" mode="aspectFit"></image>
					<text class="rain-label">雨滴</text>
					<text class="rain-value">{{$formatPrice(userInfo.gold,1,0)}}</text>
				</view>
				<view class="exchange-btn" @click="goShop">立即兑换</view>
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
			<view class="section-title" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">快捷操作</view>
			<view class="quick-actions" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1">
				<view class="quick-action-card" @click="goRecharge">
					<image :src="$getStaticSrc('/static/new-my/recharge.png')" mode="aspectFit"></image>
					<view class="quick-action-text">
						<text>快速充值</text>
						<text class="quick-sub">便捷充值</text>
					</view>
				</view>
				<view class="quick-action-card" @click="goWithdraw">
					<image :src="$getStaticSrc('/static/new-my/cash.png')" mode="aspectFit"></image>
					<view class="quick-action-text">
						<text>快速提现</text>
						<text class="quick-sub">极速到账</text>
					</view>
				</view>
			</view>
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

			<view class="section-title">更多服务</view>
			<view class="service-grid">
				<!-- <view class="service-item" @click="goSettings"><image :src="$getStaticSrc('/static/new-my/account.png')" mode="aspectFit"></image><text>账号中心</text></view> -->
				<view class="service-item" @click="goQuestion"><image :src="$getStaticSrc('/static/new-my/question.png')" mode="aspectFit"></image><text>常见问题</text></view>
				<view class="service-item" @click="goAgreement('terms')"><image :src="$getStaticSrc('/static/new-my/user.png')" mode="aspectFit"></image><text>用户协议</text></view>
				<view class="service-item" @click="goAgreement('privacy')"><image :src="$getStaticSrc('/static/new-my/privacy.png')" mode="aspectFit"></image><text>隐私政策</text></view>
				<view class="service-item" @click="goAgreement('about')"><image :src="$getStaticSrc('/static/new-my/aboutus.png')" mode="aspectFit"></image><text>关于我们</text></view>
				<view class="service-item" @click="showHelp"><image :src="$getStaticSrc('/static/new-my/customer.png')" mode="aspectFit"></image><text>专属客服</text></view>
				<view class="service-item" @click="goInvestLog" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1"><image :src="$getStaticSrc('/static/new-my/log.png')" mode="aspectFit"></image><text>项目详情</text></view>
				<view class="service-item" @click="goTips" v-if="userInfo.show_item && config?.review_mode != 1&& userInfo.show_licai==1"><image :src="$getStaticSrc('/static/new-my/team.png')" mode="aspectFit" ></image><text>我的团队</text></view>
				<view class="service-item" @click="goInvite" v-if="userInfo.show_item && config?.review_mode != 1 && userInfo.show_licai==1"><image :src="$getStaticSrc('/static/new-my/invite.png')" mode="aspectFit"></image><text>邀请好友</text></view>
				<view class="service-item" @click="goDown"><image :src="$getStaticSrc('/static/new-my/down.png')" mode="aspectFit"></image><text>下载app</text></view>
				<view class="service-item" @click="deletePopupShow = true"><image :src="$getStaticSrc('/static/new-my/quit.png')" mode="aspectFit"></image><text>退出账号</text></view>
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
		// console.log('用户信息:', this.userInfo);
		// console.log('登录状态:', this.isLoggedIn);
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
		// console.log('currentVersion~~~',this.currentVersion)
		// console.log('config.version~~~',this.config.version)
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
		uni.$on('syncInfoUpdated', this.handleSyncInfoUpdated);
		// console.log('onShow syncInfo:', this.syncInfo);
		// console.log('用户信息:', this.userInfo);
		// console.log('登录状态:', this.isLoggedIn);
		// console.log("获取AndroidID原始值：" + uni.getStorageSync('dev_android_id_raw'));
		// console.log("获取AndroidID上报值：" + uni.getStorageSync('dev_android_id'));

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
		uni.$off('syncInfoUpdated', this.handleSyncInfoUpdated);
	},
	methods: {
		handleSyncInfoUpdated(syncInfo) {
			this.syncInfo = syncInfo || {}
		},
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
					title: '完成实名认证，解锁充值服务。',
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
			
			// uni.navigateTo({
			// 	url: '/pages/my/settings/agreement?type='+e
			// })
			if(e == 'terms' || e == 'privacy'){
				uni.navigateTo({
					url: '/pages/my/settings/terms?type='+e
				})
			}else{
				uni.navigateTo({
					url: '/pages/my/settings/agreement?type='+e
				})
			}
			
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
			if (!this.isLoggedIn) {
				uni.$u.toast('请您先登录')
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false
			}
			if (this.config?.gift_auth_switch && this.userInfo.is_auth != 'Y') {
				uni.showToast({
					title: '完成实名认证，解锁完整商城服务。',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({ url: '/pages/my/settings/settings-password?type=1' })
				}, 3000)
				return false
			}
			uni.navigateTo({
				url: '/pages/shop/shop'
			})
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
		background-image: url('/static/new-my/btn-back.png');
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
	background-color: #F3F3F3;
	min-height: 100vh;
	padding-bottom: 40rpx;
}

.my-top-bg {
	height: 290rpx;
	background-image: url('/static/new-my/back.png');
	background-size: cover;
	background-position: center;
}

.my-content {
	margin-top:-25rpx;
	background-color: #F3F3F3;
	padding: 0 30rpx 0;
}

.profile-card {
	border-radius: 30rpx;
	text-align: center;
	position: relative;
}

.profile-header {
	position: relative;
	height: 92rpx;
}

.message-entry {
	position: absolute;
	left: 0;
	top: 10rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 3;
}

.profile-chat {
	width: 44rpx;
	height: 44rpx;
	margin-top:20rpx;
}

.avatar {
	width: 128rpx;
	height: 128rpx;
	border-radius: 50%;
	border: 8rpx solid #eaf2ff;
	position: absolute;
	left: 50%;
	top: -78rpx;
	transform: translateX(-50%);
	z-index: 2;
}

.user-info{
	position: absolute;
	width:100%;
	top:70rpx;
}
.user-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1e2732;
	margin-top: 10rpx;
}

.user-id {
	font-size: 20rpx;
	color: #9da8b6;
	margin-top: 10rpx;
	display: block;
}

.settings-icon {
	width: 44rpx;
	height: 44rpx;
	position: absolute;
	right: 0;
	top: 24rpx;
}

.rain-card {
	margin-top: 90rpx;
	background: #fff;
	border-radius: 30rpx;
	padding: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.rain-left {
	display: flex;
	align-items: center;
}

.rain-label {
	font-size: 38rpx;
	color: #65809c;
	margin-right: 16rpx;
}

.rain-value {
	font-size: 48rpx;
	font-weight: 700;
	color: #0f2030;
}

.section-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1a2734;
	margin: 30rpx 0 18rpx;
}

.quick-actions {
	display: flex;
	justify-content: space-between;
}

.quick-action-card {
	width: 49%;
	height: 136rpx;
	border-radius: 30rpx;
	padding: 18rpx 16rpx;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	box-sizing: border-box;
	background-image: url('/static/new-my/label-back.png');
	background-size: cover;
	background-position: center;
}

.quick-action-card image {
	width: 60rpx;
	height: 60rpx;
	margin-right: 12rpx;
}

.quick-action-text {
	display: flex;
	flex-direction: column;
}

.quick-action-text text {
	font-size: 30rpx;
	color: #ffffff;
	font-weight: 600;
	line-height: 1.1;
}
.quick-sub {
	margin-top: 8rpx;
	font-size: 24rpx !important;
	font-weight: 500 !important;
	opacity: 0.95;
}

.service-grid {
	display: flex;
	flex-wrap: wrap;
	padding: 12rpx 0 8rpx;
}

.service-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 25%;
	padding: 20rpx 0 16rpx;
}

.service-item image {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 12rpx;
}

.service-item text {
	font-size: 24rpx;
	color: #28374a;
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
.message-t{
	font-weight: 500;
	font-size: 20rpx;
	color: #000000;
	margin-top: 6rpx;
}
.message-box{
	position: relative;
}
.message-status{
	position: absolute;
	top:10rpx;
	left:40rpx;
	width: 20rpx;
	height: 20rpx;
	background-color: #ff6b35;
	border-radius: 50%;
}
/* 账户信息卡片 */
.account-card {
	margin-top: 30rpx;
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
	margin-top:30rpx;
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

/* 活动区域 */
.activity-section {
	margin: 30rpx 0 30rpx;
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
</style>
