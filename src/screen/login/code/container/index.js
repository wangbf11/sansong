import React, { PureComponent } from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    Platform,
    Keyboard,
    TouchableOpacity
} from 'react-native'
import styles from './style'
import { statusBarHeight, LoginToken, screenHeight, safeAreaBottomHeight } from '../../../../util/AdapterUtil'
import image from '../../../../assets/image'
import { StackActions } from 'react-navigation'
import DeviceInfo from 'react-native-device-info'
import Toast from 'react-native-easy-toast'
export default class Code extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            firstValue: '',
            secondValue: '',
            thirdValue: '',
            fourthValue: '',
            token: "",
            codeLength: 4,
            code: "",
            isCountTime: true,
            countTime: 60
        }
    }

    componentDidMount() {
        this._countDownAction()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    setCodeValue(value) {
        if (value.length > 4) {
            return
        }
        this.setState({ code: value })
        if (value.length == 4) {
            this.loginAction(value)
        }
    }

    //倒计时
    _countDownAction() {
        let codeTime = this.state.countTime
        this.interval = setInterval(() => {
            if (codeTime == 1) {
                this.setState({ countTime: 60, isCountTime: false })
                clearInterval(this.interval)
            }
            else {
                codeTime = codeTime - 1
                this.setState({ countTime: codeTime, isCountTime: true })
            }
        }, 1000)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <TouchableOpacity style={{
                    marginLeft: 15,
                    marginTop: statusBarHeight + 10,
                }} onPress={this.backaction.bind(this)}>
                    <Image source={image.account_error} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.hiddenKeyborad.bind(this)} activeOpacity={1} style={{ height: screenHeight - safeAreaBottomHeight - statusBarHeight - 10 }}>
                    <Text style={styles.loginTitle}>欢迎登录</Text>
                    <View style={{ marginTop: 50, alignItems: "center" }}>
                        <Image source={image.account_error} style={{ width: 81, height: 81 }} />
                    </View>
                    <Text style={{ color: "#202020", fontSize: 21, fontWeight: "bold", textAlign: 'center' }}>指尖资讯</Text>
                    <Text style={{ marginTop: 8, color: "#808080", fontSize: 10, textAlign: "center" }}>看资讯得金豆  邀好友赚现金</Text>
                    {this.codeView()}
                    <TextInput
                        ref="codeTextfield"
                        style={{ backgroundColor: "#fff", width: 0, height: 0 }}
                        onChangeText={(value) => this.setCodeValue(value)}
                        autoFocus={true}
                        keyboardType={"numeric"} >
                    </TextInput>
                    <View style={{ marginTop: this.state.isCountTime ? 17 : 35, alignItems: "center" }}>
                        {this.state.isCountTime ?
                            <Text style={{ color: "#808080", fontSize: 12 }}>
                                {this.state.countTime}s后重新发送
                        </Text>
                            :
                            <TouchableOpacity style={{ width: 100, height: 45, borderRadius: 22, backgroundColor: "#FFCC00", justifyContent: "center", alignItems: "center" }}
                                onPress={this.getMessageCode.bind(this)}>
                                <Text style={{ color: "#202020", fontSize: 12 }}>重新发送</Text>
                            </TouchableOpacity>}

                    </View>
                </TouchableOpacity>
                <Toast
                    ref="toast"
                    style={{ backgroundColor: '#737373', marginLeft: 50, marginRight: 50 }}
                    position='center'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    textStyle={{ color: '#fff', fontSize: 15, marginLeft: 50, marginRight: 50, marginTop: 15, marginBottom: 15 }}
                />
            </View>
        )
    }


    backaction() {
        clearInterval(this.interval)
        this.props.navigation.dispatch(StackActions.pop({
            n: 1,
        }))
    }

    codeView() {
        let codes = []
        for (let i = 0; i < this.state.codeLength; i++) {
            let code = this.state.code[i] == null ? "" : this.state.code[i]
            codes.push(
                <View key={i} style={{ marginLeft: 15, flex: 1 }}>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: 'center', height: 50, width: 50 }} onPress={this.showKeyboard.bind(this)}>
                        <Text>{code}</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: "#808080", height: 1 }} />
                </View>
            )
        }
        return (
            <View style={[styles.codeBackView, { flexDirection: "row" }]}>
                {codes}
            </View>
        )
    }

    hiddenKeyborad() {
        Keyboard.dismiss();
    }

    showKeyboard() {
        this.refs.codeTextfield.focus()
    }

    loginAction(value) {
        let code = value
        let device_name = DeviceInfo.getBrand()
        let device_model = DeviceInfo.getDeviceName()
        let device_version = DeviceInfo.getSystemVersion()
        let uuid = DeviceInfo.getUniqueID()
        let auth = '4'//登录类型1=qq,2=wechat,3=weibo,4=mobile
        let uuid_type = Platform.OS == "ios" ? "2" : "1"// 1=android,2=ios
        let type = Platform.OS == "ios" ? "1" : "1"//1=ios 2=应用宝 3=oppo 4=vivo 5=小米 6=华为 7=百度 8=360 9=魅族
        let nickname = "用户_" + this.props.navigation.state.params
        let mobile = this.props.navigation.state.params
        this.props.getLoginToken({
            nickname: nickname,
            device_name: device_name,
            device_model: device_model,
            device_version: device_version,
            auth: auth,
            uuid_type: uuid_type,
            uuid: uuid,
            mobile: mobile,
            code: code,
            type: type
        }).then((res) => {
            if (res && res.error_code == 0) {
                this.saveDataToStorage(res.data.token)
                this.props.navigation.dispatch(StackActions.pop({
                    n: 2,
                }))
            }
            else {
                this.refs.toast.show(res.msg + "[" + res.error_code + "]", 1000)
            }
        }).catch(err => {
            alert(JSON.stringify(err))
        })
    }

    //保存数据
    saveDataToStorage = async (token) => {
        global.storage.save({
            key: LoginToken,
            data: token,
            expires: null
        })
    }

    getMessageCode() {
        let phone = this.props.navigation.state.params
        let showphone = phone.slice(0, 3) + "****" + phone.slice(7, 11)
        this.props.getUserMessgaeCode({ mobile: phone })
            .then((res) => {
                if (res && res.error_code == 0) {
                    this._countDownAction()
                    this.refs.toast.show('验证码已发送至' + showphone + "请注意查看！", 1000)
                }
                else {
                    this.refs.toast.show(res.msg + "[" + res.error_code + "]", 1000)
                }
            }).catch(err => {

            })
    }
}
