'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const image = event.image;
	
	const res = await uniCloud.httpclient.request(
		"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=nLejAElL0hOavckSSAEA48dG&client_secret=HkBSoypYfFwd9hU3Lc5rSLLFqEv7jxhP",
		{
			dataType:"json"
		}
	)
	const access_token = res.data.access_token;
	
	const classify_res = await uniCloud.httpclient.request(
		"https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general",
		{
			method:"POST",
			headers:{
			   "Content-Type": "application/x-www-form-urlencoded"
			},
			data:{
				image: image,
				access_token:access_token,
			},
			dataType:"json"
		}
	)
	
	
	
	//返回数据给客户端
	return classify_res.data
};
