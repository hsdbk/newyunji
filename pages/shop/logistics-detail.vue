<template>
    <view class="logistics-container">
        <!-- 物流列表 -->
        <view class="logistics-list">
            <!-- 物流项 -->
            <view class="logistics-item">
                <view class="item-content">
                    <view class="item-left">
                        <image class="product-image" :src="logisticsData.image || '/static/logo.png'" mode="aspectFit"></image>
                    </view>
                    <view class="item-middle">
                        <text class="product-name">{{ logisticsData.kd_name }} {{ logisticsData.kd_sn }}</text>
                        <text class="product-title">{{ logisticsData.title || '您的快乐在路上' }}</text>
                    </view>
                </view>
                <view class="steps">
                    <view class="steps-container">
                        <!-- 顶部节点 - 收货地址 -->
                        <view class="step-item" v-for="(item, index) in formattedLogisticsSteps" :key="index">
                            <view class="step-time">
                                <view>{{ item.time }}</view>
                                <view>{{ item.date }}</view>
                            </view>
                            <view class="step-icon-line">
                                <view class="step-icon" :class="{ 'active': index === 0 }">
                                    <text v-if="index === 0" class="icon-text">收</text>
                                    <image v-else-if="item.icon" class="icon" :src="item.icon" mode="aspectFit"></image>
                                </view>
                                <view class="step-line" v-if="index < formattedLogisticsSteps.length - 1"
                                    :class="{ 'active': index === 0 }"></view>
                            </view>
                            <view class="step-content">
                                <text class="step-text">{{ item.text }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 物流时间轴 -->

        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 物流数据，按照接口字段定义
            logisticsData: {
                id: '', // 订单ID
                kd_sn: '', // 快递单号
                kd_name: '', // 快递公司名称
                kd_name_pinyin: '', // 快递公司拼音或快递100编码
                kd_tel: '', // 快递公司客服电话
                state: '', // 快递100状态码
                state_name: '', // 状态中文说明
                kd_info: [], // 物流轨迹列表
                image: '', // 商品图片
                title: '' // 商品标题
            },
			kdsn:""
        };
    },
    computed: {
        // 格式化物流步骤，将接口数据转换为页面需要的格式
        formattedLogisticsSteps() {
            if (!this.logisticsData.kd_info || this.logisticsData.kd_info.length === 0) {
                return [];
            }
            console.log('11111',this.logisticsData.kd_info )
            return this.logisticsData.kd_info.map((item, index) => {
                const date = new Date(item.ftime || item.time);
                const now = new Date();
                const isToday = date.toDateString() === now.toDateString();
                
                let dateText = '';
                if (isToday) {
                    dateText = '今天';
                } else {
                    // 格式化日期为 MM-DD
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    dateText = `${month}-${day}`;
                }
                
                // 格式化时间为 HH:mm
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const timeText = `${hours}:${minutes}`;
                
                // 根据物流状态选择合适的图标
                let icon = '';
                if (index === 0) {
                    // 最新的状态使用特殊标记
                    icon = '';
                } else if (item.context.includes('揽收')) {
                    icon = '/static/recommend/logistics_shop.png';
                } else if (item.context.includes('运输') || item.context.includes('转运') || item.context.includes('中心')) {
                    icon = '/static/recommend/logistics_car.png';
                }
                
                return {
                    icon: icon,
                    text: item.context,
                    time: timeText,
                    date: dateText
                };
            });
        }
    },
    methods: {
        // 查看物流详情
        viewLogistics(itemId) {
            // 查看物流详情
            console.log('查看物流详情', itemId);
            // 这里可以添加跳转到物流详情页的逻辑
            // uni.navigateTo({ url: `/pages/shop/logistics-detail?id=${itemId}` });
        },
        // 返回上一页
        handleBack() {
            // 返回上一页
            uni.navigateBack();
        },
        
        // 获取物流信息
        getLogisticsInfo() {
            // const kdsn = this.$route.query.kdsn || '';
			
            if (!this.kdsn) {
                console.error('参数错误，缺少快递单号');
                this.setMockData();
                return;
            }
            
            // 调用接口获取物流信息
            this.$http(
                '/goods/order/logisInfo', // 假设接口路径
                { courier_id: this.kdsn }, // 参数
                'GET'
            ).then(res => {
                if (res.code === 200 && res.data) {
                    // 接口返回成功，更新物流数据
                    this.logisticsData = res.data;
                } else {
                    console.error('获取物流信息失败:', res.msg);
                    // 接口调用失败，使用模拟数据
                    this.setMockData(this.kdsn);
                }
            }).catch(error => {
                console.error('获取物流信息失败:', error);
                // 网络错误，使用模拟数据
                this.setMockData(this.kdsn);
            });
        },
        
        // 设置模拟数据
        setMockData(kdsn = 'ZT33523654562') {
            // 根据接口字段设置模拟数据
            this.logisticsData = {
                id: 'ORD' + Date.now(),
                kd_sn: kdsn,
                kd_name: '中通物流',
                kd_name_pinyin: 'zhongtong',
                kd_tel: '95311',
                state: '0',
                state_name: '运输中',
                image: '/static/logo.png',
                title: '您的快乐在路上',
                kd_info: [
                    {
                        time: new Date().toISOString(),
                        ftime: new Date().toLocaleString('zh-CN'),
                        context: '【收货地址】广东省深圳市龙岗区 布吉街道达利新村十项6号'
                    },
                    {
                        time: new Date(Date.now() - 2 * 3600000).toISOString(),
                        ftime: new Date(Date.now() - 2 * 3600000).toLocaleString('zh-CN'),
                        context: '【深圳运转中心】包裹已到达'
                    },
                    {
                        time: new Date(Date.now() - 6 * 3600000).toISOString(),
                        ftime: new Date(Date.now() - 6 * 3600000).toLocaleString('zh-CN'),
                        context: '到【南昌预转中心】正在分拣'
                    },
                    {
                        time: new Date(Date.now() - 24 * 3600000).toISOString(),
                        ftime: new Date(Date.now() - 24 * 3600000).toLocaleString('zh-CN'),
                        context: '【南昌预转中心】揽收成功'
                    },
                    {
                        time: new Date(Date.now() - 30 * 3600000).toISOString(),
                        ftime: new Date(Date.now() - 30 * 3600000).toLocaleString('zh-CN'),
                        context: '包裹正在等待揽收'
                    },
                    {
                        time: new Date(Date.now() - 36 * 3600000).toISOString(),
                        ftime: new Date(Date.now() - 36 * 3600000).toLocaleString('zh-CN'),
                        context: '商品已经下单'
                    }
                ]
            };
        }
    },
    onLoad(e) {
		this.kdsn = e.kdsn
        // 页面加载时获取物流信息
        this.getLogisticsInfo();
    },
    onReachBottom() {
        // 无需下拉加载更多
    }
};
</script>

