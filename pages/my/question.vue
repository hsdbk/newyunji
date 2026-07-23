<template>
	<view class="question-container">

		<!-- 问题列表 -->
		<view class="question-list">
			<!-- 问题项 -->
			<view class="question-item" v-for="(item, index) in questions" :key="index">
				<view class="question-header" @click="toggleAnswer(index)">
					<text class="question-text">{{ item.title }}</text>
					<up-icon :name="item.expanded ? 'arrow-up' : 'arrow-down'" size="20"></up-icon>
				</view>

				<!-- 答案内容 -->
				<view class="answer-content" v-if="item.expanded">
					<up-parse :content="$completeImageUrls(item.content)"></up-parse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				questions: [],
				type: 'question',
				id: 0
			}
		},
		onLoad(e) {
			this.type = e.type
			// 将id转换为数字类型，确保与数据中的id类型匹配
			this.id = e.id
			if (this.type == 'question') {
				uni.setNavigationBarTitle({
					title: '常见问题'
				});
				this.initFrequentlyAskedQuestions()

			} else if (this.type == 'rule') {
				uni.setNavigationBarTitle({
					title: '规则介绍'
				});
				this.initRuleQuestions()

			} else if (this.type == 'about') {
				uni.setNavigationBarTitle({
					title: '关于我们'
				});
				this.initAboutQuestions()

			} else if (this.type == 'hot') {
				uni.setNavigationBarTitle({
					title: '热门活动'
				});
				this.initHotQuestions()

			} else {
				uni.setNavigationBarTitle({
					title: '新手引导'
				});
				this.initGuide()

			}
		},
		methods: {
			initAboutQuestions() {
				// 编辑地址
				this.$http(
					'/article/aboutus/search', {
						// type:'frequently_asked_questions'
					}, "POST").then(res => {
					this.questions = res.data.list.map(item => ({
						...item,
						expanded: this.id && item.id === this.id
					}))
				})
			},
			initHotQuestions() {
				// 编辑地址
				this.$http(
					'/article/hotactive/search', {
						// type:'frequently_asked_questions'
					}, "POST").then(res => {
					this.questions = res.data.list.map(item => ({
						...item,
						expanded: this.id && item.id === this.id
					}))
				})
			},
			initRuleQuestions() {

				// 编辑地址
				this.$http(
					'/article/taskrule/search', {
						// type:'frequently_asked_questions'
					}, "POST").then(res => {
					this.questions = res.data.list.map(item => ({
						...item,
						expanded: this.id && item.id === this.id
					}))
				})
			},
			initFrequentlyAskedQuestions() {

				// 编辑地址
				this.$http(
					'/article/article/list', {
						type: 'frequently_asked_questions'
					}, "POST").then(res => {
					this.questions = res.data.map(item => ({
						...item,
						expanded: this.id && item.id === this.id
					}))
					console.log('questions', this.questions)
				})
			},
			initGuide() {
				// 编辑地址
				this.$http(
					'/article/article/list', {
						type: 'guide'
					}, "POST").then(res => {
					this.questions = res.data.map((item, index) => ({
						...item,
						expanded: this.id ? item.id === this.id : index === 0
					}))
				})
			},
			// 切换答案显示状态
			toggleAnswer(index) {
				// 获取当前问题的展开状态
				const currentExpanded = this.questions[index].expanded;

				// 关闭所有问题
				this.questions.forEach(question => {
					question.expanded = false;
				});

				// 如果当前问题之前是关闭的，则展开它；如果之前是展开的，则保持关闭
				this.questions[index].expanded = !currentExpanded;
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f5f5f5;
	}

	.question-container {
		padding-bottom: 30rpx;
	}

	.title {
		font-size: 28rpx;
		color: #000000;
		margin: 0 0 20rpx 24rpx;
		font-weight: bold;
	}

	.question-list {
		padding: 30rpx;
	}

	.question-item {
		background-color: #ffffff;
		border-radius: 35rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.question-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		font-size: 28rpx;
		color: #333333;
		border-radius: 35rpx;
	}

	.question-text {
		flex: 1;
		font-size: 28rpx;
		color: #D54E3A;
	}

	.answer-content {
		padding: 30rpx;
		font-size: 26rpx;
		color: #666666;
		line-height: 40rpx;
		background-color: #fff;
	}
</style>