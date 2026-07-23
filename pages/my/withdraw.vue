<template>
    <view class="withdraw-page">
        <up-navbar bgColor="transparent" title="快速提现" :autoBack="true">
        </up-navbar>
        <image class="back" :src="$getStaticSrc('/static/my/withdraw-bg.png')" mode="aspectFill" />
        <!-- 主要内容区域 -->
        <view class="content">
            <!-- 当前余额区域 -->
            <view class="balance-section">
                <text class="balance-label">当前余额（元）</text>
                <text class="balance-amount">¥{{$formatPrice(userInfo.money)}}</text>
				<!-- <text class="balance-label">金币钱包余额（元）</text>
				<text class="balance-amount">¥{{$formatPrice(userInfo.withdraw_coin)}}</text> -->
            </view>
            <!-- 提现金额区域 -->
            <view class="amount-section">
                <text class="section-label">提现金额</text>
				<!-- 提现方式选择 - 移出到amount-section外部 -->
				<!-- <view class="payment-method-section">
				    <text class="section-label2">提现钱包</text>
				    <view class="payment-method-item" @click="showTypePopup">
				        <text class="payment-name" v-if="selectType == 'money'">余额钱包</text>
				        <text class="payment-name" v-else-if="selectType == 'coin'">金币钱包</text>
				        <image class="arrow-icon" src="/static/my/right-more-b.png" mode="aspectFit"></image>
				    </view>
				</view> -->
                <view class="amount-input-container">
                    <text class="currency-symbol">¥</text>
                    <input class="amount-input" type="digit" :placeholder="placeholder" v-model="withdrawAmount"
                        @input="validateAmount" @blur="normalizeAmount" />
                    <view class="all-amount-btn" @click="withdrawAll">
                        全部提现
                    </view>
                </view>
                <!-- 提现方式选择 - 移出到amount-section外部 -->
                <view class="payment-method-section">
                    <text class="section-label2">提现方式</text>
                    <view class="payment-method-item" @click="showBankPopup">
						<image class="payment-icon" v-if="selectedBankDetail?.acc_type == 1" :src="$getStaticSrc('/static/my/pay.png')" mode="aspectFit"></image>
						<image class="payment-icon" v-if="selectedBankDetail?.acc_type == 2" :src="$getStaticSrc('/static/my/zfbs.png')" mode="aspectFit"></image>
						<image class="payment-icon" v-if="selectedBankDetail?.acc_type == 3" :src="$getStaticSrc('/static/my/wx.png')" mode="aspectFit"></image>
                        <text class="payment-name" v-if="selectedBankDetail?.acc_type == 1">银联</text>
                        <text class="payment-name" v-else-if="selectedBankDetail?.acc_type == 2">支付宝</text>
                        <text class="payment-name" v-else-if="selectedBankDetail?.acc_type == 3">微信</text>
                        <text class="payment-account">{{selectedBankDetail?.card}}</text>
                        <image class="arrow-icon" :src="$getStaticSrc('/static/my/right-more-b.png')" mode="aspectFit"></image>
                    </view>
                </view>

                <!-- 提现按钮 -->
                <view class="submit-section">
                    <button class="withdraw-btn" @click="submitWithdraw">申请提现</button>
                </view>
            </view>


        </view>
        <up-popup :show="payshow" :round="10" mode="center" :closeable="true" @close="this.payshow = false">
            <view class="pay-content">
                <view class="pay-content-title">请输入支付密码</view>
                <view class="pay-content-withdraw">提现</view>
                <view class="pay-content-pay">￥<span class="pay-content-price">{{$formatPrice(withdrawAmount)}}</span></view>
                <view class="pay-message-content">
                <up-code-input :dot="true" :adjustPosition="true" v-model="password" @finish="onPasswordComplete"></up-code-input>
                </view>
            </view>
        </up-popup>
        <up-popup :show="selectedTypeshow" :round="10" mode="bottom" @close="this.selectedTypeshow = false">
            <view class="popup-content">
                <text class="section-title" style="text-align: center;">选择提现钱包</text>
                <view class="popup-items" v-for="(item, index) in selectedTypeMethods" :key="index"
                    @click="selectCheckType(item)">
                    <view class="popup-item">
                        <text class="popup-item-text">{{ item.name }}</text>
                    </view>
                    <image class="popup-item-check" v-if="selectType == item.type" :src="$getStaticSrc('/static/my/check-g.png')"
                        mode="aspectFit"></image>
                </view>
            </view>
        </up-popup>
        <up-popup :show="selectedBankshow" :round="10" mode="bottom" @close="this.selectedBankshow = false">
            <view class="popup-content">
                <text class="section-title" style="text-align: center;">选择提现账户</text>
                <view class="popup-items" v-for="(item, index) in selectedBankMethods" :key="index"
                    @click="selectBank(index)">
                    <view class="popup-item">
                        <image v-if="item.acc_type == 2" class="payment-icon" :src="$getStaticSrc('/static/my/zfbs.png')"
                            mode="aspectFit"></image>
                        <image v-else-if="item.acc_type == 4" class="payment-icon" :src="$getStaticSrc('/static/my/card.png')"
                            mode="aspectFit"></image>
                        <image v-else-if="item.acc_type == 3" class="payment-icon" :src="$getStaticSrc('/static/my/wx.png')"
                            mode="aspectFit"></image>
                        <image v-else-if="item.acc_type == 1" class="payment-icon" :src="$getStaticSrc('/static/my/pay.png')"
                            mode="aspectFit"></image>
                        <text class="popup-item-text">{{ item.card }}</text>
                    </view>
                    <image class="popup-item-check" v-if="selectedBank == index" :src="$getStaticSrc('/static/my/check-g.png')"
                        mode="aspectFit"></image>
                </view>
            </view>
        </up-popup>

    </view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
    computed: {
        formattedPrice(e) {
        // 在Vue组件中使用全局函数
            return this.$formatPrice(e);
        },
        ...mapState(['userInfo', 'isLoggedIn'])
    },
    data() {
        return {
            withdrawAmount: '',
            currentBalance: 5899,
			selectedTypeshow:false,
			selectType:'money',
            selectedBankshow: false,
			selectedTypeMethods:[{
				'type':'money',
				'name':'余额钱包'
			},{
				'type':'coin',
				'name':'金币钱包'
			}],
            selectedBankMethods: [],
            selectedBank: 0,
            selectedBankDetail: {},
            payshow: false,
            password: '',
            first_withdraw_num: '',
            first_withdraw_open: false,
            withdraw_min_num: '',
			placeholder:'请输入提现金额'
        }
    },
	onShow() {
		if (this.isLoggedIn) {
			this.$store.dispatch('updateUserInfo');
		}
		this.initApply()
		this.initClash()
	},
    methods: {
        // 返回上一页
        goBack() {
            uni.navigateBack()
        },
		initClash(){
			// 编辑地址
			this.$http(
				'/user/cost/conf', {}, "POST").then(res => {
					console.log('ceshi ',res.data)
					if(res.data){
						if(res.data.first_withdraw_open){
							this.placeholder = "首次提现为"+res.data.first_withdraw_num+"元"
						}else{
							this.placeholder = "提现金额"+res.data.withdraw_min_num+"元起"
						}
						this.first_withdraw_num = res.data.first_withdraw_num
						this.first_withdraw_open = res.data.first_withdraw_open
						this.withdraw_min_num = res.data.withdraw_min_num
					}
				
			})
		},
		initApply(){
			// 编辑地址
			this.$http(
				'/user/bank/search', {}, "POST").then(res => {
					console.log('ceshi ',res.data.list)
					if(res.data.list){
						this.selectedBankMethods = res.data.list
						this.selectedBankDetail = this.selectedBankMethods[0]
					}
				
			})
		},
        change(e) {
            console.log('内容改变，当前值为：' + e);
        },
        finish(e) {
            console.log('输入结束，当前值为：' + e);
        },
        // 验证提现金额
        validateAmount() {
            // 保留原始输入，不立即清空
            if (!this.withdrawAmount) return;

            let amount = parseFloat(this.withdrawAmount);

            // 只有当输入了完整的数字后才进行验证
            if (!isNaN(amount)) {
                // 确保金额不超过当前余额
                if (amount > this.userInfo.money) {
                    // this.withdrawAmount = this.userInfo.money.toString();
                    uni.showToast({
                        title: '提现金额不能超过当前余额',
                        icon: 'none'
                    });
                }
				console.log('amount',amount)
				console.log('first_withdraw_num',this.first_withdraw_num)
				if (this.first_withdraw_open && amount > this.first_withdraw_num) {
				    // this.withdrawAmount = this.userInfo.money.toString();
				    uni.showToast({
				        title: "首次提现为"+this.first_withdraw_num+"元",
				        icon: 'none'
				    });
				}
            }
        },
		// 输入完成后再归一化金额，避免 input 期间抢占输入
		normalizeAmount() {
			if (!this.withdrawAmount) return;
			const amount = parseFloat(this.withdrawAmount);
			if (isNaN(amount)) {
				this.withdrawAmount = '';
				return;
			}
			if (amount > this.userInfo.money) {
				this.withdrawAmount = String(this.userInfo.money);
				return;
			}
			if (this.first_withdraw_open && amount > this.first_withdraw_num) {
				this.withdrawAmount = String(this.first_withdraw_num);
			}
		},

        // 全部提现
        withdrawAll() {
			if(this.selectType == 'money'){
				this.withdrawAmount = this.userInfo.money
			}else{
				this.withdrawAmount = this.userInfo.withdraw_coin
			}
			if(this.first_withdraw_open){
				this.withdrawAmount = this.first_withdraw_num
			}
        },
		showTypePopup(){
			this.selectedTypeshow = true
		},
        // 选择提现方式
        showBankPopup() {
            this.selectedBankshow = true
        },
		selectCheckType(i){
			this.selectType = i.type
			this.selectedTypeshow = false
			this.withdrawAmount = ""
		},
        // 选择银行
        selectBank(index) {
            this.selectedBank = index
            this.selectedBankDetail = this.selectedBankMethods[index]
        },
        finish() {
            console.log(11111)
        },
        // 提交提现申请
        submitWithdraw() {
			if(!this.selectedBankDetail){
				uni.showToast({
				    title: '请添加提现信息',
				    icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({ url: `/pages/my/payment-method` });
				}, 3000);
				return false;
			}
			const amount = parseFloat(this.withdrawAmount);
			if (this.first_withdraw_open && !isNaN(amount) && amount > this.first_withdraw_num) {
				uni.showToast({
					title: "首次提现为" + this.first_withdraw_num + "元",
					icon: 'none'
				});
				return false;
			}
            this.payshow = true
            
        },
        onPasswordComplete(value){
			
            console.log('密码输入完成，当前值为：' + value);
            if (!this.withdrawAmount || parseFloat(this.withdrawAmount) <= 0) {
                uni.showToast({
                    title: '请输入有效的提现金额',
                    icon: 'none'
                })
                return false;
            }

            // // 显示加载提示
            uni.showLoading({
                title: '处理中...'
            })
			// 编辑地址
			this.$http(
				'/user/cost/apply', {
					money:this.withdrawAmount,
					passwd:value,
					bank_id:this.selectedBankDetail.id,
					type:this.selectType,
				}, "POST").then(res => {
					 uni.hideLoading()
				    // 提现成功提示
				    uni.showToast({
				        title: '提现申请已提交',
				        icon: 'success'
				    })
				
				    // 可以根据实际需求跳转到提现结果页面或返回上一页
				    setTimeout(() => {
				        uni.navigateBack()
				    }, 1500)
			}).catch(error => {
                // 处理错误情况
                uni.hideLoading()
                uni.showToast({
                    title: '提现失败，请重试',
                    icon: 'none'
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.withdraw-page {
    background-color: #f5f5f5;
    min-height: 100vh;
}

.back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 600rpx;
    z-index: 1;
}

// 内容区域样式
.content {
    padding: 40rpx 30rpx;
    position: relative; // 添加这一行
    z-index: 3;
}

// 余额区域样式
.balance-section {
    border-radius: 20rpx;
    padding: 110rpx 30rpx 40rpx;
    margin-bottom: 30rpx;
    text-align: left;
}

.balance-label {
    font-size: 28rpx;
    color: #000;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    display: block;
}

.balance-amount {
    font-size: 60rpx;
    font-weight: 700;
    color: #000;
}

// 提现金额区域样式
.amount-section {
    position: absolute;
    top: 523rpx;
    left: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    width: 630rpx;
}

.section-label {
    font-size: 28rpx;
    color: #000;
    margin-bottom: 20rpx;
    display: block;
}

.section-label2 {
    font-size: 28rpx;
    color: #000;
}

.amount-input-container {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #e0e0e0;
    padding: 0 20rpx;
    height: 88rpx;
    position: relative;
    color: #000;
}

.currency-symbol {
    font-size: 40rpx;
    color: #000;
    margin-right: 10rpx;
}

.amount-input {
    flex: 1;
    height: 100%;
    font-size: 30rpx;
    color: #000;
    // 添加这些属性确保输入内容可见
    padding: 0;
    border: none;
    background: transparent;
}

.all-amount-btn {
    font-size: 28rpx;
    color: #FF481C;
}

// 提现方式样式
.payment-method-section {
    background-color: #fff;
    border-radius: 20rpx;
    margin-bottom: 76rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.payment-method-item {
    display: flex;
    align-items: center;
    height: 88rpx;
}

.payment-icon {
    width: 52rpx;
    height: 52rpx;
    margin-right: 20rpx;
}

.payment-name {
    font-size: 28rpx;
    color: #333;
    margin-right: 10rpx;
}

.payment-account {
    font-size: 24rpx;
    color: #999;
    flex: 1;
}

.arrow-icon {
    width: 12rpx;
    height: 24rpx;
    margin-left: 24rpx;
}

// 提现按钮样式
.submit-section {
    padding: 0 20rpx;
}

.withdraw-btn {
    width: 500rpx;
    height: 70rpx;
    background-color: #000;
    color: #fff;
    font-size: 24rpx;
    border-radius: 30rpx;
    line-height: 70rpx;
}
.pay-content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    font-size: 30rpx;
    color: #000000;
    font-weight: 800;
}
.pay-content-title{
    margin-top: 44rpx;
}
.pay-content-pay{
    margin-bottom: 40rpx;
}
.pay-content-withdraw{
    margin-top: 40rpx;
    margin-bottom: 20rpx;
}
.pay-content-price{
    font-size: 48rpx;
    font-weight: 800;
}
.pay-message-content{
    padding:44rpx 44rpx 104rpx;
}
</style>