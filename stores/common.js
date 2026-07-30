// 导入http模块
import { http } from './http.js';

// 初始化抖音SDK
function initDySdk() {

    // 抖音SDK初始化
    let dysdk = uni.requireNativePlugin('lilu-dysdk-transform');

    if (!dysdk) {
        console.log('抖音SDK未加载，跳过初始化');
        return;
    }

    dysdk.customEvent()
    let code = dysdk.checkPhonePermission();
    console.log('code:', code, typeof(code));

    if (code === '1') { //已经授权
        console.log('dysdk已经授权');
        dysdk.init({
            enablePlaySession: true,
            playSessionInterval: 60000
        });

    } else { //未授权
        // //是否已经弹出过权限申请窗口，如果已弹出则不弹
        // let showPermission = uni.getStorageSync('showPermission') || '0'
        // console.log('showPermission为:', showPermission);
        // if (showPermission !== '1') { //第一次弹出授权请求窗口
        // 	uni.setStorageSync('showPermission', '1');
        // 	dysdk.requestPhonePermission();
        // }
    }
}

// 保存抖音渠道号
function saveDyChannel() {
    return;
    if (!dysdk) {
        console.log('抖音SDK未加载，跳过渠道号获取');
        return;
    }
    //获取抖音分包的渠道号
    let dyChannel = dysdk.getDyChannel();
    console.log('dyChannel', dyChannel)
    uni.setStorageSync('dyChannel', dyChannel);
}

