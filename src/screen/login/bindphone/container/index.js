import React, { PureComponent } from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    Platform,
    TouchableOpacity
} from 'react-native'
import styles from './style'
import { statusBarHeight, safeAreaBottomHeight, LoginToken, WechatAppid, WechatSecretid } from '../../../../util/AdapterUtil'
import image from '../../../../assets/image'
import { StackActions } from 'react-navigation'
import Toast from 'react-native-easy-toast'
export default class Login extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            phoneText: "",
            token: ""
        }
    }

    componentDidMount() {

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
                <Text style={styles.loginTitle}>绑定手机号</Text>
                <View style={{ marginTop: 50, alignItems: "center" }}>
                    <Image source={image.account_error} style={{ width: 81, height: 81 }} />
                </View>
                <Text style={{ color: "#202020", fontSize: 21, fontWeight: "bold", textAlign: 'center' }}>指尖资讯</Text>
                <Text style={{ marginTop: 8, color: "#808080", fontSize: 10, textAlign: "center" }}>看资讯得金豆  邀好友赚现金</Text>
                <View style={{ flexDirection: "row", marginTop: 50, height: 60, marginLeft: 38, marginRight: 38, alignItems: "center" }}>
                    <Text style={{ color: "#202020", fontSize: 18, fontWeight: "bold", fontFamily: "Helvetica" }}>+86</Text>
                    <TextInput style={{ marginLeft: 25, color: "#202020", fontSize: 18, fontFamily: "Helvetica", flex: 1 }} placeholder={"请输入手机号"} keyboardType={"numeric"} onChangeText={text => this.setState({
                        phoneText: text
                    })} />
                </View>
                <View style={{ height: 1, backgroundColor: "#A0A0A0", marginLeft: 38, marginRight: 38 }} />
                <TouchableOpacity style={{ marginTop: 35, marginLeft: 38, marginRight: 38, height: 45, borderRadius: 22, backgroundColor: "#FFCC00", justifyContent: "center", alignItems: "center" }}
                    onPress={this.getMessageCode.bind(this)}>
                    <Text style={{ color: "#202020", fontSize: 14 }}>获取验证码</Text>
                </TouchableOpacity>
                <View style={{ height: safeAreaBottomHeight }} />
                <Toast
                    ref="toast"
                    style={{ backgroundColor: '#737373' }}
                    position='center'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    textStyle={{ color: '#fff', fontSize: 15, marginLeft: 15, marginRight: 15, marginTop: 10, marginBottom: 10 }}
                />
            </View>
        )
    }

    backaction() {
        this.props.navigation.dispatch(StackActions.pop({
            n: 1,
        }))
    }

    getMessageCode() {
        let phone = this.state.phoneText
        if (phone.length == 0) {
            this.refs.toast.show("请输入手机号", 1000)
            return
        }
        if (phone.length == 11) {
            if (phone.slice(0, 1) == '1') {
                if (!(phone.slice(0, 2) == '12')) {
                    this.props.getUserMessgaeCode({ mobile: phone })
                        .then((res) => {
                            if (res && res.error_code == 0) {
                                this.props.navigation.dispatch(
                                    StackActions.push({
                                        routeName: "bindcode",
                                        params: {
                                            token: this.props.navigation.state.params,
                                            phone: phone
                                        }
                                    })
                                )
                            }
                            else {
                                this.refs.toast.show(res.msg, 1000)
                            }
                        }).catch(err => {
                        })
                    return
                }
            }
        }
        this.refs.toast.show(this.state.phoneText + "不是正确的手机号", 1000)
    }
}

