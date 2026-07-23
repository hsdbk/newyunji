<template>
	<!-- 添加下拉刷新属性 -->
	<view class="funds-log-container" enablePullDownRefresh="true">
		<!-- 顶部净变动统计 -->
		<!-- <view class="net-change-section">
			<view class="section-row">
				<image class="section-icon" src="/static/my/funds-b.png" mode="aspectFit"></image>
				<view class="section-title">净变动 {{ balance }}</view>
			</view>
			<view class="activity-items">
				<view class="amount-row">
					<image class="amount-row-icon" src="/static/my/funds-c.png" mode="aspectFit"></image>
					<view class="amount-content">
						<view class="income-amount">+{{ sum_add_money }}</view>
						<view class="amount-label">本月收入（含收益/充值）</view>
					</view>
				</view>
				<view class="amount-row">
					<image class="amount-row-icon1" src="/static/my/funds-m.png" mode="aspectFit"></image>
					<view class="amount-content">
						<view class="expense-amount">{{ sum_sub_money }}</view>
						<view class="amount-label">本月支出（提现/充值）</view>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 搜索和时间筛选 -->
		<view class="search-section">
			<view class="search-bar">
				<image class="search-icon" :src="$getStaticSrc('/static/my/search.png')" mode="aspectFit"></image>
				<input type="text" placeholder="搜索 备注/类别/流水号" v-model="searchKeyword" class="search-input"
					@input="seachKey" />
			</view>
			<view class="time-filter" @click="showFilterOptions = !showFilterOptions">
				<text class="filter-label" :class="{ 'active': showFilterOptions === true }">{{ currentFilter }}</text>
				<image class="filter-icon" :src="$getStaticSrc('/static/my/dowm-more.png')" mode="aspectFit"></image>
				<view class="filter-options" v-if="showFilterOptions">
					<view class="filter-label" v-for="(item, index) in filter" :key="index"
						:class="{ 'active': currentFilter === item }" @click.stop="selectFilter(item)">
						{{ item.name }}
					</view>
				</view>
			</view>
		</view>

		<!-- 日期选择器 -->
		<view class="date-picker-section">
			<view class="date-picker-btn">
				<picker mode="date" :value="dateRange.startDate" @change="bindStartDateChange">
					<view class="date-picker-picker">
						<view class="uni-input">{{ dateRange.startDate ? dateRange.startDate : '年/月/日' }}</view>
						<image class="calendar-icon" :src="$getStaticSrc('/static/my/date.png')" mode="aspectFit"></image>
					</view>
				</picker>
			</view>
			<text class="date-separator">至</text>

			<view class="date-picker-btn">
				<picker mode="date" :value="dateRange.endDate" @change="bindEndDateChange">
					<view class="date-picker-picker">
						<view class="uni-input">{{ dateRange.endDate ? dateRange.endDate : '年/月/日' }}</view>
						<image class="calendar-icon" :src="$getStaticSrc('/static/my/date.png')" mode="aspectFit"></image>
					</view>
				</picker>
			</view>
		</view>

		<!-- 交易类型图标 -->
		<view class="transaction-type-icons">
			<view class="icon-item">
				<image class="icon" :src="$getStaticSrc('/static/my/out.png')" mode="aspectFit"></image>
				<text class="icon-label">入账 (+)</text>
			</view>
			<view class="icon-item">
				<image class="icon" :src="$getStaticSrc('/static/my/in.png')" mode="aspectFit"></image>
				<text class="icon-label">出账 (-)</text>
			</view>
		</view>

		<!-- 交易列表 -->
		<view class="transaction-list">
			<!-- 收益结算记录 -->
			<view class="transaction-item" v-for="(item, index) in log" :key="index">
				<view class="transaction-icon">
					<image v-if="item.trans_type == 'other'" :src="$getStaticSrc('/static/my/settlement.png')" mode="aspectFit"></image>
					<image v-else-if="item.trans_type == 'invest'" :src="$getStaticSrc('/static/my/card-b.png')" mode="aspectFit"></image>
					<image v-else-if="item.trans_type == 'cost'" :src="$getStaticSrc('/static/my/funds.png')" mode="aspectFit"></image>
					<image v-else-if="item.trans_type == 'item'" :src="$getStaticSrc('/static/my/fee.png')" mode="aspectFit"></image>
				</view>
				<view class="transaction-content">
					<view class="transaction-title-row">
						<text class="transaction-title">{{ item.title }}</text>
						<text class="transaction-tag">{{ item.type_name }}</text>
					</view>
					<text class="transaction-detail">{{ item.addtime_date }}</text>
					<text class="transaction-detail">{{ item.stype_name }}</text>
				</view>
				<view class="transaction-amount">
					<text class="amount positive" v-if="item.money > 0">{{ item.money }}</text>
					<text class="amount negative" v-else>{{ item.money }}</text>
					<text class="balance">余额：{{ item.after_money }}</text>
					<text class="status success" v-if="item.status == 'Y'">{{ item.status_name }}</text>
					<text class="status remark" v-else>{{ item.status_name }}</text>
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
		<!-- 移除分页组件 -->
	</view>