// 价格格式化函数
function formatPrice(price,quantity = 1,tofix = 2) {
    const num = Number(price);
    const qty = Number(quantity); // 确保quantity是数字类型
    let value;

    if(qty !== 1 && !isNaN(qty)){
        // 当quantity不为1时，计算price*quantity并保留两位小数
        value = Math.round(num * qty * 100) / 100;
    }else{
        value = num;
    }

    if (isNaN(value)) return '0.00';

    // 保留两位小数
    const fixedNum = value.toFixed(tofix);

    // 分割整数和小数部分
    const parts = fixedNum.split('.');

    // 对整数部分添加千位分隔符
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

// 可以在这里添加其他通用函数
function completeImageUrls(content) {
    if (!content) return '';
    // 使用正则表达式匹配所有的图片标签，并补全图片地址
    const baseUrl = this.$baseUrl;

    // 处理换行符，将\n转换为<br/>标签
    let updatedContent = content.replace(/\n/g, '<br/>');
    // 匹配src属性中的相对路径图片
    // 处理src="/path/to/image.jpg" 格式，并添加width="100%"
    updatedContent = updatedContent.replace(/src="\/([^"http][^"]*)"/g, `src="${baseUrl}/$1" width="100%"`);

    // 处理src='/path/to/image.jpg' 格式，并添加width="100%"
    updatedContent = updatedContent.replace(/src='\/([^'http][^']*)'/g, `src='${baseUrl}/$1' width='100%'`);

    // 处理data-src属性（如果有懒加载的图片），并添加width="100%"
    updatedContent = updatedContent.replace(/data-src="\/([^"http][^"]*)"/g, `data-src="${baseUrl}/$1" width="100%"`);
    updatedContent = updatedContent.replace(/data-src='\/([^'http][^']*)'/g, `data-src='${baseUrl}/$1' width='100%'`);

    return updatedContent;
}
// 格式化进度百分比，避免toFixed调用错误
function formatSchedule(schedule) {
    // 检查是否为有效数字
    if (schedule === null || schedule === undefined || isNaN(parseFloat(schedule))) {
        return '0.00';
    }
    return parseFloat(schedule).toFixed(2);
}
function formatUnFixed(schedule) {
    // 检查是否为有效数字
    if (schedule === null || schedule === undefined || isNaN(parseFloat(schedule))) {
        return '0';
    }
    // 转换为数字并取整，清除小数部分
    const num = parseFloat(schedule);
    // 使用Math.floor可能会导致负数向下取整，使用parseInt更安全
    return parseInt(num, 10).toString();
}
function noteChange(data) {
    // 处理换行符和数字序号问题
    // 将\n2, \n3等替换为适当的HTML格式
    let treeRuleNote = data.replace(/\n(\d+)/g, '<br/><p style="margin-bottom: 20rpx;">$1');

    // 确保所有段落都正确关闭
    if (!treeRuleNote.includes('</p>')) {
        treeRuleNote = treeRuleNote.replace(/<p style="margin-bottom: 20rpx;">/g,
            '<p style="margin-bottom: 20rpx;">').replace(/\n/g, '<br/>');

        // 如果是以<p>标签开始但没有关闭，添加闭合标签
        if (treeRuleNote.startsWith('<p')) {
            treeRuleNote += '</p>';
        }
    }
    return treeRuleNote;
}
function getDeviceAppInfo(){
    // 1. 获取系统基础信息
    const systemInfo = uni.getSystemInfoSync();
    if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
        // App 平台
        uni.setStorageSync('dev_type',systemInfo.platform)
    } else if (uni.getAccountInfoSync) {
        // 小程序平台
        uni.setStorageSync('dev_type','miniProgram')
    } else {
        // H5 平台
        uni.setStorageSync('dev_type','h5')
    }

    if (systemInfo.platform === 'android' || systemInfo.platform === 'ios') {
        // App 平台：获取应用版本号
        uni.setStorageSync('app_version',systemInfo.appWgtVersion || '')
    } else if (result.dev_type === 'miniProgram') {
        // 小程序平台：获取小程序版本号
        uni.setStorageSync('app_version',systemInfo.version || '')
    }
}
function getOAID() {
    try{
        console.log('开始获取OAID')
        let devOaid = uni.getStorageSync("dev_oaid")

        if(devOaid){
            console.log('本地已存在OAID:', devOaid)
            return
        }

        console.log('本地没有OAID，开始获取')
        const systemInfo = uni.getSystemInfoSync();
        console.log('系统信息:', systemInfo)

        if(systemInfo.platform !== 'android'){
            console.log('非Android平台，跳过OAID获取')
            return
        }

        plus.device.getOAID({
            success: function(e) {
                console.log('OAID获取成功:', e.oaid)
                uni.setStorageSync('dev_oaid', e.oaid)
                uni.setStorageSync('dev_oaid2', e.oaid)
            },
            fail: function(e) {
                console.log('OAID获取失败，错误信息:', JSON.stringify(e))
                console.log('错误代码:', e.code)
                console.log('错误消息:', e.message)

            }
        });
    }catch (error) {
        console.error('getOAID 失败:', error);
    }
}
function getDeviceInfo() {
    try{
        plus.device.getInfo({
            success: function(e) {
                console.log('getDeviceInfo success: ' + JSON.stringify(e));
                uni.setStorageSync('device_getInfo', e)
            },
            fail: function(e) {
                console.log('getDeviceInfo failed: ' + JSON.stringify(e));
                uni.setStorageSync('device_getInfo', e)
            }
        });
    } catch (error) {
        console.error('getDeviceInfo 失败:', error);
    }
}

function md5HexLower(text) {
    const value = String(text || '')
    if (!value) return ''
    // #ifdef APP-PLUS
    if (plus.os.name === 'Android') {
        try {
            const MessageDigest = plus.android.importClass('java.security.MessageDigest')
            const StringCls = plus.android.importClass('java.lang.String')
            const BigInteger = plus.android.importClass('java.math.BigInteger')
            const md = MessageDigest.getInstance('MD5')
            const bytes = new StringCls(value).getBytes('UTF-8')
            const digest = md.digest(bytes)
            const bigInt = new BigInteger(1, digest)
            let hash = String(bigInt.toString(16))
            while (hash.length < 32) {
                hash = '0' + hash
            }
            return hash
        } catch (error) {
            console.error('md5HexLower 失败:', error)
        }
    }
    // #endif
    return value.toLowerCase()
}

