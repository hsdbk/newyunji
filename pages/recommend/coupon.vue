<template>
	<view class="coupon-container">
		<!-- 加载状态 -->
		<view v-if="isLoading" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>

		<view v-else>
			<!-- 优惠券数量 -->
			<view class="coupon-count">
				<image class="coupon-count-icon" :src="$getStaticSrc('/static/recommend/coupon/back-total.png')" mode="scaleToFill" />
				<text>共{{ totalCoupons }}张</text>
			</view>
			
			<!-- 状态标签 -->
			<view class="status-tabs">
				<view class="tab-item" :class="{ active: activeTab === 'unused' }" @click="switchTab('unused')">
					<text>未使用</text>
					<view class="tab-line" v-if="activeTab === 'unused'"></view>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'used' }" @click="switchTab('used')">
					<text>已使用</text>
					<view class="tab-line" v-if="activeTab === 'used'"></view>
				</view>
				<view class="tab-item" :class="{ active: activeTab === 'expired' }" @click="switchTab('expired')">
					<text>已过期</text>
					<view class="tab-line" v-if="activeTab === 'expired'"></view>
				</view>
			</view>
			
			<!-- 搜索和筛选 -->
			<view class="search-filter">
				<view class="search-bar">
					<image class="search-icon" :src="$getStaticSrc('/static/recommend/coupon/search.png')" mode="scaleToFill" />
					<input type="text" placeholder="搜索券名称/来源/适用商品" class="search-input" />
				</view>
				<view class="filter-button">
					<text>全部类型</text>
					<image class="filter-button-icon" :src="$getStaticSrc('/static/recommend/coupon/down.png')" mode="scaleToFill" />
				</view>
			</view>
			
			<!-- 优惠券列表 -->
			<view class="coupon-list" v-if="activeTab=='unused'">
			
				<view class="coupon-item unuse-back" v-for="coupon in able_list" :key="coupon.type">
					<view class="coupon-item-label">
						<!-- 1 代金券；2 抵用券，3: 红包券 -->
						<view class="rule-label-left label-plat" style="color:#F64A2F;">
							{{coupon.type==1?'代金券':coupon.type==2?'抵用券':'红包券'}}</view>
					</view>
					<view class="coupon-content">
						<view class="coupon-header">
							<!-- <view class="coupon-header-title">免邮</view> -->
							<view class="coupon-header-type">单笔订单</view>
						</view>
						<view class="coupon-body">
							<view class="coupon-title">
								<text class="coupon-type">{{coupon.title}}</text>
								<view class="rule-label" v-if="coupon.useType === 'all'">
									<image class="rule-label-button" :src="$getStaticSrc('/static/recommend/coupon/label.png')"
										mode="scaleToFill" />
									<text>全场通用</text>
								</view>
								<view class="rule-place" v-if="coupon.useType === 'partial'">
									<image class="rule-place-button" :src="$getStaticSrc('/static/recommend/coupon/label-place.png')"
										mode="scaleToFill" />
									<text>部分偏远地区除外</text>
								</view>
							</view>
							<view class="coupon-desc">
								<view>券面额：{{coupon.money}} 元</view>
								<view>适用：满 {{coupon.use_limit}} 元可用</view>
								<view>过期时间：{{coupon.expire_date}}</view>
							</view>
						</view>
						<view class="coupon-footer">
							<button class="use-button" @click="useCoupon(coupon)">使用</button>
						</view>
					</view>
			
				</view>
			</view>
			<view class="coupon-list" v-if="activeTab === 'used'">
				<view class="coupon-item" v-for="coupon in used_list" :key="coupon.type">
					<view class="coupon-item-label">
						<!-- 1 代金券；2 抵用券，3: 红包券 -->
						<view class="rule-label-left label-plat" style="color:#F64A2F;">
							{{coupon.type==1?'代金券':coupon.type==2?'抵用券':'红包券'}}</view>
					</view>
					<view class="coupon-content">
						<view class="coupon-header">
							<!-- <view class="coupon-header-title unused-font-color">免邮</view> -->
							<view class="coupon-header-type unused-font-color">单笔订单</view>
						</view>
						<view class="coupon-body">
							<view class="coupon-title">
								<text class="coupon-type">{{coupon.title}}</text>
								<view class="rule-label" v-if="coupon.useType === 'all'">
									<image class="rule-label-button" :src="$getStaticSrc('/static/recommend/coupon/label.png')"
										mode="scaleToFill" />
									<text>全场通用</text>
								</view>
								<view class="rule-place" v-if="coupon.useType === 'partial'">
									<image class="rule-place-button" :src="$getStaticSrc('/static/recommend/coupon/label-place.png')"
										mode="scaleToFill" />
									<text>部分偏远地区除外</text>
								</view>
							</view>
							<view class="coupon-desc">
								<view class="unused-font-color">券面额：{{coupon.money}} 元</view>
								<view class="unused-font-color">适用：满 {{coupon.use_limit}} 元可用</view>
								<view class="unused-font-color">过期时间：{{coupon.expire_date}}</view>
							</view>
						</view>
						<view class="coupon-footer">
							<view class="rule used" @click="useCoupon(coupon)">已使用</view>
						</view>
					</view>
			
				</view>
			</view>
			<view class="coupon-list" v-if="activeTab === 'expired'">
				<view class="coupon-item" v-for="coupon in expired_list" :key="coupon.type">
					<view class="coupon-item-label">
						<!-- 1 代金券；2 抵用券，3: 红包券 -->
						<view class="rule-label-left label-plat" style="color:#F64A2F;">
							{{coupon.type==1?'代金券':coupon.type==2?'抵用券':'红包券'}}</view>
					</view>
					<view class="coupon-content">
						<view class="coupon-header">
							<!-- <view class="coupon-header-title unused-font-color">免邮</view> -->
							<view class="coupon-header-type unused-font-color">单笔订单</view>
						</view>
						<view class="coupon-body">
							<view class="coupon-title">
								<text class="coupon-type">{{coupon.title}}</text>
								<view class="rule-label" v-if="coupon.useType === 'all'">
									<image class="rule-label-button" :src="$getStaticSrc('/static/recommend/coupon/label.png')"
										mode="scaleToFill" />
									<text>全场通用</text>
								</view>
								<view class="rule-place" v-if="coupon.useType === 'partial'">
									<image class="rule-place-button" :src="$getStaticSrc('/static/recommend/coupon/label-place.png')"
										mode="scaleToFill" />
									<text>部分偏远地区除外</text>
								</view>
							</view>
							<view class="coupon-desc">
								<view class="unused-font-color">券面额：{{coupon.money}} 元</view>
								<view class="unused-font-color">适用：满 {{coupon.use_limit}} 元可用</view>
								<view class="unused-font-color">过期时间：{{coupon.expire_date}}</view>
							</view>
						</view>
						<view class="coupon-footer">
							<view class="rule used" @click="useCoupon(coupon)">已使用</view>
						</view>
					</view>
			
				</view>
			</view>
			<!-- 温馨提示 -->
			<view class="tip">
				<text>温馨提示：不同券的使用门槛、可叠加规则可能不同，请以页系统核验为准。</text>
			</view>
			
			<!-- 底部功能区 -->
			<!-- <view class="bottom-functions">
				<button class="function-button" @click="doExchange">输入兑换码</button>
				<button class="function-button-two" @click="doTeam">转增好友</button>
				<button class="function-button primary">一键使用可用券</button>
			</view> -->
		</view>
		<up-popup :show="giftShow" mode="bottom" @close="giftShow = false" :closeable="true">
			<view class="bottom-content">
				<view class="bottom-title">
					转赠好友
				</view>
				<up-form class="form" ref="formRef" :model="formData">
					<up-form-item borderBottom="true" prop="name" labelWidth="190rpx">
						<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.name"
							placeholder="请输入手机号/昵称" />
					</up-form-item>
					<view class="tips-title">仅“未使用”且未锁定的优惠券可转赠；对方需在24小时内领取。</view>
				</up-form>

				<view class="sign-actions">
					<up-button type="primary" class="poster-btn" @click="goUnTeam">转赠</up-button>
				</view>
			</view>
		</up-popup>
		<up-popup :show="exchangeShow" mode="bottom" @close="exchangeShow = false" :closeable="true">
			<view class="bottom-content">
				<view class="bottom-title">
					兑换码绑定
				</view>
				<up-form class="form" ref="formRef" :model="formData">
					<up-form-item borderBottom="true" label="兑换码" prop="name" labelWidth="190rpx">
						<up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.name"
							placeholder="请输入8~12位兑换码" />
					</up-form-item>
					<view class="tips-title">支持字母/数字；绑定后不可转移。</view>
				</up-form>

				<view class="sign-actions">
					<up-button type="primary" class="poster-btn" @click="goUnTeam">绑定</up-button>
				</view>
			</view>
		</up-popup>
		<view class="tips" v-if="tipsShow">{{ tips }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				totalCoupons: 0,
				activeTab: 'unused',
				able_list: [],
				expired_list: [],
				used_list: [],
				coupons: [{
						type: 'platform',
						use_price: '￥50',
						use_type: '满300可用',
						status: '未使用',
						title: '秋季通用满减券',
						brand: true,
						useType: 'all'
					},
					{
						type: 'limit',
						use_price: '免邮',
						use_type: '单笔订单',
						status: '未使用',
						title: '全站免邮券',
						brand: false,
						useType: 'partial'
					},
					{
						type: 'used',
						use_price: '￥50',
						use_type: '满300可用',
						status: '已过期',
						title: '秋季通用满减券',
						brand: true,
						useType: 'all'
					},
				],
				tipsShow: false,
				tips: '',
				giftShow: false,
				exchangeShow: false,
				formData: {
					name: ''
				},
				isLoading: true,

			}
		},
		onShow() {
			this.isLoading = true;
			this.initTicketsList()
		},
		methods: {
			goBack() {
				// 返回上一页
				uni.navigateBack()
			},
			initTicketsList() {
				// 编辑地址
				this.$http(
					'/user/tickets/list', {}, "GET").then(res => {
					this.totalCoupons = res.data.able_list.length
					this.able_list = res.data.able_list
					this.expired_list = res.data.expired_list
					this.used_list = res.data.used_list
					this.isLoading = false;
				}).catch(error => {
					console.error('获取优惠券列表失败:', error);
					// 即使出错也要设置加载状态为false，避免页面一直显示加载中
					this.isLoading = false;
					// 可以在这里显示错误提示
					this.tips = '获取优惠券失败，请稍后重试';
					this.tipsShow = true;
					setTimeout(() => {
						this.tipsShow = false;
					}, 3000);
				})
			},
			switchTab(tab) {
				this.activeTab = tab
				// 这里可以根据tab筛选不同状态的优惠券
			},
			useCoupon() {
				this.tips = '即将转入';
				this.tipsShow = true;
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/icon/icon?tabType=recommend'
					});
				}, 3000);
				
				// 使用优惠券的逻辑
				// uni.showToast({
				// 	title: '前往使用',
				// 	icon: 'none'
				// })
			},
			doExchange() {
				this.exchangeShow = true
			},
			doTeam() {
				this.giftShow = true
			},
			goUnTeam() {
				this.tips = '转赠成功';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);

				this.tips = '对方好友不存在';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);

				this.tips = '绑定成功';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);

				this.tips = '兑换码错误，请确认';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			}
			// 其他方法...
		}
	}
