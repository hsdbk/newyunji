<template>
  <view class="order-confirm-container">
    <!-- 地址选择区域 -->
    <view class="address-section" @tap="chooseAddress">
      <view class="address-content" v-if="selectedAddress">
        <view class="address-info">
          <view class="contact-info">
            <text class="contact-name">{{ selectedAddress.name }}</text>
            <text class="contact-phone">{{ selectedAddress.tel }}</text>
            <text class="default-tag" v-if="selectedAddress.is_default === 'Y'">默认</text>
          </view>
          <view class="address-detail">{{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.address || selectedAddress.addressDetail }}</view>
        </view>
        <view class="arrow-icon">
          <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit"></image>
        </view>
      </view>
      <view class="empty-address" v-else>
        <text>请选择收货地址</text>
        <image :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 商品列表区域 -->
    <view class="goods-section">
      <view class="section-title">商品信息</view>
      <view class="goods-list">
        <view class="goods-item" v-for="(item, index) in orderItems" :key="index">
          <view class="goods-img">
            <image :src="$baseUrl + item.image || '/static/logo.png'" mode="aspectFit"></image>
          </view>
          <view class="goods-info">
            <view class="goods-title">{{ item.title }}</view>
            <view class="goods-desc">{{ item.description || '' }}</view>
            <view class="goods-bottom">
              <view class="goods-price">￥{{ $formatPrice(item.price, 1, 0) }}</view>
              <view class="goods-quantity">x{{ item.quantity }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 价格详情区域 -->
    <view class="price-section">
      <view class="section-title">价格详情</view>
      <view class="price-item">
        <text>商品总额</text>
        <text>￥{{ $formatPrice(totalPrice, 1, 0) }}</text>
      </view>
      <view class="price-item">
        <text>运费</text>
        <text>包邮</text>
      </view>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar">
      <view class="total-info">
        <text class="total-text">合计：</text>
        <text class="total-price">￥{{ $formatPrice(totalPrice, 1, 0) }}</text>
      </view>
      <view class="submit-btn" @click="submitOrder">
        提交订单
      </view>
    </view>

    <!-- 支付密码弹窗 -->
    <up-popup :show="payShow" :round="10" mode="center" :closeable="true" @close="payShow = false">
      <view class="pay-content">
        <view class="pay-title">请输入支付密码</view>
        <view class="pay-amount">支付金额：{{ $formatPrice(totalPrice, 1, 0) }}</view>
        <up-code-input :dot="true" :adjustPosition="true" v-model="password" @change="handlePasswordChange"></up-code-input>
        <view class="forgot-password" @tap="goPassword">忘记密码？</view>
      </view>
    </up-popup>

    <!-- 成功弹窗 -->
    <up-popup :show="successShow" :round="10" mode="center" :closeable="false">
      <view class="success-content">
        <image :src="$getStaticSrc('/static/my/OKpay.png')" mode="aspectFit" class="success-icon"></image>
        <view class="success-text">订单提交成功</view>
        <view class="success-btn" @tap="goOrderList">查看订单</view>
      </view>
    </up-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderItems: [],
      selectedAddress: null,
      addressList: [],
      payShow: false,
      password: '',
      successShow: false
    };
  },
  computed: {
    // 计算总积分
    totalPrice() {
      return this.orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    }
  },
  created() {
    // 加载订单商品信息
    this.loadOrderItems();
    // 加载默认地址
    this.loadDefaultAddress();
  },
  onShow() {
    // 每次页面显示时重新加载地址信息，确保从地址选择页面返回后能更新
    this.findAddressList();
    // 重新加载订单商品，确保数据最新
    this.loadOrderItems();
  },
  methods: {
    // 从缓存加载订单商品
    loadOrderItems() {
      const checkoutItems = uni.getStorageSync('checkoutItems');
      if (checkoutItems && Array.isArray(checkoutItems)) {
        this.orderItems = checkoutItems;
      }
    },
    
    // 加载默认地址
    loadDefaultAddress() {
      // 这里应该调用接口获取地址列表，暂时使用模拟数据
      // 先尝试从缓存获取默认地址
      const defaultAddressId = uni.getStorageSync('defaultAddress');
      this.findAddressList();
    },
    
    // 获取地址列表
    findAddressList() {
      this.$http(
        '/user/address/search', {}, "GET").then(res => {
        if (res.code == 200) {
          this.addressList = res.data.list;
          // 优先选择is_default=Y的地址，如果没有则选择第一条
          const defaultAddress = res.data.list.find(address => address.is_default === 'Y');
          this.selectedAddress = defaultAddress || res.data.list[0] || null;
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    },
    
    // 选择地址
    chooseAddress() {
      if (this.addressList.length > 0) {
        // 跳转到地址选择页面
        uni.navigateTo({
          url: '/pages/my/settings/settings-place?check=1'
        });
      } else {
        // 跳转到新增地址页面
        uni.navigateTo({
          url: '/pages/my/settings/settings-place?check=1'
        });
      }
    },
    
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    },
    
    // 提交订单
    submitOrder() {
      if (!this.selectedAddress) {
        uni.showToast({
          title: '请选择收货地址',
          icon: 'none'
        });
        return;
      }
      
      // 检查用户是否设置了支付密码
      if (!this.$store.state.userInfo.is_set_pay_passwd) {
        this.goPassword();
        return;
      }
      
      // 显示支付密码弹窗
      this.payShow = true;
    },
    
    // 处理密码输入完成
    handlePasswordChange(value) {
      if (value.length === 6) {
        // 提交订单到服务器
        this.addOrder(value);
      }
    },
    
    // 添加订单
    addOrder(password) { 
      // 显示加载中
      uni.showLoading({
        title: '提交订单中...'
      });
      
      var applyInfo = {
      	id:this.orderItems[0].id,
      	name:this.selectedAddress.name,
      	mobile:this.selectedAddress.tel,
      	address:this.selectedAddress.address,
      	number:this.orderItems[0].quantity,
      	passwd:password,
      	task_code:"",
      	redeem_code:"",
      }
	  console.log('applyInfo',applyInfo)
	  // return false;
      this.$http(
      	'/goods/order/apply', applyInfo, "POST").then(res => {
      		this.quantity = 1
      		uni.showToast({
      		    title: '下单成功~',
      		    icon: 'success'
      		});
      		
      		// 清除购物车中已下单的商品
      		this.clearCartItems();
			
			setTimeout(() => {
			    uni.navigateBack()
			}, 1500)
      })
    },
    
    // 清空购物车中已购买的商品
    clearCartItems() {
      const cartItems = uni.getStorageSync('cartItems') || [];
      const checkoutItemsIds = this.orderItems.map(item => item.id);
      const remainingItems = cartItems.filter(item => !checkoutItemsIds.includes(item.id));
      uni.setStorageSync('cartItems', remainingItems);
    },
    
    // 去设置支付密码
    goPassword() {
      uni.navigateTo({
        url: '/pages/my/settings/settings-password?type=3'
      });
    },
    
    // 查看订单
    goOrderList() {
      this.successShow = false;
      uni.switchTab({
        url: '/pages/my/my'
      });
    }
  }
};
</script>

<style scoped>
.order-confirm-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn image {
  width: 40rpx;
  height: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.placeholder {
  width: 60rpx;
}

/* 地址区域 */
.address-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.address-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.address-info {
  flex: 1;
}

.contact-info {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.contact-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
}

.contact-phone {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
}

.default-tag {
  font-size: 22rpx;
  color: #fff;
  background-color: #ff4d4f;
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
}

.address-detail {
  font-size: 28rpx;
  color: #666;
  line-height: 40rpx;
}

.arrow-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon image {
  width: 30rpx;
  height: 30rpx;
}

.empty-address {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30rpx;
  color: #999;
}

.empty-address image {
  width: 30rpx;
  height: 30rpx;
}

/* 商品区域 */
.goods-section {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.goods-list {
  border-top: 1rpx solid #f0f0f0;
  padding-top: 20rpx;
}

.goods-item {
  display: flex;
  margin-bottom: 20rpx;
}

.goods-img {
  width: 160rpx;
  height: 160rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  overflow: hidden;
  margin-right: 20rpx;
}

.goods-img image {
  width: 100%;
  height: 100%;
}

.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.goods-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  font-size: 30rpx;
  color: #ff4d4f;
  font-weight: bold;
}

.goods-quantity {
  font-size: 28rpx;
  color: #666;
}

/* 价格区域 */
.price-section {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 30rpx;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 28rpx;
  color: #666;
}

/* 底部结算栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.total-info {
  display: flex;
  align-items: center;
}

.total-text {
  font-size: 28rpx;
  color: #333;
}

.total-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.submit-btn {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 32rpx;
  padding: 20rpx 50rpx;
  border-radius: 50rpx;
  border: none;
}

.submit-btn[disabled] {
  background-color: #ffb8b8;
  color: #fff;
}

/* 支付弹窗 */
.pay-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  max-width: 500rpx;
}

.pay-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20rpx;
}

.pay-amount {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 30rpx;
}

.forgot-password {
  font-size: 28rpx;
  color: #1989fa;
  text-align: center;
  margin-top: 30rpx;
}

/* 成功弹窗 */
.success-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 30rpx;
}

.success-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 40rpx;
}

.success-btn {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
  border-radius: 50rpx;
}</style>