<template>
  <view class="contract-container">

    <!-- 合同内容区域 -->
    <view class="content">
      <!-- 合同头部信息 -->
      <view class="contract-header">
        <view class="contract-no">合同编号：{{ contractInfo.contract_no }}</view>
      </view>
      
      <!-- 三方信息 -->
      <view class="parties-info">
        <view class="party-item">
          <view class="party-label">甲方：</view>
          <view class="party-value">{{ contractInfo.name1 }}</view>
        </view>
        <view class="party-item">
          <view class="party-label">乙方：</view>
          <view class="party-value">{{ contractInfo.name2 }}</view>
        </view>
        <view class="party-item">
          <view class="party-label">丙方：</view>
          <view class="party-value">{{ contractInfo.name3 }}</view>
        </view>
      </view>
      
      <!-- 合同说明 -->
      <view class="contract-intro">
        <view class="intro-title">甲乙丙三方友好协商，本着平等自愿、诚实信用的原则，就甲方使用乙方提供的本网站所有服务达成如下协议：</view>
      </view>
      
      <!-- 项目明细表格 -->
      <view class="table-section">
        <view class="table-title">一、项目明细</view>
        <view class="table-container">
          <view class="table-row table-header">
            <view class="table-cell">项目名称</view>
            <view class="table-cell">{{contractInfo.item_name}}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">姓名</view>
            <view class="table-cell">{{ contractInfo.name1 }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">身份证</view>
            <view class="table-cell">{{ contractInfo.name1_idcard }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">投入本金金额（下称甲方资本金）</view>
            <view class="table-cell">{{ contractInfo.item_money }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">协议期（天）</view>
            <view class="table-cell">{{ contractInfo.item_days }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">日收益率</view>
            <view class="table-cell">{{ contractInfo.item_apr }}%</view>
          </view>
          <view class="table-row">
            <view class="table-cell">起始日</view>
            <view class="table-cell">{{ contractInfo.item_adddate }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">到期日</view>
            <view class="table-cell">{{ contractInfo.item_enddate }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">应收本息（元）</view>
            <view class="table-cell">{{ contractInfo.item_back_money }}</view>
          </view>
          <view class="table-row">
            <view class="table-cell">还款方式</view>
            <view class="table-cell">{{ contractInfo.item_type }}</view>
          </view>
        </view>
      </view>
      <view class="contract-intro">
        
        <view class="table-title">
            <up-parse :content="contractInfo.contract_content"></up-parse>
        </view>
      </view>
      <view class="contract-intro">
        <view class="footer">
          <!-- 签字区域 -->
          <view class="signature-section">
            <!-- 甲方签字 -->
            <view class="party-signature">
              <view class="party-name">甲方：{{ contractInfo.name1 }}</view>
              <view class="signature-date">{{ contractInfo.startDate }}</view>
            </view>
            
            <!-- 乙方签字和印章 -->
            <view class="party-signature">
              <view class="party-name">乙方：{{ contractInfo.name2 }}</view>
              <view class="signature-date">{{ contractInfo.startDate }}</view>
              <view class="seal">
                <view class="seal-circle">
                  <image  :src="$baseUrl +  contractInfo.contract_image1 " mode="scaleToFill"/>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 丙方签字和印章 -->
          <view class="signature-section">
            <view class="party-signature">
              <view class="party-name">丙方：{{ contractInfo.name3 }}</view>
              <view class="signature-date">{{ contractInfo.startDate }}</view>
              <view class="seal">
                <view class="seal-circle">
                  <image  :src="$baseUrl +  contractInfo.contract_image2 " mode="scaleToFill"/>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      contractInfo: {
        
      },
	  helpContent:''
    }
  },
  methods: {
    loadContractData(id) {
        // 模拟从服务器加载合同数据
        // 实际项目中应该调用API获取真实数据
        console.log('加载合同数据', this.contractInfo)
        this.$http(
            '/item/list/contract', {id:id}, "POST").then(res => {
            console.log('数据',res.data)
			this.helpContent = this.$noteChange(res.data.contract_content);
            this.contractInfo = res.data
            
        })
    }
  },
  onLoad(e) {
    // 可以在这里加载合同数据
    this.loadContractData(e.id)
  },
  
}
</script>

<style scoped>
.contract-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-size: 14px;
  color: #333333;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  background-color: #ffffff;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.back-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.nav-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.placeholder {
  width: 24px;
}

/* 内容区域样式 */
.content {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
}

/* 合同头部信息 */
.contract-header {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.contract-no {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

/* 三方信息 */
.parties-info {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.party-item {
  display: flex;
  margin-bottom: 10px;
}

.party-item:last-child {
  margin-bottom: 0;
}

.party-label {
  font-weight: 500;
  min-width: 50px;
  margin-right: 8px;
}

.party-value {
  flex: 1;
  color: #666666;
}

/* 合同说明 */
.contract-intro {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  line-height: 1.6;
}

.intro-title {
  color: #666666;
}

/* 表格区域样式 */
.table-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-title {
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 12px;
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
}

.table-cell:last-child {
  border-right: none;
  text-align: right;
  color: #666666;
}

/* 签字区域样式 */
  .footer {
    margin-top: 20px;
  }

  .signature-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .c-party-section {
    justify-content: flex-end;
  }

  .party-signature {
    position: relative;
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .party-name {
    font-size: 14px;
    color: #333333;
    margin-bottom: 5px;
    position: relative;
    z-index: 2;
  }

  .signature-date {
    font-size: 12px;
    color: #666666;
    margin-top: 60px; /* 为印章留出空间 */
  }

  /* 印章样式 */
  .seal {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  .seal-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    /* border: 2px solid #00aa00; */
    /* background-color: rgba(0, 170, 0, 0.1); */
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6; /* 降低印章透明度 */
  }
.seal-circle image{
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.seal-text {
  font-size: 18px;
  font-weight: bold;
  color: #00aa00;
  transform: rotate(5deg);
}

/* 响应式设计 */
@media (max-width: 375px) {
  .content {
    padding: 12px;
  }
  
  .table-cell {
    padding: 10px 6px;
    font-size: 13px;
  }
  
  .party-signature {
    width: 100px;
  }
  
  .seal-circle {
    width: 60px;
    height: 60px;
  }
  
  .seal-text {
    font-size: 16px;
  }
}
</style>