function syncAndroidIdReportValue() {
    const raw = uni.getStorageSync('dev_android_id_raw')
    if (!raw) {
        return uni.getStorageSync('dev_android_id') || ''
    }
    const reportValue = formatAndroidIdForAttribution(raw)
    if (reportValue) {
        uni.setStorageSync('dev_android_id', reportValue)
    }
    return reportValue
}

function formatAndroidIdForAttribution(rawAndroidId) {
    if (!rawAndroidId) return ''
    const raw = String(rawAndroidId).trim().toLowerCase()
    // 巨量归因要求 32 位小写 MD5，原始 ANDROID_ID 为 16 位十六进制
    if (/^[0-9a-f]{16}$/.test(raw)) {
        return md5HexLower(raw)
    }
    if (/^[0-9a-f]{32}$/.test(raw)) {
        return raw
    }
    return md5HexLower(raw)
}

function getAttributionDevice() {
    const result = {
        device_id_type: '',
        device_id: '',
        package_name: ''
    }
    // #ifdef APP-PLUS
    try {
        if (plus.os.name === 'Android') {
            const activity = plus.android.runtimeMainActivity()
            const Secure = plus.android.importClass('android.provider.Settings$Secure')
            result.device_id_type = 'ANDROID_ID'
            result.device_id = Secure.getString(
                activity.getContentResolver(),
                Secure.ANDROID_ID
            )
            result.package_name = activity.getPackageName()
        }
    } catch (error) {
        console.error('getAttributionDevice 失败:', error)
    }
    // #endif
    return result
}

function saveAttributionDevice(device) {
    if (!device) return
    if (device.device_id) {
        const rawAndroidId = String(device.device_id).trim().toLowerCase()
        uni.setStorageSync('dev_android_id_raw', rawAndroidId)
        syncAndroidIdReportValue()
    }
    if (device.device_id_type) {
        uni.setStorageSync('dev_device_id_type', device.device_id_type)
    }
    if (device.package_name) {
        uni.setStorageSync('package_name', device.package_name)
    }
}

function saveOdidDevice(device) {
    if (!device) return
    if (device.device_id) {
        uni.setStorageSync('dev_odid', device.device_id)
    }
    if (device.device_id_type) {
        uni.setStorageSync('dev_device_id_type', device.device_id_type)
    }
    if (device.package_name) {
        uni.setStorageSync('package_name', device.package_name)
    }
}

function isPrivacyAgreed() {
    // #ifdef APP-PLUS
    try {
        if (plus.runtime.isAgreePrivacy) {
            return plus.runtime.isAgreePrivacy()
        }
    } catch (error) {
        console.error('isPrivacyAgreed 失败:', error)
    }
    return false
    // #endif
    return true
}

let bytedanceSdkInited = false

function getBytedanceConvertModule() {
    // #ifdef APP-PLUS
    return uni.requireNativePlugin('lw_bytedance_convert')
    // #endif
    return null
}

function canInitBytedanceSdk() {
    if (!isPrivacyAgreed()) {
        return false
    }
    // #ifdef APP-PLUS
    if (plus.os.name === 'Android' && uni.getStorageSync('permission_read_phone_state') !== 1) {
        return false
    }
    // #endif
    return true
}

function reportBytedanceActivateEvent(onDone) {
    const mod = getBytedanceConvertModule()
    if (!mod) {
        onDone && onDone(false)
        return
    }
    if (typeof mod.reportActivateEvent === 'function') {
        mod.reportActivateEvent((res) => {
            console.log('BytedanceConvertModule reportActivateEvent', res)
            onDone && onDone(true, res)
        })
        return
    }
    onDone && onDone(true)
}

