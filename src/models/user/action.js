import {
    GET_SEARCH_DATA,
    GET_MESSAGE_CODE,
    LOGIN_TOKEN,
    DEVICE_INFO,
    GET_USER_INFO,
    EDIT_USER_INFO,
    USER_FRIEND,
    GET_WITH_DRAW_LIST,
    GET_WITH_DRAW_ACCOUNT,
    BIND_PAY_ACCOUNT,
    MONEY_LIST,
    BINDING_INVITE_CODE,
    BEANS_EXCHANGE,
    BIND_PHONE,
    BIND_WECHAT,
} from "./types"
import { createAction } from "redux-actions"
import http from "../../util/ajax"


//获取搜索列表
export const getSearchListData = createAction(GET_SEARCH_DATA, params => {
    return http.post({
        url: '/api/info/search',
        params: params
    })
})

//获取验证码
export const getUserMessgaeCode = createAction(GET_MESSAGE_CODE, params => {
    return http.post({
        url: "/api/user/captcha",
        params: params
    })
})

//登录获取token
export const getLoginToken = createAction(LOGIN_TOKEN, params => {
    return http.post({
        url: "/api/user/login",
        params: params
    })
})

//上传设备信息
export const upDeviceInfo = createAction(DEVICE_INFO, params => {
    return http.post({
        url: "/api/user/device",
        params: params
    })
})

//获取用户信息
export const getUserInfo = createAction(GET_USER_INFO, header => {
    return http.post({
        url: "/api/user/detail",
        header: header
    })
})

//编辑用户信息
export const editUserInfo = createAction(EDIT_USER_INFO, (header, params) => {
    return http.post({
        url: "/api/user/edit",
        header: header,
        params: params
    })
})

//用户好友界面
export const userFriendList = createAction(USER_FRIEND, header => {
    return http.post({
        url: "/api/user/subuser",
        header: header
    })
})

//获取提现记录列表
export const getWithDrawList = createAction(GET_WITH_DRAW_LIST, (header, params) => {
    return http.post({
        url: "/api/account/withdrawList",
        header: header,
        params: params
    })
})

//获取提现记录列表
export const getWithDrawAccount = createAction(GET_WITH_DRAW_ACCOUNT, (header, params) => {
    return http.post({
        url: "/api/account/payList",
        header: header,
        params: params
    })
})

//绑定提现账号
export const bindAlipayAccount = createAction(BIND_PAY_ACCOUNT, (header, params) => {
    return http.post({
        url: "/api/account/bindPay",
        header: header,
        params: params
    })
})

//提现申请
export const submitApplyWithdraw = createAction(BIND_PAY_ACCOUNT, (header, params) => {
    return http.post({
        url: "/api/account/withdraw",
        header: header,
        params: params
    })
})

//现金明细
export const getMoneyList = createAction(MONEY_LIST, (header, params) => {
    return http.post({
        url: "/api/account/cashLog",
        header: header,
        params: params
    })
})

//绑定邀请码
export const bindingInviteCode = createAction(BINDING_INVITE_CODE, (header, params) => {
    return http.post({
        url: "/api/user/invite",
        header: header,
        params: params
    })
})

//绑定邀请码
export const beansExchange = createAction(BEANS_EXCHANGE, (header, params) => {
    return http.post({
        url: "/api/account/exchange",
        header: header,
        params: params
    })
})

//绑定手机
export const bindPhone = createAction(BIND_PHONE, (header, params) => {
    return http.post({
        url: "/api/user/mobile",
        header: header,
        params: params
    })
})

//绑定微信
export const bindWechat = createAction(BIND_WECHAT, (header, params) => {
    return http.post({
        url: "/api/user/wechat",
        header: header,
        params: params
    })
})

