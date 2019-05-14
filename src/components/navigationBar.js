import React, { PureComponent, PropTypes } from "react"
import {
    View,
    Text,
    Image,
    StatusBar,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from "react-native"
import { NavigationActions, StackActions } from "react-navigation"

import {
    screenWidth,
    unitWidth,
    titleHeight,
    statusBarHeight
} from '../util/AdapterUtil'

import image from '../assets/image'

class NavigationBar extends PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        let isBackButton = this.props.isBack ?
            <TouchableOpacity
                style={styles.backButton}
                onPress={this.goBack.bind(this)} >
                <Image
                    style={styles.backImage}
                    source={image.back_b} />
            </TouchableOpacity> :
            <View style={styles.backButton} />

        let isRightButton = this.props.isRight ?
            (this.props.rightTitle ?
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={this._rightOnPress.bind(this)} >
                    <Text>{this.props.rightTitle}</Text>
                </TouchableOpacity> :
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={this._rightOnPress.bind(this)} >
                    <ImageBackground
                        style={this.props.rightImageStyle ? this.props.rightImageStyle : styles.backImage}
                        source={this.props.rightImage ? this.props.rightImage : image.back_b} >
                    </ImageBackground>
                </TouchableOpacity>) :
            <View style={styles.backButton} />
        return (
            <View>
                <View style={styles.statusBar}/>
                <View style={styles.navigationHeight}>
                    {isBackButton}
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <Text style={styles.titleStyle}>{this.props.title}</Text>
                    </View>
                    {isRightButton}
                </View>
                <View style={{
                    height: 1,
                    backgroundColor: this.props.noLine ? "#fff" : "#ccc",
                    transform: [{ scaleY: 0.5 }]
                }}>
                </View>
            </View>
        )
    }

    goBack() {
        this.props.navigation.dispatch(StackActions.pop({
            n: 1,
        }))
    }

    _rightOnPress() {
        this.props.rightOnPress()
    }
}

export default NavigationBar

const styles = StyleSheet.create({
    statusBar: {
        height: statusBarHeight,
        backgroundColor: 'transparent'
    },
    navigationHeight: {
        flexDirection: "row",
        height: 44
    },
    backButton: {
        height: 44,
        width: 49,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    backImage: {
        width: 19,
        height: 17
    },
    titleStyle: {
        color: "#202020",
        fontSize: 15
    }
})