</script>

<style scoped>
	page {
		background-color: #f5f5f5;
	}
	/* 加载状态样式 */
		.loading-container {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #f5f5f5;
			z-index: 9999;
		}
		
		.loading-spinner {
			width: 50rpx;
			height: 50rpx;
			border: 4rpx solid rgba(0, 0, 0, 0.1);
			border-left-color: #F64A2F;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin-bottom: 20rpx;
		}
		
		.loading-text {
			font-size: 28rpx;
			color: #666;
		}
		
		@keyframes spin {
			0% { transform: rotate(0deg); }
			100% { transform: rotate(360deg); }
		}
		
		/* 空状态样式 */
		.empty-state {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 300rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin: 20rpx 0;
			font-size: 28rpx;
			color: #999;
		}
	.coupon-container {
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		padding-bottom: 140rpx;
	}


	/* 优惠券数量 */
	.coupon-count {
		width: 100vw;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.coupon-count-icon {
		width: 690rpx;
		height: 40rpx;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.coupon-count text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 690rpx;
		height: 40rpx;
		color: #fff;
		border-radius: 40rpx;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
	}

	/* 状态标签 */
	.status-tabs {
		display: flex;
		margin-bottom: 30rpx;
		padding: 0 80rpx;
		justify-content: flex-start;
		/* 从 flex-end 改为 flex-start 实现居左显示 */
		align-items: flex-end;
	}

	.tab-item {
		/* 移除 flex: 1; 不再平分模块宽度 */
		width: 15vw;
		padding: 0 0 20rpx;
		font-size: 24rpx;
		color: #A4A4A4;
		text-align: center;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		margin-top: 30rpx;
		margin-right: 50rpx;
		/* 添加右侧间距，让标签之间有间隔 */
	}

	/* 最后一个标签不需要右侧间距 */
	.tab-item:last-child {
		margin-right: 0;
	}

	.tab-item.active text {
		font-size: 30rpx;
		color: #FF481C;
	}

	.tab-line {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 172rpx;
		height: 2rpx;
		background-color: #ff6b35;
		border-radius: 3rpx;
	}

	/* 搜索和筛选 */
	.search-filter {
		display: flex;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
	}

	.search-bar {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 40rpx;
		padding: 0 20rpx;
		margin-right: 20rpx;
	}

	.search-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 10rpx;
		color: #999;
	}

	.search-input {
		flex: 1;
		height: 50rpx;
		font-size: 28rpx;
	}

	.filter-button {
		width: 190rpx;
		height: 50rpx;
		background-color: #fff;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #D54E3A;
		line-height: 36rpx;
		text-align: center;
	}

	.filter-button-icon {
		width: 18.38rpx;
		height: 10.59rpx;
		margin-left: 16rpx;
	}

	.filter-icon {
		margin-left: 10rpx;
		font-size: 24rpx;
		color: #999;
	}

	/* 优惠券列表 */
	.coupon-list {
		padding: 0 30rpx;

	}

	.coupon-item {
		position: relative;
		border-radius: 30rpx 30rpx 30rpx 30rpx;
		margin-bottom: 20rpx;
		background: #fff;
		color: #000;
	}

	.unuse-back {
		background-image: url('/static/recommend/coupon-back.png');
		background-size: 100% 100%;
	}

	.coupon-item-label {
		position: absolute;
		top: 0;
		left: 0;
	}

	.coupon-label {
		position: absolute;
		top: 0;
		left: 0;
		width: 110rpx;
		height: 40rpx;
		margin-bottom: 20rpx;
	}

	.scope-button {
		width: 110rpx;
		height: 40rpx;
		background-color: transparent;
		border-radius: 30rpx;
		border: 1rpx solid #FFFFFF;
		font-family: OPPOSans, OPPOSans;
		font-weight: normal;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		font-style: normal;
		text-transform: none;
		line-height: 40rpx;
		margin-right: 10rpx;
	}

	.rule {
		width: 110rpx;
		height: 40rpx;
		background-color: transparent;
		border-radius: 30rpx;
		border: 1rpx solid #fff;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
		color: #fff;
	}

	.unuse {
		background: #FEEEE5;
		color: #993018;
	}

	.used {
		background: #F3F3F3;
		color: #A4A4A4;
	}

	/* 左上角标签 */
	.rule-label-left {
		width: 110rpx;
		height: 40rpx;
		background-color: transparent;
		border-radius: 20rpx 0rpx 20rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		position: relative;
		color: #FFFFFF;
		font-size: 20rpx;
		text-align: center;
		line-height: 40rpx;
	}

	.label-new {
		background-image: url('/static/recommend/coupon/label-new.png');
		background-size: 100% 100%;
	}

	.label-plat {
		background-image: url('/static/recommend/coupon/label-plat.png');
		background-size: 100% 100%;
	}

	.label-quie {
		background-image: url('/static/recommend/coupon/label-quie.png');
		background-size: 100% 100%;
	}

	.label-red {
		background-image: url('/static/recommend/coupon/label-red.png');
		background-size: 100% 100%;
		width: 150rpx;
	}

	.rule-label-left text {
		color: #FFFFFF;
		font-size: 20rpx;
		font-weight: normal;
		position: absolute;
		z-index: 1;
	}

	.rule-label-left-button {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.use-button {
		margin: 0;
		margin-top: 20rpx;
		width: 130rpx;
		height: 50rpx;
		background: #FFFFFF;
		border-radius: 25rpx 25rpx 25rpx 25rpx;
		font-family: OPPOSans, OPPOSans;
		font-weight: normal;
		font-size: 24rpx;
		color: #FB6941;
		text-align: center;
		font-style: normal;
		text-transform: none;
		line-height: 50rpx;
		padding: 0;

	}

	.coupon-content {
		display: flex;
		justify-content: space-between;
		padding-top: 20rpx;
		padding-bottom: 15rpx;
	}

	.coupon-header {
		width: 30vw;

	}

	.coupon-header-title {
		padding-top: 34rpx;
		font-size: 36rpx;
		color: #FFFFFF;
		text-align: center;
		font-style: normal;
	}

	.coupon-header-type {
		padding-top: 34rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		font-style: normal;
	}

	.coupon-body {
		width: 75vw;
		margin-left: 20rpx;
	}

	.coupon-title {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 20rpx;

	}

	.coupon-title text {
		font-size: 30rpx;
		color: #FFFFFF;
		text-align: left;
		font-weight: bold;
	}

	.coupon-desc {
		width: 45vw;
		font-size: 20rpx;
		color: #FFFFFF;
		text-align: left;
		margin-bottom: 15rpx;

	}

	.coupon-footer {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-end;
		height: 100%;
		width: 30vw;
		padding: 0 20rpx 0 0;
	}



	/* 全程通用 */
	.rule-label {
		width: 120rpx;
		height: 30rpx;
		background-color: transparent;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		position: relative;
	}

	.rule-label-button {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.rule-label text {
		color: #FFFFFF;
		font-size: 20rpx;
		font-weight: normal;
		position: absolute;
		z-index: 1;
	}

	/* 部分偏远地区除外 */
	.rule-place {
		width: 200rpx;
		height: 30rpx;
		background-color: transparent;
		border-radius: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.rule-place-button {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}

	.rule-place text {
		color: #FFFFFF;
		font-size: 20rpx;
		font-weight: normal;
		position: absolute;
		z-index: 1;
	}

	/* 温馨提示 */
	.tip {
		padding: 20rpx 30rpx;
		font-size: 20rpx;
		color: #999;
		text-align: center;
	}

	/* 底部功能区 */
	.bottom-functions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100vw;
		display: flex;
		padding: 20rpx 30rpx;
		background-color: #fff;
		/* 移除margin-top，固定定位时无效 */
		box-sizing: border-box;
		/* 确保宽度计算包含内边距 */
		z-index: 999;
		/* 确保显示在其他内容之上 */
		border-top: 1px solid #f0f0f0;
		/* 添加顶部边框，与主内容区分 */
	}

	.function-button {
		width: 227rpx;

		height: 70rpx;
		background-color: #ffffff;
		color: #000000;
		border-radius: 35rpx;
		font-size: 24rpx;
		line-height: 70rpx;
		margin-right: 10rpx;
		border: 1rpx solid #000000;
	}

	.function-button-two {
		width: 227rpx;

		height: 70rpx;
		background-color: #000;
		color: #fff;
		border-radius: 35rpx;
		font-size: 24rpx;
		line-height: 70rpx;
		border: 1rpx solid #000000;
		margin-right: 10rpx;
	}

	.function-button.primary {
		width: 240rpx;
		margin-right: 0;
		background-color: #000;
		color: #fff;
	}

	.tips {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 40%;
		width: 429rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #9B361F;
		border-radius: 40rpx;
		background-color: #FEEEE5;
		text-align: center;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.3);
		z-index: 99999;
	}

	.bottom-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		font-size: 30rpx;
		color: #000000;
		padding: 25rpx 50rpx;
	}

	.bottom-title {
		font-size: 28rpx;
		font-weight: bold;
		text-align: left;
		margin-top: 20rpx;
		width: 100%;
		padding-bottom: 20rpx;
	}

	.bottom-grid {
		display: flex;
		justify-content: space-around;
		width: 100%;
	}

	.poster-btn {
		border-radius: 35rpx;
		width: 500rpx;
		height: 70rpx;
		text-align: center;
		line-height: 70rpx;
		border: 1rpx solid #000;
		margin: 0 5rpx;
		font-size: 24rpx;
		background-color: #000;
		color: #fff;
	}

	.form {
		width: 88%;
		background-color: #fff;
		border-radius: 30rpx;
		padding: 0 33rpx 20rpx;
		position: relative;
	}

	.tips-title {
		color: #979696;
		font-size: 20rpx;
		padding: 0;
		margin-top: 20rpx;
		text-align: left;
	}

	.unused-font-color {
		color: #000;
	}
</style>