import React, { PureComponent } from 'react'
import {
    Text,
    View,
    Image,
    TextInput,
    Alert,
    Platform,
    TouchableOpacity,
    Keyboard, StyleSheet
} from 'react-native'
import { statusBarHeight, safeAreaBottomHeight, LoginToken, WechatAppid, WechatSecretid, screenHeight } from '../../../../util/AdapterUtil'
import NavigationService from '../../../../components/NavigationService'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default class Login extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            phoneText: "",
            token: "",
            canClick: true
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <KeyboardAwareScrollView>
                    <TouchableOpacity onPress={this.hiddenKeyborad.bind(this)} activeOpacity={1} style={{ height: screenHeight - safeAreaBottomHeight - statusBarHeight - 10 }}>
                        <Text style={{ color: "#202020",marginTop: 150, fontSize: 21, fontWeight: "bold", textAlign: 'center' }}>欢迎使用三松云医</Text>
                        <View style={{ flexDirection: "row", marginTop: 50, height: 60, marginLeft: 38, marginRight: 38, alignItems: "center" }}>
                            <Text style={{ color: "#202020", fontSize: 18, fontWeight: "bold", fontFamily: "Helvetica" }}>+86</Text>
                            <TextInput style={{ marginLeft: 25, color: "#202020", fontSize: 18, fontFamily: "Helvetica", flex: 1, height: 40 }} placeholder={"请输入手机号"} keyboardType={"numeric"} onChangeText={text => this.setState({
                                phoneText: text
                            })} />
                        </View>
                        <View style={{ height: 1, backgroundColor: "#A0A0A0", marginLeft: 38, marginRight: 38 }} />
                        <TouchableOpacity style={{ marginTop: 35, marginLeft: 38, marginRight: 38, height: 45, borderRadius: 22, backgroundColor: "#FFCC00", justifyContent: "center", alignItems: "center" }}
                            onPress={this.getMessageCode.bind(this)} disabled={!this.state.canClick}>
                            <Text style={{ color: "#202020", fontSize: 14 }}>获取验证码</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
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

    hiddenKeyborad() {
        Keyboard.dismiss();
    }

    getMessageCode() {
        NavigationService.reset('RootTab');
        return

        // this.setState({
        //     canClick: false
        // })
        // let phone = this.state.phoneText
        // if (phone.length == 0) {
        //     this.refs.toast.show("请输入手机号", 1000)
        //     this.setState({
        //         canClick: true
        //     })
        //     return
        // }
        // if (phone.length == 11) {
        //     if (phone.slice(0, 1) == '1') {
        //         if (!(phone.slice(0, 2) == '12')) {
        //             this.props.getUserMessgaeCode({ mobile: phone })
        //                 .then((res) => {
        //                     if (res && res.error_code == 0) {
        //                         this.setState({
        //                             canClick: true
        //                         })
        //                         this.props.navigation.dispatch(
        //                             StackActions.push({
        //                                 routeName: "code",
        //                                 params: phone
        //                             })
        //                         )
        //                     }
        //                     else {
        //                         this.setState({
        //                             canClick: true
        //                         })
        //                         this.refs.toast.show(res.msg, 1000)
        //                     }
        //                 }).catch(err => {
        //                     this.setState({
        //                         canClick: true
        //                     })
        //                     this.refs.toast.show("网络问题，请重试", 1000)
        //                 })
        //             return
        //         }
        //     }
        // }
        // this.setState({
        //     canClick: true
        // })
        // this.refs.toast.show(this.state.phoneText + "不是正确的手机号", 1000)
    }

    //保存数据
    saveDataToStorage = async (token) => {
        global.storage.save({
            key: LoginToken,
            data: token,
            expires: null
        })
    }
}

const styles =  StyleSheet.create({
    loginTitle: {
        marginLeft: 15,
        marginTop: 25,
        color: "#202020",
        fontSize: 30,
        fontWeight: "bold"
    }
})

