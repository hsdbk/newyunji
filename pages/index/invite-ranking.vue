<template>
    <view class="invite-ranking-container">

        <!-- 排行榜区域 -->
        <view class="ranking-section">
            <!-- 排行榜列表 -->
            <view class="ranking-list">
                <view v-for="(item, index) in rankingList" :key="index" class="ranking-item"
                    :class="getRankBackClass(index + 1)">
                    <view class="rank-number" :class="getRankClass(index + 1)">
                        <image v-if="index < 3" :src="getRankImage(index + 1)" mode="aspectFit"></image>
                        <text v-else>{{ index + 1 }}</text>
                    </view>
                    <image class="user-avatar" :src="item.avatar" mode="aspectFit"></image>
                    <text class="user-name">{{ item.nickname }}</text>
                    <text class="invited-count">已邀{{ item.invitedCount }}位</text>
                    <text class="gold-count">+{{ formatGold(item.goldCount) }}</text>
                </view>
            </view>
        </view>

        <!-- 我的邀请记录 -->
        <view class="invite-records">
            <view class="invite-title">我的邀请记录</view>
            <view class="records-list">
                <view v-for="(record, index) in inviteRecords" :key="index" class="record-item"
                    @click="handleReceive(record)">
                    <image class="user-avatar" :src="record.avatar" mode="aspectFit"></image>
                    <view class="record-info">
                        <view class="record-main-info">
                            <view class="record-user-name">{{ record.nickname }}</view>
                            <view class="record-status"
                                :class="record.status === '已完成' ? 'status-completed' : 'status-pending'">{{ record.status
                                }}</view>
                        </view>
                        <view class="record-label">
                            <text class="label-text">{{ record.label }}</text>
                        </view>
                    </view>
                    <text class="record-gold">+{{ formatGold(record.goldCount) }}</text>
                </view>
            </view>
            <view class="record-tip">数据每5分钟更新，仅显示近30天</view>
        </view>

        <!-- 活动规则 -->
        <view class="activity-rules">
            <view class="section-title">活动规则</view>
            <view class="rules-content">
                <text class="rule-item">1.活动时间:长期有效，如有调整以页公告为准。</text>
                <text class="rule-item">2.邀请新人通过您的专属链接/邀请码注册并在 24小时内完成首次打卡与手机绑定。</text>
                <text class="rule-item">3.金币实时发放，若出现异常，系统将在24小时内自动补发。</text>
                <text class="rule-item">4.严禁作弊刷号，一经核实将取消活动资格并回收奖励。</text>
            </view>
        </view>

        <!-- 常见问题 -->
        <view class="faq-section">
            <text class="faq-title">常见问题</text>
        </view>

        <!-- 底部按钮 -->
        <view class="bottom-btn-container">
            <button class="invite-btn" @click="handleInvite">立即邀请</button>
        </view>
        <!-- 确认注销弹窗 -->
        <up-popup :show="receiveShow" mode="center" @close="receiveShow = false" :closeable="true">
            <view class="sign-popup">
                <image class="sign-popup-icon" :src="$getStaticSrc('/static/index/receive.png')" mode="aspectFit"></image>
                <view class="sign-popup-content">领取金币成功</view>
                <view class="sign-actions">
                    <up-button type="primary" class="sign-popup-button" @click="receiveShow = false">确定</up-button>
                </view>
            </view>
        </up-popup>
    </view>
</template>

<script>
export default {
    data() {
        return {
            rankingList: [
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    invitedCount: 18,
                    goldCount: 188888
                }
            ],
            inviteRecords: [
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    status: '已完成',
                    label: '手机号已绑定',
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    status: '待完成',
                    label: '未打卡',
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    status: '待完成',
                    label: '未打卡',
                    goldCount: 188888
                }
            ],
            receiveShow: false
        }
    },
    methods: {
        // 返回上一页
        handleBack() {
            uni.navigateBack()
        },
        // 获取排名样式类
        getRankClass(rank) {
            if (rank === 1) return 'rank-first'
            if (rank === 2) return 'rank-second'
            if (rank === 3) return 'rank-third'
            return 'rank-normal'
        },
        getRankBackClass(rank) {
            if (rank === 1) return 'ranking-first'
            if (rank === 2) return 'ranking-second'
            if (rank === 3) return 'ranking-third'
            return ''
        },
        // 获取排名图片
        getRankImage(rank) {
            if (rank === 1) return '/static/index/invite1.png'
            if (rank === 2) return '/static/index/invite2.png'
            if (rank === 3) return '/static/index/invite3.png'
            return ''
        },
        // 格式化金币数量
        formatGold(gold) {
            return gold.toLocaleString()
        },
        // 领取金币按钮点击事件
        handleReceive(record) {
            // 模拟领取金币操作
            console.log(`领取${record.goldCount}金币`)
            // 显示领取成功弹窗
            this.receiveShow = true
        },
        // 立即邀请按钮点击事件
        handleInvite() {
            // 跳转到邀请页面
            uni.navigateTo({
                url: '/pages/index/invite'
            })
        }
    }
}
</script>

<style scoped>
page {
    background-color: #F3F3F3;
}

