/**
 * 消息页
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import actions from "../../models/actions";
import NavigationBar from "../../components/navigationBar";
import { connect } from 'react-redux'
class MineScreen extends PureComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <NavigationBar navigation={this.props.navigation} isBack={false} title={"我的"} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        color: "#202020",
        fontSize: 30
    }
});

export default connect(
    ({ userInfo }) => ({
        userInfo
    }), {
        getAllCategoryListData: actions.getAllCategoryListData
    }
)(MineScreen);
