import $store from './index.js';

// 包内固定域名池（轮询）
const BUILTIN_DOMAIN_POOL = [
	// "https://wkksw.hnhhr.com",
	// 测试
	"https://h5.paiduiyun.top",
	// 'https://wqz2w.hlwea.com',
	// 'https://wqz3w.eevlo.com',
	// 'https://wqz4w.fheud.com'
];
// 单独域名（桥接域名），用于拉取后台下发的可用域名
const BRIDGE_DOMAIN = 'https://wqz2w.hlwea.com';
const BRIDGE_DOMAIN_API = '/api/api/webconfig';
const REQUEST_TIMEOUT_MS = 8000;

function normalizeDomain(domain) {
  if (!domain || typeof domain !== 'string') return '';
  const trimmed = domain.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed.replace(/\/+$/, '');
  return `https://${trimmed}`.replace(/\/+$/, '');
}

let domainPool = [...BUILTIN_DOMAIN_POOL];
let currentDomainIndex = 0;
let dynamicDomain = normalizeDomain(uni.getStorageSync('dynamic_base_domain') || '');
let baseUrl = '';

function rebuildDomainPool(preferredList = []) {
  const merged = [];
  const pushUnique = (domain) => {
    const normalized = normalizeDomain(domain);
    if (normalized && !merged.includes(normalized)) {
      merged.push(normalized);
    }
  };
  preferredList.forEach(pushUnique);
  if (dynamicDomain) {
    pushUnique(dynamicDomain);
  }
  BUILTIN_DOMAIN_POOL.forEach(pushUnique);
  domainPool = merged.length ? merged : [...BUILTIN_DOMAIN_POOL];
}

function getBaseUrl() {
  return baseUrl;
}

function notifyBaseUrlChanged() {
  try {
    if ($store && typeof $store.commit === 'function') {
      $store.commit('setBaseUrl', baseUrl)
    }
  } catch (e) {}
}

function setActiveDomain(domain, persist = true) {
  const normalized = normalizeDomain(domain);
  if (!normalized) return;
  if (!domainPool.includes(normalized)) {
    domainPool.unshift(normalized);
  }
  currentDomainIndex = domainPool.indexOf(normalized);
  baseUrl = normalized;
  if (persist) {
    dynamicDomain = normalized;
    uni.setStorageSync('dynamic_base_domain', normalized);
  }
  notifyBaseUrlChanged();
}

rebuildDomainPool();
setActiveDomain(dynamicDomain || domainPool[0], !!dynamicDomain);

function rotateNextDomain(triedSet) {
  if (!domainPool.length) return '';
  for (let i = 0; i < domainPool.length; i++) {
    currentDomainIndex = (currentDomainIndex + 1) % domainPool.length;
    const next = domainPool[currentDomainIndex];
    if (!triedSet || !triedSet.has(next)) {
      baseUrl = next;
      notifyBaseUrlChanged();
      return next;
    }
  }
  return '';
}

let isFetchingFallbackDomain = false;
let fallbackDomainCallbacks = [];

function extractFallbackDomain(payload) {
  if (!payload) return '';
  if (typeof payload === 'string') return normalizeDomain(payload);
  return normalizeDomain(
    payload.domain ||
      payload.base_url ||
      payload.baseUrl ||
      payload.api_domain ||
      payload.apiDomain ||
      payload.url
  );
}

function extractDomainList(payload) {
  if (!payload) return [];
  const listSource =
    payload.domain_list ||
    payload.domainList ||
    (payload.data && (payload.data.domain_list || payload.data.domainList)) ||
    [];

  let rawList = [];
  if (Array.isArray(listSource)) {
    rawList = listSource;
  } else if (typeof listSource === 'string') {
    rawList = listSource.split(',');
  }

  const normalizedList = rawList
    .map((item) => normalizeDomain(typeof item === 'string' ? item : item && item.domain))
    .filter(Boolean);

  return Array.from(new Set(normalizedList));
}

