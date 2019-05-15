import React, { PureComponent } from 'react'

import {
    Image,
    Platform,
    View,
    StatusBar,
    Animated,
    Easing
} from 'react-native'

import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator, StackActions
} from 'react-navigation'

import image from "./assets/image"

import LoginScreen from './screen/login/phone'

import CodeScreen from './screen/login/code'

import WelcomeScreen from './screen/welcome/WelcomeScreen'
import HomeScreen from './screen/home/HomeScreen'
import MessageScreen from './screen/messages/MyMessageScreen'
import MyScreen from './screen/mine/MineScreen'
import BindPhoneScreen from './screen/login/bindphone'
import BindCodeScreen from './screen/login/bindcode'
import BackTwiceExitApp from './components/BackTwiceExitApp'
import Toast from './components/Toast'
import Loading from './components/Loading'
import NavigationService from './components/NavigationService';
import CodePush from 'react-native-code-push'
import * as IMClient from "rongcloud-react-native-imlib";

function onSuccess(userId) {
    console.log("连接成功：" + userId);
    alert("连接成功")
}

function onError(errorCode) {
    console.log("连接失败：" + errorCode);
    alert("连接失败")
}

function onTokenIncorrect() {
    console.log("Token 不正确或已过期");
    alert("Token 不正确或已过期")
}

IMClient.init("x18ywvqfxci8c")
IMClient.connect("Mp1SlOClkC5imMrnO5xIsAoSTn8t701T7AbwThntqeIQasCHd35DQRg6FtTrjEPC/GN4Ijv1uf2D3sMjvYRkgQ=="
,onSuccess,onError,onTokenIncorrect);

const setIcon = function ({ ...set }) {
    return (
        <Image
            source={set.focused ? set.selectSource : set.source}
            style={{
                width: 20,
                height: 20
            }}
        />
    )
}

const setMyIcon = function ({ ...set }) {
    return (
        <Image
            source={set.focused ? set.selectSource : set.source}
            style={{
                width: 42,
                height: 40,
                marginTop: -18
            }}
        />
    )
}

const tabBar = createBottomTabNavigator(
    {
        Home: {
            screen: HomeScreen,
            navigationOptions: navigation => {
                return {
                    tabBarLabel: "找大夫",
                    tabBarIcon: state => {
                        return setIcon({
                            ...state,
                            source: image.home_g,
                            selectSource: image.home_c,
                        })
                    }
                }
            }
        },
        message: {
            screen: MessageScreen,
            navigationOptions: navigation => {
                return {
                    tabBarLabel: "消息",
                    tabBarIcon: state => {
                        return setIcon({
                            ...state,
                            source: image.video_g,
                            selectSource: image.video_c
                        })
                    }
                }
            }
        },
        My: {
            screen: MyScreen,
            navigationOptions: navigation => {
                return {
                    tabBarLabel: "我的",
                    tabBarIcon: state => {
                        return setMyIcon({
                            ...state,
                            source: image.my_g,
                            selectSource: image.my_c
                        })
                    }
                }
            }
        }
    },
    {
        tabBarOptions: {
            activeTintColor: "#FFCD07",
            inactiveTintColor: "#808080",
            labelStyle: {
                fontSize: 10,
            },
            // style: {
            //     marginLeft: 10,
            //     marginRight: 10
            // },//位置是可以设置的
            // indicatorStyle: {backgroundColor: "red" } // 设置线无效
        }
    }
)

const navigator = createStackNavigator(
    {
        welcome: {
            screen: WelcomeScreen
        },
        RootTab: {
            screen: tabBar,
            navigationOptions: {
                gesturesEnabled: false
            }
        },
        login: {
            screen: LoginScreen,
            navigationOptions: {
                gesturesEnabled: false
            }
        },
        code: {
            screen: CodeScreen,
            navigationOptions: {
                gesturesEnabled: false
            }
        },
        bindphone: {
            screen: BindPhoneScreen
        },
        bindcode: {
            screen: BindCodeScreen
        },
    },
    {
        initialRouteName: 'welcome',
        headerMode: 'screen',
        defaultNavigationOptions: {
            header: null,
        },
        // 页面切换动画
        transitionConfig: () => ({
            transitionSpec: {
                duration: 300,
                easing: Easing.out(Easing.poly(4)),
                timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;

                const width = layout.initWidth;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [width, 0, 0],
                });

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                });

                return { opacity, transform: [{ translateX }] };
            },
        }),
    }
)

const RootRouter = createAppContainer(navigator)

class Route extends PureComponent {
    componentDidMount() {

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle={this.props.barStyle || 'dark-content'}
                    backgroundColor={this.props.statusBarBgColor || 'transparent'}
                    translucent={true} />
                <RootRouter ref={(e) => { NavigationService.setTopLevelNavigator(e) }}/>
                <Toast ref={(e) => { e && (global.Toast = e) }} position={'center'} />
                <Loading ref={(e) => { e && (global.Loading = e) }} />
                <BackTwiceExitApp />
            </View>
        );
    }
}
let codePushOptions = {
    //设置检查更新的频率
    //ON_APP_RESUME APP恢复到前台的时候
    //ON_APP_START APP开启的时候
    //MANUAL 手动检查
    checkFrequency : CodePush.CheckFrequency.MANUAL
};
//这一行是必须的
export default CodePush( codePushOptions )( Route );
