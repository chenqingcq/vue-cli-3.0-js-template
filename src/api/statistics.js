
import request from './interrupter';

/**
 *  获取公司 | 分组列表(公共)
 * 1：groupType String 分组类型：1 员工；2访客
 * 2: 当公司登陆的时候使用，为空查询所有分组；
 * 3: 物业不传 查询所有公司列表
 * @param {*} params 
 * 
 *//**
*  获取员工统计数据
*  companyId	String	人员所属公司id(物业登录时候可传)
  groupId	String	人员所属分组id
  startTime	String	开始时间
  endTime	String	结束时间
* @param {*} params 
* 
*/
export function queryStaffRecordStatistics(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/statistics/queryStaffRecordStatistics",
        data
    })
}
/**
 *  获取访客统计数据
 *  companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    startTime	String	开始时间
    endTime	String	结束时间
 * @param {*} params 
 * 
 */
export function queryVisitorRecordStatistics(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/statistics/queryVisitorRecordStatistics",
        data
    })
}
/**
 *  获取陌生人统计数据
 *  companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    startTime	String	开始时间
    endTime	String	结束时间
 * @param {*} params 
 * 
 */
export function queryStrangerRecordStatistics(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/statistics/queryStrangerRecordStatistics",
        data
    })
}


/**
 *  统计访客申请状态
 *  companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
 * @param {*} params 
 * 
 */
export function queryVisitorApplyStatistics(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/statistics/queryVisitorApplyStatistics",
        data
    })
}
/**
 *  统计访客注册来源
 *  companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
 * @param {*} params 
 * 
 */
export function queryVisitorRegisterChannelStatistics(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/statistics/queryVisitorRegisterChannelStatistics",
        data
    })
}




