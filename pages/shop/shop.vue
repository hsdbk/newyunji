<template>
	<view class="shop-container">
		<!-- 顶部导航栏 -->
		<up-navbar @leftClick="uni.navigateBack({delta: 1});" title="商城" v-if="ledui == 1" :safeAreaInsetTop="true">

		</up-navbar>
		<up-navbar @leftClick="uni.navigateBack({delta: 1});" title="乐兑" v-if="ledui == 2" :safeAreaInsetTop="true">

		</up-navbar>
		
		<view class="nav-section" v-if="config?.review_mode==1">
			<view class="points-section"  @click="toggleCategoryDropdown" :class="{ 'active': isDropdownVisible }">
				<text class="points-label">{{checkCategory}}</text>
				<img class="dropdown-icon" v-if="isDropdownVisible" src="/static/index/up.png">
				<img class="dropdown-icon" v-if="!isDropdownVisible" src="/static/index/down.png">
				<!-- 分类下拉菜单 -->
				<view class="category-dropdown" v-if="isDropdownVisible" @click.stop>
					<view class="dropdown-content">
						<view class="category-item" v-for="category in categories" :key="category.id"
							@click="selectCategory(category)" :class="{ 'active': selectedCategory === category.id }">
							<text class="category-name">{{ category.name }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="exchange-record" @click="goRecordLog">购买记录</view>
		</view>
		<view class="nav-sections" v-if="config?.review_mode!=1">
			<view class="exchange-record" @click="goRecordLog">购买记录</view>
		</view>
		

		<!-- 使用scroll-view替代页面滚动，确保触底加载正常工作 -->
		<scroll-view 
			class="scroll-content"
			scroll-y
			@scrolltolower="handleScrollToLower"
			lower-threshold="100"
			enable-back-to-top
		>
			<!-- 商品列表 -->
			<view class="goods-list" v-if="products.length > 0">
				<view class="goods-item" v-for="(item, index) in products" :key="item.id" @click="goToDetail(item.id)"
					:class="{ 'offset-item': isEvenRow(index) }">
					<view class="goods-image-container">
						<image class="goods-image" :src="$baseUrl + item.thumb" mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<text class="goods-title">{{ item.title }}</text>
						<text class="goods-points">
							<view class="coin-pool-bg">
								<image class="coin-pool-icon" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
								<view class="detail-title">{{config?.review_mode!=1?'':'￥'}}{{$formatPrice(item.gold,1,0)}}</view>
								<!-- <view class="detail-title">{{config?.review_mode!=1?'':'￥'}}{{$formatPrice(item.gold,1,0)}}{{config?.review_mode!=1?'积分':''}}</view> -->
							</view>
							
							</text>
						<text class="goods-tag">包邮到家</text>
						<view class="goods-stats">
							<!-- <view class="goods-rating">好评率: {{ item.good_rating }}</view> -->
							<view class="goods-count">销量: {{ item.sold_count }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-if="products.length === 0 && !isLoading">
				<text>暂无商品</text>
			</view>

			<!-- 加载中提示 -->
			<view class="loading" v-if="isLoading">
				<text>加载中...</text>
			</view>

			<!-- 无更多数据提示 -->
			<view class="no-more" v-if="!hasMore && products.length > 0 && !isLoading">
				<text>没有更多数据了</text>
			</view>
			<view style="width:100%;height:100rpx;">
				
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				// 商品数据
				products: [],
				// 分页相关数据
				currentPage: 1,
				pageSize: 10,
				hasMore: true,
				isLoading: false,
				// 金币兑换相关
				currentGold: 8560,
				currentBalance: 42.80,
				exchangeAmount: '',
				// 模拟商品数据
				mockGoodsData: [{
					id: 1,
					title: '熠熠生辉，尽显高级感',
					points: '999',
					tag: '包邮到家',
					rating: '99.99%',
					count: '9999',
					imageUrl: '/static/index/back.png'
				}],
				// 下拉菜单相关
				isDropdownVisible: false,
				selectedCategory: null,
				checkCategory: '',
				cat_id: '',
				categories: [],
				ledui:0
			};
		},
		computed: {
			...mapState(['userInfo', 'isLoggedIn','isAuth','config'])
		},
		onShow() {
			this.ledui = uni.getStorageSync('ledui')
			this.$store.dispatch('getConfig');
			if (this.isLoggedIn) {
				this.$store.dispatch('updateUserInfo');
			}
			this.loadCategories();
			// #ifdef APP
			plus.navigator.setFullscreen(true);
			// #endif
		},
		onReachBottom() {
			// 兼容页面滚动方式的触底事件
			this.handleScrollToLower();
		},
		methods: {
			loadCategories() {
				// 编辑地址
				this.$http(
					'/goods/info/search', {
						page_num: this.pageSize,
						page_current: this.currentPage,
					}, "POST").then(res => {
					this.categories = res.data.config.cats
					this.checkCategory = res.data.config.cats[0].name
					this.selectedCategory = res.data.config.cats[0].id
					this.loadProducts();
				})
			},
			// 加载商品数据
			loadProducts() {
				this.isLoading = true;
				console.log('checkCategory', this.checkCategory)
				// 编辑地址
				this.$http(
					'/goods/info/search', {
						cat_id:this.selectedCategory,
						page_num: this.pageSize,
						page_current: this.currentPage,
					}, "GET").then(res => {
					console.log('数据', res.data)
					this.products = [...this.products, ...res.data.list];
					if (res.data.list.length < this.pageSize) {
						this.hasMore = false
						this.isLoading = false
					}
				})
			},


			// 跳转到商品详情页
			goToDetail(id) {
				if (!this.isLoggedIn) {
					uni.$u.toast('请您先登录')
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1500)
					return false;
				}
				uni.navigateTo({
					url: `/pages/shop/detail?id=${id}`
				});
			},
			
			// 处理兑换金币
			handleExchange() {
				if (!this.exchangeAmount || this.exchangeAmount <= 0) {
					uni.showToast({
						title: '请输入有效数量',
						icon: 'none'
					});
					return;
				}
				
				// 验证金币是否足够
				if (this.exchangeAmount > this.currentGold) {
					uni.showToast({
						title: '金币数量不足',
						icon: 'none'
					});
					return;
				}
				
				// 显示加载中
				uni.showLoading({
					title: '兑换中...'
				});
				// 编辑地址
				this.$http(
					'/user/exchange/apply', {
						gold_amount: this.exchangeAmount,
					}, "POST").then(res => {
						this.$store.dispatch('updateUserInfo');
					// 隐藏加载并显示成功提示
					this.exchangeAmount = ""
					uni.hideLoading();
					uni.showToast({
						title: '兑换成功',
						icon: 'success'
					});

				})
			},
			goRecordLog() {
				uni.navigateTo({
					url: `/pages/shop/record-order`
				});
			},
			// 判断是否为偶数行的商品
			isEvenRow(index) {
				// 每行两个商品，计算行索引
				const rowIndex = Math.floor(index + 1 / 2);
				// 偶数行（从0开始计数，所以是奇数行索引）
				const result = rowIndex % 2 === 1;
				return result;
			},
			// 切换分类下拉菜单显示状态
			toggleCategoryDropdown() {
				this.isDropdownVisible = !this.isDropdownVisible;
			},

			// 选择分类
			selectCategory(category) {
				this.selectedCategory = category.id;
				this.checkCategory = category.name;
				// 关闭下拉菜单
				this.isDropdownVisible = false;
				this.products = []
				this.currentPage = 1
				this.loadProducts()

			},

			// 触底加载更多处理函数
			handleScrollToLower() {
				// 触底加载更多
				console.log('scroll-view触底加载更多');
				console.log('hasMore',this.hasMore);
				console.log('isLoading',this.isLoading);
				if (this.hasMore && this.isLoading) {
					this.currentPage++;
					this.loadProducts();
				}
			},
			
			// 注册点击外部关闭下拉菜单的事件
			registerClickOutside() {
				document.addEventListener('click', this.handleClickOutside);
			},

			// 处理点击外部事件
			handleClickOutside(e) {
				if (this.isDropdownVisible) {
					const pointsSection = document.querySelector('.points-section');
					const dropdown = document.querySelector('.category-dropdown');

					if (pointsSection && dropdown &&
						!pointsSection.contains(e.target) &&
						!dropdown.contains(e.target)) {
						this.isDropdownVisible = false;
					}
				}
			}
		}
	};
