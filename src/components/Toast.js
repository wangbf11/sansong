import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    Dimensions,
    Text,
} from 'react-native'
import { PropTypes } from 'prop-types';

const { height, width } = Dimensions.get('window');

const DURATION = {
    LENGTH_LONG: 1500,
    LENGTH_SHORT: 500,
    FOREVER: 0,
};


export default class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            text: '',
            position: null,
            opacityValue: new Animated.Value(this.props.opacity),
        }
    }
    isShow = false;

    show(text, duration, position = 'center', callback) {
        duration = typeof duration === 'number' ? duration : DURATION.LENGTH_LONG;

        this.setState({
            isShow: true,
            text: text,
            position,
        });

        Animated.timing(
            this.state.opacityValue,
            {
                toValue: this.props.opacity,
                duration: this.props.fadeInDuration,
            }
        ).start(() => {
            this.isShow = true;
            if (duration !== DURATION.FOREVER) this.close(duration, callback);
        });
    }

    close(duration, callback = () => { }) {
        let delay = typeof duration === 'undefined' ? DURATION.LENGTH_LONG : duration;

        if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250;

        if (!this.isShow && !this.state.isShow) return;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            Animated.timing(
                this.state.opacityValue,
                {
                    toValue: 0,
                    duration: this.props.fadeOutDuration,
                }
            ).start(() => {
                this.setState({
                    isShow: false,
                });
                this.isShow = false;
                callback();
            });
        }, delay);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let pos;
        switch (this.state.position || this.props.position) {
            case 'top':
                pos = this.props.positionValue;
                break;
            case 'center':
                pos = height / 2;
                break;
            case 'bottom':
                pos = height - this.props.positionValue;
                break;
        }

        const view = this.state.isShow ?
            <View style={[styles.container, { top: pos }]} pointerEvents="none">
                <Animated.View style={[styles.content, { opacity: this.state.opacityValue }, this.props.style]}>
                    <Text style={this.props.textStyle}>
                        {this.state.text}
                    </Text>
                </Animated.View>
            </View> :
            null;

        return view;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: width / 8,
        right: width / 8,
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 5,
        padding: 10,
    },
    text: {
        color: '#fff',
    },
});

Toast.propTypes = {
    position: PropTypes.oneOf([
        'top',
        'center',
        'bottom',
    ]),
    // style: View.propTypes.style,
    // textStyle: Text.propTypes.style,
    positionValue: PropTypes.number,
    fadeInDuration: PropTypes.number,
    fadeOutDuration: PropTypes.number,
    opacity: PropTypes.number
};

Toast.defaultProps = {
    position: 'bottom',
    textStyle: styles.text,
    positionValue: 120,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 1
};
