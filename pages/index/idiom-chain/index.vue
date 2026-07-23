<template>
    <view class="invite-ranking-container">
		<view class="task-item" v-if="tabs==0">
		  <view class="task-info">
		    <image class="task-icon" :src="$getStaticSrc('/static/index/chain.png')" mode="aspectFit"></image>
		    <view class="task-text">
		      <text class="task-title">成语接龙·好友</text>
		      <!-- <text class="task-desc">和好友一起闯关，赢更多金币</text> -->
		    </view>
		  </view>
		</view>
		<view class="task-item1" v-if="tabs==1">
		  <view class="task-info1">当前 999 关</view>
		</view>
		<view class="physical">
			<!-- <view class="physical-gold">
				<image class="physical-gold-icon" src="/static/index/gold-one.png" mode="aspectFit"></image>
				<view class="physical-gold-text">{{info.total_coins}}</view>
			</view> -->
			<view class="physical-stars">
				<view v-if="info.remain_stamina !== undefined">
                <!-- 动态生成有体力的星星 -->
                <image v-for="i in info.remain_stamina" :key="'strength-' + i" 
                        class="physical-gold-star" :src="$getStaticSrc('/static/index/strength.png')" mode="aspectFit"></image>
                <!-- 动态生成无体力的星星 -->
                <image v-for="i in (info.daily_stamina - info.remain_stamina)" :key="'unstrength-' + i" 
                        class="physical-gold-star" :src="$getStaticSrc('/static/index/unstrength.png')" mode="aspectFit"></image>
                </view>
				<view class="physical-gold-text">体力{{info.remain_stamina}}/{{info.daily_stamina}}</view>
			</view>
			<!-- <view class="physical-btn">一键赠体力</view> -->
		</view>
		<!-- 底部按钮 -->
		<view class="bottom-btn-container">
		    <button class="invite-btn" @click="handleGame">开启挑战</button>
		</view>
		<!-- 筛选选项 -->
		<up-tabs class="filter-section"  lineHeight="4rpx" :itemStyle="{ width: '20%', height: '80rpx' }"
		  :inactiveStyle="{ fontSize: '24rpx', color: '#a4a4a4' }" :activeStyle="{ fontSize: '30rpx',fontWeight: 'bold', color: '#FF481C' }" :list="list"
		   lineWidth="123rpx" lineColor="#FF481C" :current="tabs" @change="changeFilterType"></up-tabs>
        <!-- 排行榜区域 -->
        <view class="ranking-section" v-if="tabs ==1">
			<!-- <view class="invite-title">
				<view class="invite-titles">我的好友({{rank.rank.total}})</view>
				<view class="search-filter">
				  <view class="search-bar">
				    <image class="search-icon" src="/static/recommend/coupon/search.png" mode="scaleToFill"/>
				    <input type="text" placeholder="搜索好友名称/ID" class="search-input" />
				  </view>
				  <view class="filter-button">添加</view>
				</view>
			</view> -->
            <!-- 排行榜列表 -->
            <view class="ranking-list">
                <view v-for="(item, index) in rank.rank.list" :key="index" class="ranking-item"
                    :class="getRankBackClass(index + 1)">
                    <view class="rank-number" :class="getRankClass(index + 1)">
                        <image v-if="index < 3" :src="getRankImage(index + 1)" mode="aspectFit"></image>
                        <text v-else>{{ index + 1 }}</text>
                    </view>
                    <image class="user-avatar" :src="item.avatar ? $baseUrl + item.avatar : '/static/logo.png'" mode="aspectFit"></image>
                    <text class="user-name">{{ item.nickname }}</text>
                    <text class="invited-count">周积分{{ item.coins }}</text>
                </view>
            </view>
        </view>

        <!-- 我的邀请记录 -->
        <view class="invite-records" v-if="tabs ==0">
            <!-- <view class="invite-title">
				<view class="invite-titles">我的好友({{friends.friends.length}})</view>
				<view class="search-filter">
				  <view class="search-bar">
				    <image class="search-icon" src="/static/recommend/coupon/search.png" mode="scaleToFill"/>
				    <input type="text" placeholder="搜索好友名称/ID" class="search-input" />
				  </view>
				  <view class="filter-button">添加</view>
				</view>
			</view> -->
            <view class="records-list">
                <view v-for="(record, index) in friends.friends" :key="index" class="record-item">
                    <image class="user-avatar" :src="record.avatar ? $baseUrl + record.avatar : '/static/logo.png'" mode="aspectFit"></image>
                    <view class="record-info">
                        <view class="record-main-info">
                            <view class="record-user-name">{{ record.nick_name }}</view>
                            <!-- <view class="record-status"
                                :class="record.status === '在线' ? 'status-completed' : 'status-pending'">{{ record.status
                                }}</view> -->
								<view class="record-status status-completed"
								    >在线</view>
                        </view>
                        <view class="record-label">
                            <text class="label-text">{{ record.label }}</text>
                        </view>
                    </view>
                    <text class="record-gold" @click="giftFriends(record.uid)">赠体力</text>
                </view>
            </view>
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
                    status: '在线',
                    label: '连胜5·上次活跃: 刚刚',
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    status: '待完成',
                    label: '连胜5·上次活跃: 2小时前',
                    goldCount: 188888
                },
                {
                    avatar: '/static/logo.png',
                    nickname: '森森小小小',
                    status: '待完成',
                    label: '连胜5·上次活跃: 2小时前',
                    goldCount: 188888
                },
				{
				    avatar: '/static/logo.png',
				    nickname: '森森小小小',
				    status: '待完成',
				    label: '连胜5·上次活跃: 2小时前',
				    goldCount: 188888
				},
				{
				    avatar: '/static/logo.png',
				    nickname: '森森小小小',
				    status: '待完成',
				    label: '连胜5·上次活跃: 2小时前',
				    goldCount: 188888
				},
				{
				    avatar: '/static/logo.png',
				    nickname: '森森小小小',
				    status: '待完成',
				    label: '连胜5·上次活跃: 2小时前',
				    goldCount: 188888
				},
				
				{
				    avatar: '/static/logo.png',
				    nickname: '森森小小小',
				    status: '待完成',
				    label: '连胜5·上次活跃: 2小时前',
				    goldCount: 188888
				},
				{
				    avatar: '/static/logo.png',
				    nickname: '森森小小小',
				    status: '待完成',
				    label: '连胜5·上次活跃: 2小时前',
				    goldCount: 188888
				}
            ],
            receiveShow: false,
			list: [
			  { name: '好友' },
			  // { name: '排行榜' }
			],
			tabs: 0,
			info:{},
			rank:{},
			friends:{},
        }
    },
	onShow() {
		this.initIdiomsInfo()
		this.initIdiomsRank()
		this.initIdiomsFriends()
	},
    methods: {
        // 返回上一页
        handleBack() {
            uni.navigateBack()
        },
		initIdiomsInfo(){
			// 编辑地址
			this.$http(
				'/user/idioms/info', {}, "POST").then(res => {
		            this.info = res.data
			})
		},
		initIdiomsFriends(){
			// 编辑地址
			this.$http(
				'/user/idioms/friends', {}, "POST").then(res => {
				console.log('数据',res.data)
				this.friends = res.data
			})
		},
		initIdiomsRank(){
			// 编辑地址
			this.$http(
				'/user/idioms/rank', {}, "POST").then(res => {
				console.log('数据',res.data)
				this.rank = res.data
			})
		},
		giftFriends(uid){
			this.$http(
				'/user/idioms/gift', {uid:uid}, "POST").then(res => {
				uni.showToast({
				  title: '赠送成功',
				  icon: 'none'
				});
			})
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
		// 切换筛选类型
		changeFilterType(e) {
		  console.log(e.index)
		  this.tabs = e.index
		},
        // 格式化金币数量
        formatGold(gold) {
            return gold.toLocaleString()
        },
        // 立即邀请按钮点击事件
        handleGame() {
			if(!this.info.remain_stamina){
				uni.showToast({
				  title: '体力不足~',
				  icon: 'fail'
				});
				return false;
			}
            // 跳转到游戏页面
            uni.navigateTo({
                url: '/pages/index/idiom-chain/game'
            })
        }
    }
}
</script>

