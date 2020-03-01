import request from './interrupter';
/**
 *  获取设备列表信息
 *  page	String	页数，默认1
 * @param {*} params 
 * 
 */
export function queryRobotsInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/queryRobotsInfo",
        data
    })
}
/**
 * 获取单个设备信息
 * robotId	String	设备id
 * @param {*} params 
 * 
 */
export function queryOneRobotsInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/queryOneRobotsInfo",
        data
    })
}
/**
 * 获取设备类型信息
 * robotId	String	设备id
 * @param {*} params 
 * 
 */
export function queryRobotType(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/queryRobotType",
        data
    })
}

/**
 * 获取设备模型信息
 * @param {*} params 
 * 
 */
export function queryRobotModelInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/queryRobotModelInfo",
        data
    })
}

/**
 *  新增设备信息
 *  identifier	String	机器人身份证
    name	String	机器人名称
    robotType	String	机器人类型：1.solaris;2.ego;3.smarteye;4.iknow
    robotModel	String	机器人型号
 * @param {*} params 
 * 
 */
export function addRobotsInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/addRobotsInfo",
        data
    })
}

/**
 *  修改设备信息
 *  robotId	String	设备id
    identifier	String	设备SN号
    name	String	设备名称
 * @param {*} params 
 * 
 */
export function updateRobotsInfo(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/updateRobotsInfo",
        data
    })
}

/**
 *  删除设备信息
 *  robotId	String	设备id
 * @param {*} params 
 * 
 */
export function deleteRobots(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/deleteRobots",
        data
    })
}

/**
 *  重置天波密码
 * identifier	String	设备sn号码
 * @param {*} params 
 * 
 */
export function resetRobotPassword(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/robots/resetRobotPassword",
        data
    })
}