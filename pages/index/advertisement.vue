<template>
	<view class="container">
		<!-- 观看广告 -->
		<view class="activity-item">
			<view class="activity-info">
				<text class="activity-title" style="color:#993018;">观看广告赚金币</text>
				<!-- <view class="activity-desc" style="color:#993018;">最高可获得金币<span style="font-size: 30rpx;font-weight: bold;">+99999</span></view> -->
				<!-- <text class="activity-desc" style="color:#993018;">连续观看多个广告视频奖励更丰厚</text> -->
			</view>
			<view class="activity-button">
				<image class="activity-button-icon" :src="$getStaticSrc('/static/farm/btn-back.png')" mode="aspectFit"></image>
				<view class="activity-button-text">立即观看</view>
			</view>
		</view>
		<!-- <view class="look-info">
			<view>
				<view class="look-text">连看加成</view>
				<view class="look-role">每连续3次额外+5,000</view>
			</view>
		</view> -->
		
		<view class="task-section">
			<view class="task-header">
				<text class="section-title">今日任务</text>
				
			</view>
			<view class="progress-info">
				<view class="progress-info-bar">
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: calculateProgressWidth(info.normal.normal_watch_count, info.normal.normal_daily_limit) }"></view>
					</view>
					<!-- <view>已观看3/10次，今日已得5000</view> -->
					<view>已观看{{info.normal.normal_watch_count}}/{{info.normal.normal_daily_limit}}次，今日已得{{info.normal.normal_reward_gold}}</view>
				</view>
				<button class="task-btn" @click="ruleShow = true">规则</button>
			</view>
			<!-- 观看广告任务 -->
			<view class="task-item">
			  <view class="task-info">
			    <image class="task-icon" :src="$getStaticSrc('/static/index/banner.png')" mode="aspectFit"></image>
			    <view class="task-text">
			      <text class="task-title">精选视频广告<text class="reward-amount">+{{info.normal.selected_ad_reward_per_watch}}</text></text>
			      <text class="task-desc">时长约15s，可跳过</text>
			    </view>
			  </view>
			  <button class="task-btn" @click="taskBtn('normal','selected')">观看</button>
			</view>
			<view class="task-item">
			  <view class="task-info">
			    <image class="task-icon" :src="$getStaticSrc('/static/index/banner.png')" mode="aspectFit"></image>
			    <view class="task-text">
			      <text class="task-title">短片广告 <text class="reward-amount">+{{info.normal.short_ad_reward_per_watch}}</text></text>
			      <text class="task-desc">时长约10s</text>
			    </view>
			  </view>
			  <button class="task-btn" @click="taskBtn('normal','short')">观看</button>
			</view>
		</view>
		<view class="task-section" v-if="userInfo.show_item">
			<view class="task-header">
				<text class="section-title">今日任务</text>
				<image class="task-icon" :src="$getStaticSrc('/static/my/vip-t.png')" mode="aspectFit"></image>
				<text class="section-zhuanqu">专区</text>
			</view>
			<view class="progress-info">
				<view class="progress-info-bar">
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: calculateProgressWidth(info.vip.vip_watch_count, info.vip.vip_daily_limit) }"></view>
					</view>
					<view>已观看{{info.vip.vip_watch_count}}/{{info.vip.vip_daily_limit}}次，今日已得{{info.vip.vip_reward_gold}}</view>
				</view>
				<button class="task-btn" @click="ruleShow = true">规则</button>
			</view>
			<!-- 观看广告任务 -->
			<view class="task-item">
			  <view class="task-info">
			    <image class="task-icon" :src="$getStaticSrc('/static/index/banner.png')" mode="aspectFit"></image>
			    <view class="task-text">
			      <text class="task-title">精选视频广告<text class="reward-amount">+{{info.vip.selected_ad_reward_per_watch}}</text></text>
			      <text class="task-desc">时长约15s，可跳过</text>
			    </view>
			  </view>
			  <button class="task-btn" @click="taskBtn('vip','selected')">观看</button>
			</view>
			<view class="task-item">
			  <view class="task-info">
			    <image class="task-icon" :src="$getStaticSrc('/static/index/banner.png')" mode="aspectFit"></image>
			    <view class="task-text">
			      <text class="task-title">短片广告 <text class="reward-amount">+{{info.vip.short_ad_reward_per_watch}}</text></text>
			      <text class="task-desc">时长约10s</text>
			    </view>
			  </view>
			  <button class="task-btn" @click="taskBtn('vip','short')">观看</button>
			</view>
		</view>
		<!-- 邀请任务区域 -->
		<!-- <view class="task-section">
			<view class="task-header">
				<text class="section-title">邀请任务</text>
			</view>
			<view class="task-items">
				<view class="task-infos">
					<view class="task-infos-title">1</view>
					<view class="task-names">看满3次开启<text class="reward-amount">+99,999</text></view>
				</view>
			</view>
			<view class="task-items">
				<view class="task-infos">
					<view class="task-infos-title">2</view>
					<view class="task-names">看满3次开启<text class="reward-amount">+99,999</text></view>
				</view>
			</view>
			<view class="task-items">
				<view class="task-infos">
					<view class="task-infos-title">3</view>
					<view class="task-names">看满3次开启<text class="reward-amount">+99,999</text></view>
				</view>
			</view>
		</view> -->
		<!-- <view class="look-info">
			<view>
				<view class="look-text-num">今日剩余10次观看机会</view>
				<view class="look-role-num">连续观看更高频，次数用完将自动关闭入口</view>
			</view>
			<button class="look-btn">立即邀请</button>
		</view> -->
		<up-popup :show="ruleShow" mode="bottom" @close="ruleShow = false">
		    <view class="sign-popup">
		        <view class="sign-popup-content">广告规则</view>
		        <view class="tips-section">
		            <view class="tips-content">
		                <up-parse :content="content"></up-parse>
		            </view>
		        </view>
		    </view>
		</up-popup>
		<up-popup :show="nextShow" mode="center" @close="nextShow = false" :closeable="true">
		    <view class="sign-popup-center">
		       <image class="sign-popup-icon" :src="$getStaticSrc('/static/game/next.png')" mode="aspectFit"></image>
				<view class="next-title">距下次观看还需02:15</view>
				<view class="next-tips">开启提醒不会错过机会</view>
				<view class="sign-actions">
				    <up-button type="primary" class="sign-popup-button-right">到点提醒我</up-button>
				    <up-button type="primary" class="sign-popup-button-left">稍后再试</up-button>
				</view>
		    </view>
		</up-popup>
		<up-popup :show="successShow" mode="center" @close="successShow = false" :closeable="true">
		    <view class="sign-popup-center">
		        <view class="success-box">
					<image class="success-icon" :src="$getStaticSrc('/static/index/gold-one.png')" mode="aspectFit"></image>
					<view class="success-box-title">到账提醒</view>
				</view>
				<view class="next-tips">本次获得</view>
				<view class="success-title">+12,000</view>
				<view class="success-tips">
					<view>基础奖励：+1,000</view>
					<view>连看加成：+6,000</view>
					<view>宝箱奖励：+5,000</view>
				</view>
				<view class="sign-actions">
				    <up-button type="primary" class="sign-popup-button-right">继续观看</up-button>
				    <up-button type="primary" class="sign-popup-button-left">返回</up-button>
				</view>
		    </view>
		</up-popup>
		<up-popup :show="numShow" mode="center" @close="numShow = false" :closeable="true">
		    <view class="sign-popup-center">
				<image class="num-icon" :src="$getStaticSrc('/static/game/num.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">今日次数已用完</view>
				<view class="next-title" style="margin-top:20rpx;">已观看10/10次，明日00:00重置</view>
				
				<view class="next-tips">可去做其他任务继续赚</view>
				<view class="sign-actions">
				    <up-button type="primary" class="sign-popup-button-right">继续观看</up-button>
				    <up-button type="primary" class="sign-popup-button-left">返回</up-button>
				</view>
		    </view>
		</up-popup>
		<up-popup :show="boxShow" mode="center" @close="boxShow = false" :closeable="true">
		    <view class="sign-popup-center">
				<image class="num-icon" :src="$getStaticSrc('/static/game/box.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">宝箱已开启</view>
				<view class="next-title" style="margin-top:20rpx;">恭喜解锁第2个宝箱</view>
				
				<view class="next-tips">额外+3,000金币</view>
				<view class="success-tips" style="margin-top:20rpx;">
					<view>再看4次可开启下一档</view>
				</view>
				<view class="sign-actions">
				    <up-button type="primary" class="sign-popup-button">领取并继续</up-button>
				</view>
		    </view>
		</up-popup>
		<up-popup :show="playShow" mode="center" @close="playShow = false" :closeable="true">
		    <view class="sign-popup-center">
		        <view class="success-box">
					<image class="success-icon" :src="$getStaticSrc('/static/game/play.png')" mode="aspectFit"></image>
					<view class="success-box-title">播放失败</view>
				</view>
				<view class="next-title" style="margin-top:80rpx;margin-bottom:30rpx;">网络不稳定或广告源异常， 未能完成观看</view>
				<view class="next-tips">该次不计入奖励</view>
				<view class="sign-actions">
				    <up-button type="primary" class="sign-popup-button-right">重试</up-button>
				    <up-button type="primary" class="sign-popup-button-left">更换广告</up-button>
				</view>
		    </view>
		</up-popup>
		<up-popup :show="vipShow" mode="center" @close="vipShow = false" :closeable="true">
		    <view class="sign-popup-center">
		        <image class="vip-icon" :src="$getStaticSrc('/static/game/vip.png')" mode="aspectFit"></image>
		        <view class="next-title" style="margin-top:20rpx;width:224rpx;">请升级至VIP999 方可收看</view>
		        <view class="sign-actions">
		            <up-button type="primary" class="sign-popup-button">升级 VIP</up-button>
		        </view>
		    </view>
		</up-popup>
		<up-popup :show="buyShow" mode="center" @close="buyShow = false" :closeable="true">
		    <view class="sign-popup-center">
		        <image class="vip-icon" :src="$getStaticSrc('/static/game/buy.png')" mode="aspectFit"></image>
		        <view class="sign-popup-content" style="margin-top:20rpx;margin-bottom:40rpx;width:224rpx;">恭喜您认购成功</view>
		        <view class="sign-actions">
		            <up-button type="primary" class="sign-popup-button">确认</up-button>
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
				tips: '',
				ruleShow: false,
				nextShow: false,
				successShow: false,
				numShow: false,
				boxShow: false,
				playShow: false,
				vipShow: false,
				buyShow: false,
				content: '<p>没对接数据</p>',
				info: {
					normal: {
						normal_watch_count: 0,
						normal_daily_limit: 0,
						normal_reward_gold: 0,
						selected_ad_reward_per_watch: 0,
						short_ad_reward_per_watch: 0
					},
					vip: {
						vip_watch_count: 0,
						vip_daily_limit: 0,
						vip_reward_gold: 0,
						selected_ad_reward_per_watch: 0,
						short_ad_reward_per_watch: 0
					}
				}
			};
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn'])
		},
		onShow() {
			this.loadAdverties()
		},
		methods: {
			// 添加进度条宽度计算方法
			calculateProgressWidth(count, limit) {
				// 避免除以0的错误
				if (!limit || limit === 0) return '0%';
				// 计算百分比并限制最大值为100%
				const percentage = (count / limit) * 100;
				return Math.min(percentage, 100) + '%';
			},
			// 加载商品数据
			loadAdverties() {
				this.isLoading = true;
				
				// 编辑地址
				this.$http(
					'/api/ad/status', {}, "GET").then(res => {
					console.log('数据',res.data)
					this.content = res.data.ad_rules
					this.info = res.data
					
					this.isLoading = false;
					
				})
			},
			taskBtn(w,t) {
				if(w != 'vip'){
					if(this.info.normal.normal_daily_limit == this.info.normal.normal_watch_count) {
						uni.showToast({
							title: '今日次数已用完',
							icon: 'none'
						});
						return;
					}
				}else{
					if(this.info.vip.vip_watch_count == this.info.vip.vip_daily_limit) {
						uni.showToast({
							title: '今日次数已用完',
							icon: 'none'
						});
						return;
					}
				}
				
				uni.navigateTo({
					url:'/pages/index/video?watch='+w+'&type='+t
				})
			},
			// 返回上一页
			handleBack() {
				uni.navigateBack();
			}
		}
	};
