import request from './interrupter';
/**
 *  获取公司 | 分组列表(公共)
 * 1：groupType String 分组类型：1 员工；2访客
 * 2: 当公司登陆的时候使用，为空查询所有分组；
 * 3: 物业不传 查询所有公司列表
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
export function queryGroupInfoByType(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/queryGroupInfo",
        data
    })
}
/**
 *  获取单个人员信息
 *  visitorId	String	人员id
 * @param {*} params 
 * 
 */
export function queryOneUserInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/queryOneUserInfo",
        data
    })
}
/**
 *  员工管理列表
 *  searchName	String	查询人员名称
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryStaffInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/queryStaffInfo",
        data
    })
}
/**
 *  修改员工信息
 *  picFile	MultipartFile	人员头像
    visitorId	String	人员id
    visitorName	String	人员名称
    visitorDueTime	String	人员有效期
 * @param {*} params 
 * 
 */
export function updateStaffInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/updateStaffInfo",
        data
    })
}
/**
 *  删除员工信息
    visitorId	String	人员id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteStaff(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/deleteStaff",
        data
    })
}
/**
 *  访客管理列表
 *  searchName	String	查询人员名称
    page	String	页数，默认1
    companyId String 公司id
    operateType Int 查询状态：1已同意  3未授权(必传)
    groupId String 
 * @param {*} params 
 * 
 */
export function queryVisitorInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/queryVisitorInfo",
        data
    })
}
/**
 *  访客进出记录信息
 *  searchName	String	查询人员名称
    companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    startTime	String	开始时间
    endTime	String	结束时间
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryVisitorRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/queryVisitorRecord",
        data
    })
}
/**
 *  员工进出记录信息
 *  searchName	String	查询人员名称
    companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    startTime	String	开始时间
    endTime	String	结束时间
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryStaffRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/queryStaffRecord",
        data
    })
}
/**
 *  陌生人进出记录信息
 *  searchName	String	查询机器人名称
    companyId	String	人员所属公司id(物业登录时候可传)
    startTime	String	开始时间
    endTime	String	结束时间
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryStrangerRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/stranger/queryStrangerRecord",
        data
    })
}
/**
 *  修改访客申请的授权状态
 *  noticeId	String	通知id
    visitorId	String	人员id
    auth	Int	状态：1同意；2拒绝
 * @param {*} params 
 * 
 */
export function updateVisitorNoticeInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/updateVisitorNoticeInfo",
        data
    })
}
/**
 *  修改访客信息
 *  picFile	MultipartFile	人员头像
    visitorId	String	人员id
    visitorName	String	人员名称
    visitorDueTime	String	人员有效期
 * @param {*} params 
 * 
 */
export function updateVisitorInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/updateVisitorInfo",
        data
    })
}
/**
 *  删除访客信息
    visitorId	String	人员id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteVisitor(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/deleteVisitor",
        data
    })
}
/**
 *  管理员重置员工密码信息
 *  visitorId	String	人员id
 * @param {*} params 
 * 
 */
export function resetPassword(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/resetPassword",
        data
    })
}
/**
 *  公司员工批量注册
 *  companyId String
 *  propertyId String
 *  url String
 * @param {*} params 
 * 
 */
export function registerStaffInBatchByCompany(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/batch/register/staff/company",
        data
    })
}
/**
 *  公司访客批量注册
 *  companyId String
 *  propertyId String
 *  url String
 * @param {*} params 
 * 
 */
export function registerVisitorInBatchByCompany(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/batch/register/visitor/company",
        data
    })
}
/**
 *  物业员工批量注册
 *  companyId String
 *  propertyId String
 *  url String
 * @param {*} params 
 * 
 */
export function registerStaffInBatchByProperty(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/batch/register/staff",
        data
    })
}

/**
 *  物业访客批量注册
 *  companyId String
 *  propertyId String
 *  url String
 * @param {*} params 
 * 
 */
export function registerVisitorInBatchByProperty(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/batch/register/visitor",
        data
    })
}

/**
 *  批量注册日志
 *  batchId String
 *  batchNum Int
 * @param {*} params 
 * 
 */
export function registerSchedule(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/batch/register/schedule",
        data
    })
}
/**
 *  导出员工进出记录报表
 *  searchName	String	查询人员名称
    companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    startTime	String	开始时间
    endTime	String	结束时间
    recordId	String	进出记录id(多个逗号分隔)
 * @param {*} params 
 * 
 */
export function reportStaffRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/reportStaffRecord",
        data
    })
}
/**
 *  导出访客进出记录报表
 *  searchName	String	查询人员名称
    companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    startTime	String	开始时间
    endTime	String	结束时间
    recordId	String	进出记录id(多个逗号分隔)
 * @param {*} params 
 * 
 */
export function reportVisitorRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/reportVisitorRecord",
        data
    })
}
/**
 *  陌生人进出记录报表
 *  searchName	String	查询机器人名称
    companyId	String	人员所属公司id(物业登录时候可传)
    startTime	String	开始时间
    endTime	String	结束时间
    recordId	String	进出记录id(多个逗号分隔)
 * @param {*} params 
 * 
 */
export function reportStrangerRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/stranger/reportStrangerRecord",
        data
    })
}
/**
 *  导出访客报表
 *  searchName	String	查询人员名称
    companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    visitorId	String	人员id(多个逗号分隔)
 * @param {*} params 
 * 
 */
export function reportVisitor(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/visitor/reportVisitor",
        data
    })
}
/**
 *  导出员工报表
 *  searchName	String	查询人员名称
    companyId	String	人员所属公司id(物业登录时候可传)
    groupId	String	人员所属分组id
    visitorId	String	人员id(多个逗号分隔)
 * @param {*} params 
 * 
 */
export function reportStaff(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/staff/reportStaff",
        data
    })
}

/**
 *  删除陌生人记录
 *  recordId	String	进出记录id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteStrangerRecord(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/stranger/deleteStrangerRecord",
        data
    })
}