<style lang="scss">
page {
    background-color: #F3F3F3;
}
.task-item {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding:0 30rpx;
	  border-bottom: 1rpx solid #EEEEEE;
	  background-color: #ffffff;
	  border-radius: 35rpx;
	  background-image: url('/static/index/chain-back.png');
	  background-size: 100% 100%;
      margin-top:20rpx;
	  height:120rpx;
	}
	.task-item1{
		height:120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:0 30rpx;
		border-bottom: 1rpx solid #EEEEEE;
		background-color: #ffffff;
		border-radius: 35rpx;
		background-image: url('/static/index/chain1-back.png');
		background-size: 100% 100%;
		margin-top:20rpx;
	}
	.task-item:last-child {
	  border-bottom: none;
	}
	
	.task-info {
	  display: flex;
	  align-items: center;
	  flex: 1;
	}
	.task-info1{
		flex: 1;
		font-size: 36rpx;
		color: #000000;
		text-align: center;
		font-weight: 600;
	}
	.task-icon {
	  width: 85rpx;
	  height: 90rpx;
	  margin-right: 20rpx;
	}
	
	.task-text {
	  flex: 1;
	}
	
	.task-title {
	  color:#000;
	  font-size: 30rpx;
	  font-weight: bold;
	  display: block;
	  margin-bottom: 5rpx;
	}
	
	.task-desc {
	  color: #3E7A97;
	  font-size: 20rpx;
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
    margin-top: 30rpx;
    background-color: #ffffff;

    border-radius: 30rpx 30rpx 30rpx 30rpx;
}

