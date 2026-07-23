<template>
    <view class="project-detail">
        <!-- 顶部导航栏 -->
        <up-navbar title="礼品详情" bgColor="transparent" :left-show="true" :right-show="false"
            @leftClick="handleBack"></up-navbar>

        <!-- 项目图片展示区域 -->
        <view class="banner-container">
            <swiper class="banner-swiper" indicator-dots autoplay interval="3000">
                <swiper-item v-for="(items,index) in detail.thumbs" :key="index">
                    <image :src="$baseUrl + items" mode="aspectFill" class="banner-image"></image>
                </swiper-item>
            </swiper>
        </view>
        <!-- 项目信息区域 -->
        <view class="info-section">
            <view class="project-name">{{detail.title}}</view>
            <view class="project-details">
                <view class="coin-pool-bg">
                    <image class="coin-pool-icon" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
                    <!-- <view class="detail-title">￥{{$formatPrice(detail.gold,1,2)}}</view> -->
                    <view class="detail-title">{{config.review_mode!=1?'':'￥'}}{{$formatPrice(detail.gold,1,0)}}<!-- {{config.review_mode!=1?'积分':''}} --></view>
                </view>
				<!-- 限购隐藏 -->
                <view class="detail-item" v-if="detail.user_max_shop_num!=0 && config.review_mode!=1">(限购{{detail.user_max_shop_num}}件/人)</view>
            </view>
			
			<!-- 平台保障 -->
			<view class="guarantee-section">
			    <view class="guarantee-tag guarantee-tag-active" >包邮到家</view>
			    <!-- <view class="guarantee-tag">好评率:{{detail.good_rating}}</view> -->
			    <view class="guarantee-tag">销量:{{detail.sold_count}}</view>
			</view>
			<view class="progress-section">
				<view>购买数量</view>
			    <view class="quantity-section">
					<image :src="$getStaticSrc('/static/recommend/sub.png')" mode="aspectFill" class="quantity-btn" @click="decreaseQuantity"></image>
			        <view class="quantity-value">{{ quantity }}</view>
					<image :src="$getStaticSrc('/static/recommend/add.png')" mode="aspectFill" class="quantity-btn" @click="increaseQuantity"></image>
			    </view>
			    
			</view>
        </view>
        <!-- 项目概览 -->
        <view class="overview-section" >
            <view class="overview-name">
                礼品详情
                <view class="overview-label">正品保障</view>
            </view>
            <view class="overview-content">
				<rich-text :nodes="completeImageUrls(detail.content)"></rich-text>
            </view>
            <view class="steps">
                <!-- 步骤1: 选择规格 -->
                <view class="step-item active">
                    <view class="step-number">1</view>
                    <view class="step-text">选择规格</view>
                </view>
                
                <!-- 连接线1 -->
                <view class="step-line active"></view>
                
                <!-- 步骤2: 填写地址 -->
                <view class="step-item">
                    <view class="step-number">2</view>
                    <view class="step-text">填写地址</view>
                </view>
                
                <!-- 连接线2 -->
                <view class="step-line"></view>
                
                <!-- 步骤3: 确认购买 -->
                <view class="step-item">
                    <view class="step-number">3</view>
                    <view class="step-text">确认购买</view>
                </view>
            </view>
        </view>
        <!-- 项目概览 -->
        <view class="overview-section" style="margin-bottom: 150rpx;">
            <view class="project-name">购买说明</view>
            <view class="overview-content">
               {{config && config.redeem_instruction ? config.redeem_instruction : '暂无购买说明'}}
            </view>
        </view>

        <!-- 底部购买区域 -->
        <view class="bottom-section">
            <view class="price-section">
                <view class="price-label">本次购买需要:</view>
                <view class="coin-pool-bg">
                    <image class="coin-pool-icon" :src="$getStaticSrc('/static/task/yun-rain.png')" mode="aspectFit"></image>
                    <!-- <view class="price-value">￥{{$formatPrice(detail.gold,quantity,2)}}</view> -->
                    <view class="price-value">{{config.review_mode!=1?'':'￥'}}{{$formatPrice(detail.gold,quantity,0)}}<!-- {{config.review_mode!=1?'积分':''}} --></view>
                </view>
            </view>
            <view class="bottom-sections">
                <!-- <view class="price-section" v-if="config.review_mode!=1">
                    <view class="price-label">我的金币:</view>
                    <view class="coin-pool-bg">
                        <view class="price-title">{{$formatPrice(userInfo.gold,1,2)}}</view>
                    </view>
                </view> -->
            <view class="buy-btn cart-btn" @click="addToCart" v-if="config.review_mode==1">加入购物车</view>
            <view class="buy-btn" @click="handleBuy">立即购买</view>
            </view>
        </view>
        <up-popup :show="payShow" :round="10" mode="center" :closeable="true" @close="this.payShow = false">
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
        <up-popup :show="tipsPayShow" :round="10" mode="center" :closeable="true" @close="this.tipsPayShow = false">
            <view class="pay-content">
                <view class="pay-content-title">提示</view>
                <view class="pay-content-content">请设置支付密码后进行支付</view>
                
                <view class="sign-actions" >
		            <up-button type="primary" @click="goPassword" class="sign-popup-button">确认支付</up-button>
		        </view>
            </view>
        </up-popup>
        <up-popup :show="addPlaceShow" :round="10" mode="bottom" :closeable="true" @close="this.addPlaceShow = false">
            <view class="bottom-content">
                
                <!-- 标题区域 -->
                <view class="bottom-title">填写收货信息</view>
                <up-form class="form" ref="formRef" :model="formData" :rules="formRules" v-if="addressList.length == 0">
                    <up-form-item borderBottom="true" label="收货人" prop="name" labelWidth="190rpx">
                        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.name"
                            placeholder="输入收件人姓名" />
                    </up-form-item>
                    <up-form-item borderBottom="true" label="联系方式" prop="tel" labelWidth="190rpx">
                        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.tel"
                            placeholder="输入收件人联系方式" />
                    </up-form-item>
                    <up-form-item borderBottom="true" label="选择地区" prop="province" labelWidth="190rpx" @click="openProvincePicker">
                        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.province"
                            placeholder="请选择省份" />
							
                        <template #right>
                        	<image  :src="$getStaticSrc('/static/my/more.png')" mode="aspectFit" class="right-icon"></image>
                        </template>
                    </up-form-item>
                    <up-form-item borderBottom="true" label="出入城市" prop="city" labelWidth="190rpx">
                        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.city"
                            placeholder="广州市/杭州市" />
                    </up-form-item>
                    <up-form-item borderBottom="true" label="详细地址" prop="addressDetail" labelWidth="190rpx">
                        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.addressDetail"
                            placeholder="街道、楼栋/单元、门牌号等详细信息 详细地址不少于5个字" />
                    </up-form-item>
                </up-form>
                <!-- 地址信息 -->
                <view class="address-section" v-if="addressList.length > 0">
                    <view class="address-item">
                        <view class="contact-info">
                            <span class="contact-name">{{addressDetail.name}}</span>
                            <span class="contact-phone">{{addressDetail.tel}}</span>
                            <span class="default-tag">默认</span>
                        </view>
                        <view class="address-detail">{{addressDetail.province}}{{addressDetail.city}}</view>
                        <view class="address-detail">{{addressDetail.address}}</view>
                        <view class="address-options">
                            <view class="default-option" @click="setDefaultAddress(addressDetail.id)">
                              <image :src="addressDetail.is_default == 'Y'?'/static/my/place-check2.png':'/static/my/place-uncheck.png'" mode="aspectFit" class="default-icon"></image>
                              <text :class="{ 'address-title': addressDetail.is_default == 'Y' }">设为默认</text>
                            </view>
                            <span class="more-address" @click="moreAddress">更多地址</span>
                        </view>
                    </view>
                </view>
                
                <!-- 商品信息 -->
                <view class="goods-section">
                    <view class="goods-info">
                        <span class="goods-label">礼品</span>
                        <span class="goods-value">{{detail.title}} x{{quantity}}</span>
                    </view>
                    <view class="points-info">
                        <span class="points-label">{{config.review_mode!=1?'雨滴':'金额'}}</span>
                        <view class="coin-pool-bg">
                            <image class="coin-pool-icon" src="/static/task/yun-rain.png" mode="aspectFit"></image>
                            <!-- <view class="points-value">￥{{$formatPrice(detail.gold,quantity,2)}}</view> -->
                            <view class="points-value">{{config.review_mode!=1?'':'￥'}}{{$formatPrice(detail.gold,quantity,0)}}</view>
                        </view>
                    </view>
                </view>
                <view class="sign-actions">
		            <up-button type="primary" class="buy-popup-button" @click="confirmSubmit">确认购买</up-button>
		        </view>
            </view>
        </up-popup>
        <up-popup :show="failShow" :round="10" mode="bottom" :closeable="true" @close="this.failShow = false">
            <view class="bottom-content">
                <view class="bottom-title">兑换结果</view>
                <image class="sign-popup-icon" src="/static/game/fail.png" mode="aspectFit"></image>
                <view class="fail-title">兑换失败</view>
                <view class="pay-content-content">当前金币不足，请确认</view>
                
               <view class="sign-actions" style="width:70vw;">
				    <up-button type="primary" class="sign-popup-button-left">继续逛逛</up-button>
				    <up-button type="primary" class="sign-popup-button-right">收集金币</up-button>
				</view>
            </view>
        </up-popup>
        <up-popup :show="successShow" :round="10" mode="bottom" :closeable="true" @close="this.successShow = false">
            <view class="bottom-content">
                <view class="bottom-title">兑换结果</view>
                <image class="sign-popup-icon" src="/static/game/complete.png" mode="aspectFit"></image>
                <view class="fail-title">兑换成功</view>
                <view class="fail-desc">金币已扣除 999，预计7日内发货</view>
                <view class="goods-section">
                    <view class="result-info">
                        <span class="result-label">订单编号</span>
                        <span class="goods-value">JF2025-001-888</span>
                    </view>
                    <view class="result-info">
                        <span class="result-label">收货人</span>
                        <span class="goods-value">1(1)</span>
                    </view>
                    <view class="result-info">
                        <span class="result-label">收货地址</span>
                        <span class="goods-value">北京市 浦东区 111111</span>
                    </view>
                </view>
               <view class="sign-actions" style="width:70vw;">
				    <up-button type="primary" class="sign-popup-button-left">继续逛逛</up-button>
				    <up-button type="primary" class="sign-popup-button-right">收集金币</up-button>
				</view>
            </view>
        </up-popup>
        <view class="tips" v-if="tipsShow">{{ tips }}</view>
		<up-picker ref="picker" :show="pickerShow" :columns="provinces" @confirm="selectProvince"
			@cancel="closeProvincePicker" @close="closeProvincePicker"></up-picker>
    </view>
