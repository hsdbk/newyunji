<template>
  <view class="gold-log-container">

    <!-- 表格标题栏 -->
    <view class="table-header">
      <view class="header-item">摘要</view>
      <view class="header-item">雨滴</view>
      <view class="header-item">时间</view>
    </view>

    <!-- 收益记录列表 -->
    <view class="log-list">
      <view class="log-item" v-for="(item, index) in logData" :key="index">
        <view class="log-content">
          <view class="log-title">{{item.title}}</view>
          <view class="log-subtitle">{{item.trans_no}}</view>
        </view>
        <view class="log-amount">
          <view class="amount-value">{{item.btype == 'add'?'+'+item.money:''+item.money}}</view>
        </view>
        <view class="log-time">{{item.addtime_date}}</view>
      </view>
    </view>

    <!-- 空状态 -->
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
export default {
  data() {
    return {
		currentPage: 1,
		pageSize: 10,
		hasMore: true,
		isLoading: false,
		dateRange: {
			startDate: '',
			endDate: ''
		},
      currentFilterIndex: 0, // 添加缺失的变量定义
      filterType: '', // 添加缺失的变量定义
      searchKeyword: '', // 添加缺失的变量定义
      balance: 0, // 添加余额变量
      // 模拟数据
      logData: []
    };
  },
  onLoad() {
    // 这里可以调用API获取实际的收益记录数据
    this.loadGoldLog();
  },
  onReachBottom() {
  	// 触底加载更多
  	if (this.hasMore && !this.isLoading) {
  		this.loadGoldLog();
  	}
  },
  methods: {
    // 返回上一页
    handleBack() {
      uni.navigateBack();
    },
    loadMoreProducts() {
    	if (this.isLoading || !this.hasMore) return;
    
    	this.isLoading = true;
    	this.currentPage++;
    
    	// 模拟API请求
    	setTimeout(() => {
    		// 生成模拟数据
    		const mockProducts = this.generateMockProducts();
    		this.log = [...this.log, ...mockProducts];
    		this.hasMore = mockProducts.length === this.pageSize;
    		this.isLoading = false;
    	}, 500);
    },
    // 加载金币收益记录（实际项目中使用）
    // 加载金币收益记录
    loadGoldLog() {
      // 防止重复加载
      if (this.isLoading) return;
      
      // 设置加载状态
      this.isLoading = true;
      
      // 编辑地址
      this.$http(
      	'/user/funds/search', {
      		sort: this.currentFilterIndex,
      		transaction: this.filterType,
      		begin_addtime: this.dateRange.startDate,
      		end_addtime: this.dateRange.endDate,
      		key: this.searchKeyword,
      		page_current: this.currentPage,
      		page_num: this.pageSize,
			type:'gold'
      	}, "GET").then(res => {
      	// 请求成功
      	if (res && res.data && res.data.list) {
      		// 如果是第一页，直接替换数据；否则合并数据
      		if (this.currentPage === 1) {
      			this.logData = res.data.list;
      		} else {
      			this.logData = [...this.logData, ...res.data.list];
      		}
      		
      		// 更新余额
      		if (res.data.balance !== undefined) {
      			this.balance = res.data.balance;
      		}
      		
      		// 判断是否还有更多数据
      		this.hasMore = res.data.list.length === this.pageSize;
      		
      		// 如果有更多数据，增加页码
      		if (this.hasMore) {
      			this.currentPage++;
      		}
      	} else {
      		// 如果数据不存在，设置为无更多数据
      		this.hasMore = false;
      		// 第一页且无数据时清空列表
      		if (this.currentPage === 1) {
      			this.logData = [];
      		}
      	}
      	
      	// 无论成功失败，都要结束加载状态
      	this.isLoading = false;
      	
      }).catch(error => {
      	// 错误处理
      	console.error('加载金币记录失败:', error);
      	this.isLoading = false;
      	
      	// 可以添加错误提示
      	uni.showToast({
      		title: '加载失败，请重试',
      		icon: 'none'
      	});
      });
    }
  }
};
</script>

<style scoped>
page {
	background: #F3F3F3;
}
.gold-log-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 表格标题栏 */
.table-header {
  display: flex;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  margin:20rpx 30rpx;
  height:50rpx;
  line-height: 50rpx;
  background-image: url('/static/my/funds-b.png');
  background-size: 100% 100%;
}


.header-item {
  flex: 1;
  text-align: center;
}

/* 收益记录列表 */
.log-list {
    padding:0 30rpx;
  
}

.log-item {
  display: flex;
  background-color: #fff;
  padding: 20rpx 20rpx;
  justify-content: space-between;
  margin-bottom: 20rpx;
  border-radius: 30rpx;
}

.log-content {
  padding-right: 20rpx;
  text-align: left;
  position: relative;
  width:35%;
  z-index: 1;
}

.log-title {
  font-size: 24rpx;
  color: #333;
  margin-bottom: 6rpx;
}

.log-subtitle {
  font-size: 24rpx;
  color: #666;
}

.log-amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  text-align: left;
  width:20%;
}

.amount-value {
  font-size: 24rpx;
  color: #ff6633;
  font-weight: bold;
}

.special-tag {
  font-size: 20rpx;
  color: #fff;
  background-color: #ff6633;
  padding: 2rpx 12rpx;
  border-radius: 12rpx;
  margin-top: 8rpx;
}

.log-time {
  padding-left: 20rpx;
  text-align: left;
  font-size: 24rpx;
  color: #979696;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* 空状态 */
.empty-state {
  padding: 100rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

/* 高亮项 */
.log-item[isHighlighted="true"] {
  background-color: #fff9f7;
}

.loading,
.no-more {
	padding: 0 0 30rpx;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}
</style>