.ranking-list {
    padding: 0 20rpx 40rpx;
}

.ranking-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding: 0 30rpx;
    background-image: url('/static/index/invite4-b.png');
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
    color: #979696;
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
	margin-top: 30rpx;
}

.invite-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #000000;
    padding: 24rpx 30rpx;
	display: flex;
	justify-content: space-around;
}
.invite-titles{
	width:200rpx;
}
.section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #000000;
    margin-bottom: 20rpx;
}

.records-list {
    padding: 20rpx 20rpx 20rpx;

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
    border-radius: 15rpx;
    margin-left: 10rpx;
	width:93rpx;
	height:30rpx;
	text-align: center;
	background-color: #00C64B;
}

.status-completed {
    color: #fff;
    background-color: #00C64B;
    box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.status-pending {
    color: #fff;
    background-color: #979696;
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
    font-size: 24rpx;
    color: #fff;
	width: 110rpx;
	height: 50rpx;
	background: #000000;
	border-radius: 25rpx 25rpx 25rpx 25rpx;
	text-align: center;
	line-height: 50rpx;
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
    padding: 30rpx 30rpx 0;
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
.physical{
background-image: url('/static/index/tili-back.png');
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    height:100rpx;
    justify-content: space-around;
    padding:0 20rpx;
	margin-top:10rpx;
}
.physical-gold{
    display: flex;
    align-items: center;
    justify-content: center;
    padding:0 20rpx;
    background: #fff;
    text-align: center;
    border-radius: 27rpx;
    height:54rpx;
}
.physical-gold-icon{
    width: 32rpx;
    height: 29rpx;
    margin-right: 4rpx;
}
.physical-gold-text{
font-size: 24rpx;
color: #D54E3A;
}
.physical-stars{
display: flex;
    align-items: center;
    justify-content: space-around;
    height:54rpx;
    background: #fff;
    text-align: center;
    border-radius: 27rpx;
    padding:0 20rpx;
}
.physical-gold-star{
width: 32rpx;
    height: 29rpx;
    margin-right: 4rpx;
}
.physical-btn{
background-image: url('/static/index/btn.png');
    background-size: 100% 100%;
    width:174rpx;
    height:68rpx;
    font-size: 24rpx;
    color: #FFFFFF;
    line-height:55rpx ;
    text-align: center;
    margin-top:10rpx;
}
/* 搜索和筛选 */
  .search-filter {
    display: flex;
    margin-bottom: 20rpx;
  }
  
  .search-bar {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #F3F3F3;
    border-radius: 40rpx;
    padding: 0 20rpx;
    margin-right: 20rpx;
  }
  
  .search-icon {
	width:24rpx;
	height:24rpx;
    margin-right: 10rpx;
    color: #999;
  }
  
  .search-input {
    flex: 1;
    height: 50rpx;
    font-size: 24rpx;
	color:#A4A4A4;
	font-weight:100;
  }
  
  .filter-button {
    width: 110rpx;
    height: 50rpx;
    background-color: #000;
    border-radius: 25rpx;
    font-size: 24rpx;
	color: #fff;
	line-height: 50rpx;
	text-align: center;
  }
  .filter-button-icon{
	width: 18.38rpx;
	height: 10.59rpx;
	margin-left:16rpx;
  }
  .filter-icon {
    margin-left: 10rpx;
    font-size: 24rpx;
    color: #999;
  }
</style>