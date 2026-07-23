<template>
	<view class="coupon-container">


		<!-- 优惠券数量 -->
		<view class="coupon-count">
			<text>累计收益 ￥12,368</text>
		</view>

		<!-- 状态标签 -->
		<view class="status-tabs">
			<view class="tab-item" :class="{ active: activeTab === 'link' }" @click="switchTab('link')">
				<text>链接/渠道</text>
				<view class="tab-line" v-if="activeTab === 'link'"></view>
			</view>
			<view class="tab-item" :class="{ active: activeTab === 'poster' }" @click="switchTab('poster')">
				<text>海报生成</text>
				<view class="tab-line" v-if="activeTab === 'poster'"></view>
			</view>
		</view>
		<!-- 常用功能区 -->
		<view v-if="activeTab == 'link'">
			<view class="common-functions">
				<view class="function-section-title">
					快速分享
					<view class="function-section-desc">选择渠道，一键分享/复制</view>
				</view>
				<view class="function-grid">
					<view class="common-function-item">
						<image :src="$getStaticSrc('/static/recommend/wx.png')" mode="aspectFit"></image>
						<text>微信好友</text>
					</view>
					<view class="common-function-item">
						<image :src="$getStaticSrc('/static/recommend/moments.png')" mode="aspectFit"></image>
						<text>朋友圈</text>
					</view>
					<view class="common-function-item" @click="goQuestion">
						<image :src="$getStaticSrc('/static/recommend/qq.png')" mode="aspectFit"></image>
						<text>QQ</text>
					</view>
					<view class="common-function-item" @click="goAgreement">
						<image :src="$getStaticSrc('/static/recommend/weibo.png')" mode="aspectFit"></image>
						<text>微博</text>
					</view>
					<view class="common-function-item" @click="goCopyLink">
						<image :src="$getStaticSrc('/static/recommend/link.png')" mode="aspectFit"></image>
						<text>复制链接</text>
					</view>
					<view class="common-function-item" @click="goCopyText">
						<image :src="$getStaticSrc('/static/recommend/copy.png')" mode="aspectFit"></image>
						<text>复制文案</text>
					</view>
					<view class="common-function-item" @click="goQrcode">
						<image :src="$getStaticSrc('/static/recommend/qrcode.png')" mode="aspectFit"></image>
						<text>二维码</text>
					</view>
					<view class="common-function-item">
						<image :src="$getStaticSrc('/static/recommend/more.png')" mode="aspectFit"></image>
						<text>更多</text>
					</view>
				</view>
			</view>
			<view class="function-section-title">
				选择要分享的项目
				<view class="function-section-desc">长按可预览海报</view>
			</view>
			<view class="banner-container">
				<swiper class="banner-swiper" :indicator-dots="false" autoplay interval="3000">
					<swiper-item v-for="(product, index) in products" :key="index">
						<view class="banner-item">
							<!-- 商品图片 -->
							<image :src="product.imageUrl" mode="aspectFill" class="product-image"></image>

							<!-- 商品信息 -->
							<view class="product-info">
								<text class="product-name">项目名称: {{ product.name }}</text>
								<view class="stats-container">
									<view class="product-stats">
										<view class="stat-item">
											<text class="stat-label">最多质押:</text>
											<text class="stat-value">{{ product.maxPledge }}份</text>
										</view>
										<view class="stat-item">
											<text class="stat-label">单份质押:</text>
											<text class="stat-value">¥{{ product.unitPrice }}</text>
										</view>

									</view>
									<view class="product-stats">
										<view class="stat-item">
											<text class="stat-label">周期:</text>
											<text class="stat-value">{{ product.period }}日</text>
										</view>
										<view class="stat-item">
											<text class="stat-label">分成:</text>
											<text class="stat-value">¥{{ product.share }}/日</text>
										</view>
									</view>
								</view>
								<view class="product-progress">
									<text class="progress-text">剩余: {{ product.remaining }}%</text>
									<view class="progress-bar">
										<view class="progress-fill" :style="{ width: product.remaining + '%' }"></view>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="share-functions">
				<view class="share-section-title">自动生成分享文案</view>
				<view class="share-content">
					
					<!-- 占位符 -->
					<view class="placeholder-text">点标签插入占位符</view>

					<!-- 项目标签 -->
					<view class="project-tags">
						<view class="tag-item tag-name">项目名称</view>
						<view class="tag-item tag-price">单价</view>
						<view class="tag-item tag-period">周期</view>
						<view class="tag-item tag-profit">分成/日</view>
						<view class="tag-item tag-new">#新品#</view>
					</view>

					<!-- 项目描述 -->
					<view class="project-description">
						<text class="description-text">【项目名】限时上线！</text>
						<text class="description-text">单价单价元，周期周期天，分成分成/日元/日。</text>
						<text class="description-text">我已参与-感兴趣点我链接</text>
					</view>

					<!-- 选项框 -->
					<view class="options-container">
						<view class="option-item">
							<image class="option-icon" :src="$getStaticSrc('/static/recommend/check.png')" mode="scaleToFill" />
							<text class="option-text">包含价格</text>
						</view>
						<view class="option-item">
							<image class="option-icon" :src="$getStaticSrc('/static/recommend/check.png')" mode="scaleToFill" />
							<text class="option-text">附带邀请码</text>
						</view>
						<view class="option-item">
							<image class="option-icon" :src="$getStaticSrc('/static/recommend/check.png')" mode="scaleToFill" />
							<text class="option-text">防盗水印</text>
						</view>
					</view>
				</view>
			</view>
			<view class="share-button">
				<button class="share-btn" @click="goShare">分享</button>
				<button class="share-btn" @click="shareCoupon">保存</button>
			</view>
		</view>
		<view v-if="activeTab == 'poster'">
			<view class="share-functions">
				<view class="share-section-title">海报预览与样式</view>
				<view class="poster-content">
					<!-- 商品图片 -->
					<image :src="$getStaticSrc('/static/recommend/poster-back.png')" mode="aspectFill" class="poster-image"></image>
					<view class="poster-task">
						<view class="task-header">
							<text class="section-title">项目名称: XXXX</text>
						</view>
						<view class="task-items">
							<view class="task-infos">
								<view class="task-names">完成10位好友</view>
								<view class="task-progress">进度 2/10</view>
							</view>
						
							<view class="progress-bar">
								<view class="progress-fill" style="width: 20%;"></view>
							</view>
							<view class="task-progress">进度 2/10</view>
						</view>
					</view>
				</view>
				<view class="exclusive">
					<view class="exclusive-tip">ABCD88</view>
					<button class="exclusive-btn" @click="goZhuanQrcode">更新专属码</button>
				</view>
			</view>
			<view class="share-button">
				<button class="poster-btn" @click="SavePoster">预览海报</button>
			</view>
			<view class="poster-tips">注: 示意保存，实际项目中可接入canvas或后端生成。</view>
		</view>
		<up-popup :show="shareShow" mode="bottom" @close="shareShow = false" :closeable="true">
			<view class="bottom-content">
				<view class="bottom-title">
					分享到...
				</view>
				<view class="bottom-grid">
					<view class="common-function-item" @click="goSystemShare">
						<image :src="$getStaticSrc('/static/recommend/system.png')" mode="aspectFit"></image>
						<text>系统分享</text>
					</view>
					<view class="common-function-item" @click="goCopyLink">
						<image :src="$getStaticSrc('/static/recommend/copy-link.png')" mode="aspectFit"></image>
						<text>复制链接</text>
					</view>
					<view class="common-function-item" @click="goSavePoster">
						<image :src="$getStaticSrc('/static/recommend/poster.png')" mode="aspectFit"></image>
						<text>保存海报</text>
					</view>
					<view class="common-function-item" @click="goSaveQrcode">
						<image :src="$getStaticSrc('/static/recommend/share-qrcode.png')" mode="aspectFit"></image>
						<text>专属二维码</text>
					</view>
				</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button">关闭</up-button>
				</view>
			</view>
		</up-popup>
		<up-popup :show="qrcodeShow" mode="center" @close="qrcodeShow = false" :closeable="true">
			<view class="sign-popup-center" v-if="qrcodeStatus">
				<image class="vip-icon" :src="$getStaticSrc('/static/recommend/qrcode-back.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">使用浏览器打开后扫码</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button">保存</up-button>
				</view>
			</view>
			<view class="qrcode-popup-center" v-if="!qrcodeStatus">
				<image class="vip-icon" :src="$getStaticSrc('/static/recommend/qrcode-back.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">使用浏览器打开后扫码</view>
			</view>
		</up-popup>

		<view class="tips" v-if="tipsShow">{{ tips }}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				totalCoupons: 12,
				activeTab: 'poster',
				products: [{
					id: 'product_1',
					name: 'XXXX1',
					maxPledge: 10,
					period: 99,
					unitPrice: 9999,
					share: 9999,
					remaining: (100 - Math.random() * 50).toFixed(2),
					imageUrl: '/static/recommend/shop.png'
				}],
				tipsShow: false,
				tips: '',
				qrcodeShow: false,
				qrcodeStatus: true,
				shareShow: false
			}
		},
		methods: {
			goBack() {
				// 返回上一页
				uni.navigateBack()
			},
			switchTab(tab) {
				this.activeTab = tab
				// 这里可以根据tab筛选不同状态的优惠券
			},
			useCoupon() {
				// 使用优惠券的逻辑
				uni.showToast({
					title: '前往使用',
					icon: 'none'
				})
			},
			goCopyLink() {
				this.tips = '链接已复制';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			},
			goCopyText() {
				this.tips = '文案已复制';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			},
			goSystemShare() {
				this.tips = '已进入系统分享';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			},
			goSavePoster() {
				this.tips = '已保存至相册';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			},
			goQrcode() {
				this.qrcodeShow = true;
				this.qrcodeStatus = true
			},
			goSaveQrcode() {
				this.qrcodeShow = true;
				this.qrcodeStatus = false
			},
			goShare() {
				this.shareShow = true;
			},
			goZhuanQrcode() {
				this.tips = '专属码已更新';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			},
			SavePoster() {
				this.tips = '已保存至相册';
				this.tipsShow = true;
				setTimeout(() => {
					this.tipsShow = false;
				}, 3000);
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f5f5f5;
	}

	.coupon-container {
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		padding-bottom: 140rpx;
		padding: 0 30rpx;
	}


	/* 优惠券数量 */
	.coupon-count {
		width: 100%;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.coupon-count text {
		width: 100%;
		height: 40rpx;
		color: #fff;
		border-radius: 40rpx;
		font-size: 24rpx;
		text-align: center;
		line-height: 40rpx;
		background-image: url('/static/recommend/coupon/back-total.png');
		background-size: 100% 100%;
	}

	/* 状态标签 */
	.status-tabs {
		display: flex;
		margin-bottom: 30rpx;
		padding: 0 20rpx;
		justify-content: flex-start;
		/* 从 flex-end 改为 flex-start 实现居左显示 */
		align-items: flex-end;
	}

	.tab-item {
		/* 移除 flex: 1; 不再平分模块宽度 */
		width: 20vw;
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


	/* 常用功能区 */
	.common-functions {
		margin: 0 0 30rpx;
		border-radius: 20rpx;
		background-image: url('/static/recommend/share-back.png');
		background-size: 100% 100%;
	}

	.function-section-title {
		padding: 25rpx 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #000;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
	}

	.function-section-desc {
		padding: 0 10rpx;
		font-size: 24rpx;
		color: #A4A4A4;
		font-weight: 100;
	}

	.function-grid {
		display: flex;
		flex-wrap: wrap;
		padding: 0 0 20rpx;
	}

	.common-function-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
		padding: 20rpx 0;
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

	.share-functions {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		border-radius: 30rpx;
		padding: 24rpx;
	}

	.share-section-title {
		font-size: 30rpx;
		color: #000000;
		font-weight: bold;
	}

	/* 分享内容样式 */
	.share-content {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 15rpx;
		padding: 20rpx;
		background-color: #F3F3F3;
		
	}

	/* 占位符样式 */
	.placeholder-text {
		font-size: 28rpx;
		color: #979696;
		background-color: #F3F3F3;
		text-align: center;
		padding: 20rpx 0;

		border-radius: 35rpx;
		margin-bottom: 25rpx;
		border: 1px solid #e0e0e0;
	}

	/* 项目标签样式 */
	.project-tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 25rpx;
		gap: 8rpx;
	}

	.tag-item {
		padding: 10rpx 20rpx;
		border-radius: 25rpx;
		font-size: 24rpx;
		color: #ffffff;
		text-align: center;
		white-space: nowrap;
	}

	.tag-name {
		background-image: url('/static/recommend/tag-name.png');
		background-size: 100% 100%;
	}

	.tag-price {
		background-image: url('/static/recommend/tag-price.png');
		background-size: 100% 100%;
	}

	.tag-period {
		background-image: url('/static/recommend/tag-period.png');
		background-size: 100% 100%;
	}

	.tag-profit {
		background-image: url('/static/recommend/tag-profit.png');
		background-size: 100% 100%;
	}

	.tag-new {
		background-image: url('/static/recommend/tag-new.png');
		background-size: 100% 100%;
	}

	/* 项目描述样式 */
	.project-description {
		color: #000;
		background-color: #F3F3F3;
		border-radius: 35rpx;
		padding: 20rpx;
		margin-bottom: 25rpx;
		border: 1px solid #e0e0e0;
	}

	.description-text {
		font-size: 26rpx;
		color: #333333;
		display: block;
		margin-bottom: 10rpx;
		line-height: 40rpx;
	}

	/* 选项框样式 */
	.options-container {
		background-color: #ffffff;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.option-item {
		display: flex;
		align-items: center;
		margin-right: 20rpx;
	}

	.option-icon {
		width: 34rpx;
		height: 34rpx;
		margin-right: 15rpx;
	}

	.checkbox {
		width: 30rpx;
		height: 30rpx;
		border: 2rpx solid #cccccc;
		border-radius: 6rpx;
		margin-right: 15rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkbox.checked {
		background-color: #4caf50;
		border-color: #4caf50;
	}

	.option-text {
		font-size: 24rpx;
		color: #000000;
	}

	.share-button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 20rpx;
	}

	.share-btn {
		border-radius: 35rpx;
		width: 240rpx;
		height: 70rpx;
		text-align: center;
		line-height: 70rpx;
		border: 1rpx solid #000;
		margin: 0 5rpx;
		font-size: 24rpx;
	}

	.share-btn:last-child {
		background-color: #000;
		color: #fff;
	}

	/* 项目图片展示区域 */
	/* 项目图片展示区域 */
	.banner-container {
		width: 100%;
		position: relative;
		margin-bottom: 30rpx;
		background-color: #fff;
		border-radius: 30rpx;
	}

	.banner-swiper {
		width: 100%;
		height: 450rpx;

	}

	.banner-item {
		width: 100%;
		height: 100%;
		padding: 10rpx;

		box-sizing: border-box;
		/* 新增这行，确保padding不影响宽度计算 */
	}

	/* 新增商品图片和信息的样式 */
	.product-image {
		width: 100%;
		height: 200rpx;
		border-radius: 20rpx;
	}

	.product-info {
		width: 100%;
		box-sizing: border-box;
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

	.sign-popup-center {
		background-color: #ffffff;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 620rpx;
	}

	.qrcode-popup-center {
		background-color: #ffffff;
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 440rpx;
		padding: 20rpx 0 50rpx;
	}

	.sign-popup-content {
		font-size: 24rpx;
		color: #000000;
		margin-top: 20rpx;
	}

	.sign-actions {
		display: flex;
		justify-content: space-between;
	}

	.sign-popup-button {
		width: 400rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
		background-color: #000 !important;
		color: #ffffff !important;
		border: none !important;
		border-radius: 35rpx !important;
		font-size: 26rpx !important;
		margin-top: 60rpx;
		margin-bottom: 30rpx;
	}

	.vip-icon {
		width: 250rpx;
		height: 250rpx;
		margin-top: 48rpx;
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

	.poster-tips {
		color: #979696;
		font-size: 24rpx;
		text-align: center;
		margin-top: 20rpx;
	}

	.exclusive {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.exclusive-tip {
		width: 360rpx;
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 30rpx;
		border-radius: 35rpx;
		background-color: #F3F3F3;
	}

	.exclusive-btn {
		border-radius: 35rpx;
		width: 200rpx;
		height: 70rpx;
		text-align: center;
		line-height: 70rpx;
		border: 1rpx solid #000;
		margin: 0 5rpx;
		font-size: 24rpx;
		background-color: #000;
		color: #fff;
	}

	.task-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section-title {
		color: #000000;
		font-size: 30rpx;
	}

	.more-icon {
		width: 12rpx;
		height: 24rpx;
	}

	.task-items {
		border-radius: 30rpx;
		margin-bottom: 20rpx;
	}

	.task-infos {
		display: flex;
		justify-content: space-between;
	}

	.task-names {
		display: block;
		color: #FF481C;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		margin-top: 10rpx;
	}

	.task-status {
		display: block;
		color: #993018;
		font-size: 26rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.task-progress {
		display: block;
		color: #979696;
		font-size: 24rpx;
		margin-bottom: 10rpx;
		margin-top: 10rpx;
	}

	.progress-bar {
		width: 100%;
		height: 10rpx;
		background-color: #EEEEEE;
		border-radius: 5rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #FFCC00;
		border-radius: 5rpx;
	}

	.progress-fill.full {
		width: 100%;
	}
	.poster-image{
		width:100%;
		height:900rpx;
		border-radius:30rpx 30rpx 0 0 ;
	}
	.poster-content{
		background-color: #F3F3F3; 
		border-radius: 30rpx;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
	}
	.poster-task{
		background-color: #F3F3F3; 
		padding:20rpx;
		border-radius: 30rpx;
	}
</style>