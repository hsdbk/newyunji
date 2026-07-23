<template>
    <view class="invest-log-container">
        <!-- 标签页 -->
        <view class="tabs">
            <view class="tab" :class="{ active: activeTab === '' }" @click="switchTab('')">
                <text>全部</text>
                <view class="active-line" v-if="activeTab === ''"></view>
            </view>
            <view class="tab" :class="{ active: activeTab === 'D' }" @click="switchTab('D')">
                <text>进行中</text>
                <view class="active-line" v-if="activeTab === 'D'"></view>
            </view>
            <view class="tab" :class="{ active: activeTab === 'Y' }" @click="switchTab('Y')">
                <text>已完成</text>
                <view class="active-line" v-if="activeTab === 'Y'"></view>
            </view>
        </view>

        <!-- 项目列表 -->
        <view class="project-list">
            <view class="project-card" v-for="(project, index) in projects" :key="index">
                <view class="project-content" @click="goDetail(project.id)">
                    <view class="project-image">
                        <image :src="project.thumb ? $baseUrl + project.thumb : ''"
                            mode="aspectFill"></image>
                    </view>
                    <view class="project-info">
                        <view class="project-title">{{ project.name }}</view>
                        <view class="project-date">{{ project.addtime_date }}</view>
                        <view class="project-amount"><span class="project-date">认购金额：</span>{{ project.money }}</view>
                    </view>
                    <view class="project-status" v-if="project.status == 'D'">
                        进行中
                    </view>
                    <view class="project-status" v-if="project.status == 'Y'" style="color:#D54E3A;">
                        已完成
                    </view>
                </view>
            </view>

            <!-- 加载中提示 -->
            <view class="loading" v-if="isLoading">
                <text>加载中...</text>
            </view>

            <!-- 无更多数据提示 -->
            <view class="no-more" v-if="!hasMore && !isLoading">
                <text>没有更多数据了</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            activeTab: "", // 默认选中"全部"标签
            projects: [],
            // 分页相关数据
            currentPage: 1,
            pageSize: 10,
            hasMore: true,
            isLoading: false,
        };
    },
    methods: {
        // 切换标签页
        switchTab(tab) {
            this.activeTab = tab;
            this.hasMore = true
            this.isLoading = false
            this.projects = []
            this.currentPage = 1
            this.fetchProjects()
            // 实际项目中可以在这里调用API获取对应标签的数据
        },
        goDetail(id) {
            uni.navigateTo({
                url: '/pages/my/invest-detail?id=' + id
            })
        },
        // 获取项目数据（实际项目中实现）
        // 获取项目数据（实际项目中实现）
        fetchProjects() {
            // 防止重复加载或没有更多数据时继续加载
            if (this.isLoading || !this.hasMore) return;

            // 设置加载状态
            this.isLoading = true;

            // 发送请求获取项目数据
            this.$http(
                '/item/list/search', {
                page_num: this.pageSize,
                page_current: this.currentPage,
                status: this.activeTab
            }, "GET")
                .then(res => {
                    // 请求成功
                    if (res && res.data && res.data.list) {
                        // 合并新数据到现有数据中
                        this.projects = [...this.projects, ...res.data.list];

                        // 判断是否还有更多数据
                        this.hasMore = res.data.list.length === this.pageSize;

                        // 如果有更多数据，增加页码以便下次加载
                        if (this.hasMore) {
                            this.currentPage++;
                        }
                    } else {
                        // 如果没有返回有效数据，设置为无更多数据
                        this.hasMore = false;
                    }

                    // 结束加载状态
                    this.isLoading = false;

                })
                .catch(error => {
                    // 错误处理
                    console.error('加载投资记录失败:', error);
                    this.isLoading = false;

                    // 添加错误提示
                    uni.showToast({
                        title: '加载失败，请重试',
                        icon: 'none'
                    });
                });
        }
    },

    onLoad() {
        // 页面加载时获取数据
        this.fetchProjects();
    },
    onReachBottom() {
        // 触底加载更多
        if (this.hasMore && !this.isLoading) {
            this.fetchProjects();
        }
    },
};
</script>

<style lang="scss">
.invest-log-container {
    width: 100%;
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 导航栏样式 */
.nav-bar {
    width: 100%;
    height: 44px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.nav-title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

/* 标签页样式 */
.tabs {
    display: flex;
    margin-bottom: 10px;
    position: relative;
}

.tab {
    flex: 1;
    padding: 15px 0;
    text-align: center;
    position: relative;
    font-size: 24rpx;
    color: #A4A4A4;
}

.tab.active {
    color: #ff6b6b;
    font-size: 30rpx;
    font-weight: 500;
}

.active-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background-color: #ff6b6b;
    border-radius: 1.5px;
}

/* 项目列表样式 */
.project-list {
    padding: 0 15px 20px;
}

.project-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.project-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
}

.project-image {
    width: 200rpx;
    height: 150rpx;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 12px;
    flex-shrink: 0;
}

.project-image image {
    width: 100%;
    height: 100%;
}

.project-info {
    width: 40vw;
}

.project-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 6px;
}

.project-date {
    font-size: 12px;
    color: #999;
    margin-bottom: 6px;
}

.project-amount {
    font-size: 16px;
    font-weight: 500;
    color: #ff6b6b;
}

.project-status {
    position: absolute;
    top: 20rpx;
    right: 0;
    transform: translateY(-50%);
    font-size: 24rpx;
    border-radius: 12px;
    color: #979696;
}

.project-status.ongoing {
    color: #ff6b6b;
    background-color: rgba(255, 107, 107, 0.1);
}

.project-status.completed {
    color: #999;
    background-color: rgba(0, 0, 0, 0.05);
}

/* 空状态样式 */
.empty-state {
    text-align: center;
    padding: 40px 0;
    color: #999;
    font-size: 14px;
}

/* 适配不同设备尺寸 */
@media screen and (min-width: 768px) {
    .project-list {
        max-width: 600px;
        margin: 0 auto;
    }
}

.loading,
.no-more {
    padding: 0 0 30rpx;
    text-align: center;
    color: #999;
    font-size: 26rpx;
}
</style>