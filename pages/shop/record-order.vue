<template>
  <view class="order-record-page">
    <!-- 顶部导航栏 -->
    <up-navbar title="购买记录" bgColor="transparent" :left-show="true" :right-show="false"
        @leftClick="handleBack"></up-navbar>

    <!-- 状态筛选栏 -->
    <view class="status-filter">
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === '' }"
        @click="selectStatus('')"
      >
        <text class="filter-text">全部</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'S' }"
        @click="selectStatus('S')"
      >
        <text class="filter-text">待发货</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'D' }"
        @click="selectStatus('D')"
      >
        <text class="filter-text">已发货</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'P' }"
        @click="selectStatus('P')"
      >
        <text class="filter-text">运输中</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'Y' }"
        @click="selectStatus('Y')"
      >
        <text class="filter-text">已完成</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ 'active': selectedStatus === 'C' }"
        @click="selectStatus('C')"
      >
        <text class="filter-text">已取消</text>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="statistics-bar">
      <text class="total-count">共 {{ totalCount }} 笔记录</text>
      <view class="date-filter" @click="toggleCategoryDropdown">
        <text class="date-text">{{checkCategory}}</text>
        <image :src="$getStaticSrc('/static/index/down.png')" class="date-icon" mode="aspectFit"></image>
      </view>
    </view>
	<!-- 时间下拉菜单 -->
	<view 
	  class="category-dropdown" 
	  v-if="isDropdownVisible"
	  @click.stop
	>
	  <view class="dropdown-content">
	    <view 
	      class="category-item"
	      v-for="category in categories"
	      :key="category.id"
	      @click="selectCategory(category)"
	      :class="{ 'active': selectedCategory === category.id }"
	    >
	      <text class="category-name">{{ category.name }}</text>
	    </view>
	  </view>
	</view>
    <!-- 订单列表 -->
    <view class="order-list">
      <view 
        class="order-item" 
        v-for="order in orders" 
        :key="order.id"
        :class="{ 'pending': order.status === 'pending', 'shipped': order.status === 'shipped', 'transit': order.status === 'transit' }"
      >
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-id">订单号: {{ order.id }}</text>
          <!-- <text class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status) }}</text> -->
          <text class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status)}}</text>
        </view>

        <!-- 商品信息 -->
        <view class="order-content">
          <image :src="order.thumb?$baseUrl + order.thumb:'/static/farm/gift.png'" class="product-image" mode="aspectFit"></image>
          <view class="product-info-infos">
            <text class="product-title">{{ order.goods_id_title?order.goods_id_title:'商品不存在' }}</text>
            <text class="product-tag">包邮到家</text>
            <text class="product-detail">类型: {{ order.cat_id_name }}</text>
            <text class="product-detail">数量: {{ order.number }}</text>
            <!-- <text class="product-detail">颜色: {{ order.color }} 数量: x{{ order.quantity }}</text> -->
			<view class="coin-pool-bg">
			    <image class="coin-pool-icon" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
			    <!-- <view class="product-points">{{$formatPrice(order.gold,1,0)}}{{config?.review_mode!=1?'积分':''}}</view> -->
			    <view class="product-points">{{$formatPrice(order.gold,1,0)}}</view>
			</view>
          </view>
        </view>
		<view class="order-footer">
		  <text class="exchange-time">购买时间: {{ order.addtime_date }}</text>
		  <!-- <text class="exchange-time">订单状态: {{order.status}}</text> -->
		</view>
        <!-- 订单底部 -->
        <view class="order-footer-btns">
          <view class="action-buttons">
			  <button
			    class="action-btn primary-btn"
			    v-if="['S', 'D'].includes(order.status) && config?.review_mode==1"
			    @click="cancelService(order.id)"
			  >
			    取消订单
			  </button>
            <!-- <button 
              class="action-btn primary-btn"
              v-if="['S', 'D'].includes(order.status)"
              @click="contactService(order.id)"
            >
              联系客服
            </button>
            <button 
              class="action-btn secondary-btn"
              v-if="['S', 'D'].includes(order.status)"
              @click="remindShipping(order.id)"
            >
              提醒发货
            </button> -->
            <button 
              class="action-btn primary-btn"
              v-if="['D', 'P'].includes(order.status)"
              @click="trackLogistics(order.kd_sn)"
            >
              查看物流
            </button>
            <button 
              class="action-btn secondary-btn"
              v-if="['Y', 'C'].includes(order.status)"
              @click="exchangeAgain(order.id)"
            >
              再次兑换
            </button>
          </view>
        </view>
		
      </view>
    </view>
    <!-- 加载中提示 -->
    <view class="loading" v-if="isLoading">
        <text>加载中...</text>
    </view>

    <!-- 无更多数据提示 -->
    <view class="no-more" v-if="!hasMore && !isLoading">
        <text>没有更多数据了</text>
    </view>
  </view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
  data() {
    return {
      selectedStatus: '',
      totalCount: 0,
	  currentPage: 1,
	  pageSize: 10,
      orders: [],
	  isDropdownVisible: false,
	  checkCategory: "近30天",
	  selectedCategory: 30,
	  categories: [
	    { id: 3, name: '近3天' },
	    { id: 7, name: '近7天' },
	    { id: 15, name: '近15天' },
	    { id: 30, name: '近30天' },
	  ],
	  statusList:[],
	  hasMore: true, // 是否有更多数据
	  isLoading: false // 是否正在加载数据
    };
  },
  computed: {
  	...mapState(['userInfo', 'isLoggedIn','config'])
  },
  onLoad() {
		// 获取配置信息
		this.$store.dispatch('getConfig')
    // 初始化加载数据
			this.loadRecordList();
	},
	// 上拉触底加载更多
	onReachBottom() {
		// 如果正在加载或没有更多数据，则不执行
		if (this.isLoading || !this.hasMore) return;
		this.loadMoreProducts();
	},
  methods: {
    // 返回上一页
    handleBack() {
        // 返回上一页
        uni.navigateBack({
            delta: 1
        });
    },
	loadRecordStatus() {
		// 编辑地址
		this.$http(
			'/goods/order/search', {
				page_num:this.pageSize,
				page_current:this.currentPage,
			}, "POST").then(res => {
			this.statusList = res.data.config.status
			this.loadRecordList();
		})
	},
	loadRecordList() {
		this.isLoading = true;
		
		// 编辑地址
		this.$http(
			'/goods/order/search', {
				status:this.selectedStatus,
				days:this.selectedCategory,
				page_num:this.pageSize,
				page_current:this.currentPage,
			}, "POST").then(res => {
			this.statusList = res.data.config.status
				
			this.totalCount = res.data.count
			this.orders = [...this.orders, ...res.data.list];
			if(res.data.list.length < this.pageSize){
				this.hasMore = false
			}
			
			this.isLoading = false;
			
		})
	},
	// 切换分类下拉菜单显示状态
	toggleCategoryDropdown() {
	  this.isDropdownVisible = !this.isDropdownVisible;
	},
    // 选择分类
    selectCategory(category) {
      this.selectedCategory = category.id;
	  this.checkCategory= category.name;
      // 关闭下拉菜单
      this.isDropdownVisible = false;
	  this.currentPage = 1
	  this.orders = []
	  this.loadRecordList()
    },
    // 选择订单状态
    selectStatus(status) {
      this.selectedStatus = status;
	  this.currentPage = 1
	  this.orders = []
	  this.loadRecordList()
    },
    
    // 获取状态文本
    getStatusText(status) {
	  const statusMap = this.statusList
      return statusMap[status] || '';
    },
    
    // 联系客服
    contactService(orderId) {
      console.log('Contact service for order:', orderId);
      // 实现联系客服的逻辑
    },
    cancelService(orderId){
		// 调用加载列表的方法
		this.$http(
		'/goods/order/cancel', {
			id: orderId,
		}, "POST").then(res => {
			uni.showToast({
			    title: '订单取消成功',
			    icon: 'success'
			});
			// 重置分页参数
			this.currentPage = 1;
			this.orders = [];
			this.hasMore = true;
			// 重新加载订单列表
			this.loadRecordList();
		})
	},
    // 提醒发货
    remindShipping(orderId) {
      console.log('Remind shipping for order:', orderId);
      // 实现提醒发货的逻辑
    },
    
    // 查看物流
    trackLogistics(kdSn) {
      console.log('Track logistics for order:', kdSn);
      uni.navigateTo({
        url: '/pages/shop/logistics?kdsn=' + kdSn
      });
      // 实现查看物流的逻辑
    },
    
    // 再次兑换
    exchangeAgain(orderId) {
      console.log('Exchange again for order:', orderId);
      // 实现再次兑换的逻辑
    },
    
    // 加载更多商品
    loadMoreProducts() {
      // 如果没有更多数据或正在加载，则不执行
      if (!this.hasMore || this.isLoading) return;
      
      this.isLoading = true;
      // 增加页码
      this.currentPage++;
      
      // 调用加载列表的方法
      this.$http(
		'/goods/order/search', {
			status: this.selectedStatus,
			days: this.selectedCategory,
			page_num: this.pageSize,
			page_current: this.currentPage,
		}, "POST").then(res => {
			// 追加新数据
			this.orders = [...this.orders, ...res.data.list];
			
			// 判断是否还有更多数据
			if (res.data.list.length < this.pageSize) {
				this.hasMore = false;
			}
			
			this.isLoading = false;
		}).catch(() => {
			// 加载失败时恢复页码
			this.currentPage--;
			this.isLoading = false;
		});
    }
  }
};
</script>

