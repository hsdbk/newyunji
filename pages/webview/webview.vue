<template>
	<view class="webview-container">
		<web-view :src="webUrl" @load="onWebLoad" @error="onWebError"></web-view>
		<view class="loading-overlay" v-if="showLoading">
			<image class="loading-icon" :src="$getStaticSrc('/static/loading.png')" mode="aspectFit" animation="rotate"></image>
		</view>
	</view>
</template>

<script>
    import { mapState } from 'vuex'
export default {
    computed: {
			...mapState(['userInfo', 'isLoggedIn','config'])
		},
	name: 'webview',
	data() {
		return {
			webUrl: '',
			urls: '',
			showLoading: true,
		};
	},
	onLoad(e) {
		if(e.url){
			this.urls = e.url
		}
		if(!this.urls){
			this.$store.dispatch('getConfig');
		}else{
			this.webUrl = e.url;
		}
        
	},
    created() {
		if(!this.urls){
			this.webUrl = decodeURIComponent(this.config.kefu_link);
		}
        
    },
    methods: {
        onWebLoad() {
            this.showLoading = false;
        },
        onWebError() {
            this.showLoading = false;
        }
    }
};
</script>

<style scoped>
.webview-container {
	width: 100%;
	height: 100vh;
	position: relative;
}

.loading-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.9);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.loading-icon {
	width: 200rpx;
	height: 200rpx;
	animation: rotate 1s linear infinite;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>