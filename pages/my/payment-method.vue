<template>
	<view class="settings-container">
		<!-- 支付宝 -->
		<view :class="['payment-item', item.acc_type==1 ? 'pay' : item.acc_type==2 ? 'zfb' : 'wx']" v-for="(item,index) in bankList" @click="selectPayment(item)">
			<image class="payment-icon" v-if="item.acc_type == 1" :src="$getStaticSrc('/static/my/pay.png')" mode="aspectFit"></image>
			<image class="payment-icon" v-if="item.acc_type == 2" :src="$getStaticSrc('/static/my/zfb.png')" mode="aspectFit"></image>
			<image class="payment-icon" v-if="item.acc_type == 3" :src="$getStaticSrc('/static/my/wx.png')" mode="aspectFit"></image>
			<view class="payment-info">
				<view class="payment-title" v-if="item.acc_type == 1">银联支付</view>
				<view class="payment-title" v-if="item.acc_type == 2">支付宝支付</view>
				<!-- <view class="payment-title" v-if="item.acc_type == 3">微信支付</view> -->
				<view class="payment-detail">
					<view class="payment-detail-info">收款账户: {{item.card}}</view>
				</view>
				<view class="payment-detail">
					<view class="payment-detail-info">收款人: {{item.username}}</view>
				</view>
				<view class="payment-detail">
					<view class="payment-detail-info">开户行: {{item.name}}</view>
				</view>
			</view>
			<view class="payment-actions" >
				<image class="payment-checkbox" :src="$getStaticSrc('/static/my/right-more.png')" mode="aspectFit"></image>
			</view>
		</view>
		<view class="add-pay-way" @click="showAddPayPopup">
			<image :src="$getStaticSrc('/static/my/add.png')" mode="aspectFit" class="add-pay-icon"></image>
			<view class="u-cell-text">添加提现方式</view>
		</view>
		<up-popup :show="selectedAddPayshow" :round="10" mode="bottom" @close="this.selectedAddPayshow = false">
            <view class="popup-content">
                <text class="section-title" style="text-align: center;">添加提现方式</text>
                <view class="popup-items" @click="selectedPay(1)">
                    <view class="popup-item">
                        <image class="payment-icon" :src="$getStaticSrc('/static/my/pay.png')" mode="aspectFit"></image>
                        <text class="popup-item-text">银联卡</text>
                    </view>
                    <image class="popup-item-check" v-if="selectedAddPay == 1" :src="$getStaticSrc('/static/my/check-g.png')" mode="aspectFit"></image>
                </view>
				<view class="popup-items" @click="selectedPay(2)">
                    <view class="popup-item">
                        <image class="payment-icon" :src="$getStaticSrc('/static/my/zfbs.png')" mode="aspectFit"></image>
                        <text class="popup-item-text">支付宝</text>
                    </view>
                    <image class="popup-item-check" v-if="selectedAddPay == 2" :src="$getStaticSrc('/static/my/check-g.png')" mode="aspectFit"></image>
                </view>
				<!-- <view class="popup-items" @click="selectedPay(3)">
                    <view class="popup-item">
                        <image class="payment-icon" src="/static/my/wx.png" mode="aspectFit"></image>
                        <text class="popup-item-text">微信支付</text>
                    </view>
                    <image class="popup-item-check" v-if="selectedAddPay == 3" src="/static/my/check-g.png" mode="aspectFit"></image>
                </view> -->
            </view>
        </up-popup>
	</view>
</template>

<script>
export default {
    data() {
        return {
            selectedAddPayshow: false,
            bankList: [],
            selectedAddPay: 1
        }
    },
	onShow() {
		this.bankSearch()
	},
    methods: {
		// "1":"银行卡",
		// "2":"支付宝",
		// "3":"微信支付"
		bankSearch(){
		  // 编辑地址
		  this.$http(
			'/user/bank/search', {}, "POST").then(res => {
			this.bankList = res.data.list
		  })
		},
        // 返回上一页
        showAddPayPopup() {
            this.selectedAddPayshow = true
        },
		selectedPay(index) {
			this.selectedAddPay = index
			uni.navigateTo({ url: '/pages/my/payment-change?type=' + index })
		},
		selectPayment(item){
			uni.setStorageSync('payment',item)
			uni.navigateTo({ url: '/pages/my/payment-way?type=' + item.acc_type })
		}
    }
}
</script>

<style>
page{
	background: #f5f5f5;
}
.pay{
	background-image: url('/static/my/pay-back.png');
	background-size: 100% 100%;
}
.zfb{
	background-image: url('/static/my/zfb-back.png');
	background-size: 100% 100%;
}
.wx{
	background-image: url('/static/my/wx-back.png');
	background-size: 100% 100%;
}
.settings-container {
    padding: 30rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
.add-pay-way{
	height:150rpx;
	border-radius: 30rpx;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
.add-pay-icon{
	width: 48rpx;
	height: 48rpx;	
}
.u-cell-text{
	font-size: 28rpx;
	color: #A4A4A4;
}
.payment-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    position: relative;
    border-radius: 30rpx;
	margin-bottom: 30rpx;
    &:last-child {
        border-bottom: none;
    }

    &.active {
        background-color: rgba(255, 107, 59, 0.05);
    }
}

.payment-back {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
}

.payment-icon {
    width: 71rpx;
    height: 44rpx;
    z-index: 3;
    margin:0 10rpx;
}

.payment-info {
    flex: 1;
    z-index: 3;
}

.payment-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #fff;
    margin-bottom: 10rpx;
    display: block;
}

.payment-detail {
    font-size: 24rpx;
    color: #fff;
    display: block;
    margin-bottom: 5rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.payment-detail-info {
    width: 45vw;
}
.payment-actions-2 {
    width:4vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 3;
}
.payment-actions {
    width:8vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 3;
}
.payment-check{
    width:30rpx;
    height:30rpx;
}
.payment-checkbox {
    width: 13.03rpx;
    height: 24rpx;
}
</style>