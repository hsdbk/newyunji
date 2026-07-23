<template>
  <view class="invest-detail-container">
    <!-- 项目基本信息 -->
    <view class="project-info">
      <image class="project-image" :src="project.thumb?$baseUrl + project.thumb:''" mode="aspectFill"></image>
      <view class="project-name">{{project.name}}</view>
    </view>

    <!-- 收益详情 -->
    <view class="profit-details">
     <!-- <view class="profit-item">
        <view class="profit-label">项目押金</view>
        <view class="profit-value">¥{{project.apr}}</view>
      </view> -->
      <view class="profit-item">
        <view class="profit-label">预计总利息</view>
        <view class="profit-value">¥{{project.apr_money}}</view>
      </view>
      <view class="profit-item">
        <view class="profit-label">卡券金额</view>
        <view class="profit-value">¥{{project.kcal_money}}</view>
      </view>
    </view>

    <!-- 时间信息 -->
    <view class="time-info">
      <view class="time-item">
        <view class="time-label">下单时间</view>
        <view class="time-value">{{project.addtime_date}}</view>
      </view>
      <view class="time-item">
        <view class="time-label">到期时间</view>
        <view class="time-value">{{project.end_time_date}}</view>
      </view>
      <view class="time-item">
        <view class="time-label">收益方式</view>
        <view class="time-value">{{project.type_name}}</view>
      </view>
    </view>

    <!-- 查看合同按钮 -->
    <view class="contract-btn" @click="viewContract(project.id)">查看合同</view>

    <!-- 期数列表标题 -->
    <view class="periods-header">
      <view class="periods-title">期数</view>
      <view class="periods-title">本息</view>
      <view class="periods-title">预计到账时间</view>
      <view class="periods-title">实际到账时间</view>
      <view class="periods-title">状态</view>
    </view>

    <!-- 期数列表 -->
    <view class="periods-list">
      <view class="period-item" v-for="(item, index) in project.apr_plan" :key="index">
        <view class="period-cell">第{{item.apr_no}}期</view>
        <view class="period-cell amount">{{item.apr_money}}</view>
        <view class="period-cell">{{item.back_time_date}}</view>
        <view class="period-cell">{{item.ok_time_date}}</view>
        <view class="period-cell">
          <view :class="['status-badge', item.status === 'D' ? 'settled' : 'pending']">
            {{item.status_name}}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      project: {}
    };
  },
  onLoad(options) {
    this.fetchProject(options.id)
  },
  methods: {
    // 查看合同
    viewContract(id) {
      // 合同查看逻辑
      uni.navigateTo({
      	url:'/pages/my/contract?id=' + id
      })
    },
    // 获取项目数据（实际项目中实现）
    fetchProject(id) {
        this.$http(
            '/item/list/view', {id:id}, "POST").then(res => {
            console.log('数据',res.data)
            this.project = res.data.view
            
        })
    }
  }
};
</script>

<style scoped>
page{
    background-color: #F3F3F3;
}
.invest-detail-container {
  padding-bottom: 60rpx;
}

/* 项目基本信息 */
.project-info {
  padding: 30rpx;
  background-color: #fff;
}

.project-image {
  width: 100%;
  height: 350rpx;
  border-radius: 10rpx;
}

.project-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 30rpx;
}

/* 收益详情 */
.profit-details {
  background-color: #fff;
  padding: 30rpx;
}

.profit-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.profit-item:last-child {
  border-bottom: none;
}

.profit-label {
  font-size: 28rpx;
  color: #666;
}

.profit-value {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

/* 时间信息 */
.time-info {
  background-color: #fff;
  padding: 30rpx 30rpx 0;
}

.time-item {
  display: flex;
  justify-content: space-between;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.time-item:last-child {
  border-bottom: none;
}

.time-label {
  font-size: 28rpx;
  color: #666;
}

.time-value {
  font-size: 28rpx;
  color: #333;
}

/* 查看合同按钮 */
.contract-btn {
  padding: 30rpx;
  font-size: 28rpx;
  color: #D54E3A;
  background-color: #fff;
}

/* 期数列表 */
.periods-header {
  display: flex;
  background-color: #f5f5f5;
  padding: 15rpx 0;
  font-size: 26rpx;
  color: #666;
  text-align: center;
}

.periods-title {
  color:#979696;
}
.periods-title:nth-child(1) { width: 150rpx; }    /* 期数列固定宽度 */
.periods-title:nth-child(2) { width: 70rpx; }    /* 本息列固定宽度 */
.periods-title:nth-child(3) { width: 300rpx; }    /* 预计到账时间列固定宽度 */
.periods-title:nth-child(4) { width: 300rpx; }    /* 实际到账时间列固定宽度 */
.periods-title:nth-child(5) { width: 150rpx; }    /* 状态列固定宽度 */
.periods-list {
  background-color: #F3F3F3;
}

.period-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
  font-size: 26rpx;
  text-align: center;
}

.period-item:last-child {
  border-bottom: none;
}

.period-cell {
  color: #333;
  font-size: 26rpx;
}
.period-cell:nth-child(1) { width: 150rpx; }    /* 期数列固定宽度 */
.period-cell:nth-child(2) { width: 70rpx; }    /* 本息列固定宽度 */
.period-cell:nth-child(3) { width: 300rpx; }    /* 预计到账时间列固定宽度 */
.period-cell:nth-child(4) { width: 300rpx; }    /* 实际到账时间列固定宽度 */
.period-cell:nth-child(5) { width: 150rpx; }    /* 状态列固定宽度 */
.period-cell.amount {
  color: #ff5000;
}

/* 状态标签 */
.status-badge {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
}

.status-badge.settled {
  /* background-color: #e8f4ed; */
  color: #D54E3A;
}

.status-badge.pending {
  /* background-color: #fff3e0; */
  color: #000000;
}
</style>