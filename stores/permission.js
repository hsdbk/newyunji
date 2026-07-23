/**
 * 本模块封装了Android、iOS的应用权限判断、打开应用权限设置界面、以及位置系统服务是否开启
 */

// 判断是否为 iOS 设备
let isIos = false
// #ifdef APP-PLUS
isIos = (plus.os.name === "iOS")
// #endif

/**
 * 判断推送权限是否开启
 * @returns {boolean} 是否开启推送权限
 */
const judgeIosPermissionPush = () => {
	let result = false
	const UIApplication = plus.ios.import("UIApplication")
	const app = UIApplication.sharedApplication()
	let enabledTypes = 0
	if (app.currentUserNotificationSettings) {
		const settings = app.currentUserNotificationSettings()
		enabledTypes = settings.plusGetAttribute("types")
		console.log("enabledTypes1:" + enabledTypes)
		if (enabledTypes === 0) {
			console.log("推送权限没有开启")
		} else {
			result = true
			console.log("已经开启推送功能!")
		}
		plus.ios.deleteObject(settings)
	} else {
		enabledTypes = app.enabledRemoteNotificationTypes()
		if (enabledTypes === 0) {
			console.log("推送权限没有开启!")
		} else {
			result = true
			console.log("已经开启推送功能!")
		}
		console.log("enabledTypes2:" + enabledTypes)
	}
	plus.ios.deleteObject(app)
	plus.ios.deleteObject(UIApplication)
	return result
}

/**
 * 判断定位权限是否开启
 * @returns {boolean} 是否开启定位权限
 */
const judgeIosPermissionLocation = () => {
	let result = false
	const cllocationManger = plus.ios.import("CLLocationManager")
	const status = cllocationManger.authorizationStatus()
	result = (status !== 2)
	console.log("定位权限开启：" + result)
	// 以下代码判断了手机设备的定位是否关闭，推荐另行使用方法 checkSystemEnableLocation
	/* const enable = cllocationManger.locationServicesEnabled();
	const status = cllocationManger.authorizationStatus();
	console.log("enable:" + enable);
	console.log("status:" + status);
	if (enable && status != 2) {
		result = true;
		console.log("手机定位服务已开启且已授予定位权限");
	} else {
		console.log("手机系统的定位没有打开或未给予定位权限");
	} */
	plus.ios.deleteObject(cllocationManger)
	return result
}

/**
 * 判断麦克风权限是否开启
 * @returns {boolean} 是否开启麦克风权限
 */
const judgeIosPermissionRecord = () => {
	let result = false
	const avaudiosession = plus.ios.import("AVAudioSession")
	const avaudio = avaudiosession.sharedInstance()
	const permissionStatus = avaudio.recordPermission()
	console.log("permissionStatus:" + permissionStatus)
	if (permissionStatus === 1684369017 || permissionStatus === 1970168948) {
		console.log("麦克风权限没有开启")
	} else {
		result = true
		console.log("麦克风权限已经开启")
	}
	plus.ios.deleteObject(avaudiosession)
	return result
}

/**
 * 判断相机权限是否开启
 * @returns {boolean} 是否开启相机权限
 */
const judgeIosPermissionCamera = () => {
	let result = false
	const AVCaptureDevice = plus.ios.import("AVCaptureDevice")
	const authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide')
	console.log("authStatus:" + authStatus)
	if (authStatus === 3) {
		result = true
		console.log("相机权限已经开启")
	} else {
		console.log("相机权限没有开启")
	}
	plus.ios.deleteObject(AVCaptureDevice)
	return result
}

/**
 * 判断相册权限是否开启
 * @returns {boolean} 是否开启相册权限
 */
const judgeIosPermissionPhotoLibrary = () => {
	let result = false
	const PHPhotoLibrary = plus.ios.import("PHPhotoLibrary")
	const authStatus = PHPhotoLibrary.authorizationStatus()
	console.log("authStatus:" + authStatus)
	if (authStatus === 3) {
		result = true
		console.log("相册权限已经开启")
	} else {
		console.log("相册权限没有开启")
	}
	plus.ios.deleteObject(PHPhotoLibrary)
	return result
}

/**
 * 判断通讯录权限是否开启
 * @returns {boolean} 是否开启通讯录权限
 */
const judgeIosPermissionContact = () => {
	let result = false
	const CNContactStore = plus.ios.import("CNContactStore")
	const cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0)
	if (cnAuthStatus === 3) {
		result = true
		console.log("通讯录权限已经开启")
	} else {
		console.log("通讯录权限没有开启")
	}
	plus.ios.deleteObject(CNContactStore)
	return result
}

/**
 * 判断日历权限是否开启
 * @returns {boolean} 是否开启日历权限
 */
const judgeIosPermissionCalendar = () => {
	let result = false
	const EKEventStore = plus.ios.import("EKEventStore")
	const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0)
	if (ekAuthStatus === 3) {
		result = true
		console.log("日历权限已经开启")
	} else {
		console.log("日历权限没有开启")
	}
	plus.ios.deleteObject(EKEventStore)
	return result
}

/**
 * 判断备忘录权限是否开启
 * @returns {boolean} 是否开启备忘录权限
 */
