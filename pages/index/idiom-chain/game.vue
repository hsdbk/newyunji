<template>
	<view class="panel">
		<view class="checkpointList-back">
			<up-navbar title="成语接龙" bgColor="transparent" :left-show="true" :right-show="false"
				@click="handleBack"></up-navbar>
			<view class="checkpoint-title">第 {{customs}} 关</view>
			<view class="checkpointList-game">
				<view class="itemView" v-for="(item, index) in initdata" :key="index" @tap="onclickSelect(item)"
					:animation="item.animationData">
					<view class="item" :class="'itemsele-' + item.status">
						<text class="text">{{ item.space ? item.content : '' }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="checkpointTips">
			<view class="avatar-tips">
				<image class="avatar-icon" mode="aspectFit"
					:src="userinfo.next_user ? (userinfo.next_user.avatar ? $baseUrl + userinfo.next_user.avatar : '/static/logo.png') : '/static/logo.png'">
				</image>
				<view class="tips-text">还差{{userinfo.next_user ? userinfo.next_user.diff_level : 0}}关超越TA</view>
			</view>
			<view class="physical-btn" @click="getHint">
				<image class="search-icon" mode="aspectFit" :src="$getStaticSrc('/static/game/search.png')"></image>
				<text>提示({{ userinfo.daily_tip }})</text>
			</view>
		</view>
		<view class="checkpointList">
			<view class="itemView" v-for="(item, index) in filldata" :key="index" @tap="selectAnswer(item, index)"
				:animation="item.animationData">
				<view :class="['item itemsele-1',{ 'item-empty': !item.content }]">
					<view class="text">{{ item.content }}</view>
				</view>
			</view>
		</view>
		<image class="complete-icon" v-if="completeShow" mode="aspectFit" :src="$getStaticSrc('/static/game/relay.png')"></image>
		<!-- 确认注销弹窗 -->
		<up-popup :closeOnClickOverlay="false" :show="successShow" mode="center" @close="successShow = false">
			<view class="sign-popup">
				<image class="sign-popup-icon" :src="$getStaticSrc('/static/game/success.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">恭喜闯关成功</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button-back" @click="handleBack">返回</up-button>
					<up-button type="primary" class="sign-popup-button" @click="nextGame">下一关</up-button>
				</view>
			</view>
		</up-popup>
		<up-popup :closeOnClickOverlay="false" :show="failShow" mode="center" @close="failShow = false">
			<view class="sign-popup">
				<image class="sign-popup-icon" :src="$getStaticSrc('/static/game/fail.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">闯关失败</view>
				<view class="sign-popup-content">体力: {{userinfo.brawn}}/{{userinfo.total_brawn}}</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-button-back" @click="handleBack">返回</up-button>
					<up-button type="primary" class="sign-popup-button" v-if="userinfo.brawn != 0"
						@click="nextGame">重新开始</up-button>
					<up-button type="primary" class="sign-popup-button" v-if="userinfo.brawn == 0">
						<image class="search-icon" mode="aspectFit" :src="$getStaticSrc('/static/game/continue.png')"></image>
						继续挑战
					</up-button>
				</view>
			</view>
		</up-popup>
		<up-popup :closeOnClickOverlay="false" :show="brawnShow" mode="center" @close="brawnShow = false">
			<view class="sign-popup">
				<image class="sign-popup-icon" :src="$getStaticSrc('/static/game/brawn.png')" mode="aspectFit"></image>
				<view class="sign-popup-content">当前体力不足</view>
				<view class="sign-popup-content">体力: {{userinfo.remain_stamina}}/{{userinfo.daily_stamina}}</view>
				<view class="sign-actions">
					<up-button type="primary" class="sign-popup-brawn">
						<image class="search-icon" mode="aspectFit" :src="$getStaticSrc('/static/game/continue.png')"></image>
						继续
					</up-button>
				</view>
			</view>
		</up-popup>
	</view>

</template>

<script>
	var _this;
	export default {
		data() {
			return {
				appData: [],
				userinfo: {
					brawn: 5,
					total_brawn: 5,
					customs: 5,
					daily_tip: 3,
                    next_user:{
                        avatar:'',
                        nickname:'',
                        diff_level:0,
                    }
				},
				initdata: [], //网格数据
				filldata: [], //需要填充数据
				currentReseau: 1, //当前选中网格
				customs: 0,
				customsstr: '第1关',
				animation: null,
				successShow: false,
				failShow: false,
				completeShow: false,
				brawnShow: false
			}
		},
		onUnload() {},
		onLoad() {
			_this = this;
			// 初始化加载用户信息
			// this.userinfo = {
			//     // 用户体力
			//     brawn:5,
			//     // 总体力
			//     total_brawn:5,
			//     // 关卡
			//     customs:40,
			//     // 提示次数
			//     prompt:3,
			//     // 连胜
			//     winning_streak:0,
			//     // 最大连胜
			//     max_winning_streak:0,
			//     // 下一关用户信息
			//     nextUserinfo:{
			//         avatar:5,
			//         nickname:'',
			//     }
			// }



		},
		onShow() {
			console.log(this.userinfo)
			// 首先检查并更新每日提示次数
			this.checkDailyPromptLimit();
			this.initIdiomsInfo()
		},
		methods: {
			// 修复checkDailyPromptLimit方法，确保准确读取和返回缓存值
			checkDailyPromptLimit() {
				// 获取今天的日期（格式：YYYY-MM-DD）
				const today = new Date().toISOString().split('T')[0];

				try {
					// 从本地存储获取上次使用日期和剩余提示次数
					const lastUseDate = uni.getStorageSync('promptLastUseDate');
					console.log('缓存日期:', lastUseDate, '今天:', today);

					// 直接获取并验证缓存中的提示次数
					const cachedRemainingPrompts = uni.getStorageSync('promptRemainingCount');
					console.log('缓存提示次数:', cachedRemainingPrompts, '类型:', typeof cachedRemainingPrompts);

					// 处理首次使用或日期变更的情况
					if (!lastUseDate || lastUseDate !== today) {
						console.log('新的一天，重置提示次数为3');
						uni.setStorageSync('promptLastUseDate', today);
						uni.setStorageSync('promptRemainingCount', 3);
						this.userinfo.daily_tip = 3;
						return 3;
					} else {
						// 确保返回缓存中的实际值，但进行类型转换和有效性检查
						const remainingPrompts = Number(cachedRemainingPrompts);
						console.log('转换后提示次数:', remainingPrompts);

						if (cachedRemainingPrompts === null || cachedRemainingPrompts === undefined || isNaN(
								remainingPrompts)) {
							console.log('缓存值无效，重置为3');
							uni.setStorageSync('promptRemainingCount', 3);
							this.userinfo.daily_tip = 3;
							return 3;
						} else {
							// 返回缓存的实际值（可能为0）
							const actualCount = Math.max(0, Math.floor(remainingPrompts));
							this.userinfo.daily_tip = actualCount;
							console.log('返回缓存值:', actualCount);
							return actualCount;
						}
					}
				} catch (error) {
					console.error('检查每日提示次数出错:', error);
					// 出错时返回默认值
					this.userinfo.daily_tip = 3;
					return 3;
				}
			},

			// 4. 修改initIdiomsInfo方法
			initIdiomsInfo() {
				this.$http(
					'/user/idioms/info', {}, "POST").then(res => {
					try {
						// 先获取本地的每日提示次数
						const promptCount = this.checkDailyPromptLimit();
						console.log('initIdiomsInfo中获取的提示次数:', promptCount);

						// 创建新对象，避免直接替换
						const resData = res.data || {};

						// 使用Object.assign合并，但特别处理daily_tip字段
						const tempUserInfo = Object.assign({}, this.userinfo, resData);
						// 确保本地提示次数覆盖服务器返回的值
						tempUserInfo.daily_tip = promptCount;
						// 确保next_user始终有默认值，避免为null
						tempUserInfo.next_user = tempUserInfo.next_user || { avatar: '', nickname: '', diff_level: 0 };
						this.userinfo = tempUserInfo;

						console.log('最终userinfo中的daily_tip值:', this.userinfo.daily_tip);

						this.customs = resData.current_level || 0;

						if (!resData.remain_stamina) {
							uni.showToast({
								title: '体力不足~',
								icon: 'fail'
							});
							return false;
						}

						_this.refresh();
						this.animation = uni.createAnimation({
							duration: 80,
							timingFunction: 'linear',
						});
					} catch (error) {
						console.error('初始化用户信息出错:', error);
					}
				}).catch(error => {
					console.error('请求用户信息出错:', error);
				})
			},
			handleBack() {
				// 结束游戏记录当前玩家信息提交后台

				uni.navigateBack({
					delta: 1
				})
			},
			nextGame() {
				this.successShow = false
				this.failShow = false
				this.completeShow = false

                // 在刷新前更新next_user.diff_level
                if (this.userinfo.next_user && typeof this.userinfo.next_user.diff_level === 'number') {
                    // 确保diff_level不会小于0
                    this.userinfo.next_user.diff_level = Math.max(0, this.userinfo.next_user.diff_level - 1);
                    console.log('更新后的diff_level:', this.userinfo.next_user.diff_level);
                }
				this.refresh();
			},
			setCustoms() {
				this.customsstr = '第' + this.customs + '关'
				this.customs = this.customs

			},
			// 更新getHint方法，增加类型检查
			getHint() {
				console.log('调用getHint，当前提示次数:', this.userinfo.daily_tip);

				// 使用userinfo.daily_tip替代userinfo.prompt
				if (this.userinfo.daily_tip <= 0) {
					uni.showToast({
						title: '今日提示次数已用完，明天再来吧！',
						icon: 'none'
					});
					return;
				}

				// 原有动画逻辑保持不变
				if (!this.animation) {
					this.animation = uni.createAnimation({
						duration: 200,
						timingFunction: 'ease-in-out',
					});
				}

				// 找到当前需要填词的位置（status == 2）
				let currentGrid = null;
				for (let i = 0; i < this.initdata.length; i++) {
					if (this.initdata[i].status === 2) {
						currentGrid = this.initdata[i];
						break;
					}
				}

				if (!currentGrid) {
					console.log('未找到需要填词的位置');
					return;
				}

				// 找到filldata中对应的正确答案
				for (let i = 0; i < this.filldata.length; i++) {
					if (this.filldata[i].id === currentGrid.id) {
						this.animation.scale(1.2).step();
						this.animation.scale(1).step();
						this.$set(this.filldata[i], 'animationData', this.animation.export());

						setTimeout(() => {
							const resetAnimation = uni.createAnimation({
								duration: 0
							});
							resetAnimation.scale(1).step();
							this.$set(this.filldata[i], 'animationData', resetAnimation.export());
						}, 400);

						break;
					}
				}

				// 减少提示次数并更新到本地存储
				this.userinfo.daily_tip--;
				const newCount = this.userinfo.daily_tip;
				console.log('使用提示后，更新缓存次数为:', newCount);
				uni.setStorageSync('promptRemainingCount', newCount);
			},
			// 刷新数据
			refresh() {
				this.initdata = [];
				this.filldata = [];
				this.currentReseau = 1;
				for (let i = 0; i < 81; i++) {
					this.initdata.push({
						space: false, //是否显示文字
						content: '', //文字内容
						status: 0, //网格状态，0没有位置，1待填充和不需要填充的正常状态，2,错误状态，3，通过状态
						selected: false, //是否选中
						id: i, //格子id
						animationData: '', //动画
					});
				}

				this.generateIdiomRecords1().then(records => {
					console.log('成语结果~', records)
					this.checkChain(records)
					// 这里可以处理生成的记录，比如保存到文件或用于游戏逻辑
					// 例如：this.appData = records;
				}).catch(error => {
					console.error('生成记录失败:', error);
				});

			},
			generateIdiomRecords1() {
				return new Promise((resolve, reject) => {
					// 编辑地址
					this.$http(
						'/user/idioms/words', {}, "POST").then(res => {
						console.log('成语~', res)
						if (res.code === 200 && res.data && Array.isArray(res.data)) {
							// 2. 过滤出四字成语
							const fourCharIdioms = res.data.filter(item =>
								item.word && item.word.length === 4
							);

							if (fourCharIdioms.length === 0) {
								reject(new Error('没有找到四字成语'));
								return;
							}

							// 3. 随机选择5-20条成语
							// const recordCount = Math.floor(Math.random() * 16) + 5; // 5-20条
							console.log('成语数量', this.userinfo.current_difficulty)
							const recordCount = this.userinfo.current_difficulty; // 5-20条
							const selectedIdioms = this.randomSample(fourCharIdioms, recordCount);

							// 4. 生成唯一ID和grids数据
							const records = [];
							// 确保ID不重复的集合
							const usedIds = new Set();
							// 确保grid ID不重复的集合
							const usedGridIds = new Set();

							// 生成记录
							selectedIdioms.forEach((idiom, index) => {
								const recordId = 10 + index; // 从1392开始编号

								// 为每个成语生成4个相连的grid对象
								const grids = this.generateConnectedGrids(usedGridIds);

								records.push({
									id: recordId,
									phrase: idiom.word,
									grids: grids
								});
							});

							resolve(records);
						} else {
							reject(new Error('无效的成语数据'));
						}
					})
				})
			},
			// 生成指定格式的成语记录函数
			// generateIdiomRecords() {
			//     return new Promise((resolve, reject) => {
			//         try {
			//             // 1. 加载chain.json数据
			//             let customsFilePath = `/static/data/chain.json`;

			//             uni.request({
			//                 url: customsFilePath,
			//                 success: (res) => {
			//                     // console.log('Chain data loaded successfully:', res);

			//                     if (res.statusCode === 200 && res.data && Array.isArray(res.data)) {
			//                         // 2. 过滤出四字成语
			//                         const fourCharIdioms = res.data.filter(item => 
			//                             item.word && item.word.length === 4
			//                         );

			//                         if (fourCharIdioms.length === 0) {
			//                             reject(new Error('没有找到四字成语'));
			//                             return;
			//                         }

			//                         // 3. 随机选择5-20条成语
			//                         // const recordCount = Math.floor(Math.random() * 16) + 5; // 5-20条
			//                         console.log('成语数量',this.userinfo.current_difficulty)
			//                         const recordCount = this.userinfo.current_difficulty; // 5-20条
			//                         const selectedIdioms = this.randomSample(fourCharIdioms, recordCount);

			//                         // 4. 生成唯一ID和grids数据
			//                         const records = [];
			//                         // 确保ID不重复的集合
			//                         const usedIds = new Set();
			//                         // 确保grid ID不重复的集合
			//                         const usedGridIds = new Set();

			//                         // 生成记录
			//                         selectedIdioms.forEach((idiom, index) => {
			//                             const recordId = 10 + index; // 从1392开始编号

			//                             // 为每个成语生成4个相连的grid对象
			//                             const grids = this.generateConnectedGrids(usedGridIds);

			//                             records.push({
			//                                 id: recordId,
			//                                 phrase: idiom.word,
			//                                 grids: grids
			//                             });
			//                         });

			//                         resolve(records);
			//                     } else {
			//                         reject(new Error('无效的成语数据'));
			//                     }
			//                 },
			//                 fail: (err) => {
			//                     console.error('Error loading chain data:', err);
			//                     reject(err);
			//                 }
			//             });
			//         } catch (e) {
			//             console.error('Exception when generating idiom records:', e);
			//             reject(e);
			//         }
			//     });
			// },
			// 生成相连的格子ID，确保成语不出现残缺
			// 生成相连的格子ID，允许成语之间共用相同的格子ID
			// 生成相连的格子ID，确保不同成语的字不会共用同一个位置
			generateConnectedGrids(usedGridIds, phrase = null) {
				const grids = [];
				let firstId, direction, currentId;
				let isConnected = false;

				// 尝试找到与已存在格子相邻的位置，增强连贯性
				const adjacentCandidates = [];
				if (usedGridIds && usedGridIds.size > 0) {
					usedGridIds.forEach(id => {
						const adjacentIds = this.getAdjacentGridIds(id);
						adjacentIds.forEach(adjId => {
							if (!usedGridIds.has(adjId)) {
								adjacentCandidates.push(adjId);
							}
						});
					});
				}

				// 增加尝试次数并优化布局算法，确保成语布局更紧密
				for (let attempt = 0; attempt < 500; attempt++) {
					// 优先从相邻候选位置选择起始点
					if (adjacentCandidates.length > 0 && Math.random() > 0.3) {
						firstId = adjacentCandidates[Math.floor(Math.random() * adjacentCandidates.length)];
					} else {
						// 随机选择第一个位置
						firstId = Math.floor(Math.random() * 81); // 0-80范围内
					}
					console.log('firstId',firstId)
					// 检查这个位置是否已被使用
					if (usedGridIds && usedGridIds.has(firstId)) continue;

					// 随机选择方向：0=水平（左右相连），1=垂直（上下相连）
					direction = Math.floor(Math.random() * 2);

					// 检查是否有足够的空间放置4个相连的格子
					if (direction === 0) {
						// 水平方向：检查是否在同一行有足够空间
						const rowStart = Math.floor(firstId / 9) * 9;
						const rowEnd = rowStart + 8;
						if (firstId + 3 <= rowEnd) {
							isConnected = true;
							// 验证这四个格子都未被使用
							for (let i = 0; i < 4; i++) {
								if (usedGridIds && usedGridIds.has(firstId + i)) {
									isConnected = false;
									break;
								}
							}
						}
					} else {
						// 垂直方向：检查是否在同一列有足够空间
						if (firstId + 3 * 9 <= 81) {
							isConnected = true;
							// 验证这四个格子都未被使用
							for (let i = 0; i < 4; i++) {
								if (usedGridIds && usedGridIds.has(firstId + i * 9)) {
									isConnected = false;
									break;
								}
							}
						}
					}

					// 如果找到合适的位置，生成grids
					if (isConnected) {
						// 先生成临时grids数组
						const tempGrids = [];

						for (let i = 0; i < 4; i++) {
							if (direction === 0) {
								currentId = firstId + i;
							} else {
								currentId = firstId + i * 9;
							}

							// 将currentId添加到usedGridIds，确保不会被其他成语重复使用
							if (usedGridIds) {
								usedGridIds.add(currentId);
							}

							tempGrids.push({
								id: currentId,
								space: Math.random() > 0.7 // 约30%概率为true
							});
						}

						// 如果提供了成语，应用相同字的特殊规则
						if (phrase) {
							this.applySameCharacterRule(tempGrids, phrase);
						}

						// 检查是否所有space都为false，如果是则至少设置一个为true
						this.ensureNotAllFalse(tempGrids);

						// 将处理后的tempGrids添加到结果中
						grids.push(...tempGrids);
						break;
					}
				}

				// 如果尝试多次后仍未找到合适位置，通过系统性查找确保生成相连的ID
				if (grids.length === 0) {
					console.warn('Warning: Could not find connected grids after multiple attempts');
					// 通过系统性查找而非随机方式
					for (let id = 0; id <= 81; id++) {
						// 尝试水平方向
						if (id % 9 <= 5 &&
							(!usedGridIds || !usedGridIds.has(id)) &&
							(!usedGridIds || !usedGridIds.has(id + 1)) &&
							(!usedGridIds || !usedGridIds.has(id + 2)) &&
							(!usedGridIds || !usedGridIds.has(id + 3))) {
							// 先生成临时grids数组
							const tempGrids = [];

							for (let i = 0; i < 4; i++) {
								currentId = id + i;
								if (usedGridIds) {
									usedGridIds.add(currentId);
								}
								tempGrids.push({
									id: currentId,
									space: Math.random() > 0.7
								});
							}

							// 如果提供了成语，应用相同字的特殊规则
							if (phrase) {
								this.applySameCharacterRule(tempGrids, phrase);
							}

							// 检查是否所有space都为false，如果是则至少设置一个为true
							this.ensureNotAllFalse(tempGrids);

							// 将处理后的tempGrids添加到结果中
							grids.push(...tempGrids);
							break;
						}
						// 尝试垂直方向
						if (id + 3 * 9 <= 81 &&
							(!usedGridIds || !usedGridIds.has(id)) &&
							(!usedGridIds || !usedGridIds.has(id + 9)) &&
							(!usedGridIds || !usedGridIds.has(id + 18)) &&
							(!usedGridIds || !usedGridIds.has(id + 27))) {
							// 先生成临时grids数组
							const tempGrids = [];

							for (let i = 0; i < 4; i++) {
								currentId = id + i * 9;
								if (usedGridIds) {
									usedGridIds.add(currentId);
								}
								tempGrids.push({
									id: currentId,
									space: Math.random() > 0.7
								});
							}

							// 如果提供了成语，应用相同字的特殊规则
							if (phrase) {
								this.applySameCharacterRule(tempGrids, phrase);
							}

							// 检查是否所有space都为false，如果是则至少设置一个为true
							this.ensureNotAllFalse(tempGrids);

							// 将处理后的tempGrids添加到结果中
							grids.push(...tempGrids);
							break;
						}
					}
				}

				return grids;
			},

			// 确保成语的字不会都为false的辅助函数
			ensureNotAllFalse(grids) {
				// 检查是否所有space都为false
				const allFalse = grids.every(grid => !grid.space);

				if (allFalse) {
					// 如果全部为false，随机选择1-2个位置设置为true
					const countToSetTrue = Math.floor(Math.random() * 2) + 1; // 1或2
					const indices = [];

					// 生成不重复的随机索引
					while (indices.length < countToSetTrue) {
						const randomIndex = Math.floor(Math.random() * grids.length);
						if (!indices.includes(randomIndex)) {
							indices.push(randomIndex);
						}
					}

					// 设置选中的索引为true
					indices.forEach(index => {
						grids[index].space = true;
					});
				}
			},

			// 应用相同字的特殊规则
			// 应用相同字的特殊规则，增强成语之间的连贯性
			applySameCharacterRule(grids, phrase) {
				// 找出成语中重复的字
				const charMap = new Map();
				for (let i = 0; i < phrase.length; i++) {
					const char = phrase[i];
					if (charMap.has(char)) {
						charMap.get(char).push(i);
					} else {
						charMap.set(char, [i]);
					}
				}

				// 遍历所有重复的字
				charMap.forEach((positions, char) => {
					if (positions.length > 1) {
						// 随机选择其中一个位置作为当前字，设置为true
						const currentIndex = positions[Math.floor(Math.random() * positions.length)];
						grids[currentIndex].space = true;

						// 对于其他相同的字，有更高概率出现在上下左右相邻的位置
						// 提高触发概率到90%，增强严丝合缝效果
						if (Math.random() > 0.1) { // 90%概率触发特殊规则
							for (let i = 0; i < positions.length; i++) {
								if (positions[i] !== currentIndex) {
									const otherIndex = positions[i];
									const currentGrid = grids[currentIndex];
									const otherGrid = grids[otherIndex];

									// 检查两个格子是否相邻（上下左右）
									if (this.areGridsAdjacent(currentGrid.id, otherGrid.id)) {
										// 如果相邻，可以保持当前状态或稍微调整概率
										// 增加游戏难度，有70%概率设置为false
										if (Math.random() > 0.3) {
											otherGrid.space = false;
										}
									} else {
										// 如果不相邻，有更高概率调整布局（需要重新检查空间）
										if (Math.random() > 0.5) { // 50%概率调整位置
											// 尝试找到与当前字相邻的空闲位置
											const adjacentIds = this.getAdjacentGridIds(currentGrid.id);
											for (const adjId of adjacentIds) {
												// 检查这个位置是否未被使用
												if (!this.isGridIdUsed(adjId, grids)) {
													// 交换位置
													otherGrid.id = adjId;
													// 设为true以突出显示
													otherGrid.space = true;
													break;
												}
											}
										}
									}
								}
							}
						}
					}
				});
			},

			// 检查两个格子是否相邻（上下左右）
			areGridsAdjacent(id1, id2) {
				const row1 = Math.floor(id1 / 9);
				const col1 = id1 % 9;
				const row2 = Math.floor(id2 / 9);
				const col2 = id2 % 9;

				// 检查是否水平相邻或垂直相邻
				return (Math.abs(row1 - row2) === 1 && col1 === col2) ||
					(Math.abs(col1 - col2) === 1 && row1 === row2);
			},

			// 获取与指定格子相邻的所有格子ID
			getAdjacentGridIds(id) {
				const adjacentIds = [];
				const row = Math.floor(id / 9);
				const col = id % 9;

				// 上
				if (row > 0) adjacentIds.push(id - 9);
				// 下
				if (row < 8) adjacentIds.push(id + 9);
				// 左
				if (col > 0) adjacentIds.push(id - 1);
				// 右
				if (col < 8) adjacentIds.push(id + 1);

				return adjacentIds;
			},

			// 检查格子ID是否已在grids数组中使用
			isGridIdUsed(id, grids) {
				return grids.some(grid => grid.id === id);
			},
			// 随机从数组中选择指定数量的元素
			randomSample(array, sampleSize) {
				const shuffled = [...array].sort(() => 0.5 - Math.random());
				return shuffled.slice(0, sampleSize);
			},

			checkChain(appData) {
				var _filldata = []
				for (let i = 0; i < 81; i++) {
					for (let j = 0; j < appData.length; j++) {
						for (let k = 0; k < appData[j].grids.length; k++) {
							if (appData[j].grids[k].id == i) {
								this.initdata[i].space = !appData[j].grids[k].space;
								this.initdata[i].status = 1;
								this.initdata[i].content = appData[j].phrase.substring(k, k + 1);
								if (!this.initdata[i].space && !this.isContainArr(_filldata, i)) {
									_filldata.push({
										id: i, //网格id
										content: this.initdata[i].content, //文字内容
										animationData: '' // 确保有animationData属性
									})
								}
							}
						}
					}
				}
				this.filldata = this.$u.randomArray(_filldata)
				this.nextCheckpoint();
			},
			isContainArr(arr, id) {
				for (let i = 0; i < arr.length; i++) {
					// console.log(arr[i], id);
					if (arr[i].id == id) {
						return true;
					}
				}
				return false;
			},
			/* 找出下一个待填充的格子id */
			nextCheckpoint() {
				for (let i = 0; i < 81; i++) {
					if (this.initdata[i].status == 1 && !this.initdata[i].space || this.initdata[i].status == 2 && !this
						.initdata[i].space) {
						this.initdata[i].status = 2
						this.currentReseau = i;
						return;
					}
				}
			},

			/* 选中格子 */
			onclickSelect(item) {
				if (item.status == 0 || item.status == 3 || (item.status == 1 && item.space)) {
					return;
				}
				// 检查是否有错误的，先去除
				for (let i = 0; i < 81; i++) {
					if (this.initdata[i].status == 2 && this.initdata[i].space) {
						this.initdata[i].status = 1
						this.initdata[i].space = false;
					}
				}
				if (item.status == 1 && !item.space || item.status == 2) {
					this.initdata[this.currentReseau].status = 1
					this.currentReseau = item.id
					this.initdata[this.currentReseau].status = 2
				}
			},
			/* 填充答案 */
			selectAnswer(item, id) {
				// 填充进去
				this.initdata[this.currentReseau].space = true;
				this.initdata[this.currentReseau].content = item.content;

				// 选错了
				if (item.id != this.currentReseau) {
					this.userinfo.winning_streak = 0;
					// 确保 animation 已初始化
					if (!this.animation) {
						this.animation = uni.createAnimation({
							duration: 80,
							timingFunction: 'linear',
						});
					}

					this.animation.translateX(-5).step();
					this.animation.translateX(5).step();
					this.animation.translateX(0).step();
					this.initdata[this.currentReseau].animationData = this.animation.export();

					setTimeout(function() {
						if (this.animation) {
							this.animation.translateX(0).step();
							this.initdata[this.currentReseau].animationData = this.animation.export();
						}
					}.bind(this), 50);
					// this.failShow = true;
					// this.userinfo.brawn--;
					return;
				}

				this.initdata[this.currentReseau].status = 3
				this.filldata.splice(id, 1);

				// 判断是否通关
				if (this.filldata.length == 0) {
					return this.reachStandard();
				}
				this.nextCheckpoint();
			},
			// 通关了
			reachStandard() {
				console.log('通关了');
				this.userinfo.winning_streak++;
				// 显示complete-icon
				this.completeShow = true;
				// 更新最大连胜
				if (this.userinfo.winning_streak > this.userinfo.max_winning_streak) {
					this.userinfo.max_winning_streak = this.userinfo.winning_streak;
				}
                
				this.passSuccess()

				// console.log(this.userinfo);
			},
			passSuccess() {
				// 编辑地址
				this.$http(
					'/user/idioms/pass', {
						level_id: this.userinfo.current_level
					}, "POST").then(res => {
					// 5秒后隐藏complete-icon并跳转下一关
					this.userinfo.current_level++;
					setTimeout(() => {
						this.customs++;
						this.setCustoms();
						_this.refresh();
                        if (this.userinfo.next_user && typeof this.userinfo.next_user.diff_level === 'number') {
                            // 确保diff_level不会小于0
                            this.userinfo.next_user.diff_level = Math.max(0, this.userinfo.next_user.diff_level - 1);
                            console.log('更新后的diff_level:', this.userinfo.next_user.diff_level);
                        }
						this.completeShow = false;
						this.successShow = false;
					}, 3000);
				})
			},
			back() {
				uni.navigateBack()
			}

		}
	}
</script>

<style lang="scss" scoped>
	page {
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #FFF4EE;
	}

	.panel {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.checkpointList-back {
		background-image: url('/static/game/chain-back.png');
		background-size: 100% 100%;
	}

	.checkpointTips {
		background-image: url('/static/game/tips-back.png');
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 24rpx 0;
	}

	.physical-btn {
		width: 211rpx;
		height: 82rpx;
		background-image: url('/static/game/btn-back.png');
		background-size: 100% 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 10rpx;
		margin-top: 10rpx;
	}

	.tips-text {
		font-size: 24rpx;
		color: #D54E3A;
		background-image: url('/static/game/tips-text-back.png');
		background-size: 100% 100%;
		width: 200rpx;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		text-align: center;
		padding: 0 10rpx;
	}

	.avatar-tips {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.physical-btn text {

		font-size: 28rpx;
		color: #fff;
	}

	.avatar-icon {
		width: 80rpx;
		height: 80rpx;
		border: 4rpx solid #fff;
		border-radius: 50%;
	}

	.search-icon {
		width: 32rpx;
		height: 32rpx;
		position: relative;
		margin-right: 10rpx;
	}

	.checkpoint-title {
		font-size: 40rpx;
		color: #000000;
		font-weight: bold;
		margin-left: 30rpx;
		padding-top: 100rpx;
	}

	.checkpointList-game {
		display: flex;
		flex-wrap: wrap;
		margin-top: 50rpx;
		padding: 40rpx;
		// background-image: url('/static/game/chain-back.png');
		// background-size: 100% 100%;
	}

	.item-empty {
		background: #ffffff !important;
		color: #000000 !important;
	}

	.checkpointList {
		display: flex;
		flex-wrap: wrap;
		height: 411rpx;
		padding: 41rpx;
		background-image: url('/static/game/game-back.png');
		background-size: 100% 100%;
	}

	.itemView {
		width: calc(100% / 9);
		height: 0;
		padding-bottom: calc(100% / 9);
		position: relative;



	}

	.item {
		position: absolute;
		left: 4rpx;
		right: 4rpx;
		bottom: 4rpx;
		top: 4rpx;
		border-radius: 6rpx;

		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 500;
		font-size: 36rpx;
		color: #fff;
	}

	.itemsele-0 {}

	.itemsele-1 {
		background: #9D877C;
		color: #fff;
	}

	.itemsele-2 {
		border: solid 2px #9D877C;
		background: #ffffff;
	}

	.itemsele-3 {
		border: solid 2px #9D877C;
		background: #ffffff;
		color: #000;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.right-item {
		margin: 0 12rpx;
		position: relative;
		color: #ffffff;
		display: flex;
	}

	.sign-popup {
		background-color: #ffffff;
		border-radius: 16rpx;
		width: 620rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.sign-popup-icon {
		width: 304rpx;
		height: 174rpx;
		margin-top: 96rpx;
	}

	.sign-popup-icon1 {
		width: 200rpx;
		height: 200rpx;
		margin-top: 66rpx;
	}

	.sign-popup-icon2 {
		width: 197rpx;
		height: 186rpx;
		margin-top: 72rpx;
	}

	.sign-popup-icon3 {
		width: 128rpx;
		height: 122rpx;
		margin-top: 66rpx;
	}

	.sign-popup-content {
		font-size: 30rpx;
		color: #000000;
		margin-top: 10rpx;
	}

	.sign-actions {
		display: flex;
		justify-content: space-between;
	}

	.sign-actions .u-button {
		width: 200rpx;
	}

	.sign-popup-button-back {
		width: 240rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
		background-color: #fff !important;
		border: 1rpx solid #000 !important;
		color: #000 !important;
		border-radius: 35rpx !important;
		font-size: 26rpx !important;
		margin-top: 80rpx;
		margin-bottom: 40rpx;
		margin-right: 20rpx;
	}

	.sign-popup-button {
		width: 240rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
		background-color: #000 !important;
		color: #ffffff !important;
		border: none !important;
		border-radius: 35rpx !important;
		font-size: 26rpx !important;
		margin-top: 80rpx;
		margin-bottom: 40rpx;
	}

	.sign-popup-brawn {
		width: 400rpx !important;
		height: 70rpx !important;
		line-height: 70rpx !important;
		background-color: #000 !important;
		color: #ffffff !important;
		border: none !important;
		border-radius: 35rpx !important;
		font-size: 26rpx !important;
		margin-top: 80rpx;
		margin-bottom: 40rpx;
	}

	/* 添加complete-icon样式 */
	.complete-icon {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 400rpx;
		height: 400rpx;
		z-index: 9999;
	}
</style>