</template>

<script>
export default {
	data() {
		const currentDate = this.getDate({
			format: true
		})
		return {
			// 分页相关数据
			currentPage: 1,
			pageSize: 10,
			hasMore: true,
			isLoading: false,
			// 移除分页相关数据
			transactions: [],
			filterType: 'item_earn',
			searchKeyword: '',
			dateRange: {
				startDate: '',
				endDate: ''
			},
			loading: false,
			list: [{
				name: '全部',
				label: 'all'
			},
			{
				name: '充值',
				label: 'invest'
			},
			{
				name: '提现',
				label: 'cost'
			},
			{
				name: '投资',
				label: 'item'
			},
			{
				name: '其他',
				label: 'other'
			}
			],
			tabs: 0,
			balance: 0,
			sum_add_money: 0,
			sum_sub_money: 0,
			log: [],
			showFilterOptions: false,
			filter: [{
				name: '时间倒序',
				id: 1
			},
			{
				name: '时间正序',
				id: 2
			},
			{
				name: '金额从大到小',
				id: 3
			}
			],
			currentFilter: '时间倒序',
			currentFilterIndex: 1
		};
	},
	onLoad() {
		// 初始化加载数据
		this.currentPage = 1; // 确保从第一页开始
		this.hasMore = true;
		this.loadProducts();
	},
	onUnload() {

	},
	onReachBottom() {
		// 触底加载更多
		if (this.hasMore && !this.isLoading) {
			this.loadProducts();
		}
	},
	methods: {
		bindStartDateChange: function (e) {
			this.dateRange.startDate = e.detail.value
			this.initLog();
		},
		bindEndDateChange: function (e) {
			if (!this.dateRange.startDate) {
				uni.showToast({
					title: '请先选择开始日期',
					icon: 'none'
				});
				return;
			}
			this.dateRange.endDate = e.detail.value;
			this.initLog();
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 10;
			} else if (type === 'end') {
				year = year + 10;
			}
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			return `${year}年/${month}月/${day}日`;
		},
		initLog() {
			this.log = [];
			this.currentPage = 1; // 修复变量名，使用currentPage而不是page_current
			this.hasMore = true; // 重置为可以加载更多
			this.loadProducts();
		},
		selectFilter(item) {
			console.log(item)
			this.currentFilter = item.name
			this.currentFilterIndex = item.id
			this.showFilterOptions = false
			this.initLog()
		},
		// 加载商品数据
		loadProducts() {
			// 防止重复加载或没有更多数据时继续加载
			if (this.isLoading || !this.hasMore) return;

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
			}, "GET").then(res => {
				// 请求成功
				if (res && res.data && res.data.list) {
					// 如果是第一页，直接替换数据；否则合并数据
					if (this.currentPage === 1) {
						this.log = res.data.list;
					} else {
						this.log = [...this.log, ...res.data.list];
					}

					// 更新统计数据
					if (res.data.balance !== undefined) {
						this.balance = res.data.balance;
					}
					if (res.data.sum_add_money !== undefined) {
						this.sum_add_money = res.data.sum_add_money;
					}
					if (res.data.sum_sub_money !== undefined) {
						this.sum_sub_money = res.data.sum_sub_money;
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
						this.log = [];
					}
				}

				// 无论成功失败，都要结束加载状态
				this.isLoading = false;

			}).catch(error => {
				// 错误处理
				console.error('加载资金记录失败:', error);
				this.isLoading = false;

				// 添加错误提示
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none'
				});
			});
		},
		// 切换筛选类型
		changeFilterType(type) {
			console.log('type', type)
			this.showFilterOptions = false
			this.filterType = type.label;
			this.initLog()
		},
		seachKey(e) {
			console.log('搜索', this.searchKeyword)
			this.initLog()
		},
		// 搜索交易记录
		searchTransactions() {
			this.showFilterOptions = false
			this.initLog()
		},

		// 切换日期范围
		changeDateRange() {
			this.showFilterOptions = false
			this.initLog()
		}

		// 移除分页相关方法
	}
};
</script>

