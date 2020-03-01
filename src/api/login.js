import request from './interrupter';
/**
 * 登录
 *  userAccount	String	用户登录名(电话号码)
    passWord	String	用户密码（md5 32位小数）
    msUserType	Int	2公司管理员；3物业管理员
 * @param {*} params 
 * 
 */
export function login(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/userLogin",
        data
    })
}
/**
 * 登出
 * @param {*} params 
 * 
 */
export function logout(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/userLogout",
        data
    })
}
/**
 * 获取token
 * @param {*} params 
 * 
 */
export function getToken(data) {
    return request({
        method: "post",
        url: "/app/2.1.0/token/sign",
        data
    })
}
