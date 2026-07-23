import uviewPlus from 'uview-plus'
import $store from './stores/index.js'
import App from './App.vue' // 添加App组件导入
import {http ,getSsidAsync,getBaseUrl,warmupBaseDomain} from './stores/http.js' // 移到顶部统一导入
// 导入common.js中的函数
import { formatPrice, completeImageUrls,formatSchedule,formatUnFixed,noteChange,getDeviceAppInfo,getOAID,
  getDeviceInfo,initDySdk,saveDyChannel,collectAndroidDeviceInfo,saveOdidDevice,ensureAndroidIdRawCollected,requestDeviceAuthAndCollect,initBytedanceConvertSdk,reportBytedanceRegisterEvent,syncDevNo,getStaticSrc } from './stores/common.js'
// 导入permission.js中的函数
import { usePermission, judgeIosPermission, requestAndroidPermission, checkSystemEnableLocation, gotoAppPermissionSetting, isIos } from './stores/permission.js'


// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
// 注册common.js相关方法为全局属性
Vue.prototype.$http = http
Vue.prototype.$getSsidAsync = getSsidAsync
Object.defineProperty(Vue.prototype, '$baseUrl', {
  get() {
    return (this.$store && this.$store.state && this.$store.state.baseUrl) || getBaseUrl()
  },
  configurable: true
})
Vue.prototype.$warmupBaseDomain = warmupBaseDomain
Vue.prototype.$initDySdk = initDySdk
Vue.prototype.$saveDyChannel = saveDyChannel
Vue.prototype.$collectAndroidDeviceInfo = collectAndroidDeviceInfo
Vue.prototype.$saveOdidDevice = saveOdidDevice
Vue.prototype.$ensureAndroidIdRawCollected = ensureAndroidIdRawCollected
Vue.prototype.$requestDeviceAuthAndCollect = requestDeviceAuthAndCollect
Vue.prototype.$initBytedanceConvertSdk = initBytedanceConvertSdk
Vue.prototype.$reportBytedanceRegisterEvent = reportBytedanceRegisterEvent
Vue.prototype.$syncDevNo = syncDevNo
Vue.prototype.$getStaticSrc = getStaticSrc
// 注册permission相关方法为全局属性
Vue.prototype.$usePermission = usePermission
Vue.prototype.$judgeIosPermission = judgeIosPermission
Vue.prototype.$requestAndroidPermission = requestAndroidPermission
Vue.prototype.$checkSystemEnableLocation = checkSystemEnableLocation
Vue.prototype.$gotoAppPermissionSetting = gotoAppPermissionSetting
Vue.prototype.$isIos = isIos
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.$http = http
  app.config.globalProperties.$getSsidAsync = getSsidAsync
  Object.defineProperty(app.config.globalProperties, '$baseUrl', {
    get() {
      return (this.$store && this.$store.state && this.$store.state.baseUrl) || getBaseUrl()
    },
    configurable: true
  })
  app.config.globalProperties.$warmupBaseDomain = warmupBaseDomain
  app.config.globalProperties.$formatPrice = formatPrice
  app.config.globalProperties.$completeImageUrls = completeImageUrls
  app.config.globalProperties.$formatSchedule = formatSchedule
  app.config.globalProperties.$formatUnFixed = formatUnFixed
  app.config.globalProperties.$noteChange = noteChange
  app.config.globalProperties.$getDeviceAppInfo = getDeviceAppInfo
  app.config.globalProperties.$getOAID = getOAID
  app.config.globalProperties.$getDeviceInfo = getDeviceInfo
  app.config.globalProperties.$initDySdk = initDySdk
  app.config.globalProperties.$saveDyChannel = saveDyChannel
  app.config.globalProperties.$collectAndroidDeviceInfo = collectAndroidDeviceInfo
  app.config.globalProperties.$saveOdidDevice = saveOdidDevice
  app.config.globalProperties.$ensureAndroidIdRawCollected = ensureAndroidIdRawCollected
  app.config.globalProperties.$requestDeviceAuthAndCollect = requestDeviceAuthAndCollect
  app.config.globalProperties.$initBytedanceConvertSdk = initBytedanceConvertSdk
  app.config.globalProperties.$reportBytedanceRegisterEvent = reportBytedanceRegisterEvent
  app.config.globalProperties.$syncDevNo = syncDevNo
  app.config.globalProperties.$getStaticSrc = getStaticSrc
  // 注册permission相关方法为全局属性
  app.config.globalProperties.$usePermission = usePermission
  app.config.globalProperties.$judgeIosPermission = judgeIosPermission
  app.config.globalProperties.$requestAndroidPermission = requestAndroidPermission
  app.config.globalProperties.$checkSystemEnableLocation = checkSystemEnableLocation
  app.config.globalProperties.$gotoAppPermissionSetting = gotoAppPermissionSetting
  app.config.globalProperties.$isIos = isIos
  app.use(uviewPlus)
  app.use($store)
  return {
    app,
    $store
  }
}
// #endif