/** 判定当前域名返回是否像可用业务接口（防止 200 错误页当成成功） */
function isDomainResponseUsable(res) {
  if (!res || res.statusCode !== 200) return false;
  const data = res.data;
  if (data == null || typeof data !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(data, 'code');
}

function fetchFallbackDomainFromBridge() {
  return new Promise((resolve, reject) => {
    if (isFetchingFallbackDomain) {
      fallbackDomainCallbacks.push({ resolve, reject });
      return;
    }
    isFetchingFallbackDomain = true;
    uni.request({
      url: BRIDGE_DOMAIN + BRIDGE_DOMAIN_API,
      method: 'GET',
      timeout: REQUEST_TIMEOUT_MS,
      data: {
        type: 'web'
      },
      success: (res) => {
        let domainList = [];
        let nextDomain = '';
        if (res && res.statusCode === 200 && res.data) {
          domainList = extractDomainList(res.data.data || res.data);
          nextDomain = extractFallbackDomain(res.data.data || res.data);
        }
        console.log('domainList', domainList)
        if (domainList.length) {
          rebuildDomainPool(domainList);
          nextDomain = nextDomain || domainList[0];
        }
        if (nextDomain) {
          setActiveDomain(nextDomain, true);
          resolve(nextDomain);
          fallbackDomainCallbacks.forEach((cb) => cb.resolve(nextDomain));
        } else {
          reject('桥接域名未返回可用域名');
          fallbackDomainCallbacks.forEach((cb) => cb.reject('桥接域名未返回可用域名'));
        }
      },
      fail: () => {
        reject('桥接域名请求失败');
        fallbackDomainCallbacks.forEach((cb) => cb.reject('桥接域名请求失败'));
      },
      complete: () => {
        isFetchingFallbackDomain = false;
        fallbackDomainCallbacks = [];
      }
    });
  });
}

function requestWithDomainFailover(path, data, method = 'GET') {
  return new Promise((resolve, reject) => {
    const triedDomain = [];
    const triedSet = new Set();
    const attempt = (triedFallback) => {
      const maxRetry = Math.max(domainPool.length, 1);
      const currentBase = baseUrl;
      if (!currentBase || triedSet.has(currentBase)) {
        const next = rotateNextDomain(triedSet);
        if (!next) {
          if (triedFallback) {
            reject({
              type: 'all_failed',
              message: '域名池全部不可用',
              triedDomain
            });
            return;
          }
          fetchFallbackDomainFromBridge()
            .then(() => attempt(true))
            .catch(() => {
              reject({
                type: 'all_failed',
                message: '内置域名和桥接域名均不可用',
                triedDomain
              });
            });
          return;
        }
      }
      const requestBase = baseUrl;
      triedDomain.push(requestBase);
      triedSet.add(requestBase);
      uni.request({
        url: requestBase + path,
        data,
        method,
        timeout: REQUEST_TIMEOUT_MS,
        success: (res) => {
          if (isDomainResponseUsable(res)) {
            setActiveDomain(requestBase, true);
            resolve({ res, usedBaseUrl: requestBase });
            return;
          }
          console.log('域名响应不可用，切换下一个:', requestBase, res && res.statusCode);
          handleFailover();
        },
        fail: (err) => {
          console.log('域名请求失败，切换下一个:', requestBase, err);
          handleFailover();
        }
      });

      function handleFailover() {
        if (triedSet.size < maxRetry) {
          const next = rotateNextDomain(triedSet);
          if (next) {
            attempt(triedFallback);
            return;
          }
        }
        if (triedFallback) {
          reject({
            type: 'all_failed',
            message: '域名池全部请求异常',
            triedDomain
          });
          return;
        }
        fetchFallbackDomainFromBridge()
          .then(() => {
            triedSet.clear();
            triedDomain.length = 0;
            attempt(true);
          })
          .catch(() => {
            reject({
              type: 'all_failed',
              message: '内置域名和桥接域名均请求异常',
              triedDomain
            });
          });
      }
    };
    attempt(false);
  });
}

/** 启动时预热：探测可用域名，失败则自动轮询/桥接 */
function warmupBaseDomain() {
  return requestWithDomainFailover('/api/api/config', {}, 'GET')
    .then(({ usedBaseUrl }) => {
      console.log('域名预热成功:', usedBaseUrl);
      return usedBaseUrl;
    })
    .catch((err) => {
      console.log('域名预热失败:', err);
      return '';
    });
}
// 添加一个锁变量，确保同一时间只有一个请求在获取新ssid
let isFetchingSsid = false;
// 添加一个队列，存储等待获取ssid的回调函数
let ssidCallbacks = [];
// 添加一个全局变量，缓存当前有效的ssid
let currentValidSsid = null;
// 添加一个时间戳，记录当前ssid的获取时间
let currentSsidTimestamp = 0;

// 异步获取SSID的函数
function getSsidAsync() {
  return new Promise((resolve, reject) => {
    // 如果已经有请求在获取ssid，将当前回调添加到队列中
    if (isFetchingSsid) {
      ssidCallbacks.push({ resolve, reject });
      return;
    }
    
    // 首先检查全局缓存的ssid是否有效
    let nowTime = Math.floor(Date.now() / 1000);
    const cacheValidTime = 3600; // 全局缓存的有效期为30秒
    if (currentValidSsid && currentSsidTimestamp && (nowTime - currentSsidTimestamp < cacheValidTime)) {
      resolve(currentValidSsid);
      return;
    }
    // 修改localStorage为uni-app缓存API
    let ssid = uni.getStorageSync('ssid');
    // 保存ssid的初始值，用于后续比较
    const originalSsid = ssid;
    // 使用更精确的时间戳计算方式，并确保可以重新赋值
    // let nowTime = Math.floor(Date.now() / 1000);
    // 添加默认值处理，避免空值转换错误
    var expireTime = parseInt(uni.getStorageSync('expire_time') || '0');
    let resetTime = parseInt(uni.getStorageSync('reset_time') || '0');
    
    // 确保时间戳是有效的数字
    if (isNaN(nowTime) || nowTime < 0) {
      // 使用一个合理的默认时间
      nowTime = Math.floor(new Date().getTime() / 1000);
    }
    if (isNaN(expireTime) || expireTime < 0) {
      expireTime = 0;
    }
    if (isNaN(resetTime) || resetTime < 0) {
      resetTime = 0;
    }
    
    // 根据需求：只要缓存中存在有效的ssid（非空字符串）且未过期，就直接返回ssid
    // 修复：当resetTime为0时，应视为未设置过期时间，不应该直接认为过期
    let ssidStatus = {
      isExist: ssid !== undefined && ssid !== null && ssid !== '',
      isExpired: (resetTime > 0 && resetTime <= nowTime)
    };
    
    
    if (ssidStatus.isExist && !ssidStatus.isExpired) {
      // 更新全局缓存的ssid
      currentValidSsid = ssid;
      currentSsidTimestamp = nowTime;
      resolve(ssid);
      return;
    }else{
      // 记录获取新ssid的具体原因
      let reason = [];
      if (!ssidStatus.isExist) reason.push('ssid不存在或为空');
      if (ssidStatus.isExpired) reason.push('ssid已过期');
      
      // 设置锁状态为正在获取
      isFetchingSsid = true;
      // SSID不存在或已过期，异步请求新的SSID
      requestWithDomainFailover('/api/api/config', {}, 'GET')
        .then(({ res }) => {
          if (res.data && res.data.code == 200 && res.data.data) {
            // 记录新旧ssid对比
            
            // 修改localStorage为uni-app缓存API保存SSID信息
            uni.setStorageSync('ssid', res.data.data.ssid);
            expireTime = parseInt(res.data.data.ssid_expire_time);
            uni.setStorageSync('expire_time', expireTime);
            
            // 计算新的重置时间：当前时间 + 过期时间
            let newResetTime = nowTime + expireTime;
            // 确保重置时间是有效的数字，并且大于当前时间
            if (isNaN(newResetTime) || newResetTime <= nowTime) {
              // 使用一个默认的过期时间（例如24小时）
              newResetTime = nowTime + 86400;
            }
            uni.setStorageSync('reset_time', newResetTime);
            
            // 更新全局缓存的ssid
            currentValidSsid = res.data.data.ssid;
            currentSsidTimestamp = nowTime;
            
            // 返回新的SSID
            resolve(res.data.data.ssid);
            // 处理队列中的回调
            ssidCallbacks.forEach(callback => {
              callback.resolve(res.data.data.ssid);
            });
          } else {
            reject('获取SSID失败: 返回数据格式不正确');
            // 处理队列中的回调
            ssidCallbacks.forEach(callback => {
              callback.reject('获取SSID失败: 返回数据格式不正确');
            });
          }
        })
        .catch(() => {
          reject('获取SSID请求失败');
          // 处理队列中的回调
          ssidCallbacks.forEach(callback => {
            callback.reject('获取SSID请求失败');
          });
        })
        .finally(() => {
          // 重置锁状态和队列
          isFetchingSsid = false;
          ssidCallbacks = [];
        });
    }

    
  });
}

// 修改http函数为异步函数
async function http(url, data, method = 'GET') {
  try {
    // 异步获取有效的SSID，无论是否存在或过期
    let ssid = await getSsidAsync();
    // 在请求数据中添加SSID
    if (ssid && data) {
      data.ssid = ssid;
    }

	// console.log('原始请求:', baseUrl + url, method, data);
    // 执行原有的请求操作
    return new Promise((resolve, reject) => {
      requestWithDomainFailover(url, data, method)
        .then(({ res }) => {
          // console.log('原始响应:', baseUrl + url, res);
          if (res.statusCode == 200) {
            if (res.data.code == 200) {
              resolve(res.data)
            } else if (res.data.code == 0) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              reject(res.data.msg)
            } else if (res.data.code == 410) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }else if (res.data.code == 401) {
              // 清除用户登录状态
              uni.removeStorageSync('ssid');
              uni.removeStorageSync('expire_time');
              uni.removeStorageSync('reset_time');
              // 清除全局缓存的ssid
              currentValidSsid = null;
              currentSsidTimestamp = 0;
              // 清除Vuex中的用户状态
              $store.commit('setUserLoggedOut');
              // 跳转到登录页面
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/login/login' 
                });
              }, 1500);
              reject(res.data.msg || '登录状态已过期');
            }else if (res.data.code == 403) {
              // 处理401和403状态码，清除用户登录状态
              uni.showToast({
                title: res.data.msg || '登录状态已过期，请重新登录',
                icon: 'none'
              });
              // 清除本地存储的登录信息
              uni.removeStorageSync('ssid');
              uni.removeStorageSync('expire_time');
              uni.removeStorageSync('reset_time');
              // 清除全局缓存的ssid
              currentValidSsid = null;
              currentSsidTimestamp = 0;
              // 清除Vuex中的用户状态
              $store.commit('setUserLoggedOut');
              // 跳转到登录页面
              setTimeout(() => {
                uni.navigateTo({
                 url: '/pages/login/login' 
                });
              }, 1500);
              reject(res.data.msg || '登录状态已过期');
            } 
          } else {
            uni.showToast({
              title: "接口请求失败" + res.statusCode,
              icon: 'none'
            })
            reject('接口请求失败');
          }
        })
        .catch(() => {
          uni.showToast({
            title: '服务器请求异常',
            icon: 'none'
          })
          reject('服务器请求异常');
        })
        .finally(() => {
          // 重置锁状态和队列
          isFetchingSsid = false;
          ssidCallbacks = [];
        });
    });
  } catch (error) {
    // 即使获取SSID失败，也可以尝试发送请求（某些接口可能不需要SSID）
    return new Promise((resolve, reject) => {
      requestWithDomainFailover(url, data, method)
        .then(({ res }) => {
          // 成功回调逻辑同上面
          if (res.statusCode == 200) {
            if (res.data.code == 200) {
              resolve(res.data.data)
            } else if (res.data.code == 0) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              reject(res.data.msg)
            }
          } else {
            uni.showToast({
              title: "接口请求失败" + res.statusCode,
              icon: 'none'
            })
            reject('接口请求失败');
          }
        })
        .catch(() => {
          uni.showToast({
            title: '服务器请求异常',
            icon: 'none'
          })
          reject('服务器请求异常');
        });
    });
  }
}

// 导出函数和变量
export { http, baseUrl, getBaseUrl, getSsidAsync, warmupBaseDomain, currentValidSsid, currentSsidTimestamp };