<style lang="scss">
.funds-log-container {
	padding: 30rpx;
	background-color: #f5f5f5;
	min-height: 100vh;

	// 顶部净变动统计
	// 顶部净变动统计
	.net-change-section {
		color: white;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		position: relative;

		.section-row {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			height: 50rpx;
			margin-bottom: 20rpx;
			line-height: 50rpx;
		}

		.section-icon {
			position: absolute;
			width: 100%;
		}

		.section-title {
			font-size: 24rpx;
			color: #fff;
			text-align: center;
			position: relative;
			line-height: 50rpx;
			z-index: 1;
			margin: 0;
		}

		.activity-items {
			display: flex;
			justify-content: space-between;
			position: relative;
		}

		.amount-row {
			width: 48%;
			position: relative;
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.amount-row-icon,
		.amount-row-icon1 {
			position: absolute;
			width: 100%;
			height: 90rpx;
		}

		.amount-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			z-index: 1;
		}

		.income-amount,
		.expense-amount {
			color: #fff;
			font-size: 30rpx;
			font-weight: bold;
			margin-bottom: 5rpx;
		}

		.amount-label {
			font-size: 20rpx;
			opacity: 0.9;
			text-align: center;
			color: #fff;
		}
	}

	// 筛选选项
	.filter-section {
		width: 100%;
		border-radius: 16rpx;
		margin-bottom: 20rpx;

		.filter-tabs {
			display: flex;
			justify-content: space-between;

			.tab {
				width: 20vw;
				text-align: center;
				padding: 15rpx 20rpx;
				font-size: 24rpx;
				color: #a4a4a4;
				line-height: 30rpx;
			}

			.tab.active {
				color: #FF481C;
				line-height: 30rpx;
				font-size: 30rpx;
				border-bottom: 2rpx solid #FF481C;
			}
		}
	}

	// 搜索和时间筛选
	.search-section {
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.search-bar {
			display: flex;
			align-items: center;
			background-color: #fff;
			border-radius: 60rpx;
			padding: 0 20rpx;
			flex: 1;
			margin-right: 20rpx;
			height: 50rpx;

			.search-icon {
				width: 24rpx;
				height: 24rpx;
				font-size: 24rpx;
				margin-right: 10rpx;
				color: #999;
			}

			.search-input {
				height: 60rpx;
				font-size: 24rpx;
				background: none;
			}
		}

		.time-filter {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #666;
			height: 50rpx;
			background-color: #fff;
			border-radius: 60rpx;
			padding: 0 20rpx;
			width: 190rpx;
			justify-content: center;
			position: relative;

			.filter-icon {
				position: absolute;
				top: 20rpx;
				right: 17rpx;
				margin-left: 5rpx;
				font-size: 20rpx;
				width: 18.38rpx;
				height: 10rpx;
				margin-left: 30rpx;
			}

			.filter-options {
				position: absolute;
				top: 60rpx;
				left: 0;
				width: 100%;
				background-color: #fff;
				border-radius: 16rpx;
				box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
				padding: 10rpx 0;
				z-index: 1000;

				.filter-label {
					text-align: center;
					line-height: 50rpx;
					height: 50rpx;
					color: #A4A4A4;
				}

				.filter-label.active {
					// background-color: #f5f5f5;
					color: #D54E3A;
				}
			}
		}
	}

	// 日期选择器
	.date-picker-section {
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;

		.date-picker-btn {
			width: 320rpx;
			padding: 10rpx 32rpx;
			background-color: #fff;
			border-radius: 30rpx;
			color: #A4A4A4;
			font-size: 24rpx;
		}

		.date-picker-picker {
			width: 100%;
			display: flex !important;
			align-items: center !important;
			justify-content: space-between !important;
		}

		.uni-input {
			flex: 1;
			/* 让输入框占据剩余空间 */
			text-align: left;
		}

		.calendar-icon {
			width: 34rpx;
			height: 34rpx;
			font-size: 32rpx;
			margin-left: 10rpx;
		}

		.date-separator {
			font-size: 24rpx;
			color: #000000;
			font-weight: bold;
			padding: 0 13rpx;
		}
	}

	// 交易类型图标
	.transaction-type-icons {
		background-color: white;
		padding: 20rpx;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		display: flex;

		.icon-item {
			display: flex;
			align-items: center;
			margin-right: 30rpx;

			.icon {
				width: 20rpx;
				height: 20rpx;
				margin-right: 5rpx;
			}

			.icon-label {
				font-size: 24rpx;
				color: #666;
			}
		}
	}

	// 交易列表
	.transaction-list {
		margin-bottom: 20rpx;

		.transaction-item {
			background-color: white;
			padding: 20rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;

			.transaction-icon {
				width: 80rpx;
				height: 80rpx;
				background-color: #f5f5f5;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.transaction-content {
				flex: 1;

				.transaction-title-row {
					display: flex;
					align-items: center;
					margin-bottom: 8rpx;

					.transaction-title {
						font-size: 28rpx;
						color: #333;
						margin-right: 10rpx;
					}

					.transaction-subtitle {
						font-size: 24rpx;
						color: #999;
					}

					.transaction-tag {
						font-size: 24rpx;
						color: #993018;
						background-color: #FEEEE5;
						padding: 2rpx 10rpx;
						border-radius: 10rpx;
					}
				}

				.transaction-detail {
					display: block;
					font-size: 22rpx;
					color: #999;
					margin-bottom: 4rpx;
				}
			}

			.transaction-amount {
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				.amount {
					font-size: 30rpx;
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.amount.positive {
					color: #00C64B;
				}

				.amount.negative {
					color: #FF481C;
				}

				.balance {
					font-size: 20rpx;
					color: #999;
					margin-bottom: 4rpx;
				}

				.status {
					font-size: 22rpx;
					padding: 2rpx 15rpx;
					border-radius: 12rpx;
				}

				.status.success {
					text-align: center;
					width: 100rpx;
					height: 40rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: #09893A;
					background-color: #BCFFD5;
				}

				.status.failed {
					color: #e6a23c;
					background-color: #fdf6ec;
				}

				.status.remark {
					text-align: center;
					width: 210rpx;
					height: 40rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: #FF481C;
					background-color: #F3F3F3;
				}

				.failure-reason {
					font-size: 22rpx;
					color: #999;
					margin-top: 4rpx;
				}
			}
		}
	}

	// 移除分页组件样式
}
</style>