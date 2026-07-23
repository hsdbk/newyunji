<template>
  <view class="signin-container">
    <!-- 顶部导航栏 -->
    <up-navbar title="每日打卡" bgColor="transparent" :left-show="true" :right-show="false"
      @click="handleBack"></up-navbar>
    <image class="back" :src="$getStaticSrc('/static/farm/home-back-c.png')" mode="aspectFit"></image>
    <!-- 打卡主体区域 -->
    <view class="signin-main">
      <!-- 金币气泡区域 -->
      <view class="gold-bubble">
     <!--   <image class="bubble-back" src="/static/index/paopao.png" mode="aspectFit"></image>
        <view class="bubble-content">
          <text class="bubble-title">今日待瓜分金币池</text>
          <view>
            <image v-for="i in Math.max(0, Number(goldPoolInfo.star) || 0)" :key="'star-' + i" 
                  class="bubble-star" src="/static/index/star.png" mode="aspectFit"></image>
            <image v-for="i in Math.max(0, 3 - (Number(goldPoolInfo.star) || 0))" :key="'unstar-' + i" 
                  class="bubble-star" src="/static/index/unstar.png" mode="aspectFit"></image>
          </view>
          <text class="gold-count">{{goldPoolInfo.num}}枚</text>
          <view class="gold-icon">
            <image src="/static/index/golds.png" mode="aspectFit"></image>
          </view>
        </view> -->
      </view>

      <!-- 兔子和打卡提示 -->
      <view class="rabbit-section">
        <image class="rabbit" :src="$getStaticSrc('/static/index/rabbit.png')" mode="aspectFit"></image>

      </view>
      <!-- <view class="star-section">
        <image class="bubble-star" src="/static/index/star.png" mode="aspectFit"></image>
        <image class="bubble-star" src="/static/index/unstar.png" mode="aspectFit"></image>
        <image class="bubble-star" src="/static/index/unstar.png" mode="aspectFit"></image>
      </view> -->
      <!-- 7天打卡进度 -->
      <view class="signin-progress">
        <!-- <view class="signin-days">已连续打卡<span class="signin-days-show">{{ signinData.consecutiveDays }}</span> 天，<span
            class="signin-days-days">再坚持<span
              class="signin-days-show">{{ signinData.daysLeftForReward }}</span>天可领取实物奖励</span></view> -->
        <view class="days-container">
          <!-- 第1天 -->
          <view v-for="(item,index) in info.user_sign_info" :key="index" @click="reSign(index + 1)">
            <view class="day-item">
              <image class="check-icon" :src="$getStaticSrc('/static/index/sign-in.png')" mode="aspectFit"></image>
              <view class="sign-back">
                <image class="sign-icon" v-if="item" :src="$getStaticSrc('/static/index/sign1.png')"
                  mode="aspectFit"></image>
                <image class="sign-icon" v-else :src="$getStaticSrc('/static/index/sign2.png')" mode="aspectFit"></image>
                <text class="day-number"></text>
              </view>
            </view>
            <view class="day-label">{{ index }}</view>
          </view>
        </view>
        <!-- 打卡按钮组 -->
        <view class="signin-buttons">
          <button class="signin-btn" @click="handleSignin">立即打卡</button>
          <!-- <button class="supplement-btn" @click="handleSupplement">补签</button> -->
        </view>

        <!-- 打卡奖励提示 -->
        <!-- <view class="reward-tip" @click="goPhysical">
          <view class="tip-content">
            <image class="gift-icon-small" src="/static/index/gift.png" mode="aspectFit"></image>
            <view>
              <view class="tip-text">连续打卡3日领取实物</view>
              <view class="tip-text1">今日打卡也计入连续天数，完成后在此处提交收货信息。</view>
            </view>
          </view>
        </view> -->
      </view>



      <!-- 任务奖励区域 -->
      <!-- <view class="tasks-section">
        <view class="task-item" @click="handleWatchAd">
          <view class="task-info">
            <image class="task-icon" src="/static/index/banner.png" mode="aspectFit"></image>
            <view class="task-text">
              <text class="task-title">看广告赚金币</text>
              <text class="task-desc">更多金币等你来</text>
            </view>
          </view>
          <button class="task-btn">去观看</button>
        </view>
       <view class="task-item" @click="handleInviteFriends">
          <view class="task-info">
            <image class="task-icon" src="/static/index/gold.png" mode="aspectFit"></image>
            <view class="task-text">
              <text class="task-title">邀请好友得到金币</text>
              <text class="task-desc">可平分金币池</text>
            </view>
          </view>
          <button class="task-btn">去邀请</button>
        </view>
      </view> -->

      <!-- 规则说明区域 -->
      <view class="rules-section">
        <text class="rules-title">规则说明</text>
        <view class="rules-list">
          <rich-text :nodes="info.sign_rule"></rich-text>
        </view>
      </view>
    </view>
    <!-- 确认注销弹窗 -->
		<up-popup :show="signInShow" mode="center"  @close="signInShow = false" :closeable="true">
			<view class="sign-popup">
				<image class="sign-popup-icon" :src="$getStaticSrc('/static/index/signIn.png')" mode="aspectFit"></image>
        <view class="sign-popup-content">打卡成功</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button" @click="signInShow = false">确定</up-button>
				</view>
			</view>
		</up-popup>
    <up-popup :show="supplementaryShow" mode="center"  @close="supplementaryShow = false" :closeable="true">
			<view class="sign-popup">
				<image class="sign-popup-icon1" :src="$getStaticSrc('/static/index/supplementary.png')" mode="aspectFit"></image>
        <view class="sign-popup-content">补签成功</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button" @click="supplementaryShow = false">确定</up-button>
				</view>
			</view>
		</up-popup>
    <up-popup :show="physicalShow" mode="center"  @close="physicalShow = false" :closeable="true">
			<view class="sign-popup">
				<image class="sign-popup-icon2" :src="$getStaticSrc('/static/index/physical.png')" mode="aspectFit"></image>
        <view class="sign-popup-content">已获得实物奖励</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button" @click="physicalShow = false">确定</up-button>
				</view>
			</view>
		</up-popup>
    <up-popup :show="goldShow" mode="center"  @close="goldShow = false" :closeable="true">
			<view class="sign-popup">
				<image class="sign-popup-icon3" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
        <view class="sign-popup-content">获得雨滴奖励</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button" @click="goldShow = false">确定</up-button>
				</view>
			</view>
		</up-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 打卡状态数据
      signinData: {
        consecutiveDays: 1,
        daysLeftForReward: 2,
        goldPool: '99,999,999',
        signedDays: [], // 已打卡的天数
        todayDay: 0, // 今天是第几天
        rewardDay: 0, // 奖励天
        supplementCount: 1, // 剩余补签次数
        hasSignedToday: false,
		re_sign_used:true,
		re_sign_day:0,
		re_sign:'请选择补签天'
      },
      signInShow: false,//打卡
      supplementaryShow: false,//补签
      physicalShow: false,//实物奖励
      goldShow: false,//金币奖励
	  helpContent:'',
	  goldPoolInfo:{},
	  info:{}
    };
  },
  onShow() {
  	this.initCheckinfo()
  	this.initGoldPool()
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },
	initGoldPool(){
		// 编辑地址
		this.$http(
			'/api/api/goldPool', {}, "POST").then(res => {
				this.goldPoolInfo = res.data
		})
	},
	initCheckinfo(){
		// 编辑地址
		this.$http(
			'/user/info/checkinfo', {}, "GET").then(res => {

	            this.info = res.data
              
				// this.helpContent = res.data.sign_rule
		})
	},
	reSign(i){
		if(i> this.signinData.todayDay){
			uni.showToast({
			  title: '补签天不能大于当前日',
			  icon: 'none'
			});
			return false;
		}
		this.signinData.re_sign_day = i
		this.signinData.re_sign = '第'+i+'天'
		
	},
    // 处理打卡
    handleSignin() {
      
      if (this.signinData.hasSignedToday) {
        uni.showToast({
          title: '今日已打卡',
          icon: 'none'
        });
        return;
      }
		// 编辑地址
		this.$http(
			'/user/info/checkin', {}, "POST").then(res => {
		    this.goldShow = true;
			this.initCheckinfo()
			this.initGoldPool()
		})
    },
    // 处理补签
    handleSupplement() {
		  if (!this.signinData.re_sign_used) {
			uni.showToast({
			  title: '没有补签次数了',
			  icon: 'none'
			});
			return;
		  }

		// 编辑地址
		this.$http(
			'/user/info/recheckin', {day:this.signinData.re_sign_day}, "POST").then(res => {
		    // 这里可以添加补签的逻辑，如观看广告等
		    uni.showToast({
		      title: '补签成功',
		      icon: 'success'
		    });
		})
      
    },
    // 跳转实物奖励页面
    goPhysical() {
      uni.navigateTo({
        url: '/pages/index/physical'
      });
    },  

    // 处理观看广告
    handleWatchAd() {
		uni.navigateTo({
			url: '/pages/index/advertisement'
		});
    },

    // 处理邀请好友
    handleInviteFriends() {
      uni.navigateTo({
        url: '/pages/index/invite'
      });
    }
  }
};
</script>

