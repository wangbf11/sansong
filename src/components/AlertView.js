import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal, Platform } from "react-native"
import PropTypes from 'prop-types'

import {
    screenWidth,
    screenHeight,
    statusBarHeight
} from "../util/AdapterUtil"

class AlertView extends PureComponent {

    static propTypes = {
        children: PropTypes.node.isRequired
    }

    render() {
        const {
            children,
        } = this.props
        let subViews = []
        subViews = Object.keys(children)
        subViews = subViews.map((page, i) => {
            return <View key={i}>{children[page]}</View>
        })

        return (
            Platform.OS === "ios" ?
                <Modal transparent={true}
                    onRequestClose={() => { }}
                    visible={this.props.isShow}>
                    <View
                        style={[styles.backgroundIOS, this.props.position, this.props.backgroundColor]}>
                        <View style={this.props.contentStyle}>
                            {subViews}
                        </View>
                    </View>
                </Modal> :
                this.props.isShow &&
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : 'rgba(52,52,52,0.5)'
                }}>
                    <Modal transparent={true}
                        onRequestClose={() => { }}
                        animationType='slide'
                        visible={this.props.isShow}>
                        <View
                            style={[styles.backgroundAndroid, this.props.position, this.props.backgroundColor]}>
                            <View style={this.props.contentStyle}>
                                {subViews}
                            </View>
                        </View>
                    </Modal>
                </View>
        )
    }
}

let styles = StyleSheet.create({
    backgroundAndroid: {
        flex: 1,
        alignItems: 'center'
    },
    backgroundIOS: {
        position: 'absolute',
        top: 0,
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'rgba(52,52,52,0.5)',
        alignItems: 'center'
    }
})

export default AlertView