function initBytedanceConvertSdk(onDone) {
    if (!canInitBytedanceSdk()) {
        console.log('不满足巨量SDK初始化条件，跳过激活')
        onDone && onDone(false)
        return
    }
    if (bytedanceSdkInited) {
        reportBytedanceActivateEvent(onDone)
        return
    }
    const mod = getBytedanceConvertModule()
    if (!mod || typeof mod.initSDK !== 'function') {
        console.log('BytedanceConvertModule 未加载或不支持 initSDK')
        onDone && onDone(false)
        return
    }
    mod.initSDK((res) => {
        console.log('BytedanceConvertModule initSDK', res)
        bytedanceSdkInited = true
        reportBytedanceActivateEvent(onDone)
    })
}

function reportBytedanceRegisterEvent(registerType = 'phone', onDone) {
    const mod = getBytedanceConvertModule()
    if (!mod || typeof mod.reportRegisterEvent !== 'function') {
        console.log('BytedanceConvertModule 未加载或不支持 reportRegisterEvent')
        onDone && onDone(false)
        return
    }
    const report = () => {
        mod.reportRegisterEvent(registerType, (res) => {
            console.log('BytedanceConvertModule reportRegisterEvent', res)
            onDone && onDone(true, res)
        })
    }
    if (bytedanceSdkInited) {
        report()
        return
    }
    initBytedanceConvertSdk((ok) => {
        if (ok) {
            report()
            return
        }
        onDone && onDone(false)
    })
}

function initConvertAdSdk(onDone) {
    initBytedanceConvertSdk(onDone)
}

let privacyDeviceCollectStarting = false

function tryPrivacyDeviceCollect(vm, callbacks = {}) {
    if (!isPrivacyAgreed()) {
        return false
    }
    if (uni.getStorageSync('device_privacy_collect_done') === '1') {
        return false
    }
    if (privacyDeviceCollectStarting) {
        return false
    }
    privacyDeviceCollectStarting = true
    const { afterCollect, onDone, onDenied } = callbacks
    requestDeviceAuthAndCollect(vm, 'activate', {
        afterCollect: () => {
            initConvertAdSdk()
            if (afterCollect) {
                afterCollect()
            }
            uni.setStorageSync('device_privacy_collect_done', '1')
            privacyDeviceCollectStarting = false
        },
        onDone: (granted) => {
            if (!granted) {
                privacyDeviceCollectStarting = false
            }
            if (onDone) {
                onDone(granted)
            }
        },
        onDenied: () => {
            privacyDeviceCollectStarting = false
            if (onDenied) {
                onDenied()
            }
        }
    })
    return true
}

function collectAndroidDeviceInfo() {
    if (!isPrivacyAgreed()) {
        console.log('未同意隐私政策，跳过设备信息采集')
        return
    }
    // #ifdef APP-PLUS
    if (plus.os.name === 'Android' && uni.getStorageSync('permission_read_phone_state') !== 1) {
        console.log('未授权，跳过 ANDROID_ID 获取')
        return
    }
    // #endif
    saveAttributionDevice(getAttributionDevice())
    getOAID()
    getDeviceInfo()
}

const MAX_PHONE_AUTH_DENY_COUNT = 2
const PHONE_AUTH_DENIED_QUIT_KEY = 'phone_auth_denied_quit'
let phonePermissionRequesting = false
let deviceAuthCollectInProgress = false

function shouldSkipPhoneAuthFlow() {
    if (uni.getStorageSync(PHONE_AUTH_DENIED_QUIT_KEY) === '1') {
        return true
    }
    return false
}

function quitAppAfterAuthDenied() {
    console.log('已连续拒绝授权' + MAX_PHONE_AUTH_DENY_COUNT + '次，退出APP')
    uni.setStorageSync(PHONE_AUTH_DENIED_QUIT_KEY, '1')
    phonePermissionRequesting = false
    deviceAuthCollectInProgress = false
    // #ifdef APP-PLUS
    plus.runtime.quit()
    // #endif
}

function resetPhonePermissionRequestingState() {
    phonePermissionRequesting = false
    deviceAuthCollectInProgress = false
}

