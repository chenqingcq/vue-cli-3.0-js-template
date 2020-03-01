import request from './interrupter';
/**
 *  获取组织管理列表
 *  searchName	String	查询人员名称
    companyId	String	公司id(物业登录时候可传)
    page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryAgencyInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/queryAgencyInfo",
        data
    })
}

/**
 *  获取单个组织信息
 *  companyId	String	公司id
 * @param {*} params 
 * 
 */
export function queryOneAgencyInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/queryOneAgencyInfo",
        data
    })
}
/**
 *  删除组织信息
    agencyId	String	组织id(必填，多个用逗号分隔)
 * @param {*} params 
 * 
 */
export function deleteAgency(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/deleteAgency",
        data
    })
}
/**
 *  修改组织信息
    picFile	MultipartFile	组织照片
    agencyId	String	公司id
    agencyName	String	公司名称
    agencyAddress	String	公司楼层地址
    agencyAccount	String	公司账号
 * @param {*} params 
 * 
 */
export function updateAgencyInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/updateAgencyInfo",
        data
    })
}
/**
 *  新增组织
    picFile	MultipartFile	组织照片
    companyName	String	公司名称
    companyAccount	String	公司管理员账户
    companyPassword	String	公司管理员密码
    companyThreshold	String	阈值(权重)
    companyAddress	String	楼层地址信息
    companyModelVersion	String	模型版本号
    companySupportScan	String	是否支持扫码进出：0不支持；1支持
    companyFilter	String	是否开启过滤：0否；1是
 * @param {*} params 
 * 
 */
export function addAgencyInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/addAgencyInfo",
        data
    })
}

/**
 *  获取特征模型
 * @param {*} params 
 * 
 */
export function queryFeatureModel(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/queryFeatureModel",
        data
    })
}

/**
 *  修改组织账号密码信息
 *  agencyId	String	组织id
    newPassWord	String	组织账号密码
 * @param {*} params 
 * 
 */
export function updateAgencyPassword(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/agency/updateAgencyPassword",
        data
    })
}