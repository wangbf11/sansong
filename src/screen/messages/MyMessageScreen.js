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
import * as IMClient from "rongcloud-react-native-imlib";

class MyMessageScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            conversationTypes: "1, 2",
            conversations : [],
        };
    }

    componentDidMount() {
        this.getConversations();
    }

    getConversations = async () => {
        const { conversationTypes } = this.state;
        const conversations = await IMClient.getConversationList(
            conversationTypes.split(",").map(i => parseInt(i))
        );
        console.log(conversations);
        this.setState({ conversations });
    };


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <NavigationBar navigation={this.props.navigation} isBack={false} title={"消息"} />
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
)(MyMessageScreen);
