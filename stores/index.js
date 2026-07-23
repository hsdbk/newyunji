import { createStore } from 'vuex'
import { http } from './http.js'
// 从本地存储获取初始状态
const getInitialState = () => {
  try {
    const savedState = uni.getStorageSync('userState')
    if (savedState) {
      return JSON.parse(savedState)
    }
  } catch (e) {
    console.error('读取本地存储失败:', e)
  }
  return {
    isLoggedIn: false,
    isAuth: false,
    config: {},
    userInfo: {
		id: null,
		nick_name: '请登录',
		avatar: null,
		balance: null,
		vip_info:{
			vip_jlz_first:0
		}
	}
  }
}
const $store = createStore({
  //state可以看作是全局公共的数据，需要的组件可以调用
  state: {
    ...getInitialState(),
    baseUrl: ''
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
  },
  //mutations可以看作是调用state的事件，在组件中可以通过commit方法调用和响应
  mutations: {
    setBaseUrl(state, url) {
      state.baseUrl = url || ''
    },
    // 登录成功后设置用户状态
    setUserLoggedIn(state) {
      state.isLoggedIn = true;
	  // 保存到本地存储
      this.commit('saveStateToStorage')
    },

    // 登出时清除用户状态
    setUserLoggedOut(state) {
      state.isLoggedIn = false;
	  state.isAuth = false;
      state.userInfo =  {
			id: null,
			nick_name: '请登录',
			avatar: null,
			balance: null,
			vip_info:{vip_jlz_first:0}
		};
	  // 保存到本地存储
      this.commit('saveStateToStorage');
      // 注意：SSID相关存储的清除和重新生成已经在confirmQuit方法中完成
      // 这里不再重复清除，以避免覆盖新生成的SSID
    },
    setConfigInfo(state, configInfo) {
		// console.log('configInfo',configInfo)
      state.config = configInfo;
    },
    // 添加getUserInfo方法，用于更新用户信息
    getUserInfo(state, userInfo) {
      state.userInfo = userInfo;
	    // 保存到本地存储
      this.commit('saveStateToStorage')
    },
	// 保存状态到本地存储的mutation
    saveStateToStorage(state) {
      try {
        uni.setStorageSync('userState', JSON.stringify({
          isLoggedIn: state.isLoggedIn,
          userInfo: state.userInfo
        }))
      } catch (e) {
        console.error('保存状态到本地存储失败:', e)
      }
    }
  },
  actions: {
    updateUserInfo({ commit, state }) {
      if (!state.isLoggedIn) {
        return Promise.resolve();
      }
      
      // 重要：返回http请求的Promise
      return http('/user/info/index', {}, "GET").then(data => {
		state.isAuth = data.data.is_auth == "Y"?true:false;
        if (data.data && typeof data.data === 'object') {
          const info = data.data.userinfo || data.data;
		  if (data.data.xinshouduihuan !== undefined) {
			info.xinshouduihuan = data.data.xinshouduihuan;
		  }
          commit('getUserInfo', info);
        } else {
          console.error('用户信息数据格式不正确:', data.data);
        }
      }).catch(error => {
        console.error('获取用户信息失败:', error);
        return Promise.reject(error); // 确保错误也能被正确传递
      })
    },
	getConfig({ commit, state }) {
	  
	  // 重要：返回http请求的Promise
	  return http('/api/api/webconfig', {type:'web'}, "GET").then(data => {
	    // console.log('基础信息:', data.data);
	    if (data.data && typeof data.data === 'object') {
			
	      commit('setConfigInfo', data.data);
	    } else {
	      // console.error('基础信息数据格式不正确:', data.data);
	    }
	  }).catch(error => {
	    // console.error('获取用户信息失败:', error);
	    return Promise.reject(error); // 确保错误也能被正确传递
	  })
	}
  },
  modules: {}
})

export default $store;