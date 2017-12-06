/**
 * @author: chenwei
 * @description: 接口地址
 * @time: 2017-03-15
 */
const Http_Domain = "https://www.cxy61.com/program_girl";   //https://app.bcjiaoyu.com/program_girl
const Page_Domain = "https://www.cxy61.com/girl";        //https://app.bcjiaoyu.com/girl
//const Http_Domain = "https://app.bcjiaoyu.com/program_girl";
//const Page_Domain = "https://app.bcjiaoyu.com/girl";
let Http = {
	domainPage:Page_Domain,    //网站页面地址的域名
	domain:Http_Domain,        //接口域名
	login:Http_Domain + "/userinfo/invitation_code_login/",       //邀请码登录
	whoami:Http_Domain + "/userinfo/whoami/",                     //个人信息
	addReward:Http_Domain + "/userinfo/add_reward/",              //添加奖励
	updateExtent:Http_Domain + "/userinfo/update_learnextent/",   //更新进度
	myTeam:Http_Domain + "/userinfo/mygroup/",                    //我的团队
	teamBrand:Http_Domain + "/userinfo/groups/diamond/ranking/",  //团队排行
	lunTanUnread:Http_Domain + "/message/messages/?types=forum&status=unread",   //论坛未读消息
	findPassword:Http_Domain + "/userinfo/reset_password/",       //找回密码
	awardDiamond:Http_Domain + "/userinfo/play_reward/",		  //打赏钻石
	courseInfo:(pk)=>{                                            //课程信息
		return Http_Domain + "/course/courses/" + pk + "/"
	},
	getPassCode:(phone)=>{
		return Http_Domain + "/userinfo/reset_password_request/?telephone=" + phone      //获取找回密码验证码
	},
	getRegCode:(phone)=>{
		return Http_Domain + "/userinfo/telephone_signup_request/?telephone=" + phone    //获取手机注册验证码
	},
	getNewsList:(lastId)=>{
		return Http_Domain + "/news/news/?current_id=" + lastId                          //获取新闻推送列表
	},

	addActivity:Http_Domain + "/club/club_create/",                                      //添加活动
	activityList:(pagenum)=>{
		return Http_Domain + "/club/clubs/?page=" + pagenum                              //活动列表
	},
	myAcitivitys:(pagenum, type)=>{
		return Http_Domain + "/club/myclub/?types="+type+"&page=" + pagenum              //我的活动
	},
	updateActivity:(pk)=>{
		return Http_Domain + "/club/clubs/" + pk + "/"                                   //修改活动
	},
	getActivityDetail:(pk)=>{
		return Http_Domain + "/club/club_detail/"+ pk +"/"                               //活动详情
	},
	quitActivity:(pk)=>{
		return Http_Domain + "/club/clubs/"+pk+"/"                                       //解散活动
	},
	joinActivity:(pk, password)=>{
		return Http_Domain + "/club/join_club/"+pk+"/?password=" + password              //加入活动
	},
	removeActivityMember:(pk)=>{
		return Http_Domain + "/club/delete_clubmember/"+pk+"/"                           //移除活动成员
	},
	leaveActivity:(pk)=>{
		return Http_Domain + "/club/quit_club/"+pk+"/"                                   //退出活动
	},

	competeList:(pagenum)=>{
		return Http_Domain + "/contest/?page=" + pagenum                              //竞赛列表
	},
	competeDetail:(pk)=>{
		return Http_Domain + "/contest/"+pk+"/"                                       //竞赛详情
	},
	questionList:(pk)=>{
		return Http_Domain + "/contest/"+pk+"/question/"                              //竞赛下问题列表
	},
	competeAnswer:(pk)=>{
		return Http_Domain + "/contest/"+pk+"/answer_question/"                       //回答问题
	},

	userinfo:(username)=>{
		return Http_Domain + "/userinfo/username_userinfo/?username=" + username
	},

	getScholarship:(pagenum)=>{
		return Http_Domain + "/asset/record/?page=" + pagenum                         //奖学金
	}

}
export default Http;
