<template>
  <view class="cart-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="back-btn" @tap="navigateBack">
        <image :src="$getStaticSrc('/static/icon/back.png')" mode="aspectFit"></image>
      </view>
      <view class="title">购物车</view>
      <view>
        <view class="clear-btn" @click="showFlashPopup">
            刷新
        </view>
        <view class="clear-btn" @click="showClearPopup" v-if="cartItems.length > 0">
            清空
        </view>
      </view>
    </view>

    <!-- 购物车商品列表 -->
    <view class="cart-list" v-if="cartItems.length > 0">
      <view 
        class="cart-item" 
        v-for="(item, index) in cartItems" 
        :key="item.id"
      >
        <view class="select-box" @tap="toggleSelect(index)">
          <image 
            class="select-icon" 
            :src="item.selected ? '/static/my/place-check2.png' : '/static/my/place-uncheck.png'" 
            mode="aspectFit"
          ></image>
        </view>
        <view class="item-content">
          <view class="item-img">
            <image :src="$baseUrl + item.image || '/static/logo.png'" mode="aspectFit"></image>
          </view>
          <view class="item-info">
            <view class="item-title">{{ item.title }}</view>
            <view class="item-desc">{{ item.description || '' }}</view>
            <view class="item-bottom">
              <view class="item-price">￥{{$formatPrice(item.price,1,0)}}</view>
              <view class="item-quantity">
                <view class="quantity-btn" @tap="decreaseQuantity(index)" :disabled="item.quantity <= 1">-
                </view>
                <view class="quantity-input">{{ item.quantity }}</view>
                <view class="quantity-btn" @tap="increaseQuantity(index)">+
                </view>
              </view>
            </view>
          </view>
          <view class="delete-btn" @tap="deleteItem(index)">
			<button class="confirm-btn">删除</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 空购物车状态 -->
    <view class="empty-cart" v-else>
      <image :src="$getStaticSrc('/static/my/empty.png')" mode="aspectFit"></image>
      <view class="empty-text">购物车是空的</view>
      <button class="go-shopping" @tap="goShopping">去购物</button>
    </view>

    <!-- 底部结算栏 -->
    <view class="bottom-bar" v-if="cartItems.length > 0">
      <view class="select-all" @tap="toggleSelectAll">
        <image 
          class="select-icon" 
          :src="isAllSelected ? '/static/my/place-check2.png' : '/static/my/place-uncheck.png'" 
          mode="aspectFit"
        ></image>
        <text>全选</text>
      </view>
      <view class="total-info">
        <view class="total-text">合计：<text class="total-price">￥{{$formatPrice(totalPrice,1,0)}}</text></view>
        <button class="checkout-btn" :disabled="selectedCount === 0" @tap="checkout">
          结算({{ selectedCount }})
        </button>
      </view>
    </view>
    <!-- 确认清空弹窗 -->
	<up-popup :show="clearPopupVisible" mode="center" :closeable="false">
	    <view class="popup-content">
	      <view class="popup-title">确认清空</view>
	      <view class="popup-message">确定要清空购物车吗？</view>
	      <view class="popup-buttons">
	        <button class="cancel-btn" @tap="clearPopupVisible = false">取消</button>
	        <button class="confirm-btn" @tap="clearCart">确定</button>
	      </view>
	    </view>
	</up-popup>
	<up-popup :show="deletePopupVisible" mode="center" :closeable="false">
	    <view class="popup-content">
	      <view class="popup-title">确认删除</view>
	      <view class="popup-message">确定要删除该商品吗？</view>
	      <view class="popup-buttons">
	        <button class="cancel-btn" @tap="deletePopupVisible = false">取消</button>
	        <button class="confirm-btn" @tap="confirmDelete">确定</button>
	      </view>
	    </view>
	</up-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      clearPopupVisible: false,
      deletePopupVisible: false,
      currentDeleteIndex: -1,
	  
    };
  },
  computed: {
    // 计算总价
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return item.selected ? total + item.price * item.quantity : total;
      }, 0);
    },
    // 计算选中的商品数量
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length;
    },
    // 是否全选
    isAllSelected() {
      return this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
    }
  },
  created() {
    console.log(111)
    // 页面创建时从缓存读取购物车数据
    this.loadCartFromCache();
  },
  onShow() {
    // 每次页面显示时重新加载购物车数据，确保从订单确认页面返回后能更新
    this.loadCartFromCache();
  },
  methods: {
    // 从缓存加载购物车数据
    loadCartFromCache() {
      const cartData = uni.getStorageSync('cartItems');
      console.log('cartData',cartData)
      if (cartData && Array.isArray(cartData) && cartData.length > 0) {
        this.cartItems = cartData;
      }
    },
    
    // 保存购物车数据到缓存
    saveCartToCache() {
      uni.setStorageSync('cartItems', this.cartItems);
    },
    
    // 切换选中状态
    toggleSelect(index) {
      this.cartItems[index].selected = !this.cartItems[index].selected;
      this.saveCartToCache();
    },
    
    // 切换全选状态
    toggleSelectAll() {
      const newSelectedState = !this.isAllSelected;
      this.cartItems.forEach(item => {
        item.selected = newSelectedState;
      });
      this.saveCartToCache();
    },
    
    // 减少商品数量
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
        this.saveCartToCache();
      }
    },
    
    // 增加商品数量
    increaseQuantity(index) {
      this.cartItems[index].quantity++;
      this.saveCartToCache();
    },
    
    // 显示删除确认弹窗
    deleteItem(index) {
      this.currentDeleteIndex = index;
      this.deletePopupVisible = true;
    },
    
    // 确认删除商品
    confirmDelete() {
      this.cartItems.splice(this.currentDeleteIndex, 1);
      this.saveCartToCache();
      this.deletePopupVisible = false;
      this.currentDeleteIndex = -1;
      // 显示删除成功提示
      uni.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500
      });
    },
    
    // 显示清空购物车确认弹窗
    showClearPopup() {
		console.log(this.clearPopupVisible)
      this.clearPopupVisible = true;
    },
    showFlashPopup(){
        this.loadCartFromCache();
    },
    // 清空购物车
    clearCart() {
      this.cartItems = [];
      this.saveCartToCache();
      this.clearPopupVisible = false;
      // 显示清空成功提示
      uni.showToast({
        title: '购物车已清空',
        icon: 'success',
        duration: 1500
      });
    },
    
    // 结算
    checkout() {
      const selectedItems = this.cartItems.filter(item => item.selected);
      if (selectedItems.length > 1) {
        uni.showToast({
          title: '请选择单条商品结算',
          icon: 'none',
          duration: 1500
        });
        return;
      }
      if (selectedItems.length > 0) {
        // 将选中的商品信息传递给订单确认页面
        uni.setStorageSync('checkoutItems', selectedItems);
        // 跳转到订单确认页面（这里需要根据实际路由调整）
        uni.navigateTo({
          url: '/pages/shop/order-confirm'
        });
      }
    },
    
    // 返回上一页
    navigateBack() {
      uni.navigateBack();
    },
    
    // 去购物
    goShopping() {
      uni.navigateTo({
        url: '/pages/shop/shop'
      });
    }
  }
};
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 100rpx;
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