</script>

<style scoped>
	page {
		background: #f5f5f5;
	}
	.activity-item {
		position: relative;
		width: 100%;
		height: 200rpx;
		margin-bottom: 20rpx;
		border-radius: 50rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		background-image: url('/static/farm/advertisement-back.png');
		background-size: 100% 100%;
	}
	.activity-info {
		position: absolute;
		left: 367rpx;
		top: 55rpx;
		transform: translateY(-50%);
		z-index: 1;
	}

	.activity-title {
		display: block;
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
	}

	.activity-desc {
		display: block;
		font-size: 20rpx;
		color: #3E7A97;
		line-height: 24rpx;
	}
	.activity-button {
		position: absolute;
		right: 60rpx;
		bottom: 5rpx;
		width: 215rpx;
		height: 82rpx;
	}

	.activity-button-icon {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
	}
	.activity-button-text {
		position: absolute;
		top: 0;
		left: 0;
		width: 215rpx;
		height: 82rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 72rpx;
		z-index: 3;
		/* 添加z-index属性，使其显示在图标上方 */
	}
	.look-info{
		background: #ffffff;
		padding:25rpx 33rpx;
		border-radius: 30rpx;
		padding:22rpx 33rpx;
		margin:22rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.look-text-num{
		flex: 1;
		font-size: 24rpx;
		color: #000;
		font-weight: bold;
		padding-bottom: 10rpx;
	}
	.look-text{
		flex: 1;
		font-size: 30rpx;
		color: #D54E3A;
		font-weight: bold;
		padding-bottom: 10rpx;
	}
	.look-role{
		flex: 1;
		font-size: 20rpx;
		color: #010101;
	}
	.look-role-num{
		font-size: 20rpx;
		color: #979696;
	}
	.look-btn{
		width: 160rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #000;
		color: #ffffff;
		border-radius: 35rpx;
		font-size: 24rpx;
		margin:0;
	}
	.container {
		padding: 30rpx;
		box-sizing: border-box;
	}

	.task-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #EEEEEE;
		background-color: #FEEEE5;
		border-radius: 30rpx;
		margin-bottom:10rpx;
	}

	.task-item:last-child {
		border-bottom: none;
	}

	.task-info {
		display: flex;
		align-items: center;
		
		flex: 1;
	}

	.task-icon {
		width: 64rpx;
		height: 61rpx;
		margin-right: 20rpx;
	}

	.task-text {
		flex: 1;
	}

	.task-title {
		color: #000;
		font-size: 24rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 5rpx;
	}

	.task-desc {
		color: #979696;
		font-size: 20rpx;
	}

	.label-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		padding: 20rpx 35rpx;
	}

	.task-btn {
		width: 110rpx;
		height: 50rpx;
		line-height: 50rpx;
		background-color: #000;
		color: #ffffff;
		border: none;
		border-radius: 35rpx;
		font-size: 24rpx;
	}

	/* 邀请链接区域 */
	.invite-link-container,
	.invite-code-container {
		margin-bottom: 20rpx;
	}

	.link-wrapper,
	.code-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.invite-link,
	.invite-code {
		flex: 1;
		color: #000;
		font-size: 28rpx;
		margin-right: 20rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 25rpx 30rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
	}

	.copy-btn {
		width: 180rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #000000;
		color: #ffffff;
		border: none;
		border-radius: 30rpx;
		font-size: 24rpx;
	}

	/* 分享提示 */
	.share-tip {
		display: block;
		color: #D54E3A;
		font-size: 24rpx;
		margin-bottom: 40rpx;
		line-height: 1.5;
		margin-left: 35rpx;
	}

	/* 区域标题 */
	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
		display: block;
		margin:0;
	}
	.section-zhuanqu{
		font-size: 30rpx;
		color: #FF9C00;
	}
	/* 如何参与区域 */
	.participate-section {
		margin-bottom: 40rpx;
		background-color: #ffffff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		padding: 30rpx;
		border-radius: 30rpx;
	}

	.steps-container {
		display: flex;
		justify-content: space-between;
	}

	.step-item {
		flex: 1;
		width: 195rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #FEEEE5;
		border-radius: 30rpx;
		padding: 20rpx;
		margin-right: 10rpx;
	}

	.step-number {
		width: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #993018;
		border-radius: 50%;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 15rpx;

		background: #FFFFFF;
	}

	.step-text {
		font-size: 22rpx;
		color: #993018;
		text-align: center;
	}

	/* 奖励说明区域 */
	.reward-section {
		margin-bottom: 40rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.reward-item {
		background-color: #F3F3F3;
		border-radius: 30rpx;
		padding: 30rpx;
		margin-top: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.reward-info {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.reward-text {
		color: #333333;
		font-size: 24rpx;
		margin-right: 10rpx;
	}

	.reward-role {
		color: #993018;
		font-size: 20rpx;
		margin-right: 10rpx;
		background-color: #FEEEE5;
		padding: 5rpx 10rpx;
		border-radius: 15rpx;
	}

	.reward-amount {
		color: #D54E3A;
		font-size: 30rpx;
		font-weight: bold;
	}

	.reward-desc {
		color: #666666;
		font-size: 24rpx;
		line-height: 1.5;
	}

	/* 邀请任务区域 */
	.task-section {
		margin-bottom: 22rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		padding: 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.task-header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 30rpx;
	}

	.more-icon {
		width: 12rpx;
		height: 24rpx;
	}

	.task-items {
		background-color: #FEEEE5;
		border-radius: 30rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.task-infos {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.task-infos-title{
		width:36rpx;
		height:36rpx;
		background-color: #fff;
		text-align: center;
		line-height: 36rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}
	.task-names {
		display: block;
		color: #333333;
		font-size: 28rpx;
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
		color: #666666;
		font-size: 26rpx;
		margin-bottom: 10rpx;
	}
	.progress-info{
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}
	.progress-info-bar{
		width:60vw;
	}
	.progress-bar {
		width: 100%;
		height: 10rpx;
		background-color: #CCCCCC;
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

	/* 立即邀请按钮 */
	.invite-button-container {
		display: flex;
		justify-content: center;
	}

	.invite-btn {
		width: 500rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #000000;
		color: #ffffff;
		border: none;
		border-radius: 35rpx;
		font-size: 24rpx;
	}

	.tips {
		position: absolute;
		left: 161rpx;
		top: 297rpx;
		width: 429rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 28rpx;
		color: #9B361F;
		border-radius: 40rpx;
		background-color: #FEEEE5;
		text-align: center;
		box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.3);
	}
	.sign-popup {
	    background-color: #ffffff;
	    border-radius: 16rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	}
	.sign-popup-center {
	    background-color: #ffffff;
	    border-radius: 16rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
		width:620rpx;
	}
	.sign-popup-icon{
		width:150rpx;
		height:126rpx;
		margin:79rpx 0 30rpx;
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
	    margin-top: 30rpx;
	    margin-bottom: 30rpx;
	}
	.sign-popup-button-left {
	    width: 240rpx !important;
	    height: 70rpx !important;
	    line-height: 70rpx !important;
	    background-color: #fff !important;
	    border:1rpx solid #000 !important;
	    color: #000 !important;
	    border-radius: 35rpx !important;
	    font-size: 26rpx !important;
	    margin-top: 40rpx;
	    margin-bottom: 40rpx;
	    margin-right: 20rpx;
	}
	.sign-popup-button-right {
	    width: 240rpx !important;
	    height: 70rpx !important;
	    line-height: 70rpx !important;
	    background-color: #000 !important;
	    color: #ffffff !important;
	    border: none !important;
	    border-radius: 35rpx !important;
	    font-size: 26rpx !important;
	    margin-top: 40rpx;
	    margin-bottom: 40rpx;
		 margin-right: 20rpx;
	}
	.sign-popup-content {
	    font-size: 30rpx;
	    color: #000000;
		font-weight: bold;
	    margin-top: 40rpx;
	}
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
	    color: #000;
	    line-height: 36rpx;
	}
	.sign-actions {
		display: flex;
		justify-content: space-between;
	}
	.next-title{
		width:380rpx;
		color:#000;
		font-size:30rpx;
		text-align: center;
	}
	.next-tips{
		color:#993018;
		font-size: 24rpx;
		padding:0 40rpx;
		height:40rpx;
		line-height: 40rpx;
		background-color: #FEEEE5;
		text-align: center;
		border-radius: 20rpx;
		margin-top: 20rpx;
	}
	.success-title{
		color:#D54E3A;
		font-size:48rpx;
		font-weight: 500;
		margin:10rpx 0;
	}
	.success-tips{
		color:#979696;
		font-size:24rpx;
	}
	.success-icon{
		width:36rpx;
		height:32rpx;
		margin-right: 10rpx;
	}
	.success-box-title{
		color:#000;
		font-size:30rpx;
		font-weight: bold;
	}
	.success-box{
		display: flex;
		align-items: center;
		margin:40rpx 0 0;
	}
	.num-icon{
		width:64rpx;
		height:64rpx;
		margin:40rpx 0 0;
	}
	.vip-icon{
		width:300rpx;
		height:234rpx;
		margin-top: 48rpx;
	}
</style>