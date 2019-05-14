import React, {
    Component,
} from 'react';
import {
    findNodeHandle,
    requireNativeComponent,
    UIManager,
    View
} from "react-native";
import PropTypes from 'prop-types';

export default class WebpImageViewAndroid extends Component{
    constructor(props){
        super(props)
        this._onChange = this._onChange.bind(this);
    }

    render(){
        let self = this;
        // {...this.props} 一定需要设置，不让你永远也看不到
        return(
            <RCTWebpImageViewAndroid
                ref="My_WebpImageViewAndroid"
                {...this.props}
                onChange={this._onChange}
               />);
    }

    _onChange() {
        if (!this.props.onChangeColor) {
            return;
        }
        //js发送命令
        UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs.My_WebpImageViewAndroid), // 对应原生方法 接受命令receiveCommand的3个参数 参数1:原生控件  参数2: commandId  参数3: 数组参数
            1,[this.props.imageUri]
        )
        this.props.onChangeColor();
    }
}
//参数类型定义
WebpImageViewAndroid.propTypes = {
    onChangeColor: PropTypes.func,
    imageUri: PropTypes.string,  // 设置color属性
    ScaleType: PropTypes.string,  // 设置ScaleType属性 fit_xy fit_center center_crop
    ...View.propTypes, // 这里一定需要设置，不然会报错。has no propType for native prop。这个被坑了
};

// 拿到Native组件
var RCTWebpImageViewAndroid = requireNativeComponent('WebpImageView', WebpImageViewAndroid,{
    nativeOnly: {onClick: true}
});