</template>

<script>
	import { mapState } from 'vuex'
	import {
		getAllProvinces,
		getProvinceByName
	} from '/stores/pro.js'
export default {
    data() {
        return {
            quantity: 1,
			id:'',
			detail:[],
            list: [
			  { name: '品牌介绍' },
			  { name: '收益规则' },
			  { name: '质押合同' }
			],
			tabs: 0,
            payShow:false,
            tipsPayShow:false,
            tipsShow:false,
			tips:'',
            addPlaceShow:false,
            successShow:false,
            failShow:false,
            password: '',
            addressList:[],
            addressDetail:{},
            formData: {
                name: '',
                tel: '',
                province: '',
                city: '',
                addressDetail: '',
                isDefault: true,
            },
            formRules: {
				name: [{
					required: true,
					message: '请输入真实姓名',
					trigger: 'blur'
				}],
				tel: [{
					required: true,
					message: '请输入有效手机号',
					trigger: 'blur'
				}],
				province: [{
					required: true,
					message: '请选择省份',
					trigger: 'blur'
				}],
				city: [{
					required: true,
					message: '请输入城市',
					trigger: 'blur'
				}],
				addressDetail: [{
					required: true,
					message: '请输入详细地址',
					trigger: 'blur'
				}]
			},
			pickerShow: false,
			provinces: [], // 省份列表
        };
    },
	computed: {
		...mapState(['userInfo', 'isLoggedIn','config','isAuth'])
	},
	onLoad(e) {
        this.id = e.id
        // 调用action获取配置信息
        this.$store.dispatch('getConfig')
    },
	onShow() {
		// 查询是否有地址
		this.findAddressList()
		// 加载省份数据
		this.loadProvinces()
		// 初始化加载数据
		this.detailProducts();
		if (this.isLoggedIn) {
			this.$store.dispatch('updateUserInfo');
		}
		var defaultAddress = uni.getStorageSync('defaultAddress')
		if(defaultAddress){
			// 优先选择is_default=Y的地址，如果没有则选择第一条
			this.addressDetail = this.addressList.find(address => address.id === defaultAddress)
		}
	},
	
    methods: {
            // 添加到购物车
            addToCart() {

                // 获取商品信息
                const product = {
                    id: this.detail.id,
                    title: this.detail.title,
                    description: this.detail.subtitle || this.detail.title,
                    price: this.detail.gold,
                    quantity: this.quantity,
                    image: this.detail.thumbs || '',
                    selected: true
                };
                
                // 获取现有购物车数据
                let cartItems = uni.getStorageSync('cartItems') || [];
                
                // 检查是否已存在相同商品
                const existingIndex = cartItems.findIndex(item => item.id === product.id);
                
                if (existingIndex !== -1) {
                    // 如果已存在，更新数量
                    cartItems[existingIndex].quantity += product.quantity;
                } else {
                    // 如果不存在，添加新商品
                    cartItems.push(product);
                }
                
                // 保存到本地缓存
                uni.setStorageSync('cartItems', cartItems);
                console.log('cartItems',cartItems)
                // 显示添加成功提示
                uni.showToast({
                    title: '已加入购物车',
                    icon: 'success'
                });
            },
		// 加载省份数据
		loadProvinces() {
			
			this.provinces = [getAllProvinces().map(province => province.name)];
			console.log(this.provinces)
		},
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
			const selectedProvince = e;
			console.log(e)
			this.formData.province = selectedProvince.value[0];
			this.closeProvincePicker();
		},
		// 补全图片地址的函数
		completeImageUrls(content){
		  if (!content) return '';
		  // 使用正则表达式匹配所有的图片标签，并补全图片地址
		  const baseUrl = this.$baseUrl;
		  
		  // 匹配src属性中的相对路径图片
		  // 处理src="/path/to/image.jpg" 格式，并添加width="100%"
		  let updatedContent = content.replace(/src="\/([^"http][^"]*)"/g, `src="${baseUrl}/$1" width="100%"`);
		  
		  // 处理src='/path/to/image.jpg' 格式，并添加width="100%"
		  updatedContent = updatedContent.replace(/src='\/([^'http][^']*)'/g, `src='${baseUrl}/$1' width='100%'`);
		  
		  // 处理data-src属性（如果有懒加载的图片），并添加width="100%"
		  updatedContent = updatedContent.replace(/data-src="\/([^"http][^"]*)"/g, `data-src="${baseUrl}/$1" width="100%"`);
		  updatedContent = updatedContent.replace(/data-src='\/([^'http][^']*)'/g, `data-src='${baseUrl}/$1' width='100%'`);
		  
		  return updatedContent;
		},
        handleBack() {
            // 返回上一页
            uni.navigateBack({
                delta: 1
            });
        },
		moreAddress(){
			uni.navigateTo({
				url:'/pages/my/settings/settings-place?check=1'
			})
		},
		forgetPass(){
			uni.navigateTo({ url: '/pages/my/settings/settings-password?type=3' })
		},
		// 设置默认地址
		setDefaultAddress(id) {
		  // 移除所有地址的默认状态
		  this.addressList.forEach(address => {
		    address.isDefault = false
		  })
		  
		  // 设置选中的地址为默认
		  const selectedAddress = this.addressList.find(address => address.id === id)
		  if (selectedAddress) {
		    selectedAddress.isDefault = true
		  }
		  
		  // 更新默认地址ID
		  this.defaultAddressId = id
		  
		  // 这里可以添加调用API更新默认地址的逻辑
		  console.log('设置默认地址:', id)
		  this.defaultAddress(selectedAddress)
		  // 显示成功提示
		  uni.showToast({
		    title: '设置成功',
		    icon: 'success'
		  })
		},
		defaultAddress(selectedAddress){
			console.log('默认',selectedAddress)

			var formData = {
				id:selectedAddress.id,
				name:selectedAddress.name,
				tel:selectedAddress.tel,
				province:selectedAddress.province,
				city:selectedAddress.city,
				addressDetail:selectedAddress.address,
				isDefault:true
			}
			this.$http(
				'/user/address/save',formData , "POST").then(res => {
				if (res.code == 200) {
					setTimeout(() => {
					    this.findAddressList()
					}, 1500)
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			})
		},
		goPassword(){
			console.log(1)
			uni.navigateTo({ url: '/pages/my/settings/settings-password?type=3' })
		},
		findAddressList(){
			this.$http(
				'/user/address/search', {}, "GET").then(res => {
				if (res.code == 200) {
					this.addressList = res.data.list
					// 优先选择is_default=Y的地址，如果没有则选择第一条
                    const defaultAddress = res.data.list.find(address => address.is_default === 'Y')
                    this.addressDetail = defaultAddress || res.data.list[0]
					uni.setStorageSync('defaultAddress',this.addressDetail.id)
					console.log(this.addressDetail)
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			})
		},
		detailProducts() {
			this.isLoading = true;
			
			// 编辑地址
			this.$http(
				'/goods/info/view', {
					id:this.id
				}, "POST").then(res => {
					console.log('数据',res.data)
					this.detail = res.data.view
			})
		},
       // 切换筛选类型
		changeFilterType(e) {
		  console.log(e.index)
		  this.tabs = e.index
		},
        increaseQuantity() {
			if(this.detail.max_shop_num!=0){
				// 限购
				if(this.config.review_mode!=1){
					if (this.quantity < this.detail.max_shop_num) {
					    this.quantity++;
					}else{
						uni.showToast({
						    title: '限购'+this.quantity,
						    icon: 'none'
						});
					}
				}else{
					this.quantity++;
				}
				
			}else{
				this.quantity++;
			}
            
        },
        decreaseQuantity() {
            // 限制最少1份
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        handleBuy() {
			
            // this.tips = '请完善收货信息';
            // this.tipsShow = true;
            // setTimeout(() => {
            //     this.tipsShow = false;
            // }, 3000);
			// if(!this.userInfo.can_shop){
			// 	uni.showToast({
			// 	    title: '成长值达到1000，即刻解锁更多精彩商品！',
			// 	    icon: 'none'
			// 	});
			// 	return false;
			// }
			this.addPlaceShow = true
			
        },
        confirmSubmit() {
			console.log('userInfo',this.userInfo.is_set_pay_passwd)
			this.addPlaceShow = false
			if(this.addressList.length == 0){
				this.$refs.formRef.validate().then(() => {
				    this.addAddress()
					
					if(this.userInfo.is_set_pay_passwd){
						this.payShow = true
					}else{
						this.tipsPayShow = true
					}
					
					
					// this.addOrder(this.formData)
				}).catch(error => {
				    this.tips = '请完善收货信息';
				    this.tipsShow = true;
				    setTimeout(() => {
				        this.tipsShow = false;
				    }, 3000);
				});
			}else{
				if(this.userInfo.is_set_pay_passwd){
					this.payShow = true
				}else{
					this.tipsPayShow = true
				}
				// 不添加地址下单
				// this.addOrder(this.addressDetail)
				
			}
            
        },
		addAddress(){
			// 新增地址
			this.$http(
				'/user/address/save', this.formData, "POST").then(res => {
				// if (res.code == 200) {
				// 	uni.showToast({
				// 		title: '新增成功',
				// 		icon: 'success'
				// 	});
				// } else {
				// 	uni.showToast({
				// 		title: res.msg,
				// 		icon: 'none'
				// 	});
				// }
			})
		},
		confirmBuy(){
			if(!this.password){
				uni.showToast({
				    title: '请输入密码~',
				    icon: 'success'
				});
			}
			if(this.addressList.length == 0){
				this.addOrder(this.formData)
			}else{
				this.addOrder(this.addressDetail)
			}
			
		},
		// 下单
		addOrder(place){
			console.log('当前添加地址',place)
			
			// 验证address参数
			if(!place){
				uni.showToast({
					title: '请选择收货地址',
					icon: 'none'
				})
				return false;
			}
			
			// 验证address的必要属性
			if(!place.name || !place.tel || !place.province || !place.city || !place.address){
				uni.showToast({
					title: '地址信息不完整',
					icon: 'none'
				})
				return false;
			}
			
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
			// if(this.id){
			// 	uni.showToast({
			// 	    title: '余额不足',
			// 	    icon: 'success'
			// 	});
			// 	return false
			// }
			this.payShow = false
			this.tipsPayShow = false
			var applyInfo = {
				id:this.id,
				name:place.name,
				mobile:place.tel,
				address:place.province+place.city+place.address,
				province:place.province,
				city:place.city,
				number:this.quantity,
				passwd:this.password,
				task_code:"",
				redeem_code:"",
			}
			this.$http(
				'/goods/order/apply', applyInfo, "POST").then(res => {
					this.quantity = 1
					uni.showToast({
					    title: '下单成功~',
					    icon: 'success'
					});
				})
		}
    }
};
</script>

<style scoped>
	@import "./detail.css";
</style>