function requestPhonePermission(vm, onGranted, onDenied, denyCount = 0, options = {}) {
    const { repeatOnDeny = true, quitOnDenied = true } = options
    // #ifdef APP-HARMONY
    onGranted()
    return
    // #endif

    // #ifdef APP-PLUS
    if (plus.os.name === 'iOS') {
        uni.setStorageSync('permission_read_phone_state', 1)
        onGranted()
        return
    }
    if (shouldSkipPhoneAuthFlow()) {
        onDenied && onDenied()
        return
    }
    if (denyCount === 0) {
        if (phonePermissionRequesting) {
            return
        }
        phonePermissionRequesting = true
    }
    vm.$requestAndroidPermission('android.permission.READ_PHONE_STATE').then(res => {
        console.log('授权状态android====', res)
        uni.setStorageSync('permission_read_phone_state', res)
        if (res === 1) {
            phonePermissionRequesting = false
            uni.removeStorageSync(PHONE_AUTH_DENIED_QUIT_KEY)
            onGranted()
            return
        }

        if (!repeatOnDeny) {
            onDenied && onDenied()
            if (quitOnDenied) {
                quitAppAfterAuthDenied()
            } else {
                resetPhonePermissionRequestingState()
            }
            return
        }

        const nextDenyCount = denyCount + 1
        if (nextDenyCount >= MAX_PHONE_AUTH_DENY_COUNT) {
            onDenied && onDenied()
            if (quitOnDenied) {
                quitAppAfterAuthDenied()
            } else {
                resetPhonePermissionRequestingState()
            }
            return
        }

        requestPhonePermission(vm, onGranted, onDenied, nextDenyCount, options)
    })
    return
    // #endif

    onGranted()
}

function hasAndroidIdRaw() {
    const raw = uni.getStorageSync('dev_android_id_raw')
    return !!(raw && String(raw).trim())
}

function ensureAndroidIdRawCollected(vm, type = 'activate', callbacks = {}) {
    if (!isPrivacyAgreed()) {
        console.log('未同意隐私政策，跳过 ANDROID_ID 获取')
        return
    }
    if (shouldSkipPhoneAuthFlow()) {
        return
    }
    // #ifdef APP-PLUS
    if (plus.os.name === 'Android') {
        if (hasAndroidIdRaw()) {
            syncAndroidIdReportValue()
            console.log('dev_android_id_raw 已有值，跳过获取')
            if (callbacks.afterCollect) {
                callbacks.afterCollect()
            }
            if (callbacks.onDone) {
                callbacks.onDone(true)
            }
            return
        }
        console.log('dev_android_id_raw 为空，开始获取')
        if (uni.getStorageSync('permission_read_phone_state') === 1) {
            collectAndroidDeviceInfo()
            if (callbacks.afterCollect) {
                callbacks.afterCollect()
            }
            uni.setStorageSync('syncDevNoCount', 0)
            vm.$syncDevNo(type)
            if (callbacks.onDone) {
                callbacks.onDone(true)
            }
            return
        }
    }
    // #endif
    requestDeviceAuthAndCollect(vm, type, callbacks)
}

function requestDeviceAuthAndCollect(vm, type = 'activate', callbacks = {}) {
    if (!isPrivacyAgreed()) {
        console.log('未同意隐私政策，跳过授权采集')
        return
    }
    if (shouldSkipPhoneAuthFlow()) {
        return
    }
    if (deviceAuthCollectInProgress || phonePermissionRequesting) {
        return
    }
    deviceAuthCollectInProgress = true
    const { onDone, afterCollect, onDenied, quitOnDenied = true, repeatOnDeny = true } = callbacks
    const finishAuth = () => {
        deviceAuthCollectInProgress = false
        collectAndroidDeviceInfo()
        if (afterCollect) {
            afterCollect()
        }
        uni.setStorageSync('syncDevNoCount', 0)
        vm.$syncDevNo(type)
        if (onDone) {
            onDone(true)
        }
    }
    const handleDenied = (res) => {
        deviceAuthCollectInProgress = false
        if (onDenied) {
            onDenied(res)
        }
        if (onDone) {
            onDone(false)
        }
        if (!quitOnDenied) {
            resetPhonePermissionRequestingState()
        }
    }

    requestPhonePermission(vm, finishAuth, handleDenied, 0, {
        repeatOnDeny,
        quitOnDenied
    })
}