<style scoped>
.signin-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.signin-main {
  padding: 30rpx;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 677rpx;
}

/* 金币气泡区域 */
.gold-bubble {
  position: relative;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300rpx;
  margin-top: 162rpx;
}

.bubble-back {
  position: absolute;
  width: 600rpx;
  height: 300rpx;
  z-index: 1;
}

.bubble-content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 60rpx;
}

.bubble-title {
  color: #8A6D3B;
  font-size: 24rpx;
  display: block;
  margin-bottom: 10rpx;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5rpx 8rpx;
  border-radius: 20rpx;
}

.bubble-star {
  width: 50rpx;
  height: 46rpx;
  margin-right: 10rpx;
}

.gold-count {
  color: #FF481C;
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.gold-icon {}

.gold-icon image {
  width: 197rpx;
  height: 81rpx;
}

.star-section {
  position: absolute;
  top: 545rpx;
  left: 173rpx;
}

/* 兔子和打卡提示 */
.rabbit-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  top: 359rpx;
  left: 0rpx;
}

.rabbit {
  width: 285rpx;
  height: 268rpx;
}

.signin-days {
  color: #000;
  font-size: 30rpx;
  text-align: left;
  font-weight: bold;
}

.signin-days-show {
  color: #FF5827;
}

.signin-days-days {
  font-size: 24rpx;
}

