import {
    Dimensions,
    Platform,
    StatusBar
} from "react-native"

//UI设计图的宽度
const designWidth = 750
//UI设计图的高度
const designHeight = 1334

//手机屏幕宽高
export const screenWidth = Dimensions.get('window').width
export const screenHeight = Dimensions.get('window').height

//根据设计图计算的缩放
export const scaleWidth = screenWidth / designWidth * 2
export const scaleHeight = screenHeight / designHeight * 2

//状态栏的高度
export const statusBarHeight = getStatusBarHeight()

//iPhoneX bottom安全区域高度
export const safeAreaBottomHeight = isIPhoneX() ? 34 : 0

export const BoxArticleListData = 'boxArticleListData'
export const SoucreArticleListData = 'soucreArticleListData'
export const BoxVideoListData = 'boxVideoListData'
export const SoucreVideoListData = 'soucreVideoListData'
export const HistoryListData = 'historyListData'
export const LoginToken = 'loginToken'
export const ArticleTime = 'articleTime'
export const VideoTime = 'videoTime'
export const HourRewardTime = 'hourRewardTime'

export const WechatAppid = "wx6c9d879505173326"
export const WechatSecretid = "b94c6dc7d0065d852c3c8545a0f60a51"

export const ThreePictureAdId = Platform.OS === "ios" ? "911646499" : "911647731"
export const OnePictureAdId = Platform.OS === "ios" ? "911646359" : "911647786"
/**
 * 判断是否为iOS刘海屏
 */
export function isIPhoneX() {
    if (Platform.OS == 'ios') {
        if (screenHeight == 812 && screenWidth == 375) {
            return true
        }
        else if (screenHeight == 896 && screenWidth == 414) {
            return true
        }
        return false
    }
    return false
}

/**
 * 状态栏的高度
 */
export function getStatusBarHeight() {
    if (Platform.OS == 'android') return StatusBar.currentHeight
    if (isIPhoneX()) return 44
    return 20
}

export function deleteTheZeroAfter(num) {
    var newNum
    try {
        newNum = num.toString().split(".")[1]
    }
    catch (e) {
        newNum = ""
    }
    if (newNum === "00") {
        return num.toString().split(".")[0]
    }
    else {
        return num
    }
}
