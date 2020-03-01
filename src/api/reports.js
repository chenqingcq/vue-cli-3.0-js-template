import request from './interrupter';
/**
 *  导出空间预约消费报表  
 *  groupId	String	分组id(多个用逗号分隔)
    visitorId	String	人员id(多个用逗号分隔)
    startTime	String	开始时间,格式：YYYY-MM-dd hh:mm:ss
    endTime	String	结束时间,格式：YYYY-MM-dd hh:mm:ss
 * @param {*} params 
 * 
 */
export function report(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/report",
        data
    })
}
/**
 *  获取公司所有人员信息
 *  visitorType	String	人员类型：1员工 ; 2访客(不传则查询所有类型访客)
 * @param {*} params 
 * 
 */
export function queryUserInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/queryUserInfo",
        data
    })
}
/**
 *  获取公司所有分组信息
 *  groupType	String	分组类型：1员工 ; 2访客(不传则查询所有类型访客)
 * @param {*} params 
 * 
 */
export function queryGroupInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/queryGroupInfo",
        data
    })
}

