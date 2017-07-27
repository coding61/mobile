/**
 * @author: chenwei
 * @description: 网络请求的封装
 * @time: 2017-03-15
 */

let BCFetchRequest = {
	/*
	 * fetch 简单封装
	 * url: 请求的 URL
	 * successCallback: 请求成功回调
	 * failCallback: 请求失败
	 */
	get:(url, successCallback, failCallback) => {
		fetch(url)
		.then((response) => response.text())
		.then((responseText) => {
			successCallback(JSON.parse(responseText));
		})
		.catch((err) => {
			failCallback(err);
		});
	},
	fetchData:(type, url, token, data, successCallback, failCallback) => {
		var dic = {
			method:type
		}
		var headers = {
			"Accept":'application/json',
			"Content-Type":'application/json;charset=utf-8'
		}
		if (token) {
			headers["Authorization"] = "Token " + token
		}
		dic["headers"] = headers
		if (data) {
			dic["body"] = JSON.stringify(data)
		}
		
		fetch(url, dic)
		.then((response) => response.text())
		.then((responseText) => {
			if (responseText) {
				successCallback(JSON.parse(responseText));
			}else{
				successCallback(responseText);
			}
		})
		.catch((err) => {
			failCallback(err);
		});
	}
}
export default BCFetchRequest;