.clear-btn {
  font-size: 28rpx;
  color: #666;
}

/* 购物车列表 */
.cart-list {
  margin-top: 20rpx;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.select-box {
  margin-right: 20rpx;
  padding-top: 40rpx;
}

.select-icon {
  width: 40rpx;
  height: 40rpx;
}

.item-content {
  flex: 1;
  display: flex;
  position: relative;
}

.item-img {
  width: 180rpx;
  height: 180rpx;
  margin-right: 20rpx;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  overflow: hidden;
}

.item-img image {
  width: 100%;
  height: 100%;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.item-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.item-quantity {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  font-size: 32rpx;
  color: #333;
  border-radius: 6rpx;
}

.quantity-btn[disabled] {
  color: #ccc;
}

.quantity-input {
  width: 70rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333;
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn image {
  width: 40rpx;
  height: 40rpx;
}

/* 空购物车 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-cart image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.go-shopping {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
  border-radius: 50rpx;
  border: none;
}

/* 底部结算栏 */
.bottom-bar {
  position: fixed;
  bottom: 110rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.select-all {
  display: flex;
  align-items: center;
}

.select-all text {
  margin-left: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.total-info {
  display: flex;
  align-items: center;
}

.total-text {
  font-size: 28rpx;
  color: #333;
  margin-right: 30rpx;
}

.total-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff4d4f;
}

.checkout-btn {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 28rpx;
  border-radius: 50rpx;
  border: none;
}

.checkout-btn[disabled] {
  background-color: #fff;
  border:1rpx solid #ff4d4f;
}

/* 弹窗样式 */
.popup-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  max-width: 500rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30rpx;
}

.popup-message {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-bottom: 40rpx;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.cancel-btn {
  flex: 1;
  background-color: #f5f5f5;
  color: #666;
  font-size: 28rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
  border: none;
}

.confirm-btn {
  flex: 1;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 28rpx;
  border-radius: 10rpx;
  border: none;
}
</style>