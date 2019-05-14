import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Modal,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            text: ''
        }
    }

    show(text = '') {
        this.setState({
            visible: true,
            text
        })
    }

    hide() {
        this.setState({
            visible: false
        })
    }

    render() {
        let visible;
        if (this.props.visible !== undefined) {
            visible = this.props.visible;
        } else {
            visible = this.state.visible;
        }

        if (!visible) return null

        return (
            <TouchableOpacity style={styles.wrapper} onPress={() => { this.hide() }}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <ActivityIndicator size={'large'} color={'#fff'} />
                        <View style={styles.textBox}>
                            {
                                this.state.text ?
                                    <Text style={styles.text}>{this.state.text}</Text> :
                                    null
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 110,
        minHeight: 110,
        paddingTop: 18,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.75)',
    },
    textBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        paddingVertical: 10,
    },
    text: {
        width: '100%',
        paddingHorizontal: 5,
        fontSize: 14,
        color: '#ccc',
        lineHeight: 18,
        textAlign: 'center',
    },
});