const judgeIosPermissionMemo = () => {
	let result = false
	const EKEventStore = plus.ios.import("EKEventStore")
	const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1)
	if (ekAuthStatus === 3) {
		result = true
		console.log("备忘录权限已经开启")
	} else {
		console.log("备忘录权限没有开启")
	}
	plus.ios.deleteObject(EKEventStore)
	return result
}

/**
 * Android权限查询
 * @param {string} permissionID 权限ID
 * @returns {Promise<number|object>} 权限请求结果
 */
const requestAndroidPermission = (permissionID) => {
	return new Promise((resolve) => {
		plus.android.requestPermissions(
			[permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
			(resultObj) => {
				let result = 0
				for (let i = 0; i < resultObj.granted.length; i++) {
					const grantedPermission = resultObj.granted[i]
					console.log('已获取的权限：' + grantedPermission)
					result = 1
				}
				for (let i = 0; i < resultObj.deniedPresent.length; i++) {
					const deniedPresentPermission = resultObj.deniedPresent[i]
					console.log('拒绝本次申请的权限：' + deniedPresentPermission)
					result = 0
				}
				for (let i = 0; i < resultObj.deniedAlways.length; i++) {
					const deniedAlwaysPermission = resultObj.deniedAlways[i]
					console.log('永久拒绝申请的权限：' + deniedAlwaysPermission)
					result = -1
				}
				resolve(result)
				// 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
				// if (result !== 1) {
				// gotoAppPermissionSetting()
				// }
			},
			(error) => {
				console.log('申请权限错误：' + error.code + " = " + error.message)
				resolve({
					code: error.code,
					message: error.message
				})
			}
		)
	})
}

/**
 * 使用一个方法，根据参数判断权限
 * @param {string} permissionID 权限ID
 * @returns {boolean} 是否开启对应权限
 */
const judgeIosPermission = (permissionID) => {
	switch (permissionID) {
		case "location":
			return judgeIosPermissionLocation()
		case "camera":
			return judgeIosPermissionCamera()
		case "photoLibrary":
			return judgeIosPermissionPhotoLibrary()
		case "record":
			return judgeIosPermissionRecord()
		case "push":
			return judgeIosPermissionPush()
		case "contact":
			return judgeIosPermissionContact()
		case "calendar":
			return judgeIosPermissionCalendar()
		case "memo":
			return judgeIosPermissionMemo()
		default:
			return false
	}
}

/**
 * 跳转到**应用**的权限页面
 */
const gotoAppPermissionSetting = () => {
	if (isIos) {
		const UIApplication = plus.ios.import("UIApplication")
		const application2 = UIApplication.sharedApplication()
		const NSURL2 = plus.ios.import("NSURL")
		// const setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES")		
		const setting2 = NSURL2.URLWithString("app-settings:")
		application2.openURL(setting2)

		plus.ios.deleteObject(setting2)
		plus.ios.deleteObject(NSURL2)
		plus.ios.deleteObject(application2)
	} else {
		// console.log(plus.device.vendor)
		const Intent = plus.android.importClass("android.content.Intent")
		const Settings = plus.android.importClass("android.provider.Settings")
		const Uri = plus.android.importClass("android.net.Uri")
		const mainActivity = plus.android.runtimeMainActivity()
		const intent = new Intent()
		intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
		const uri = Uri.fromParts("package", mainActivity.getPackageName(), null)
		intent.setData(uri)
		mainActivity.startActivity(intent)
	}
}

/**
 * 检查系统的设备服务是否开启
 * @returns {boolean} 系统定位服务是否开启
 */
const checkSystemEnableLocation = () => {
	if (isIos) {
		const cllocationManger = plus.ios.import("CLLocationManager")
		const result = cllocationManger.locationServicesEnabled()
		console.log("系统定位开启:" + result)
		plus.ios.deleteObject(cllocationManger)
		return result
	} else {
		const context = plus.android.importClass("android.content.Context")
		const locationManager = plus.android.importClass("android.location.LocationManager")
		const main = plus.android.runtimeMainActivity()
		const mainSvr = main.getSystemService(context.LOCATION_SERVICE)
		const result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER)
		console.log("系统定位开启:" + result)
		return result
	}
}

/**
 * 权限管理组合式函数
 * @returns {Object} 权限管理相关方法
 */
export function usePermission() {
	/**
	 * 判断权限是否开启
	 * @param {string} permissionID 权限ID
	 * @returns {Promise<boolean|number|object>} 权限判断结果
	 */
	const checkPermission = async (permissionID) => {
		if (isIos) {
			return judgeIosPermission(permissionID)
		} else {
			return await requestAndroidPermission(permissionID)
		}
	}

	return {
		// iOS 权限判断
		judgeIosPermission,
		// Android 权限请求
		requestAndroidPermission,
		// 检查系统定位服务是否开启
		checkSystemEnableLocation,
		// 跳转到应用权限设置页面
		gotoAppPermissionSetting,
		// 统一权限检查方法
		checkPermission,
		// 是否为 iOS 设备
		isIos
	}
}

// 保持向后兼容的导出
export {
	judgeIosPermission,
	requestAndroidPermission,
	checkSystemEnableLocation,
	gotoAppPermissionSetting,
	isIos
}