function syncDevNo(type = 'activate') {
    try{
        if (!isPrivacyAgreed()) {
            return
        }
        syncAndroidIdReportValue()
        let syncDevNoCount = uni.getStorageSync("syncDevNoCount");
        syncDevNoCount = syncDevNoCount || 0;
        // console.log('当前syncDevNoCount', syncDevNoCount);
        // 仅限制激活上报次数，注册/登录上报不应被 activate 次数耗尽后拦截
        if (type === 'activate' && syncDevNoCount >= 10) {
        	// console.log('syncDevNo 已达到最大执行次数10次，不再执行');
        	return;
        }
        
        // 初始化抖音SDK
        // initDySdk()
        // 保存抖音渠道号
        saveDyChannel()
        if (uni.getStorageSync('permission_read_phone_state') === 1) {
            getOAID()
            getDeviceInfo()
        }

        let devNo = uni.getStorageSync("dev_no"),
            devType = uni.getStorageSync("dev_type"),
            devOaid = uni.getStorageSync("dev_oaid"),
            devOaid2 = uni.getStorageSync("dev_oaid2"),	//device_getInfo
            devAndroidId = uni.getStorageSync("dev_android_id"),
			devAndroidIdRaw = uni.getStorageSync('dev_android_id_raw'),
            devClientId = uni.getStorageSync("dev_client_id"),
            deviceGetInfo = uni.getStorageSync("device_getInfo"),
            packageName = uni.getStorageSync("package_name"),
            devDeviceIdType = uni.getStorageSync("dev_device_id_type"),
            customerActiveTime = uni.getStorageSync("customer_active_time"),
            app_no = uni.getStorageSync('m_app_no'),
            app_version = uni.getStorageSync('app_version');

        if (!app_no) app_no= '';

        const params = {
            dev_no: devNo,
            dev_type: devType,
            dev_oaid: devOaid,
            dev_oaid2: devOaid2,
            device_get_info: deviceGetInfo,
            app_no: app_no,
            dev_android_id: devAndroidId,
            dev_android_id_raw: devAndroidIdRaw,
            dev_client_id: devClientId,
            package_name: packageName,
            dev_device_id_type: devDeviceIdType,
            customer_active_time: customerActiveTime,
            app_version: app_version,
            type:type
        };

        console.error('/api/api/sync:', params);

        // 调用http函数
        http(
            '/api/api/sync', params, "POST").then(res => {
            // console.log('syncDevNo 响应:', res);
            uni.setStorageSync('syncInfo', res.data);
            uni.$emit && uni.$emit('syncInfoUpdated', res.data);
            uni.setStorageSync('syncDevNoCount', syncDevNoCount + 1);
            // console.log('syncDevNo 执行次数:', syncDevNoCount + 1);
        }).catch(error => {
            // console.error('syncDevNo 失败:', error);
            uni.showToast({
                title: '同步设备信息失败，请重试',
                icon: 'none'
            });
        });
    }catch (error){
        console.error('syncDevNo 失败:', error);
    }
}
function getStaticSrc(path) {
	let staticImageTimestamp = Date.now();
	if (!path) return '';
	const connector = path.includes('?') ? '&' : '?';
	return `${path}${connector}t=`+staticImageTimestamp;
}
// 导出函数
export { getStaticSrc,formatPrice, completeImageUrls, formatSchedule, formatUnFixed, noteChange, getDeviceAppInfo, getOAID, getDeviceInfo, initDySdk, saveDyChannel, getAttributionDevice, saveAttributionDevice, collectAndroidDeviceInfo, saveOdidDevice, ensureAndroidIdRawCollected, requestDeviceAuthAndCollect, syncDevNo, isPrivacyAgreed, tryPrivacyDeviceCollect, initConvertAdSdk, initBytedanceConvertSdk, reportBytedanceRegisterEvent };