<style scoped>
page {
    background-color: #F3F3F3;
}

/* 全局样式 */
.logistics-container {
    width: 100%;
    background-color: #F3F3F3;
}

/* 顶部导航栏样式 */
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100rpx;
    background-color: #ffffff;
    padding: 0 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 10;
}

.back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-icon {
    font-size: 40rpx;
    color: #000000;
}

.nav-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #000000;
}

.nav-right {
    width: 60rpx;
}

/* 物流列表样式 */
.logistics-list {
    padding: 20rpx;
}

.logistics-item {
    background-color: #ffffff;
    border-radius: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.item-content {
    display: flex;
    align-items: flex-start;
    padding: 20rpx;
}

.item-left {
    width: 200rpx;
    height: 200rpx;
    margin-right: 20rpx;
    background-color: #f9f9f9;
    border-radius: 25rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image {
    width: 200rpx;
    height: 200rpx;
}

.item-middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.product-name {
    font-size: 28rpx;
    color: #000000;
    font-weight: bold;
    margin-bottom: 10rpx;
}

.product-title {
    font-size: 28rpx;
    color: #000000;
    line-height: 40rpx;
    margin-bottom: 16rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.item-right {
    margin-left: 20rpx;
}

.status-badge {
    padding: 8rpx 20rpx;
    border-radius: 16rpx;
    font-size: 24rpx;
    text-align: right;
}

.status-badge.transporting {
    color: #00AEFF;
}

.status-badge.delivered {
    color: #979696;
}

/* 物流时间轴样式 */
.steps {
    background-color: #ffffff;
    padding: 30rpx;
    margin-bottom: 30rpx;
    border-radius: 30rpx;
}

.steps-container {
    position: relative;
}

.step-item {
    display: flex;
    position: relative;
    padding-bottom: 40rpx;
}

.step-icon-container {
    position: absolute;
    left: -60rpx;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-icon {
    width: 60rpx;
    height: 60rpx;
    background-color: #E0E0E0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.step-icon.active {
    background-color: #00AEFF;
}

.icon-text {
    font-size: 24rpx;
    color: #FFFFFF;
    font-weight: bold;
}

.step-content {
    margin-left: 20rpx;
    flex: 1;
}

.step-content.active {
    color: #00AEFF;
}

.step-text {
    font-size: 28rpx;
    color: #000000;
    margin-bottom: 10rpx;
    line-height: 40rpx;
}

.step-time {
    width: 15vw;
    font-size: 24rpx;
    color: #979696;
    text-align: center;
}

.step-line {
    position: absolute;
    left: 140rpx;
    top: 60rpx;
    width: 1rpx;
    height: 90rpx;
    border: 2rpx dashed #E0E0E0;
}

.step-line.active {
    border: 2rpx dashed #00AEFF;
}

.icon {
    width: 37rpx;
    height: 37rpx;
}
</style>