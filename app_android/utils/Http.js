/**
 * @author: chenwei
 * @description: 接口地址
 * @time: 2017-03-15
 */
const Http_Domain = "https://app.bcjiaoyu.com/program_girl";
let Http = {
	domain:Http_Domain,  //域名
	login:Http_Domain + "/userinfo/invitation_code_login/",       //邀请码登录
	whoami:Http_Domain + "/userinfo/whoami/",                     //个人信息
	addReward:Http_Domain + "/userinfo/add_reward/",              //添加奖励
	updateExtent:Http_Domain + "/userinfo/update_learnextent/",   //更新进度
	myTeam:Http_Domain + "/userinfo/mygroup/",                    //我的团队
	teamBrand:Http_Domain + "/userinfo/groups/diamond/ranking/",  //团队排行
	courseInfo:(pk)=>{                                            //课程信息
		return Http_Domain + "/course/courses/" + pk + "/"
	},


}
export default Http;