.invite-ranking-container {
    width: 100%;
    min-height: 100vh;
    padding: 0 30rpx 100rpx;
    box-sizing: border-box;
}

/* 顶部导航栏 */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    background-color: #ffffff;
    padding: 0 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.back-btn {
    width: 44rpx;
    height: 44rpx;
}

.header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #000;
}

.header-right {
    width: 44rpx;
}

/* 排行榜区域 */
.ranking-section {
    margin-top: 20rpx;
    /* background-color: #ffffff; */

    border-radius: 30rpx 30rpx 30rpx 30rpx;
}

.ranking-list {
    padding: 20rpx 0 40rpx;
}

.ranking-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding: 0 30rpx;
    position: relative;
    background-image: url('/static/index/invite-b.png');
    background-size: 100% 100%;
    margin-bottom: 12rpx;
}

.ranking-first {
    background-image: url('/static/index/invite1-b.png');
    background-size: 100% 100%;
}

.ranking-second {
    background-image: url('/static/index/invite2-b.png');
    background-size: 100% 100%;
}

.ranking-third {
    background-image: url('/static/index/invite3-b.png');
    background-size: 100% 100%;
}

.ranking-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2rpx;
    background-color: #f0f0f0;
}

/* 排名数字 */
.rank-number {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: bold;
    color: #999999;
}

.rank-number image {
    width: 60rpx;
    height: 60rpx;
}

.rank-first {
    color: #ff9500;
}

.rank-second {
    color: #c7c7cc;
}

.rank-third {
    color: #cd7f32;
}

/* 用户头像 */
.user-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 0 20rpx;
}

/* 用户信息 */
.user-name {
    flex: 1;
    font-size: 24rpx;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.invited-count {
    font-size: 24rpx;
    color: #000000;
    margin: 0 20rpx;
}

.gold-count {
    font-size: 24rpx;
    font-weight: bold;
    color: #D54E3A;

    padding: 8rpx 20rpx;
    border-radius: 20rpx;
}

/* 邀请记录 */
.invite-records {
    width: 100%;
    background-color: #ffffff;
    border-radius: 30rpx 30rpx 30rpx 30rpx;
}

.invite-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #000000;
    margin-bottom: 20rpx;
    padding: 24rpx 30rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #000000;
    margin-bottom: 20rpx;
}

.records-list {
    padding: 0 20rpx;

}

.record-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    position: relative;
    background: #F3F3F3;
    border-radius: 30rpx 30rpx 30rpx 30rpx;
    padding: 0 30rpx 0 0;
    margin-bottom: 12rpx;
}

.record-item::after {
    background-color: #f0f0f0;
}

.record-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-left: 10rpx;
}

.record-main-info {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.record-user-name {
    font-size: 26rpx;
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.record-info-item {
    width: 55%;
    display: flex;
    align-items: center;
    /* 保持垂直居中 */
    justify-content: flex-start;
    /* 水平左对齐 */
    flex-direction: row;
    /* 明确设置为行布局 */
    gap: 15rpx;
    /* 添加元素间距 */
}

.record-status {
    font-size: 20rpx;
    padding: 2rpx 16rpx;
    border-radius: 15rpx;
    margin-left: 10rpx;
}

.status-completed {
    color: #993018;
    background-color: #FEEEE5;
    box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.status-pending {
    color: #979696;
    background-color: #F0F0F0;
}

.record-label {
    font-size: 20rpx;
    color: #979696;
}

.label-text {
    font-size: 20rpx;
    color: #979696;
}

.record-tip {
    font-size: 20rpx;
    color: #979696;
    text-align: left;
    margin-left: 55rpx;
    padding-bottom: 30rpx;
}

.record-gold {
    font-size: 28rpx;
    font-weight: bold;
    color: #D54E3A;
}

/* 活动规则 */
.activity-rules {
    margin-top: 20rpx;
    padding: 10rpx 30rpx;
}

.rules-content {}

.rule-item {
    display: block;
    font-size: 24rpx;
    color: #979696;
    line-height: 48rpx;
    margin-bottom: 10rpx;
}

/* 常见问题 */
.faq-section {
    margin-bottom: 20rpx;
    padding: 20rpx 30rpx;
}

.faq-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #000;
}

/* 底部按钮 */
.bottom-btn-container {
    padding: 30rpx;
}

.invite-btn {
    width: 500rpx;
    height: 70rpx;
    background-color: #000;
    color: #ffffff;
    font-size: 24rpx;
    border-radius: 35rpx;
    line-height: 70rpx;
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

.sign-popup-icon1 {
    width: 200rpx;
    height: 200rpx;
    margin-top: 66rpx;
}

.sign-popup-icon2 {
    width: 197rpx;
    height: 186rpx;
    margin-top: 72rpx;
}

.sign-popup-icon3 {
    width: 128rpx;
    height: 122rpx;
    margin-top: 66rpx;
}

.sign-popup-content {
    font-size: 30rpx;
    color: #000000;
    margin-top: 10rpx;
}

.sign-actions {
    display: flex;
    justify-content: space-between;
}

.sign-actions .u-button {
    width: 200rpx;
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
    margin-top: 80rpx;
    margin-bottom: 40rpx;
}


</style>