<style lang="scss" scoped>
.order-record-page {
  background-color: #f3f3f3;
  min-height: 100vh;
}


/* 状态筛选栏 */
.status-filter {
  display: flex;
  padding: 0 32rpx 0;
  height: 88rpx;
  padding-top:150rpx;
  align-items: center;
  overflow-x: auto;
  white-space: nowrap;
}

.filter-item {
  height: 50rpx;
  width:110rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
  border: 1px solid #000;
  border-radius: 25rpx;
  margin-right: 5rpx;
}

.filter-text {
  font-size: 24rpx;
  color: #000;
}
.filter-item.active{
    background-color: #000;
}
.filter-item.active .filter-text {
  color: #fff;
  background-color: #000;
  height: 50rpx;
  line-height: 50rpx;
  width:110rpx;
  font-weight: 600;
}


/* 统计信息 */
.statistics-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
}

.total-count {
  font-size: 20rpx;
  color:#979696;
}

.date-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 25rpx;
  width:226rpx;
  height:50rpx;
  background-color: #fff;
  text-align: center;
  line-height: 50rpx;
}

.date-text {
  font-size: 24rpx;
  color: #000;
  margin-right: 8rpx;
}

.date-icon {
  width: 16rpx;
  height: 12rpx;
}

/* 订单列表 */
.order-list {
  padding: 10rpx 30rpx 24rpx;
}

