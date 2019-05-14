/**
 * 图片
 */
import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Image,
    ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import image from '../assets/image'

export default class ImageView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: props.source,
            resizeMode: props.resizeMode || 'cover',
        }
    }

    static getDerivedStateFromProps(props, state) {
        // 通过判断 source 是否是Object，来确定是否是网络图片
        let isNetImage = Object.prototype.toString.call(state.source) === "[object Object]";
        if (isNetImage && props.source !== state.source) {
            return {
                source: props.source,
            }
        }
        return null
    }

    componentDidMount() {
    }

    onError = (e) => {
        // console.log(e);
        this.setState({
            source: image.account_error,
        })
    }

    componentWillUnmount() {
        // 去除组件销毁时，异步的setState为完成的警告
        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        const { imageBackground } = this.props;
        const { source, resizeMode } = this.state;

        if (imageBackground) {
            return (
                <ImageBackground
                    {...this.props}
                    source={source}
                    resizeMode={resizeMode}
                    onError={this.onError}
                >
                    {this.props.children}
                </ImageBackground>
            );
        }

        return (
            <Image
                {...this.props}
                source={source}
                resizeMode={resizeMode}
                onError={this.onError}
            />
        );
    }
};

const styles = StyleSheet.create({
});
