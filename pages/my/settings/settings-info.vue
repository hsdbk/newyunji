<template>
  <view class="payment-change-container">
    <up-form class="form" ref="formRef" v-if="type == 1" :model="formData" :rules="nickRules">
      <up-form-item borderBottom="true" label="昵称" prop="nick_name" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.nick_name" placeholder="输入新的昵称" />
      </up-form-item>
    </up-form>
    <up-form class="form" ref="formRef" v-else-if="type == 2" :model="formData" :rules="emailRules">
      <up-form-item borderBottom="true" v-if="status == 1" label="邮箱" prop="email" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.email" placeholder="输入邮箱地址" />
      </up-form-item>
      <up-form-item borderBottom="true" v-else label="邮箱" prop="email" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.email"
          placeholder="输入新的邮箱地址" />
      </up-form-item>
    </up-form>
    <up-form class="form" ref="formRef" v-else-if="type == 3" :model="formData" :rules="qqRules">
      <up-form-item borderBottom="true" v-if="status == 1" label="QQ" prop="qq" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.qq" placeholder="输入QQ账号" />
      </up-form-item>
      <up-form-item borderBottom="true" v-else label="QQ" prop="qq" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.qq"
          placeholder="输入新的QQ账号" />
      </up-form-item>
    </up-form>
    <up-form class="form" ref="formRef" v-else-if="type == 4" :model="formData" :rules="wxRules">
      <up-form-item borderBottom="true" v-if="status == 1" label="微信" prop="wechat" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.wechat" placeholder="输入微信账号" />
      </up-form-item>
      <up-form-item borderBottom="true" v-else label="微信" prop="wechat" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.wechat"
          placeholder="输入新的微信账号" />
      </up-form-item>
    </up-form>
    <up-form class="form" ref="formRef" v-else-if="type == 5" :model="formData" :rules="phoneRules">
      <up-form-item borderBottom="true" v-if="status == 1" label="手机号" prop="mobile" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.mobile" placeholder="输入手机号" />
      </up-form-item>
      <up-form-item borderBottom="true" v-else label="手机号" prop="mobile" labelWidth="150rpx">
        <up-input border="false" placeholderStyle="{ color: '#A4A4A4' }" v-model="formData.mobile" placeholder="输入新的手机号" />
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
	import { mapState } from 'vuex'
export default {
  data() {
    return {
      formData: {
        nick_name: '',
        email: '',
        qq: '',
        wechat: '',
        mobile: ''
      },
      type: '',
      status: '',
      nickRules: {
        nick_name: [
          {
            required: true,
            message: '请输入新的昵称',
            trigger: 'blur'
          }
        ]
      },
      emailRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          }
        ]
      },
      qqRules: {
        qq: [
          {
            required: true,
            message: '请输入QQ账号',
            trigger: 'blur'
          }
        ]
      },
      wxRules: {
        wechat: [
          {
            required: true,
            message: '请输入微信账号',
            trigger: 'blur'
          }
        ]
      },
      phoneRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  computed: {
  	...mapState(['userInfo', 'isLoggedIn'])
  },
  onLoad(e) {
    this.type = e.type
    this.status = e.status
    if (e.type == 1) {
      uni.setNavigationBarTitle({
        title: '修改昵称'
      });
    } else if (e.type == 2) {
      if (e.status == 1) {
        uni.setNavigationBarTitle({
          title: '绑定邮箱'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '更换邮箱'
        });
      }
    } else if (e.type == 3) {
      if (e.status == 1) {
        uni.setNavigationBarTitle({
          title: '绑定QQ'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '更换QQ'
        });
      }
    } else if (e.type == 4) {
      if (e.status == 1) {
        uni.setNavigationBarTitle({
          title: '绑定微信'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '更换微信'
        });
      }
    } else if (e.type == 5) {
      if (e.status == 1) {
        uni.setNavigationBarTitle({
          title: '绑定手机号'
        });
      } else {
        uni.setNavigationBarTitle({
          title: '更换手机号'
        });
      }
    }
	
	if (e.status != 1) {
	  console.log('userInfo',this.userInfo)
	  this.formData.nick_name = this.userInfo.nick_name
	  this.formData.email = this.userInfo.email
	  this.formData.wechat = this.userInfo.wechat
	  this.formData.mobile = this.userInfo.mobile

	}
  },
  methods: {
    confirmSubmit() {
      this.$refs.formRef.validate().then(() => {
        console.log(this.formData)
        this.updataUserinfo()
        // // 表单验证通过，这里可以添加提交数据的逻辑
        // uni.showToast({
        //   title: '提交成功',
        //   icon: 'success'
        // });
        // 可以在这里调用API提交数据
        // 提交成功后返回上一页
        // uni.navigateBack();
      }).catch(error => {
        console.log('表单验证失败', error);
      });
    },
    updataUserinfo(){
		// 创建一个过滤后的对象，只包含非空值的字段
		const filteredFormData = {};
		if(this.formData.nick_name){
			filteredFormData.nick_name = this.formData.nick_name
		}
		if(this.formData.email){
			filteredFormData.email = this.formData.email
		}
		if(this.formData.qq){
			filteredFormData.qq = this.formData.qq
		}
		if(this.formData.wechat){
			filteredFormData.wechat = this.formData.wechat
		}
		if(this.formData.mobile){
			filteredFormData.mobile = this.formData.mobile
		}
		this.$http(
			'/user/info/update', filteredFormData, "POST").then(res => {
				    uni.showToast({
				        title: '更新成功',
				        icon: 'success'
				    })
				    setTimeout(() => {
				        uni.navigateBack()
				    }, 1500)
		})
	},
  }
}
</script>

<style scoped>
page {
  background: #f5f5f5;
}

.payment-change-container {
  padding: 30rpx;
  box-sizing: border-box;
}

.confirm-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.confirm-btn-container {
  width: 500rpx;
  height: 70rpx;
  border-radius: 30rpx;
  margin-top: 256rpx;
}

.form {
  background-color: #fff;
  border-radius: 30rpx;
  padding: 0 23rpx;
}

.u-form-item__body {
  padding: 0 !important;
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