.order-item {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.order-id {
  font-size: 20rpx;
  color: #000;
}

.order-status {
  font-size: 26rpx;
  font-weight: 600;
}

.status-S {
  color: #000;
}

.status-D {
  color: #D54E3A ;
}

.status-P {
  color: #00AEFF;
}

.status-Y {
  color: #979696;
}

.status-C {
  color: #979696;
}

/* 商品信息 */
.order-content {
  display: flex;
  margin-bottom: 24rpx;
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  background-color: #f8f8f8;
  border-radius: 30rpx;
  margin-right: 24rpx;
}

.product-info-infos {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 28rpx;
  color: #000;
  font-weight: bold;
  line-height: 44rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.product-tag {
  font-size: 24rpx;
  color: #993018;
  background-color: #FFF0F0;
  padding: 4rpx 16rpx;
  border-radius: 16rpx;
  align-self: flex-start;
  margin: 12rpx 0;
}

.product-detail {
  font-size: 20rpx;
  color: #979696;
}

.product-points {
  font-size: 28rpx;
  color: #D54E3A;
  font-weight: 600;
}

/* 订单底部 */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-footer-btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top:10rpx;
}

.exchange-time {
  font-size: 20rpx;
  color: #979696;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-btn {
	width:150rpx;
  height: 40rpx;
  font-size: 20rpx;
  border-radius: 20rpx;
  line-height: 40rpx;
  margin-left: 10rpx;
}

.primary-btn {
  background-color: #fff;
  color: #000;
  border: none;
  border: 2rpx solid #000;
}

.secondary-btn {
  background-color: #000;
  color: #fff;
  
}
/* 分类下拉菜单样式 */
.category-dropdown {
  position: absolute;
  top: 240rpx; /* 导航栏下方 */
  right: 35rpx;
  width: 220rpx;
  z-index: 999;
}

.dropdown-content {
  background-color: #fff;
  border-radius: 30rpx 30rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-item {
	font-size: 24rpx;
  padding: 24rpx 30rpx;
  transition: background-color 0.2s ease;
}

.category-item:last-child {
  border-bottom: none;
}
.category-item:hover {
  background-color: #fff0e6;
  color:#D54E3A;
}
.category-item.active {
  
}


.category-name {
  font-size: 26rpx;
  color: #333;
  display: block;
  text-align: center;
}

.category-item.active .category-name {
  color: #D54E3A;
  font-weight: bold;
}
.loading,
.no-more {
    padding: 0 0 30rpx;
    text-align: center;
    color: #999;
    font-size: 26rpx;
}
  .coin-pool-bg {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.coin-pool-icon {
		width: 36rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.coin-pool-title {
		font-size: 24rpx;
		color: #000;
        margin-left: 10rpx;
}
</style>