</script>

<style scoped>
	.shop-container {
		padding:80rpx 0 0;
		height: 100vh;
		background-color: #f5f5f5;
		position: relative;
	}
	
	/* scroll-view样式 */
	.scroll-content {
		width: 100%;
		height: calc(100% - 88rpx);
		box-sizing: border-box;
	}
	
	/* 导航栏标题样式 */
	.navbar-title {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width:100vw;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #000;
		background-color: rgb(248, 248, 248); color: rgb(0, 0, 0);
		z-index: 999;
		padding-top: env(safe-area-inset-top);
	}

	.nav-section {
		padding:10rpx 32rpx;
		
		// #ifdef H5
		
		// #endif
		// #ifdef APP
		margin-top:100rpx;
		// #endif
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.nav-sections{
		// #ifdef H5
		
		// #endif
		// #ifdef APP
		margin-top:100rpx;
		// #endif
		padding:10rpx 32rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	.exchange-record {
		font-size: 28rpx;
		color: #000;
		border-radius: 30rpx;
		background-color: #fff;
		width: 200rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
	}

	/* 顶部导航栏 */
	.points-section {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		width: 240rpx;
		height: 60rpx;

		background-image: url('/static/index/nav-back.png');
		background-size: 100% 100%;
		position: relative;
	}

	.points-section.active {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.points-label {
		font-size: 24rpx;
		color: #D54E3A;
	}

	.dropdown-icon {
		width: 18.38rpx;
		height: 10rpx;
		font-size: 20rpx;
		color: #666;
		margin-left: 10rpx;
	}

	/* 分类下拉菜单样式 */
	.category-dropdown {
		position: absolute;
		// #ifdef H5
		top: 90rpx;
		// #endif
		// #ifdef APP
		top: 90rpx;
		// #endif
		/* 导航栏下方 */
		left: 0;
		width: 280rpx;
		z-index: 9999;
	}
	
	/* 金币兑换样式 */
	.change {
		background-color: #fff;
		// #ifdef APP
		margin: 90rpx 20rpx 0; 
		// #endif
		// #ifdef H5
		margin: 20rpx 20rpx 0; 
		// #endif
		padding: 50rpx 32rpx 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		position: relative;
	}
	
	.change-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}
	
	.change-item {
		text-align: center;
	}
	
	.change-label {
		font-size: 28rpx;
		color: #333;
		margin-right: 10rpx;
	}
	
	.change-value {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.gold-value {
		color: #D54E3A;
	}
	
	.balance-value {
		color: #D54E3A;
	}
	
	.change-record {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		font-size: 28rpx;
		color: #D54E3A;
	}
	
	.change-content {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.change-input-group {
		width: 66%;
		position: relative;
	}
	
	.input-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.change-input {
		width: 100%;
		height: 80rpx;
		border: 2rpx solid #E5E5E5;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		box-sizing: border-box;
	}
	
	.exchange-rate {
		display: block;
		font-size: 26rpx;
		color: #999;
		margin-bottom: 30rpx;
		text-align: center;
		position: absolute;
		top: 20rpx;
		right: 30rpx;
	}
	
	.exchange-btn {
		width: 200rpx;
		height: 55rpx;
		line-height: 55rpx;
		background-color: #FF6B35;
		color: #fff;
		font-size: 28rpx;
		border-radius: 44rpx;
		border: none;
	}
	
	.exchange-btn:active {
		background-color: #E55A2A;
	}

	.dropdown-content {
		background-color: #fff;
		border-radius: 30rpx 30rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		animation: slideDown 0.3s ease;
		/* 添加固定高度和滑动功能 */
		max-height: 400rpx;
		overflow-y: auto;
		/* 优化滑动条样式 */
		::-webkit-scrollbar {
			width: 4rpx;
		}
		::-webkit-scrollbar-track {
			background: #f1f1f1;
			border-radius: 2rpx;
		}
		::-webkit-scrollbar-thumb {
			background: #ccc;
			border-radius: 2rpx;
		}
		::-webkit-scrollbar-thumb:hover {
			background: #999;
		}
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
		color: #D54E3A;
	}

	.category-item.active {}


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

	/* 商品列表 */
	.goods-list {
		padding: 20rpx 30rpx 20rpx;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
		align-content: start;
		position: relative;
		/* 确保z-index生效 */
	}

	.goods-item {
		background-color: #fff;
		border-radius: 30rpx;
		overflow: hidden;
		padding: 10rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		transition: transform 0.3s ease;
		position: relative;
		display: flex;
				flex-direction: column;
				align-items: center;
		/* 确保transform生效 */
	}


	.goods-item.offset-item {
		transform: translateY(80rpx) !important;
		z-index: 1;
		/* 确保错位的元素在上方 */
	}

	.goods-image-container {
		width: 300rpx;
		height: 300rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.goods-image {
		width: 100%;
		height: 100%;
		border-radius: 30rpx;
	}

	.goods-info {
		width:100%;
		padding: 20rpx 0 10rpx;
	}

	.goods-title {
		font-size: 28rpx;
		color: #000;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 10rpx;
		font-weight: bold;
	}

	.goods-points {
		font-size: 28rpx;
		color: #D54E3A;
		font-weight: bold;
		margin-bottom: 10rpx;
		display: block;
	}

	.goods-tag {
		font-size: 24rpx;
		color: #993018;
		background-color: #FEEEE5;
		padding: 4rpx 16rpx;
		border-radius: 16rpx;
		margin-bottom: 15rpx;
		display: inline-block;
	}

	.goods-stats {
		font-size: 20rpx;
		color: #979696;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.goods-rating,
	.goods-count {
		display: block;
		margin-bottom: 5rpx;
	}

	/* 空状态 */
	.empty-state {
		padding: 200rpx 0;
		text-align: center;
		color: #979696;
	}

	/* 分页组件 */
	.pagination {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.loading,
	.no-more {
		padding: 90rpx 0 30rpx;
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