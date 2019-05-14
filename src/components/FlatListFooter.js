/**
 * FlatList ListFooterComponent
 */
import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class FlatListFooter extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static defaultProps = {
        isShowBottom: true,  // 是否去除iPhoneX的底部
        hasMore: true,
        show: true,
    }

    componentDidMount() {
    }

    render() {
        let container_end = this.props.isShowBottom ? { marginBottom: 20 + 10} : null;

        if (!this.props.show) return (
            <View style={container_end}></View>
        );

        return (
            <View style={[styles.container, container_end]}>
                <Text style={styles.text}>
                    {this.props.hasMore ? '加载中……' : '没有更多了'}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 34,
    },
    text: {
        fontSize: 15,
        color: '#686868',
    },
});
