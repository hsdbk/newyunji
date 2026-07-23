<template>
	<view class="recommend-container">
		<!-- 顶部轮播图 -->
		<view class="banner-container">
			<up-swiper :list="banner" @click="hotActive" height="350rpx" radius="5" keyName="thumb" :circular="true" :autoplay="true" class="banner-swiper">
				<!-- <swiper-item v-for="(item,index) in banner" :key="index">
					<image :src="$baseUrl + item.thumb" mode="aspectFill" class="banner-image"></image>
				</swiper-item> -->
			</up-swiper>
		</view>

		<!-- 顶部功能按钮 -->
		<!-- <view class="top-buttons">
			<view class="top-button-item" @click="showCustomerService">
				<view class="top-button-icon">
					<image src="/static/recommend/custom.png" mode="aspectFit"></image>
				</view>

				<text class="top-button-text">在线客服</text>
			</view>
			<view class="top-button-item" @click="sharePage">
				<view class="top-button-icon">
					<image src="/static/recommend/share.png" mode="aspectFit"></image>
				</view>
				<text class="top-button-text">分享</text>
			</view>
			<view class="top-button-item" @click="showMyWallet">
				<view class="top-button-icon">
					<image src="/static/recommend/coupon.png" mode="aspectFit"></image>
				</view>
				<text class="top-button-text">我的券包</text>
			</view>
			<view class="top-button-item" @click="showGrassDetails">
				<view class="top-button-icon">
					<image src="/static/recommend/detail.png" mode="aspectFit"></image>
				</view>
				<text class="top-button-text">种草详情</text>
			</view>
		</view> -->
		<view class="notice" v-if="config && config.notice">
			<up-notice-bar style="border-radius: 20rpx;" speed="50" :text="config.notice" bgColor="#fff" color="#000"></up-notice-bar>
		</view>
		<!-- 分类标签 -->
		<view class="category-tabs">
			<view class="category-scroll">
				<!-- <view class="category-tab" v-for="(item,index) in projectType" :class="{ active: activeCategory === index }" @click="switchCategory(index)">
					<text>{{item}}</text>
				</view> -->
				<view class="category-tab" @click="goQuestion('hot')">
					<text>热门活动</text>
				</view>
				<view class="category-tab" :class="{ active: activeCategory === 'activity' }"
					@click="switchCategory('activity')">
					<text>稳健类型</text>
				</view>
				<view class="category-tab" @click="goQuestion('about')">
					<text>关于我们</text>
				</view>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="product-list" v-if="products.length > 0">
			<view class="product-item" v-for="(product, index) in products" :key="index">
				<text class="product-name">{{ product.name }}</text>
				<text class="product-desc" v-if="product.name_desc">{{ product.name_desc }}</text>
				<!-- 商品图片 -->
				<view class="product-image-container">
					<image :src="product.thumb?$baseUrl + product.thumb:''" mode="aspectFill" class="product-image"></image>
					
				</view>
				<!-- 进度100%时显示水印 -->
				<image v-if="product.schedule >= 100 && config.project_empty" 
						:src="$baseUrl + config.project_empty" 
						mode="aspectFit" 
						class="product-watermark"></image>
				<!-- 商品信息 -->
				<view class="product-info">
					<view class="product-title" v-if="product.pack!='0.00' && product.pack_money!='0.00'">参与 {{product.pack}} 送 {{product.pack_money}} 红包</view>
					<view class="product-progress">
						<text class="progress-text">参与进度</text>
						<view class="progress-bar">
							<view class="progress-fill" :style="{ width: product.schedule + '%' }"></view>
						</view>
						<text class="progress-text">{{ product.schedule }}%</text>
					</view>
					<view class="product-sections">
						<view class="product-sections-view">
							<view class="product-sections-title">最低金额</view>
							<view class="product-sections-desc">¥{{ product.min_money }}</view>
						</view>
						<view class="product-sections-view">
							<view class="product-sections-title">每日分红</view>
							<view class="product-sections-desc">¥{{ product.apr_money }}</view>
						</view>
						<view class="product-sections-view">
							<view class="product-sections-title">参与周期</view>
							<view class="product-sections-desc">{{ product.days }}{{ product.type=='C'?'天':product.type=='A'?'天':product.type=='B'?'天':product.type=='H'?'小时':'天' }}</view>
						</view>
						<!-- <view class="product-sections-view">
							<view class="product-sections-title">日收益率</view>
							<view class="product-sections-desc">{{ product.apr }}%</view>
						</view> -->
						
					</view>
					
					<button class="join-button" @click="viewProductDetail(product)">立即参与</button>
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
			// 分页相关数据
			currentPage: 1,
			pageSize: 10,
			hasMore: true,
			isLoading: false,
			// 商品数据
			products: [],
			// 当前选中的分类
			activeCategory: 'activity',
			projectType:[],
			banner:[]
		}
	},
	computed: {
		...mapState(['isAuth','config'])
	},
	created() {
		// 先获取配置信息
		this.$store.dispatch('getConfig')
		// 初始化加载数据
		this.loadProducts();
		this.initBanner();
		// #ifdef APP
		plus.navigator.setFullscreen(true);
		// #endif
		// 注册触底加载事件
		uni.$on('reachBottom', this.loadMoreProducts);
	},
	onUnload() {
		// 取消事件监听
		uni.$off('reachBottom', this.loadMoreProducts);
	},
	onReachBottom() {
		// 触底加载更多
		if (this.hasMore && !this.isLoading) {
			this.loadMoreProducts();
		}
	},
	methods: {
		// 加载商品数据
		initBanner() {
			// 编辑地址
			this.$http(
				'/api/api/banner', {
					url:'home'
				}, "GET").then(res => {
				console.log('数据',res.data)
				// 为每个banner项的thumb添加$baseUrl前缀
				this.banner = res.data.map(item => {
					return {
						...item,
						thumb: this.$baseUrl + item.thumb
					};
				});
			})
		},
		goQuestion(type) {
			uni.navigateTo({
				url: '/pages/my/settings/question?type='+type
			})
		},
		hotActive(item){
			console.log(this.banner[item].url)
			if(this.banner[item].url){
				// detail
				uni.navigateTo({
					url: '/pages/my/settings/agreement?type=detail&id='+this.banner[item].url
				})
				// uni.navigateTo({
				// 	url: '/pages/my/settings/question?type=hot&id='+this.banner[item].url
				// })
			}
		},
		// 加载商品数据
		loadProducts() {
			this.isLoading = true;
			
			// 编辑地址
			this.$http(
				'/item/dq/search', {
					page_num:this.pageSize,
					page_current:this.currentPage,
					// project_type:this.activeCategory
					project_type:'C'
				}, "GET").then(res => {
				console.log('数据',res.data)
				this.projectType = res.data.config.project_type
				this.products = [...this.products, ...res.data.list];
				if(res.data.list.length < this.pageSize){
					this.hasMore = false
				}
				
				this.isLoading = false;
				
			})
		},

		// 加载更多商品
		loadMoreProducts() {
			if (this.isLoading || !this.hasMore) return;

			this.isLoading = true;
			this.currentPage++;

			// 模拟API请求
			setTimeout(() => {
				// 生成模拟数据
				const mockProducts = this.generateMockProducts();
				this.products = [...this.products, ...mockProducts];
				this.hasMore = mockProducts.length === this.pageSize;
				this.isLoading = false;
			}, 500);
		},

		// 生成模拟数据
		generateMockProducts() {
			const products = [];
			const productCount = this.pageSize;

			for (let i = 0; i < productCount; i++) {
				const productNum = (this.currentPage - 1) * this.pageSize + i + 1;
				products.push({
					id: 'product_' + productNum,
					name: 'XXXX' + productNum,
					maxPledge: 10,
					period: 99,
					unitPrice: 9999,
					share: 9999,
					remaining: (100 - Math.random() * 50).toFixed(2),
					imageUrl: i % 2 === 0 ? '/static/recommend/shop.png' : '/static/recommend/shop.png'
				});
			}

			// 最后一页可能不足pageSize条数据
			if (this.currentPage > 3) {
				return products.slice(0, Math.floor(Math.random() * this.pageSize) + 1);
			}

			return products;
		},

		// 切换分类
		switchCategory(category) {
			this.activeCategory = category;
			this.currentPage = 1;
			this.products = [];
			this.loadProducts();
		},

		// 查看商品详情
		viewProductDetail(product) {
			console.log('查看商品详情:', product);
			if(!this.isAuth){
				
				// 使用优惠券的逻辑
				uni.showToast({
					title: '完成实名认证，解锁完整商城服务。',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({ url: `/pages/my/settings/settings-password?type=1` });
				}, 3000);
				return false;
			}
			if(product.schedule == 100){
				uni.showToast({
					title: '项目已结束',
					icon: 'none'
				})
				return false;
			}
			// 这里可以跳转到商品详情页面
			uni.navigateTo({ url: `/pages/shop/project-detail?id=${product.id}` });
		},

		// 参与项目
		joinProject(product) {
			console.log('参与项目:', product);
			// 这里可以跳转到参与项目页面或弹出参与确认框
		},

		// 顶部功能按钮点击事件
		showCustomerService() {
			console.log('kefu_link', this.config.kefu_link)
			// 检查客服链接是否存在
			if (this.config && this.config.kefu_link) {
			  const url = this.config.kefu_link;
			  
			  // 跨平台解决方案
			  if (window.plus) {
			    // 使用5+ runtime API
			    plus.runtime.openURL(url, (result) => {
			      console.log('成功打开客服链接');
			    }, (error) => {
			      console.error('打开客服链接失败:', error);
			      uni.showToast({
			        title: '打开客服链接失败',
			        icon: 'none'
			      });
			    });
			  } else if (typeof window.open === 'function') {
			    // Web平台使用window.open
			    window.open(url, '_blank');
			  } else {
			    // 兜底方案
			    uni.showToast({
			      title: '请复制客服链接: ' + url,
			      icon: 'none',
			      duration: 3000
			    });
			  }
			} else {
			  uni.showToast({
			    title: '客服链接暂不可用',
			    icon: 'none'
			  });
			}
		},

		sharePage() {
			console.log('分享页面');
			uni.navigateTo({ url: '/pages/recommend/share' });
		},

		showMyWallet() {
			console.log('我的券包');
			uni.navigateTo({ url: '/pages/recommend/coupon' });
		},

		showGrassDetails() {
			console.log('种草详情');
		}
	}
}
</script>

