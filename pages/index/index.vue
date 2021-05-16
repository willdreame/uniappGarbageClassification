<template>
	<view>
		<button type="primary" @click="btnTakePhoto">拍照或从相册选择</button>
		<image :src="imagepath" mode="widthFix" style="width: 100%;"></image>
		<view style="text-align: center;">{{keyword}}</view>
		<view style="text-align: center;">{{macherd}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imagepath: '',
				keyword:'',
				macherd: '',
				
			}
		},
		onLoad() {

		},
		methods: {
			btnTakePhoto(){
				uni.chooseImage({
					count:1,
					success: (res) => {
						this.imagepath = res.tempFilePaths[0];
						this.image2base64();
					}
				})
			},
			image2base64(){
				wx.getFileSystemManager().readFile({
					filePath:this.imagepath,
					encoding:"base64",
					success:(res)=>{
						this.imageClassify(res.data);
						//nLejAElL0hOavckSSAEA48dG
						//HkBSoypYfFwd9hU3Lc5rSLLFqEv7jxhP
					}
				})
			},

			
			async imageClassify(b64){
				uniCloud.callFunction({
					name:"ImageClassify",
					data:{
						image: b64
					},
					success:(res) =>{ 
						this.parseResult(res.result.result)
					}
				})
			// 	var [err,res] = await uni.request({
			// 		url:"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=nLejAElL0hOavckSSAEA48dG&client_secret=HkBSoypYfFwd9hU3Lc5rSLLFqEv7jxhP"
			// 	})
			// 	var access_token = res.data.access_token;
				
			// 	var [err,res] = await uni.request({
			// 		url:"https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",
			// 		method:"POST",
			// 		data:{
			// 			image: b64,
			// 			access_token:access_token,
			// 		},
			// 		header:{
			// 			"Content-Type": "application/x-www-form-urlencoded"
			// 		}
			// 	})
			// 	console.log(res, 'res')
			 },
			 parseResult(result){
			 	console.log(result);
				var itemList = [];
				var abs_result_index;
				for(let i = 0; i< result.length; i++){
					if(result[i].score>.7){
						abs_result_index = i;
						break;
					}
					itemList.push(result[i].keyword+result[i].score)
				};
				console.log(abs_result_index)
				if(abs_result_index>=0){
					this.searchKeyWord(result[abs_result_index].keyword)
					return;
				};
				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						this.searchKeyWord(result[res.tapIndex].keyword)
					}
				})
			 },
			 searchKeyWord(kw){
				 console.log(kw,'searchkeyword')
				 this.keyword = kw;
				 uniCloud.callFunction({
				 	name:"TrashClassify",
					data:{
						keyword: kw
					},
					success: (res) => {
						console.log(res)
						this.macherd = res.result.matched.typename
					}
				 })
			 },
			
		}
	}
</script>

<style>
</style>
