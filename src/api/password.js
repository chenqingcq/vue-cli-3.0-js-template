import request from './interrupter';
/**
 *  修改密码
 *  userId	String	用户id
    passWord	String	用户密码
    newPassWord	String	用户新密码
 * @param {*} params 
 * 
 */
export function updatePassword(data) {
    return request({
        method: "post",
        url: "/rosServer/science/1.0.0/background/updatePassword",
        data
    })
}