<style lang="scss">
page {
	margin: 0;
	padding: 0;
	width: 100%;
	max-width: 100%;
	overflow-x: hidden;
	background-color: #f8f8f8;
}

.recommend-container {
	width: 100%;
	background-color: #f8f8f8;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	overflow-x: hidden;

	.banner-container {
		width: 90%;
		position: relative;
		padding:30rpx;
		border-radius: 35rpx;
		.banner-swiper {
			width: 100%;
			height: 500rpx;
			border-radius: 35rpx;
			.banner-image {
				width: 100%;
				height: 100%;
			}
			border-radius: 35rpx;
			.banner-text {
				position: absolute;
				top: 50%;
				left: 20rpx;
				transform: translateY(-50%);
				color: #fff;

				.banner-title {
					font-size: 36rpx;
					font-weight: bold;
					display: block;
				}

				.banner-subtitle {
					font-size: 24rpx;
					display: block;
					margin-top: 10rpx;
				}
			}
		}
	}

	.top-buttons {
		width: 90%;
		display: flex;
		justify-content: space-around;
		padding: 32rpx 0;
		margin-bottom: 10rpx;

		.top-button-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #fff;
			padding:20rpx;
			border-radius: 35rpx;
			width: 150rpx;
			flex-shrink: 0;
			.top-button-icon {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 10rpx;
				background-color: #fff;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.top-button-icon image {
				width: 41rpx;
				height: 44rpx;
			}

			.top-button-text {
				font-size: 24rpx;
				color: #333;
			}
		}
	}

	.category-tabs {
		padding: 15rpx 0;
		margin-bottom: 10rpx;
		.category-scroll {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.category-tab {
				padding: 10rpx 20rpx;
				margin:0 10rpx;
				position: relative;
				text {
					font-size: 30rpx;
					color: #FF481C;
					font-weight: 800;
				}

				&.active {
					text {
						font-size: 30rpx;
						font-weight: 800;
						color: #FF481C;
						padding:0 30rpx;
					}

					// 修改红色下划线样式
					&::after {
						content: '';
						position: absolute;
						bottom: -6rpx;
						left: 25rpx;
						width: 172rpx;
						height: 4rpx;
						background-color: #FF481C;
					}
				}
			}
		}
	}

}



.loading,
.no-more {
	padding: 0 0 30rpx;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}
.notice{
	width:90%;
}
</style>