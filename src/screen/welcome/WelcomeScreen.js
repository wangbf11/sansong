import React, { PureComponent } from 'react'
import {
    View,
    Text,
    Image,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import { StackActions, NavigationActions } from "react-navigation"
import { screenWidth, ArticleTime, VideoTime, safeAreaBottomHeight, screenHeight, statusBarHeight, LoginToken } from '../../util/AdapterUtil'
import image from '../../assets/image'
import DeviceInfo from 'react-native-device-info'
import SplashScreen from "react-native-splash-screen";
import MD5 from "react-native-md5"
import * as OpenNative from '../../native/OpenNative'
import AlertView from '../../components/AlertView'
import CodePush from "react-native-code-push"
import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'
import actions from "../../models/actions";
let Code_Push_Key = "Y0yM5lrPkEKUGjJvhaPQX6pwRUv74ksvOXqog"
class WelcomeScreen extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: "",
            adUrl: "",
            timerCount: 5,
            isShowAccountErrorView: false,
            isShowNetworkErrorView: false,
            isShowUpVersion: false,
            isShowProgress: false,
            version: "",
            progress: "",
            isCountTime: false,
            token: ""
        }
    }

    //读取数据
    getDataFromStorage = async () => {
        global.storage.load({
            key: LoginToken,
        }).then(ret => {
            this.setState({ token: ret })
            this.upDeviceInfo(ret)
        }).catch(err => {
            this.setState({ token: "" })
            this.upDeviceInfo("")
        })
    }

    upDeviceInfo(token) {
        let device_name = DeviceInfo.getBrand()
        let device_model = DeviceInfo.getDeviceName()
        let device_version = DeviceInfo.getSystemVersion()
        let uuid = DeviceInfo.getUniqueID()
        let uuid_type = Platform.OS == "ios" ? "2" : "1"
        let parmas
        if (token == "") {
            parmas = {
                device_name: device_name,
                device_model: device_model,
                device_version: device_version,
                uuid: uuid,
                uuid_type: uuid_type,
            }
        }
        else {
            parmas = {
                device_name: device_name,
                device_model: device_model,
                device_version: device_version,
                uuid: uuid,
                uuid_type: uuid_type,
                token: token
            }
        }
        this.props.upDeviceInfo(parmas).then(res => {
            if (res && res.error_code == 0) {
                let data = res.data
                this.saveArticleTimeToStorage(data.article_time)
                this.saveVideoTimeToStorage(data.video_time)
            }
        })
    }

    componentDidMount() {
        SplashScreen.hide();
        this.getDataFromStorage()
        let isEmulator = DeviceInfo.isEmulator()
        if (isEmulator) {
            this.setState({ isShowAccountErrorView: true })
            return
        }
        //检测更新
        CodePush.checkForUpdate(Code_Push_Key).then((update) => {
            if (update) {
                clearInterval(this.interval)
                this.setState({
                    isShowUpVersion: true,
                    version: update.appVersion,
                    timerCount: "",
                    isCountTime: false
                })
            }
            else {
                this.setState({
                    timerCount: "5",
                    isCountTime: true
                })
            }
            this.getSplashAd()
        })
    }

    getSplashAd() {
        let accountId = 'af291168a23be66f93f80e98fb3e6c58'
        let secret = "a23be66f93f80e98"
        let adSpaceKey = "61cbea2e40ec9afbe1e98559c3f444b5"
        let sign = MD5.hex_md5(accountId + adSpaceKey + secret)
        let url = "https://interaction.bayimob.com/openApi/advertisementAccess?accountId=" + accountId + "&adSpaceKey=" + adSpaceKey + "&sign=" + sign
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((json) => {
                if (this.state.isCountTime) {
                    this._countDownAction()
                }
                this.setState({
                    imageUrl: json.result.imageUrl,
                    adUrl: json.result.adUrl
                })
            }).catch((error) => {

            })
    }

    //倒计时
    _countDownAction() {
        let codeTime = 5
        this.interval = setInterval(() => {
            if (codeTime == 0) {
                this.toHome()
            }
            else {
                codeTime = codeTime - 1
            }
            this.setState({ timerCount: codeTime })
        }, 1000)
    }

    //保存文章阅读时间
    saveArticleTimeToStorage = async (articleTime) => {
        global.storage.save({
            key: ArticleTime,
            data: articleTime,
            expires: null
        })
    }

    //保存视频观看时间
    saveVideoTimeToStorage = async (videoTime) => {
        global.storage.save({
            key: VideoTime,
            data: videoTime,
            expires: null
        })
    }

    render() {
        let showTime = this.state.timerCount === "" ? "" : this.state.timerCount + "s"
        return (
            <View style={{ flex: 1 }}>
                {this.state.imageUrl != "" &&
                    <TouchableOpacity onPress={this.openUrl.bind(this)} activeOpacity={1}>
                        <Image source={{ uri: this.state.imageUrl }} style={{ width: screenWidth, height: screenWidth * 144 / 75 }}></Image>
                    </TouchableOpacity>}
                <TouchableOpacity activeOpacity={1} style={{ position: 'absolute', width: 65, height: 28, backgroundColor: 'rgba(0,0,0,0.5)', marginTop: statusBarHeight, marginLeft: screenWidth - 75, borderRadius: 14, justifyContent: "center", alignItems: "center" }} onPress={this.toHome.bind(this)}>
                    <Text style={{ fontSize: 11, color: "#fff" }} >跳过{showTime}</Text>
                </TouchableOpacity>
                <View style={{ position: 'absolute', backgroundColor: "#fff", marginTop: screenHeight - safeAreaBottomHeight - 97, width: screenWidth }}>
                    <View style={{ height: 97, flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                        <Image source={image.account_error} style={{ width: 208, height: 84 }} />
                    </View>
                    <View style={{ height: safeAreaBottomHeight }} />
                </View>
                {this.showPhoneErrorView()}
                {this.showProgressView()}
                {this.showUpVersionView()}
                {this.showNetworkErrorView()}
                <Toast
                    ref="toast"
                    style={{ backgroundColor: '#737373' }}
                    position='center'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    textStyle={{ color: '#fff', fontSize: 15, marginLeft: 50, marginRight: 50, marginTop: 15, marginBottom: 15 }}
                />
            </View>
        )
    }

    showProgressView() {
        return (
            <AlertView isShow={this.state.isShowProgress}
                position={{ justifyContent: "center" }}
                contentStyle={{ alignItems: "center" }}>
                <View style={{ width: screenWidth - 58, alignItems: "center" }}>
                    <Text style={{ color: "#202020", fontSize: 15 }}>正在加载 {parseInt(this.state.progress * 100, 10)}%</Text>
                    <View style={{ marginTop: 18, height: 16, backgroundColor: "#E5E5E5", flexDirection: "row", width: screenWidth - 58 }}>
                        <View style={{ backgroundColor: "#00A0E9", height: 16, width: this.state.progress * 100 + "%" }} />
                    </View>
                </View>
                <View />
            </AlertView >
        )
    }

    showUpVersionView() {
        return (
            <AlertView isShow={this.state.isShowUpVersion}
                position={{ justifyContent: "center" }}
                contentStyle={{ alignItems: "center" }}>
                <View style={{ borderRadius: 8, width: screenWidth - 58, backgroundColor: "#fff", alignItems: "center" }}>
                    <Image source={image.account_error} style={{ marginTop: -43 }} />
                    <Text style={{ color: "#5292FF", fontSize: 19, marginTop: 24 }}>新版本升级</Text>
                    <View style={{ width: screenWidth - 58, marginTop: 30 }}>
                        <Text style={{ color: "#202020", fontSize: 14, fontWeight: "bold", marginLeft: 20, marginRight: 20 }}>指尖资讯V{this.state.version}更新了</Text>
                        <Text style={{ color: "#808080", fontSize: 12, marginLeft: 20, marginRight: 20, marginTop: 13 }}>1.返奖率更高，金币拿到手软</Text>
                        <Text style={{ color: "#808080", fontSize: 12, marginLeft: 20, marginRight: 20, marginTop: 6 }}>2.邀请得现金，躺着也能赚钱</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 40 }}>
                        <TouchableOpacity style={{ width: 150, marginLeft: 12, marginRight: 20, marginBottom: 35, backgroundColor: "#FFCC00", justifyContent: "center", alignItems: "center", height: 36, borderRadius: 18 }} onPress={this.upVersionAction.bind(this)}>
                            <Text style={{ color: '#202020', fontSize: 14 }}>更新</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View />
            </AlertView >
        )
    }

    upVersionAction() {
        this.syncImmediate()
        this.setState({ isShowUpVersion: false })
    }

    //如果有更新的提示
    syncImmediate() {
        CodePush.sync({
            installMode: CodePush.InstallMode.IMMEDIATE,
            updateDialog: null,
        },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                //("检查更新");
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                //("下载安装包");
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                //("等待用户协作");
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                //("安装中");
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                //("已经是最新版本了");
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                //("取消更新");
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                //("更新完成");
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                //("未知错误");
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        if (!progress.receivedBytes) {
            this.refs.toast.show('更新出错了，请稍后重试', 1000)
            this.setState({ isShowProgress: false })
            return
        }
        if (!progress.totalBytes) {
            this.refs.toast.show('更新出错了，请稍后重试', 1000)
            this.setState({ isShowProgress: false })
            return
        }
        if (progress) {
            this.setState({ isShowProgress: true })
            let currProgress = parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2)
            if (currProgress >= 1) {
                this.setState({ isShowProgress: false })
            }
            else {
                this.setState({ progress: currProgress })
            }
        }
    }

    showPhoneErrorView() {
        return (
            <AlertView isShow={this.state.isShowAccountErrorView}
                position={{ justifyContent: "center" }}
                contentStyle={{ alignItems: "center" }}
                backgroundColor={{ backgroundColor: "#fff" }}>
                <Image source={image.account_error} />
                <Text style={{ color: "#748088", fontSize: 15, fontWeight: "bold", marginTop: 27 }}>检测到手机异常，可能有如下原因：</Text>
                <Text style={{ color: "#748088", fontSize: 12, marginTop: 22 }}>1.未插SIM卡，建议插卡后使用</Text>
                <Text style={{ color: "#748088", fontSize: 12, marginTop: 9 }}>2.手机ROOT（刷机）过</Text>
                <Text style={{ color: "#748088", fontSize: 12, marginTop: 9 }}>3.非手机用户，包括模拟器</Text>
                <TouchableOpacity onPress={this.closeErrorView.bind(this)}
                    style={{ backgroundColor: "#FFCC00", height: 36, width: 100, borderRadius: 18, marginTop: 28, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#202020", fontSize: 12 }}>联系客服</Text>
                </TouchableOpacity>
                <Text style={{ color: "#505050", fontSize: 12, marginTop: 12 }}>请备注：异常用户</Text>
            </AlertView>
        )
    }

    closeErrorView() {
        this.setState({
            isShowAccountErrorView: false
        })
    }

    showNetworkErrorView() {
        return (
            <AlertView isShow={this.state.isShowNetworkErrorView}
                position={{ justifyContent: "center" }}
                contentStyle={{ alignItems: "center" }}
                backgroundColor={{ backgroundColor: "#fff" }}>
                <Image source={image.account_error} />
                <Text style={{ color: "#748088", fontSize: 15, fontWeight: "bold", marginTop: 27 }}>页面走丢啦，请检查你的网络状况！</Text>
                <TouchableOpacity onPress={this.refreshView.bind(this)}
                    style={{ height: 36, width: 100, borderColor: "#748088", borderWidth: 1, borderRadius: 3, marginTop: 18, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#748088", fontSize: 12 }}>重新加载</Text>
                </TouchableOpacity>
            </AlertView>
        )
    }

    refreshView() {
        console.log("刷新界面")
    }


    toHome() {
        this.setState({
            isShowAccountErrorView: false,
            isShowProgress: false,
            isShowUpVersion: false
        })
        clearInterval(this.interval)
        // 跳转首页
        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: "login"
                    })
                ]
            })
        )
    }

    openUrl() {
        if (this.state.adUrl != "") {
            OpenNative.RNOpenUrl(this.state.adUrl, (res) => {
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        marginTop: 100,
        width: 120,
        height: 45,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4398ff',
    }
})

export default connect(
    ({ deviceInfo }) => {
        return { deviceInfo }
    }, {
        upDeviceInfo: actions.upDeviceInfo
    }
)(WelcomeScreen)
