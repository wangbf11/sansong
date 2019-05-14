/**
 * Android 返回
 */
import React, { Component, PureComponent } from 'react';
import {
    BackHandler,
} from 'react-native';

import NavigationService from './NavigationService';

export default class extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        if (!NavigationService.getState()) {
            return false
        }
        if (NavigationService.getState().nav.routes.length !== 1) {
            return false
        }
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();
            return false;
        }
        this.lastBackPressed = Date.now();
        Toast.show('再按一次退出应用', 2000);
        return true;
    }

    render() {
        return null
    }
};
