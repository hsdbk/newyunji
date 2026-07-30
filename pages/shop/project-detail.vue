<template>
    <view class="project-detail">
        <!-- 项目图片展示区域 -->
        <view class="banner-container">
            <swiper class="banner-swiper" indicator-dots autoplay interval="3000">
                <swiper-item>
                    <image :src="detail.thumb?$baseUrl + detail.thumb:''" mode="aspectFill" class="banner-image"></image>
                </swiper-item>
            </swiper>
        </view>
        <!-- 项目信息区域 -->
        <view class="info-section">
            <view class="project-name">{{detail.name}}</view>
            <!-- <view class="project-details">
                <view class="detail-item">单份质押：{{detail.min_money}}元；最多{{detail.max_count}}份；周期{{detail.days}}天；预计剩余{{$formatSchedule(detail.schedule)}}%</view>
            </view> -->

            <!-- 标签区域 -->
            <view class="tags-section">
                <view class="tag-item primary">最低金额
                    <text class="tag-value">{{detail.min_money}}元</text>
                </view>
                <view class="tag-item secondary">每日分红
                    <text class="tag-value">{{detail.apr_money}}元</text>
                </view>
                <view class="tag-item tertiary">参与周期
                    <text class="tag-value">{{detail.days}}{{ detail.type=='C'?'天':detail.type=='A'?'天':detail.type=='B'?'天':detail.type=='H'?'小时':'天' }}</text>
                </view>
				<view class="tag-item tertiary">日收益率
				    <text class="tag-value">{{detail.apr}}%</text>
				</view>
            </view>

            <!-- 募集进度 -->
            <view class="progress-section">
                <view class="progress-header">
                    <text class="progress-title">参与进度</text>
                    <!-- <text class="progress-remaining">剩余份数: {{detail.rem_count}}份</text> -->
                    
                </view>
				<view class="product-progress">
					<view class="progress-bar">
						<view class="progress-fill" :style="{ width: detail.schedule + '%' }"></view>
					</view>
					<text class="progress-text">{{ detail.schedule }}%</text>
				</view>
                
                <!-- 平台保障 -->
                <view class="guarantee-section">
                    <!-- <view class="guarantee-tag first-tag">安全保障</view> -->
                    <view class="tag-row">
                        <view class="guarantee-tag">安全保障</view>
                        <view class="guarantee-tag">平台托管</view>
                        <view class="guarantee-tag">合规风控</view>
                    </view>
                </view>
            </view>

            
        </view>

        <!-- 标签页切换 -->
        <!-- 筛选选项 -->
		<up-tabs class="filter-section"  lineHeight="4rpx" :itemStyle="{ width: '20%', height: '80rpx' }"
		  :inactiveStyle="{ fontSize: '24rpx', color: '#a4a4a4' }" :activeStyle="{ fontSize: '30rpx',fontWeight: 'bold', color: '#FF481C' }" :list="list"
		   lineWidth="123rpx" lineColor="#FF481C" :current="tabs" @change="changeFilterType"></up-tabs>
        <!-- 项目概览 -->
        <view class="overview-section" >
            <view class="overview-content" v-if="tabs === 0">
				 <up-parse :content="$completeImageUrls(detail.brand_intro)"></up-parse>
            </view>
            <view class="overview-content" v-if="tabs === 1">
				<view class="table-container">
				  <view class="table-row table-header">
				    <view class="table-cell">项目名称</view>
				    <view class="table-cell">{{detail.name}}</view>
				  </view>
				  <view class="table-row">
				    <view class="table-cell">项目规模</view>
				    <view class="table-cell">{{ detail.money }}</view>
				  </view>
				  <view class="table-row">
				    <view class="table-cell">购买金额</view>
				    <view class="table-cell">最低起购{{ detail.min_money }}</view>
				  </view>
				  <view class="table-row">
				    <view class="table-cell">产品期限</view>
				    <view class="table-cell">{{ detail.days }}{{ detail.type=='C'?'天':detail.type=='A'?'天':detail.type=='B'?'天':detail.type=='H'?'小时':'天' }}</view>
				  </view>
				  <!-- <view class="table-row">
				    <view class="table-cell">收益计算</view>
				    <view class="table-cell">{{ detail.result_money }}</view>
				  </view> -->
				  <view class="table-row">
				    <view class="table-cell">返还方式</view>
				    <view class="table-cell">{{config.type[detail.type]}}</view>
				  </view>
				  <view class="table-row">
				    <view class="table-cell">计算时间</view>
				    <view class="table-cell">
						<view>项目采用 T+1计息结算方式(在T日(认购当日)成功认购的份额，将于T+1日(下一个自然日)的相同时间结算利息)。项目到期系统将自动返还本金。</view>
					</view>
				  </view>
				  <view class="table-row">
				    <view class="table-cell">可购金额</view>
				    <view class="table-cell">
						<view>项目发行期间未售罄，均可自由购买</view>
					</view>
				  </view>
				  <!-- <view class="table-row">
				    <view class="table-cell">安全保障</view>
				    <view class="table-cell cell-second">
						<view>{{ detail.contract_name3 }}</view>
						<view>对平台的每笔认购提供100%本金保障。</view>
						<view>平台设立风险备用金，对本金承诺全额垫付。</view>
						</view>
				  </view>
				  <view class="table-row">
				    <view class="table-cell">推荐奖励</view>
				    <view class="table-cell cell-second">
						<view>点击"我的-邀请好友"就可以复制您的专属邀请链接分享给好友</view>
						<view>1.一级奖励(2%):您直接邀请的好友成功投资，您将获得其每次投资金额的2%作为奖励。</view>
						<view>2.二级奖励(1%):您的好友(一级)邀请的新用户成功投资您将获得该新用户每次投资金额的1%作为奖励</view>
					</view>
				  </view> -->
				</view>
            </view>
            <view class="overview-content" v-if="tabs === 2">
               <up-parse :content="$completeImageUrls(detail.pledge_contract)"></up-parse>
            </view>
        </view>

        <!-- 底部购买区域 -->
        <view class="bottom-section">
            <view class="price-section">
                <view>
					<view class="price-label">最低认购金额</view>
					<view class="price-value">¥{{detail.min_money}}</view>
				</view>
				<view class="coupon-section" v-if="usecouponChange">
					<image :src="$getStaticSrc('/static/recommend/sub.png')" mode="aspectFill" class="coupon-btn" @click="unusedCoupon"></image>
					<view class="price-label" style="font-size: 18rpx;">优惠金额</view>
					<view class="price-value" style="font-size: 24rpx;">¥{{ticketsInfo.money}}</view>
				</view>
            </view>
            <view class="join-section">
				<!-- <view class="quantity-section"> -->
					<!-- <input type="number" class="price-input" placeholder="请输入投资金额"> -->
					<!-- <up-input class="price-input" placeholderStyle="{ color: '#A4A4A4' }" v-model="price" placeholder="请输入投资金额" /> -->
					<!-- <image src="/static/recommend/sub.png" mode="aspectFill" class="quantity-btn" @click="decreaseQuantity"></image>
				    <view class="quantity-value">{{ quantity }}</view>
					<image src="/static/recommend/add.png" mode="aspectFill" class="quantity-btn" @click="increaseQuantity"></image> -->
				<!-- </view> -->
				<view class="buy-btn" @click="handleBuy">立即参与</view>
			</view>
        </view>
		<up-popup :show="priceShow" mode="bottom" @close="priceShow = false" :closeable="true">
		    <view class="bottom-content">
		        <up-form class="form" :model="formData">
		            <up-form-item borderBottom="true" label="金额" prop="name" labelWidth="190rpx">
		                <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.price"
		                    placeholder="输入购买金额" />
		            </up-form-item>
					<!-- <up-form-item borderBottom="true" label="选择钱包" prop="typeShow" labelWidth="190rpx" @click="openProvincePicker">
					    <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.typeShow"
					        placeholder="请选择钱包" />
							
					    <template #right>
					    	<image  :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
					    </template>
					</up-form-item> -->
		        </up-form>
				<view class="sign-actions">
				    <up-button type="primary" class="buy-popup-button" @click="confirmSubmit">确认购买</up-button>
				</view>
		    </view>
		</up-popup>
        <up-popup :show="buyShow" mode="center" @close="buyShow = false" :closeable="true">
		    <view class="sign-popup-center">
		        <image class="vip-icon" src="/static/game/buy.png" mode="aspectFit"></image>
		        <view class="sign-popup-content" style="margin-top:20rpx;margin-bottom:40rpx;width:224rpx;">恭喜您认购成功</view>
		        <view class="sign-actions">
		            <up-button type="primary" class="sign-popup-button">确认</up-button>
		        </view>
		    </view>
		</up-popup>
        <up-popup :show="payshow" :round="10" mode="center" :closeable="true" @close="this.payshow = false">
            <view class="pay-content">
                <view class="pay-content-title">请输入支付密码</view>
                <view class="pay-message-content">
                    <up-code-input :dot="true" :adjustPosition="true" v-model="password"></up-code-input>
                </view>
                <view class="pay-content-withdraw" @click="forgetPass">忘记密码？</view>
                <view class="sign-actions">
		            <up-button type="primary" class="sign-popup-button" @click="confirmBuy">确认支付</up-button>
		        </view>
            </view>
        </up-popup>
		<up-popup :show="couponshow" :round="10" mode="center" :closeable="true" @close="closeCouponList">
		    <view class="pay-content">
		        <view class="pay-content-title" style="margin-bottom: 20rpx;">优惠券</view>
		        <view class="coupon-item unuse-back" v-for="coupon in availableCoupons" :key="coupon.type">
		        		<view class="coupon-item-label">
							<!-- 1 代金券；2 抵用券，3: 红包券 -->
		        			<view class="rule-label-left label-plat" style="color:#F64A2F;">{{coupon.type==1?'代金券':coupon.type==2?'抵用券':'红包券'}}</view>
		        		</view>
		          <view class="coupon-content">
		        			<view class="coupon-header">
		        				<!-- <view class="coupon-header-title">免邮</view> -->
		        				<view class="coupon-header-type">单笔订单</view>
		        			</view>
		            <view class="coupon-body">
		              <view class="coupon-title">
		        				<text class="coupon-type">{{coupon.title}}</text>
		        				<view class="rule-label" v-if="coupon.useType === 'all'">
		        					<image class="rule-label-button" src="/static/recommend/coupon/label.png" mode="scaleToFill"/>
		        					<text>全场通用</text>
		        				</view>
		        				<view class="rule-place" v-if="coupon.useType === 'partial'">
		        					<image class="rule-place-button" src="/static/recommend/coupon/label-place.png" mode="scaleToFill"/>
		        					<text>部分偏远地区除外</text>
		        				</view>
		        			</view>
		        			<view class="coupon-desc">
		        				<view>券面额：{{coupon.money}} 元</view>
		        				<view>适用：满 {{coupon.use_limit}} 元可用</view>
		        				<view>过期时间：{{coupon.expire_date}}</view>
		        			</view>
		            </view>
		            <view class="coupon-footer">
		        			<button class="use-button" @click="useCoupon(coupon)">使用</button>
		        		</view>
		          </view>
		          
		        </view>
		    </view>
		</up-popup>
		<up-picker ref="picker" :show="pickerShow" keyName="name" :columns="typeMethods" @confirm="selectProvince"
			@cancel="closeProvincePicker" @close="closeProvincePicker"></up-picker>
    </view>
