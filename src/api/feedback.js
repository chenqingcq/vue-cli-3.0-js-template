import request from './interrupter';
/**
 *  获取反馈信息主话题列表1
 *  searchName	String	查询员工名称
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryFeedBackInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/feedback/queryFeedBackInfo",
        data
    })
}
/**
 *  获取反馈信息主话题列表2
 *  topicId	String	主题id(三选一个)
    companyId	String	公司id(三选一个)，没有不填
    visitorId	String	员工id(三选一个)
    propertyId	String	物业id(必传)
    page	Int	
    pageSize	Int	
    topicType	int	1 主题 其他值 则查对应值
    不传该key则全查
 * @param {*} params 
 * 
 */
export function getFeedBackList(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/feedback/get/feedback",
        data
    })
}
/**
 *  获取主话题下的所有对话信息
 *  feedbackId	String	主话题id
 * @param {*} params 
 * 
 */
export function queryFeedBackTopicInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/feedback/queryFeedBackTopicInfo",
        data
    })
}
/**
 *  删除对话信息
 *  feedbackId	String	 反馈记录id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteFeedBack(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/feedback/deleteFeedBack",
        data
    })
}
/**
 *  新增反馈信息
 *  feedbackType	String	说话对象，1是管理员；2是员工；
    feedbackTopicType	String	对话类型，1是主话题，一级；2是答复，二级；
    feedbackVisitorId	String	员工id
    feedbackCompanyId	String	员工所属公司id
    feedbackContent	String	对话内容
    feedbackTopicId	String	主话题id(一级话题，意见表id)
    feedbackId	String	答复id(上一级对话，意见表id)
 * @param {*} params 
 * 
 */
export function addFeedBackInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/feedback/addFeedBackInfo",
        data
    })
}

