<template>
	<view class="settings-container">
		<!-- 支付宝 -->
		<view :class="['payment-item', detail.acc_type==1 ? 'pay' : detail.acc_type==2 ? 'zfb' : 'wx']">
			<image class="payment-back" v-if="detail.acc_type==1" :src="$getStaticSrc('/static/my/pay-back.png')" mode="aspectFit"></image>
			<image class="payment-back" v-else-if="detail.acc_type==2" :src="$getStaticSrc('/static/my/zfb-back.png')" mode="aspectFit"></image>
			<image class="payment-back" v-else :src="$getStaticSrc('/static/my/wx-back.png')" mode="aspectFit"></image>
			<image class="payment-icon" v-if="detail.acc_type == 1" :src="$getStaticSrc('/static/my/pay.png')" mode="aspectFit"></image>
			<image class="payment-icon" v-if="detail.acc_type == 2" :src="$getStaticSrc('/static/my/zfb.png')" mode="aspectFit"></image>
			<image class="payment-icon" v-if="detail.acc_type == 3" :src="$getStaticSrc('/static/my/wx.png')" mode="aspectFit"></image>
			<view class="payment-info">
				<view class="payment-title" v-if="detail.acc_type == 1">银联支付</view>
				<view class="payment-title" v-if="detail.acc_type == 2">支付宝支付</view>
				<view class="payment-title" v-if="detail.acc_type == 3">微信支付</view>
				<view class="payment-detail">
					<view class="payment-detail-info">收款账户: {{detail.card}}</view>
				</view>
				<view class="payment-detail">
					<view class="payment-detail-info">收款人: {{detail.username}}</view>
				</view>
				<view class="payment-detail" v-if="detail.acc_type == 1">
					<view class="payment-detail-info">开户行: {{detail.name}}</view>
				</view>
			</view>
		</view>
		<view class="confirm-btn">
			<view class="confirm-btn-container">
				<up-button class="change" @click="changeSubmit">更改</up-button>
				<up-button class="del" @click="delSubmit">删除</up-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
    data() {
        return {
            type: '',
            detail:{}
        }
    },
	onLoad(e) {
	    this.type = e.type
		if(e.type==1){
			uni.setNavigationBarTitle({
				title: '添加银行卡'
			});
		}else if(e.type==2){
			uni.setNavigationBarTitle({
				title: '添加支付宝'
			});
		}else if(e.type==3){
			uni.setNavigationBarTitle({
				title: '添加微信支付'
			});
		}
	},
	onShow() {
		console.log(uni.getStorageSync('payment'))
		this.detail = uni.getStorageSync('payment')
	},
    methods: {
        changeSubmit() {
            uni.navigateTo({ url: '/pages/my/payment-change?type=' + this.type +'&id=' + this.detail.id })
        },
        delSubmit() {
			// 编辑地址
			this.$http(
				'/user/bank/remove', {id:this.detail.id}, "POST").then(res => {
				uni.showToast({
				  title: '删除成功',
				  icon: 'success'
				});
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			})
			
            
        }
    }
}
</script>

<style>
page{
	background: #f5f5f5;
}
.settings-container {
    padding: 30rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
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
.payment-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    position: relative;
    border-radius: 30rpx;

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
.confirm-btn{
	display: flex;
	justify-content: center;
	align-items: center;
  }
  .confirm-btn-container {
	width: 500rpx;
	height:70rpx;
	border-radius: 30rpx;
    margin-top: 160rpx;
  }
  .change{
	  background-color: #000000 !important;
      color:#fff !important;
      border-radius: 35rpx !important;
  }
  .del{
	  margin-top: 26rpx;
	  background-color: transparent !important;
	  border:1rpx solid #000 !important;
      border-radius: 35rpx !important;
  }
</style>