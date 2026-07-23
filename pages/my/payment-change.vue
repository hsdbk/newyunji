<template>
  <view class="payment-change-container">
    <up-form class="form" ref="formRef" v-if="type==1" :model="formData" :rules="bankRules">
      <up-form-item borderBottom="true" label="姓名" prop="name" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.name" placeholder="输入真实姓名" />
      </up-form-item>
      
      <up-form-item borderBottom="true" label="银行账户" prop="bankAccount" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.bankAccount" placeholder="输入银行卡号" />
      </up-form-item>
      
      <up-form-item borderBottom="true" label="开户行" prop="bankName" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.bankName" placeholder="输入开户银行地址" />
      </up-form-item>
    </up-form>
    <up-form class="form" ref="formRef" v-else-if="type==2" :model="formData" :rules="zfbRules">
      <up-form-item borderBottom="true" label="姓名" prop="name" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.name" placeholder="输入真实姓名" />
      </up-form-item>
      
      <up-form-item borderBottom="true" label="支付宝账号" prop="zfbAccount" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.zfbAccount" placeholder="输入支付宝账号" />
      </up-form-item>
    </up-form>
	<up-form class="form"  ref="formRef" v-else-if="type==3" :model="formData" :rules="wxRules">
      <up-form-item borderBottom="true" label="姓名" prop="name" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.name" placeholder="输入真实姓名" />
      </up-form-item>
      
      <up-form-item borderBottom="true" label="微信账号" prop="wxAccount" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{color:'#A4A4A4'}" v-model="formData.wxAccount" placeholder="输入微信账号" />
      </up-form-item>
    </up-form>
    <view class="confirm-btn">
		<view class="confirm-btn-container">
			<up-button type="primary" @click="confirmSubmit">确认</up-button>
		</view>
	</view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
		  id:0,
        formData: {
          name: '',
          bankAccount: '',
          zfbAccount: '',
          wxAccount: '',
          bankName: ''
        },
		type: '',
        bankRules: {
          name: [
            {
              required: true,
              message: '请输入真实姓名',
              trigger: 'blur'
            }
          ],
          bankAccount: [
            {
              required: true,
              message: '请输入银行卡号',
              trigger: 'blur'
            }
            // {
            //   pattern: /^\d{16,19}$/,
            //   message: '请输入正确的银行卡号',
            //   trigger: 'blur'
            // }
          ],
          bankName: [
            {
              required: true,
              message: '请输入开户银行地址',
              trigger: 'blur'
            }
          ]
        },
		zfbRules: {
          name: [
            {
              required: true,
              message: '请输入真实姓名',
              trigger: 'blur'
            }
          ],
          zfbAccount: [
            {
              required: true,
              message: '请输入支付宝账号',
              trigger: 'blur'
            }
          ]
        },
		wxRules: {
          name: [
            {
              required: true,
              message: '请输入真实姓名',
              trigger: 'blur'
            }
          ],
          wxAccount: [
            {
              required: true,
              message: '请输入微信账号',
              trigger: 'blur'
            }
          ]
        },
		detail:{}
      }
    },
	onLoad(e) {
        this.id = e.id
        this.type = e.type
		if(e.type==1){
			if(e.id){
				uni.setNavigationBarTitle({
					title: '添加银行卡'
				});
			}else{
				uni.setNavigationBarTitle({
					title: '编辑银行卡'
				});
			}
			
		}else if(e.type==2){
			if(e.id){
				uni.setNavigationBarTitle({
					title: '添加支付宝'
				});
			}else{
				uni.setNavigationBarTitle({
					title: '编辑支付宝'
				});
			}
		}else if(e.type==3){
			if(e.id){
				uni.setNavigationBarTitle({
					title: '添加微信支付'
				});
			}else{
				uni.setNavigationBarTitle({
					title: '编辑微信支付'
				});
			}
		}
    },
	onShow() {
		console.log(uni.getStorageSync('payment'))
		this.detail = uni.getStorageSync('payment')
	},
    methods: {
      confirmSubmit() {
        this.$refs.formRef.validate().then(() => {
          this.savePayment();
        }).catch(error => {
          console.log('表单验证失败', error);
        })
      },
	  savePayment(){
		  var arrData = {
			  id:this.id,
			  acc_type:this.type,
			  username:this.formData.name,
			  card:'',
		  }
		  if(this.type == 1){
			  arrData.card = this.formData.bankAccount
			  arrData.name = this.formData.bankName
		  }else if(this.type == 2){
			  arrData.card = this.formData.zfbAccount
		  }else if(this.type == 3){
			  arrData.card = this.formData.wxAccount
		  }
		  // 编辑地址
		  this.$http(
		  	'/user/bank/save', arrData, "POST").then(res => {
				if(this.id){
					this.detail.username = arrData.username
					this.detail.card = arrData.card
					uni.setStorageSync('payment',this.detail)
					uni.showToast({
					  title: '编辑成功',
					  icon: 'success'
					});
				}else{
					uni.showToast({
					  title: '添加成功',
					  icon: 'success'
					});
				}
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
		  })
		  
	  }
    }
  }
</script>

<style scoped>
	page{
		background: #f5f5f5;
	}
  .payment-change-container {
    padding: 30rpx;
    box-sizing: border-box;
  }
  .confirm-btn{
	display: flex;
	justify-content: center;
	align-items: center;
  }
  .confirm-btn-container {
	width: 500rpx;
	height:70rpx;
	border-radius: 30rpx;
    margin-top: 160rpx;
  }
  .form{
	background-color: #fff;
	border-radius: 30rpx;
	padding:36rpx 23rpx; 
  }
  /* 自定义表单样式，使其更接近图片设计 */
  .u-form-item__body {
    padding: 0;
  }
  
  .u-input__wrapper {
    background-color: transparent !important;
    border-bottom: 1rpx dashed #ddd;
    border-radius: 0;
  }
  
  .u-button {
    background-color: #000;
    border-radius: 44rpx;
    height: 88rpx;
    line-height: 88rpx;
  }
  
  .u-button--primary {
    background-color: #000;
  }
  
  .u-button--primary:after {
    border: none;
  }
</style>