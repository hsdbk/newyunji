// 埋点工具类
class TrackingManager {
  constructor() {
    this.platform = '';
    this.appId = '';
    this.isInitialized = false;
  }

  // 初始化埋点配置
  init(config) {
    this.platform = config.platform || '';
    this.appId = config.appId || '';
    this.isInitialized = true;
    console.log('埋点初始化完成', { platform: this.platform, appId: this.appId });
  }

  // 获取当前平台
  getCurrentPlatform() {
    // 使用uni-app的API获取当前平台
    return uni.getSystemInfoSync().platform;
  }

  // 基础埋点上报方法
  track(eventName, params = {}) {
    if (!this.isInitialized) {
      console.warn('埋点尚未初始化');
      return;
    }

    // 构建通用埋点参数
    const commonParams = {
      platform: this.platform,
      appId: this.appId,
      eventName,
      timestamp: Date.now(),
      userId: uni.getStorageSync('userId') || '',
      ...params
    };

    // 根据不同平台执行不同的埋点逻辑
    const currentPlatform = this.getCurrentPlatform();
    const systemInfo = uni.getSystemInfoSync();
    const appPlatform = systemInfo.appPlatform || '';
    
    // 处理小程序平台
    if (appPlatform === 'tt') {
      // 抖音小程序
      this.trackDouyin(commonParams);
    } else if (appPlatform === 'ks') {
      // 快手小程序
      this.trackKuaishou(commonParams);
    } else {
      // 其他平台
      switch (currentPlatform) {
        case 'android':
          this.trackAndroid(commonParams);
          break;
        case 'ios':
          this.trackIOS(commonParams);
          break;
        case 'devtools': // 微信开发者工具
        case 'mp-weixin': // 微信小程序
          this.trackWeixin(commonParams);
          break;
        case 'h5':
          this.trackH5(commonParams);
          break;
        default:
          this.trackDefault(commonParams);
          break;
      }
    }
  }

  // Android平台埋点
  trackAndroid(params) {
    // 这里可以集成Android原生埋点SDK的调用
    console.log('Android埋点上报:', params);
    // 示例：调用原生SDK
    // if (window.plus) {
    //   plus.android.importClass('com.example.tracking.Tracker');
    //   const tracker = new plus.android.importClass('com.example.tracking.Tracker');
    //   tracker.trackEvent(params.eventName, JSON.stringify(params));
    // }
  }

  // iOS平台埋点
  trackIOS(params) {
    // 这里可以集成iOS原生埋点SDK的调用
    console.log('iOS埋点上报:', params);
    // 示例：调用原生SDK
    // if (window.plus) {
    //   const tracker = plus.ios.importClass('Tracker');
    //   tracker.trackEventWithParams(params.eventName, JSON.stringify(params));
    // }
  }

  // 微信小程序埋点
  trackWeixin(params) {
    // 微信小程序可以使用wx.reportAnalytics或第三方SDK
    console.log('微信小程序埋点上报:', params);
    // 示例：使用微信官方分析
    // if (wx.reportAnalytics) {
    //   wx.reportAnalytics(params.eventName, params);
    // }
  }

  // H5平台埋点
  trackH5(params) {
    // H5平台可以使用第三方埋点SDK，如百度统计、友盟等
    console.log('H5埋点上报:', params);
    // 示例：使用第三方SDK
    // if (window._hmt) {
    //   window._hmt.push(['_trackEvent', params.eventName, JSON.stringify(params)]);
    // }
  }

  // 默认埋点处理（通用）
  trackDefault(params) {
    // 通用埋点逻辑，可以是发送HTTP请求到自定义埋点服务器
    console.log('默认埋点上报:', params);
    this.sendTrackRequest(params);
  }

  // 发送埋点请求到服务器
  sendTrackRequest(params) {
    // 这里可以调用后台提供的埋点接口
    // 注意：实际使用时需要替换为真实的埋点接口地址
    uni.request({
      url: '/api/tracking', // 替换为真实的埋点接口
      method: 'POST',
      data: params,
      success: (res) => {
        console.log('埋点上报成功', res);
      },
      fail: (err) => {
        console.error('埋点上报失败', err);
      }
    });
  }

  // 页面访问埋点
  trackPageView(pageName, params = {}) {
    this.track('page_view', { pageName, ...params });
  }

  // 用户行为埋点
  trackUserAction(actionName, params = {}) {
    this.track('user_action', { actionName, ...params });
  }

  // 注册埋点
  trackRegister(params = {}) {
    this.track('register', { ...params });
  }

  // 登录埋点
  trackLogin(params = {}) {
    this.track('login', { ...params });
  }

  // 抖音小程序埋点
  trackDouyin(params) {
    console.log('抖音小程序埋点上报:', params);
    
    // 根据事件类型处理不同的埋点
    if (params.eventName === 'register') {
      // 抖音注册埋点 - 使用抖音小程序的埋点API
      if (typeof tt !== 'undefined' && tt.reportAnalytics) {
        // 根据注册状态选择不同的事件名称
        const eventName = params.status === 'failed' ? 'register_failed' : 'register_success';
        
        // 抖音小程序埋点参数格式需要符合抖音要求
        const douyinParams = {
          phone: params.phone || '',
          inviteCode: params.inviteCode || '',
          registerTime: params.timestamp || Date.now()
        };
        
        // 添加失败原因（如果注册失败）
        if (params.status === 'failed') {
          douyinParams.errorMsg = params.errorMsg || '';
          douyinParams.errorCode = params.errorCode || '';
        }
        
        tt.reportAnalytics(eventName, douyinParams);
      }
    } else {
      // 其他事件的通用处理
      if (typeof tt !== 'undefined' && tt.reportAnalytics) {
        tt.reportAnalytics(params.eventName, params);
      }
    }
  }

  // 快手小程序埋点
  trackKuaishou(params) {
    console.log('快手小程序埋点上报:', params);
    
    // 根据事件类型处理不同的埋点
    if (params.eventName === 'register') {
      // 快手注册埋点 - 使用快手小程序的埋点API
      if (typeof ks !== 'undefined' && ks.reportAnalytics) {
        // 根据注册状态选择不同的事件名称
        const eventName = params.status === 'failed' ? 'register_failed' : 'register_success';
        
        // 快手埋点参数格式需要符合快手要求
        const kuaishouParams = {
          phone: params.phone || '',
          inviteCode: params.inviteCode || '',
          registerTime: params.timestamp || Date.now()
        };
        
        // 添加失败原因（如果注册失败）
        if (params.status === 'failed') {
          kuaishouParams.errorMsg = params.errorMsg || '';
          kuaishouParams.errorCode = params.errorCode || '';
        }
        
        ks.reportAnalytics(eventName, kuaishouParams);
      }
    } else {
      // 其他事件的通用处理
      if (typeof ks !== 'undefined' && ks.reportAnalytics) {
        ks.reportAnalytics(params.eventName, params);
      }
    }
  }
}

// 导出单例实例
export default new TrackingManager();
