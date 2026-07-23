<template>
	<view>
		<!-- 小贴士 -->
		<view class="tips-section">
			<!-- <view class="label" v-if="type == 'privacy'">快速导航</view>	
			<view class="tab-nav" v-if="type == 'privacy'">
			  <view class="tab-row">
				<view
				  v-for="(item, index) in navItems"
				  :key="index"
				  class="tab-item"
				  :class="{ active: currentIndex === index }"
				  @click="switchTab(index)"
				>
				  {{ item }}
				</view>
			  </view>
			</view> -->
		    <!-- <text class="section-title" style="text-align: center;">{{title}}</text> -->
			<view class="label"></view>	
		    <view class="tips-content">
		        <up-parse :content="$completeImageUrls(content)"></up-parse>
		    </view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
    data() {
        return {
            type: '',
            id: '',
            title: '',
            content: '',
			navItems: [],
        }
    },
	computed: {
		...mapState(['userInfo', 'isLoggedIn','isAuth','config'])
	},
	onLoad(e) {
		this.$store.dispatch('getConfig');
		this.type = e.type
		this.id = e.id
		
	},
	onShow() {
		if(this.type == 'terms'){
			this.initTermsOfService('terms_of_service')
		}else if(this.type == 'about'){
			this.initTermsOfService('about')
		}else if(this.type == 'zzf'){
			this.initTermsOfService('zzf')
		}else if(this.type == 'auth'){
			uni.setNavigationBarTitle({
				title: '应用权限'
			});
			this.title = '应用权限'
			this.content = this.config.index_gonglue
		}else if(this.type == 'privacy'){
			this.initPrivacyPolicy()
		}else if(this.type == 'frequently'){
			this.initFrequentlyAskedQuestions()
		}else if(this.type == 'tianqi'){
			this.initTianqiService()
		}else if(this.type == 'detail'){
			this.initDetailService()
		}
	},
    methods: {
		initDetailService(t){
			// 编辑地址
			this.$http(
				'/article/hotactive/detail', {
					id:this.id
				}, "POST").then(res => {
					console.log('tianqi',res)
					uni.setNavigationBarTitle({
						title: res.data.title
					});
		            this.title = res.data.title
		            this.content = res.data.content
			})
		},
		initTianqiService(t){
        	// 编辑地址
        	this.$http(
        		'/article/tianqi/detail', {
					id:this.id
				}, "POST").then(res => {
					console.log('tianqi',res)
					uni.setNavigationBarTitle({
						title: res.data.title
					});
                    this.title = res.data.title
                    this.content = res.data.content
        	})
        },
        initTermsOfService(t){
        	// 编辑地址
        	this.$http(
        		'/article/article/detail', {
					type:t
				}, "POST").then(res => {
					uni.setNavigationBarTitle({
						title: res.data.title
					});
                    this.title = res.data.title
                    this.content = res.data.content
        	})
        },
		initPrivacyPolicy(){
			// 编辑地址
			this.$http(
				'/article/article/privacyPolicy', {}, "POST").then(res => {
					uni.setNavigationBarTitle({
						title: res.data.title
					});
		            this.title = res.data.title
		            this.content = res.data.content
		            this.navItems = res.data.keywords
			})
		},
		
    }
}
</script>

<style>
/* 标签导航样式 */
.tab-nav {
  background-color: #ffffff;
  margin-bottom: 20rpx;
}

.tab-row {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
}

.tab-item {
  flex: 0 0 auto;
  padding: 15rpx 30rpx;
  margin: 10rpx;
  font-size: 26rpx;
  color: #993018;
  background-color: #FEEEE5;
  border-radius: 25rpx;
  text-align: center;
}

.tab-item.active {
  color: #ffffff;
  background-color: #ff9800;
}
.label{
	font-size: 28rpx;
	color: #000000;
	font-weight: bold;
}
	/* 小贴士 */
	.tips-section {
	    padding: 30rpx;
	    border-radius: 10rpx;
	}
	
	.tips-title {
	    font-size: 26rpx;
	    font-weight: 500;
	    color: #ff9800;
	    margin-bottom: 10rpx;
	    display: block;
	}
	
	.tips-content {
	    font-size: 24rpx;
	    color: #000000;
	    line-height: 36rpx;
	}
</style>