/* 7天打卡进度 */
.signin-progress {
  position: relative;
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-top: 120rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.days-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-items {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 77.31rpx;
  height: 99.75rpx;
  margin-top: 40rpx;
}

.day-item signed {
  color: #FFD700;
}

.day-item today {
  color: #FF5827;
  font-weight: bold;
}

.day-item gift-day {
  color: #FF9B5A;
}

.day-number {
  font-size: 30rpx;
  color:#fff;
  margin-bottom: 5rpx;
  position: relative;
}

.today {
  color: #fff;
}

.day-label {
  position: relative;
  font-size: 24rpx;
  color: #999999;
}

.check-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 99.75rpx;
}

.sign-back {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 77.31rpx;
  height: 99.75rpx;
}

.sign-icon {
  position: absolute;
  width: 59rpx;
  height: 59rpx;
}

/* 打卡按钮组 */
.signin-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  padding: 0 20rpx;
}

.signin-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #000;
  color: #ffffff;
  border: none;
  border-radius: 30rpx;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.supplement-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #fff;
  color: #000;
  border: 1rpx solid #000;
  border-radius: 30rpx;
  font-size: 24rpx;
}

/* 打卡奖励提示 */
.reward-tip {
  border-radius: 20rpx;
  margin-bottom: 30rpx;
}

.tip-content {
  display: flex;
  align-items: center;
}

.gift-icon-small {
  width: 58rpx;
  height: 64rpx;
  margin-right: 15rpx;
}

.tip-text {
  color: #000;
  font-size: 30rpx;
  font-weight: bold;
  flex: 1;
}

.tip-text1 {
  color: #979696;
  font-size: 20rpx;
  margin-top: 10rpx;
}

/* 任务奖励区域 */
.tasks-section {
  background-color: #ffffff;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #EEEEEE;
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
  color: #333333;
  font-size: 30rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 5rpx;
}

.task-desc {
  color: #999999;
  font-size: 24rpx;
}

.task-btn {
  width: 160rpx;
  height: 70rpx;
  line-height: 70rpx;
  background-color: #000;
  color: #ffffff;
  border: none;
  border-radius: 35rpx;
  font-size: 26rpx;
}

/* 规则说明区域 */
.rules-section {
  border-radius: 20rpx;
  /* box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05); */
}

.rules-title {
  color: #333333;
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.rules-list {
  color: #666666;
  font-size: 26rpx;
}

.rule-item {
  display: block;
  margin-bottom: 15rpx;
  line-height: 1.5;
}

.rule-item:last-child {
  margin-bottom: 0;
}
.sign-popup {
    background-color: #ffffff;
    border-radius: 16rpx;
    width: 620rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .sign-popup-icon {
    width: 304rpx;
    height: 174rpx;
    margin-top: 96rpx;
  }
  .sign-popup-icon1{
    width: 200rpx;
    height: 200rpx;
    margin-top: 66rpx;
  }
  .sign-popup-icon2{
    width: 197rpx;
    height: 186rpx;
    margin-top: 72rpx;
  }
  .sign-popup-icon3{
    width: 128rpx;
    height: 122rpx;
    margin-top: 66rpx;
  }
  .sign-popup-content{
  font-size: 30rpx;
  color: #000000;
  margin-top:10rpx;
  }
  .sign-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .sign-actions .u-button {
    width: 200rpx;
  }
  .sign-popup-button{
    width: 400rpx !important;
    height: 70rpx;
    line-height: 70rpx;
    background-color: #000;
    color: #ffffff;
    border: none;
    border-radius: 35rpx;
    font-size: 26rpx;
    margin-top: 80rpx;
    margin-bottom: 40rpx;
  }
  .u-icon__icon{
		color:#000 !important;
	}
</style>