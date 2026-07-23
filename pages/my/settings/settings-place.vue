<template>
  <view>
    <!-- 地址列表 -->
    <view class="address-list">
      <!-- 默认地址 -->
      <view class="address-item" @click="checkAddress(item.id)"
        :class="{ 'address-item-default': item.is_default == 'Y' }" v-for="(item, index) in addressList" :key="item.id">
        <!-- 姓名和电话 -->
        <view class="address-header">
          <view class="address-name" :class="{ 'address-title': item.is_default == 'Y' }">{{ item.name }}</view>
          <view class="address-phone" :class="{ 'address-title': item.is_default == 'Y' }">{{ item.tel }}</view>
          <view v-if="item.is_default == 'Y'" class="default-tag">默认</view>
        </view>

        <!-- 地址信息 -->
        <view class="address-detail" :class="{ 'address-title': item.is_default == 'Y' }">{{ item.province }}/{{
          item.city }}</view>
        <view class="address-detail" :class="{ 'address-title': item.is_default == 'Y' }">{{ item.address }}</view>


        <!-- 操作按钮区域 -->
        <view class="address-actions">
          <!-- 设为默认 -->
          <view class="default-option" @click.stop="setDefaultAddress(item.id)">
            <image :src="item.is_default == 'Y' ? '/static/my/place-check.png' : '/static/my/place-uncheck.png'"
              mode="aspectFit" class="default-icon"></image>
            <text :class="{ 'address-title': item.is_default == 'Y' }">设为默认</text>
          </view>

          <!-- 操作按钮组 -->
          <view class="action-buttons">
            <view class="action-btn" @click.stop="deleteAddress(item.id)">删除</view>
            <view class="action-btn" @click.stop="copyAddress(item)">复制</view>
            <view class="action-btn" @click.stop="editAddress(item)">修改</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态提示（当没有地址时显示） -->
    <view class="empty-state" v-if="addressList.length === 0">
      <image :src="$getStaticSrc('/static/my/place-undata.png')" class="empty-icon" mode="aspectFit" />
      <text class="empty-text">暂无收货地址</text>
    </view>

    <!-- 底部新增按钮 -->
    <view class="add-button-container">
      <up-button type="primary" class="add-address-button" @click="addNewAddress">
        新增收货地址
      </up-button>
    </view>

    <!-- 确认删除弹窗 -->
    <up-popup :show="deletePopupShow" mode="center" @close="cancelDelete">
      <view class="delete-popup">
        <view class="delete-title">确认删除</view>
        <view class="delete-content">确定要删除该收货地址吗？</view>
        <view class="delete-actions">
          <up-button type="default" class="del-address-button" @click="cancelDelete">取消</up-button>
          <up-button type="primary" class="add-address-button" @click="confirmDelete">确定</up-button>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressList: [],
      defaultAddressId: '1', // 当前默认地址ID
      deletePopupShow: false, // 删除弹窗显示状态
      currentDeleteId: '',// 当前要删除的地址ID
      check: 0
    }
  },
  onLoad(e) {
    this.check = e.check
  },
  onShow() {
    this.findAddressList()
  },
  methods: {
    checkAddress(id) {
      if (this.check) {
        uni.setStorageSync('defaultAddress', id)
        uni.navigateBack()
      }
    },
    findAddressList() {
      this.$http(
        '/user/address/search', {}, "GET").then(res => {
          if (res.code == 200) {
            this.addressList = res.data.list
            const index = this.addressList.findIndex(address => address.is_default === 'Y')
            this.defaultAddressId = this.addressList[index].id
          } else {
            uni.showToast({
              title: res.msg,
              icon: 'none'
            });
          }
        })
    },
    delAddress(id) {
      this.$http(
        '/user/address/remove', { id: id }, "GET").then(res => {
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
    defaultAddress(selectedAddress) {
      console.log(selectedAddress)
      // name: '',
      // tel: '',
      // province: '',
      // city: '',
      // addressDetail: '',
      // isDefault: false,
      var formData = {
        id: selectedAddress.id,
        name: selectedAddress.name,
        tel: selectedAddress.tel,
        province: selectedAddress.province,
        city: selectedAddress.city,
        addressDetail: selectedAddress.address,
        isDefault: true
      }
      this.$http(
        '/user/address/save', formData, "POST").then(res => {
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

    // 删除地址（显示确认弹窗）
    deleteAddress(id) {
      console.log(id)
      this.currentDeleteId = id
      this.deletePopupShow = true
    },

    // 确认删除
    confirmDelete() {
      // 从列表中移除地址
      const index = this.addressList.findIndex(address => address.id === this.currentDeleteId)
      if (index > -1) {
        this.addressList.splice(index, 1)
      }

      // 如果删除的是默认地址，且还有其他地址，则设置第一个为默认
      if (this.currentDeleteId === this.defaultAddressId && this.addressList.length > 0) {
        this.setDefaultAddress(this.addressList[0].id)
        // this.defaultAddress(this.addressList[0])
      }

      // 关闭弹窗
      this.deletePopupShow = false

      // 这里可以添加调用API删除地址的逻辑
      console.log('删除地址:', this.currentDeleteId)
      this.delAddress(this.currentDeleteId)
      // 显示成功提示
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      })
    },

    // 取消删除
    cancelDelete() {
      this.deletePopupShow = false
      this.currentDeleteId = ''
    },

    // 复制地址
    copyAddress(address) {
      // 复制地址信息到剪贴板
      const addressText = `${address.name} ${address.phone}\n${address.address}`

      uni.setClipboardData({
        data: addressText,
        success: () => {
          uni.showToast({
            title: '地址已复制',
            icon: 'success'
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    },

    // 修改地址
    editAddress(address) {
      // 这里可以跳转到编辑地址页面，并传递当前地址信息
      console.log('修改地址:', address)
      // 示例：跳转到编辑页面
      uni.navigateTo({
        url: `/pages/my/settings/edit-address?id=${address.id}`
      })
    },

    // 新增收货地址
    addNewAddress() {
      // 这里可以跳转到新增地址页面
      console.log('新增收货地址')
      // 示例：跳转到新增页面
      uni.navigateTo({
        url: '/pages/my/settings/edit-address'
      })
    }
  }
}
</script>

<style scoped>
page {
  background-color: #f3f3f3;
  padding-bottom: 120rpx;
}

.address-list {
  padding: 30rpx;
}

.address-item {
  position: relative;
  background-color: #ffffff;
  border-radius: 30rpx;
  margin-bottom: 20rpx;
  padding: 20rpx 30rpx;
}

.address-item-default {
  background-color: #f3f3f3;
  background-image: url('/static/my/place-back.png');
  background-size: 100% 100%;
}

.default-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 195rpx;
}

.address-header {
  display: flex;
  align-items: center;
  color: #000000;
  position: relative;
  margin-bottom: 10rpx;
}

.address-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #000000;
}

.address-phone {
  font-size: 28rpx;
  color: #000000;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.default-tag {
  font-size: 24rpx;
  color: #fff;
  padding: 4rpx 16rpx;
  border: 1px solid #fff;
  border-radius: 30rpx;
}

.address-detail {
  font-size: 28rpx;
  color: #979696;
  line-height: 44rpx;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.address-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10rpx;
}

.default-option {
  font-size: 28rpx;
  color: #666;
  display: flex;
  align-items: center;
  position: relative;
}

.action-buttons {
  display: flex;
  position: relative;
}

.action-btn {
  margin-left: 16rpx;
  font-size: 24rpx;
  color: #993018;
  width: 100rpx;
  height: 40rpx;
  background: #FEEEE5;
  border-radius: 20rpx;
  text-align: center;
  line-height: 40rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 40rpx;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
}

.add-button-container {
  position: fixed;
  bottom: 40rpx;
  left: 0;
  right: 0;
  padding: 0 40rpx;
}

.address-title {
  color: #fff;
}

.add-address-button {
  background-color: #000000;
  color: #ffffff;
  border-radius: 35rpx;
  font-size: 24rpx;
  height: 70rpx;
  width: 500rpx;
  text-align: center;
  line-height: 70rpx;
}

.del-address-button {
  background-color: #fff;
  color: #000;
  border-radius: 35rpx;
  font-size: 24rpx;
  height: 70rpx;
  width: 500rpx;
  line-height: 70rpx;
  text-align: center;
  border: 1rpx solid #000;
}

.delete-popup {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 60rpx 0;
  width: 620rpx;
}

.delete-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.delete-content {
  font-size: 30rpx;
  color: #666;
  text-align: center;
  margin-bottom: 40rpx;
}

.default-icon {
  width: 34rpx;
  height: 34rpx;
}

.delete-actions {
  display: flex;
  justify-content: space-between;
}

.delete-actions .u-button {
  width: 200rpx;
}
</style>