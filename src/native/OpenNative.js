import {
    NativeModules,
    Platform,
} from 'react-native';
const nativeApi = NativeModules.OpenNativeModule;
const isAndroid = Platform.OS === 'android';
// 测试与rn通信
export const testCallback = (text = 'test', callback = () => { }) => {
    return nativeApi.testCallback(text, (error, events) => {
        if (error) {
            callback(error);
        } else {
            callback(events);
        }
    });
}

// 获取版本号
export const getAppVersion = (callback = () => { }) => {
    if (isAndroid) {
        return nativeApi.getAppVersion(response => {
            if (response) {
                callback({ "code": 1, "message": response });
            } else {
                callback({ "code": 0, "message": "" });
            }
        });
    }
    else {
        return nativeApi.getAppVersion((code, message) => {
            callback({ "code": code, "message": message })
        })
    }
}


// 获取版本号
export const RNOpenUrl = (url, callback = () => { }) => {
    return nativeApi.RNOpenUrl(url, (code, message) => {
        callback({ "code": code, "message": message })
    })
}