</template>

<script>
	import { mapState } from 'vuex'
export default {
    data() {
        return {
			formData:{
				price:'',
				type:'money',
				typeShow:'余额钱包',
			},
			id:'',
			typeMethods:[[{
				'type':'money',
				'name':'余额钱包'
			},{
				'type':'coin',
				'name':'金币钱包'
			}]],
            quantity: 1,
			price:'',
			detail:{},
			config:{},
            list: [
			  { name: '项目介绍' },
			  { name: '收益规则' },
			  // { name: '质押合同' }
			],
			tabs: 0,
            buyShow:false,
            payshow:false,
			couponshow:false,
			priceShow:false,
            password: '',
			coupons: [],
			usecouponChange:false,
			tickets_id:0,
			ticketsInfo:{},
			pickerShow:false
        };
    },
	computed: {
		...mapState(['isAuth']),
		// 根据输入金额过滤可用优惠券
		availableCoupons() {
			const price = parseFloat(this.formData.price) || 0
			if (!this.detail.tickets || this.detail.tickets.length === 0) {
				return []
			}
			return this.detail.tickets.filter(coupon => {
				const useLimit = parseFloat(coupon.use_limit) || 0
				return price >= useLimit
			})
		}
	},
	onLoad(e) {
		this.id = e.id
		
		// 初始化加载数据
		this.initProducts();
	},
	onShow() {
		// #ifdef APP
		plus.navigator.setFullscreen(true);
		// #endif
	},
    methods: {
		// 打开省份选择器
		openProvincePicker() {
			this.pickerShow = true
		},
		// 关闭省份选择器
		closeProvincePicker() {
			this.pickerShow = false
		},
		// 选择省份
		selectProvince(e) {
			// e为选中的值，直接使用
			const selectedProvince = e.value[0];
			console.log(e.value[0].type)
			this.formData.typeShow = selectedProvince.name;
			this.formData.type = selectedProvince.type;
			this.closeProvincePicker();
		},
        handleBack() {
            // 返回上一页
            uni.navigateBack({
                delta: 1
            });
        },
		// 加载商品数据
		initProducts() {
			// 编辑地址
			this.$http(
				'/item/dq/view', {
					id:this.id
				}, "GET").then(res => {
				this.detail = res.data.view;
				
				this.config = res.data.config;
				console.log('config',this.config.type[this.detail.type])
			})
		},
       // 切换筛选类型
		changeFilterType(e) {
		  console.log(e.index)
		  this.tabs = e.index
		},
        increaseQuantity() {
            // 限制最多10份
            if (this.quantity < 10) {
                this.quantity++;
            }
        },
        decreaseQuantity() {
            // 限制最少1份
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
		useCoupon(e){
			console.log('11',e)
			this.couponshow = false
			this.usecouponChange = true
			this.ticketsInfo = e
			this.tickets_id = e.id
			
			this.payshow = true
		},
		unusedCoupon(){
			this.usecouponChange = false
			this.ticketsInfo = {}
			this.tickets_id = 0
		},
		closeCouponList(){
			this.couponshow = false
			this.usecouponChange = false
			this.payshow = true
		},
		forgetPass(){
			uni.navigateTo({ url: '/pages/my/settings/settings-password?type=3' })
		},
        handleBuy() {
			if(!this.isAuth){
				
				// 使用优惠券的逻辑
				uni.showToast({
					title: '请先完成实名认证',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({ url: `/pages/my/settings/settings-password?type=1` });
				}, 3000);
				return false;
			}
			this.priceShow = true
			
            // // 处理购买逻辑
            // uni.showToast({
            //     title: '参与成功',
            //     icon: 'success'
            // });
        },
		confirmBuy(){
			if(!this.password){
				uni.showToast({
				    title: '请输入密码~',
				    icon: 'success'
				});
			}
			// 编辑地址
			this.$http(
				'/item/dq/apply', {
					id:this.id,
					money:this.formData.price,
					passwd:this.password,
					tickets_id:this.tickets_id,
					type:this.formData.type
				}, "POST").then(res => {
					this.formData.price = ''
					this.password = ''
					uni.showToast({
						title: '购买成功~',
						icon: 'success'
					});
					setTimeout(() => {
						this.payshow = false
					}, 3000)
				
			})
		},
		confirmSubmit(){
			// 验证是否输入金额
			if(!this.formData.price || parseFloat(this.formData.price) <= 0){
				uni.showToast({
					title: '请输入金额',
					icon: 'none'
				})
				// 保持弹窗打开
				return false
			}
			
			// 验证最低金额
			const price = parseFloat(this.formData.price)
			const minMoney = parseFloat(this.detail.min_money) || 0
			if(price < minMoney){
				uni.showToast({
					title: '金额不能低于最低金额',
					icon: 'none'
				})
				// 保持弹窗打开
				return false
			}
			
			this.priceShow = false
			console.log('price',this.formData.price)
			// 只有当有可用优惠券时才显示优惠券弹窗
			if(this.availableCoupons.length > 0){
				this.couponshow = true
				return false;
			}
			this.payshow = true
		}
    }
};
</script>

<style scoped>
	.right-icon {
		  width:12rpx;
		  height: 24rpx;
		}
	.table-container {
	  border: 1px solid #e0e0e0;
	  border-radius: 4px;
	  overflow: hidden;
	}
	
	.table-row {
	  display: flex;
	  border-bottom: 1px solid #e0e0e0;
	}
	
	.table-row:last-child {
	  border-bottom: none;
	}
	
	.table-header {
	  background-color: #f5f5f5;
	  font-weight: 500;
	}
	
	.table-cell {
	    flex: 1;
		padding: 12px 8px;
		border-right: 1px solid #e0e0e0;
		word-break: break-all;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cell-second{
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: left;
		line-height: 1.5;

	}
	
	.table-cell:last-child {
	  border-right: none;
	  text-align: left;
	  color: #666666;
	}
.project-detail {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}


/* 项目图片展示区域 */
.banner-container {
	padding:20rpx 30rpx 0;
    position: relative;
	border-radius: 10rpx;
}

.banner-swiper {
    width: 100%;
	height: 350rpx;
}

.banner-image {
    width: 100%;
    height: 100%;
	border-radius: 10rpx;
}

.banner-text {
    position: absolute;
    top: 50%;
    left: 20rpx;
    transform: translateY(-50%);
    color: #fff;
}

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

/* 项目信息区域 */
.info-section {
    padding: 16px;
}

.project-name {
    font-size: 30rpx;
    font-weight: 800;
    color: #000;
    margin-bottom: 12px;
}

.project-details {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.detail-item {
    margin-right: 16px;
    margin-bottom: 8px;
    font-size: 24rpx;
    color:#979696;
}

.detail-label {
    color: #666;
}

.detail-value {
    color: #333;
    font-weight: 500;
}

/* 标签区域 */
.tags-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.tag-item {
    flex: 1;
    padding: 10px;
    border-radius: 30px;
    text-align: center;
    font-size: 24rpx;
    color: #fff;
    margin: 0 4px;
}

.tag-item.primary {
    background-image: url('/static/recommend/1.png');
		background-size: 100% 100%;
}

.tag-item.secondary {
    background-image: url('/static/recommend/2.png');
		background-size: 100% 100%;
}

.tag-item.tertiary {
    background-image: url('/static/recommend/3.png');
		background-size: 100% 100%;
}

.tag-value {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    margin-top: 4px;
}

/* 募集进度 */
.progress-section {
    margin-bottom: 16px;
    background-color: #fff;
    padding:28rpx;
    border-radius: 30rpx;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.progress-title {
    font-size: 24rpx;
    color: #979696;
}

.progress-remaining {
    font-size: 24rpx;
    color: #000000;
    font-weight: 800;
}

.progress-bar {
	width:100%;
	flex:1;
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background-color: #fe8046;
    border-radius: 4px;
}

/* 平台保障 */
.guarantee-section {
    margin-top:20rpx;
}

.guarantee-tag {
    display: inline-block;
    padding: 6px 12px;
    background-color: #FEEEE5;
    color: #993018;
    border-radius: 16px;
    font-size: 24rpx;
    margin-right: 10rpx;
    margin-bottom: 10rpx;
}
.tag-row {
    display: flex;
    gap: 10rpx;
}

/* 项目概览 */
.overview-section {
    padding: 16px;
	margin-bottom: 150rpx;
}

.overview-content {
    padding: 24rpx;
    font-size: 14px;
    color: #666;
    background-color: #fff;
    line-height: 1.8;
    border-radius: 30rpx;
}

/* 底部购买区域 */
.bottom-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
	justify-content: space-between;
    padding: 12px 16px;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
}

.price-section {
    display: flex;
	align-items: center;
	
}
.coupon-section{
	margin-left: 20rpx;
	position: relative;
}
.join-section{
	display: flex;
	align-items: center;
}
.price-label {
    font-size: 24rpx;
    color: #A4A4A4;
}
.coupon-btn{
	width:24rpx;
	height:24rpx;
	position: absolute;
	top:-20rpx;
	right:-20rpx;
}
.price-value {
    font-size: 36rpx;
    font-weight: 600;
    color: #ff4d4f;
}

.quantity-section {
    display: flex;
    align-items: center;
    margin: 0 20px;
}

.quantity-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-value {
    margin: 0 16px;
    font-size: 36rpx;
    color: #333;
    min-width: 20px;
    text-align: center;
}

.buy-btn {
    width:200rpx;
    height:70rpx;
    background-color: #000;
    color: #fff;
    border-radius: 20px;
    font-size: 24rpx;
    font-weight: 500;
    line-height: 70rpx;
    text-align: center;
}
.sign-popup-center {
	    background-color: #ffffff;
	    border-radius: 16rpx;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
		width:620rpx;
	}
    .sign-popup-content {
	    font-size: 30rpx;
	    color: #000000;
		font-weight: bold;
	    margin-top: 40rpx;
	}
    .sign-actions {
		display: flex;
		justify-content: space-between;
	}
    .sign-popup-button {
	    width: 400rpx !important;
	    height: 70rpx !important;
	    line-height: 70rpx !important;
	    background-color: #000 !important;
	    color: #ffffff !important;
	    border: none !important;
	    border-radius: 35rpx !important;
	    font-size: 26rpx !important;
	    margin-top: 60rpx;
	    margin-bottom: 30rpx;
	}
    .vip-icon{
		width:300rpx;
		height:234rpx;
		margin-top: 48rpx;
	}
    .pay-content{
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    font-size: 30rpx;
    color: #000000;
    
}
.pay-content-title{
    margin-top: 44rpx;
    font-weight: 800;
}
.pay-content-pay{
    margin-bottom: 40rpx;
}
.pay-content-withdraw{
    font-size: 24rpx;
    text-align: right;
    padding:0 30rpx;
}
.pay-content-price{
    font-size: 48rpx;
    font-weight: 800;
}
.pay-message-content{
    padding:104rpx 44rpx 20rpx;
}


.coupon-item {
	width:580rpx;
	position: relative;
    border-radius: 30rpx 30rpx 30rpx 30rpx;
	background: #fff;
	color:#000;
	margin:0 20rpx 20rpx;
  }
  .unuse-back{
	  background-image: url('/static/recommend/coupon-back.png');
	  background-size: 100% 100%;
  }
  
  .coupon-item-label{
	position: absolute;
	top: 0;
	left: 0;
  }
  .coupon-label {
	position: absolute;
	top: 0;
	left: 0;
	width: 110rpx;
	height: 40rpx;
	margin-bottom: 20rpx;
  }
  .scope-button{
	width: 110rpx;
	height: 40rpx;
	background-color: transparent;
	border-radius: 30rpx;
	border: 1rpx solid #FFFFFF;
	font-family: OPPOSans, OPPOSans;
	font-weight: normal;
	font-size: 24rpx;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
	text-transform: none;
	line-height: 40rpx;
	margin-right: 10rpx;
	}
.rule {
  width: 110rpx;
  height: 40rpx;
  background-color: transparent;
  border-radius: 30rpx;
  border:1rpx solid #fff;
  font-size: 24rpx;
  text-align: center;
  line-height: 40rpx;
  color:#fff;
}
.unuse{
	background: #FEEEE5;
	color:#993018;
}
.used{
	background: #F3F3F3;
	color:#A4A4A4;
}
/* 左上角标签 */
.rule-label-left {
  width: 110rpx;
  height: 40rpx;
  background-color: transparent;
  border-radius: 20rpx 0rpx 20rpx 0rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  position: relative;
  color: #FFFFFF;
  font-size: 20rpx;
  text-align: center;
  line-height: 40rpx;
}
.label-new{
	background-image: url('/static/recommend/coupon/label-new.png');
	background-size: 100% 100%;
}
.label-plat{
	background-image: url('/static/recommend/coupon/label-plat.png');
	background-size: 100% 100%;
}
.label-quie{
	background-image: url('/static/recommend/coupon/label-quie.png');
	background-size: 100% 100%;
}
.label-red{
	background-image: url('/static/recommend/coupon/label-red.png');
	background-size: 100% 100%;
	width:150rpx;
}
.rule-label-left text {
  color: #FFFFFF;
  font-size: 20rpx;
  font-weight: normal;
  position: absolute;
  z-index: 1;
}

.rule-label-left-button {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

  .use-button {
	margin:0;
	margin-top: 20rpx;
    width: 130rpx;
	height: 50rpx;
	background: #FFFFFF;
	border-radius: 25rpx 25rpx 25rpx 25rpx;
	font-family: OPPOSans, OPPOSans;
	font-weight: normal;
	font-size: 24rpx;
	color: #FB6941;
	text-align: center;
	font-style: normal;
	text-transform: none;
	line-height: 50rpx;
	padding:0;
	
  }
  .coupon-content{
	display: flex;
	justify-content: space-between;
	padding-top: 20rpx;
	padding-bottom: 15rpx;
  }
  .coupon-header{
	width:30vw;
	
  }
  .coupon-header-title{
	padding-top: 34rpx;
	font-size: 36rpx;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
  }
  .coupon-header-type{
	  padding-top: 34rpx;
	font-size: 24rpx;
	color: #FFFFFF;
	text-align: center;
	font-style: normal;
  }
  .coupon-body{
	width:40vw;
	margin-left: 20rpx;
  }
  .coupon-title{
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 20rpx;
	
  }
  .coupon-title text{
	font-size: 30rpx;
	color: #FFFFFF;
	text-align: left;
	font-weight: bold;
  }
  .coupon-desc{
	width:45vw;
	font-size: 20rpx;
	color: #FFFFFF;
	text-align: left;
	margin-bottom: 15rpx;

  }
  .coupon-footer{
	display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    height: 100%;
	width: 30vw;
	padding:0 20rpx 0 0;
  }
  /* 全程通用 */
  .rule-label{
  	width: 120rpx;
  	height: 30rpx;
  	background-color: transparent;
  	border-radius: 15rpx;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  	margin-right: 20rpx;
  	position: relative;
  }
  .rule-label-button{
  	width: 100%;
  	height: 100%;
  	position: absolute;
  	top: 0;
  	left: 0;
  }
  .rule-label text{
  	color: #FFFFFF;
  	font-size: 20rpx;
  	font-weight: normal;
  	position: absolute;
  	z-index: 1;
  }
  /* 部分偏远地区除外 */
  .rule-place{
  	width: 200rpx;
  	height: 30rpx;
  	background-color: transparent;
  	border-radius: 15rpx;
  	display: flex;
  	align-items: center;
  	justify-content: center;
  	position: relative;
  }
  .rule-place-button{
  	width: 100%;
  	height: 100%;
  	position: absolute;
  	top: 0;
  	left: 0;
  }
  .rule-place text{
  	color: #FFFFFF;
  	font-size: 20rpx;
  	font-weight: normal;
  	position: absolute;
  	z-index: 1;
  }
    /* 温馨提示 */
    .tip {
      padding: 20rpx 30rpx;
      font-size: 20rpx;
      color: #999;
      text-align: center;
    }
    
    /* 底部功能区 */
    .bottom-functions {
  	position: fixed;
  	bottom: 0;
  	left: 0;
  	right: 0;
  	width: 100vw;
  	display: flex;
  	padding: 20rpx 30rpx;
  	background-color: #fff;
  	/* 移除margin-top，固定定位时无效 */
  	box-sizing: border-box; /* 确保宽度计算包含内边距 */
  	z-index: 999; /* 确保显示在其他内容之上 */
  	border-top: 1px solid #f0f0f0; /* 添加顶部边框，与主内容区分 */
  	}
  	
    .function-button {
      width:227rpx;
  	
      height: 70rpx;
      background-color: #ffffff;
      color: #000000;
      border-radius: 35rpx;
      font-size: 24rpx;
  	line-height: 70rpx;
      margin-right: 10rpx;
  	border:1rpx solid #000000;
    }
    .function-button-two{
  	width:227rpx;
  	
      height: 70rpx;
      background-color: #000;
      color: #fff;
      border-radius: 35rpx;
      font-size: 24rpx;
  	line-height: 70rpx;
  	border:1rpx solid #000000;
  	margin-right: 10rpx;
    }
    .function-button.primary {
  	width:240rpx;
  	margin-right:0;
      background-color: #000;
      color: #fff;
    }
    .tips {
    	position: absolute;
    	left: 50%;
    	transform: translateX(-50%);
    	top: 40%;
    	width: 429rpx;
    	height: 100rpx;
    	line-height: 100rpx;
    	font-size: 28rpx;
    	color: #9B361F;
    	border-radius: 40rpx;
    	background-color: #FEEEE5;
    	text-align: center;
    	box-shadow: 0 4rpx 6rpx rgba(0, 0, 0, 0.3);
    	z-index: 99999;
    }
    .bottom-content {
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	flex-direction: column;
    	text-align: center;
    	font-size: 30rpx;
    	color: #000000;
    	padding: 25rpx 50rpx;
    }
    
    .bottom-title {
    	font-size: 28rpx;
    	font-weight: bold;
    	text-align: left;
    	margin-top: 20rpx;
    	width: 100%;
    	padding-bottom: 20rpx;
    }
    
    .bottom-grid {
    	display: flex;
    	justify-content: space-around;
    	width: 100%;
    }
    
    .poster-btn {
    	border-radius: 35rpx;
    	width: 500rpx;
    	height: 70rpx;
    	text-align: center;
    	line-height: 70rpx;
    	border: 1rpx solid #000;
    	margin: 0 5rpx;
    	font-size: 24rpx;
    	background-color: #000;
    	color: #fff;
    }
    .form {
  	  width:88%;
        background-color: #fff;
        border-radius: 30rpx;
        padding: 0 33rpx 20rpx;
        position: relative;
    }
    .tips-title{
  	  color:#979696;
  	  font-size: 20rpx;
  	  padding:0;
  	  margin-top:20rpx;
  	  text-align: left;
    }
    .unused-font-color{
    	  color:#000;
    }
	.price-input{
		width:20vw;
	}
	.buy-popup-button {
		width: 500rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
		background-color: #000 !important;
		color: #ffffff !important;
		border: none !important;
		border-radius: 35rpx !important;
		font-size: 26rpx !important;
	}
	.product-progress{
		width:100%;
	}
	.progress-text{
		margin-left: 10rpx;
	}
</style>