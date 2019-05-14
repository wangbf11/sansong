/**
 * 首页
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import actions from "../../models/actions";
import NavigationBar from "../../components/navigationBar";
import ImageView from "../../components/ImageView";
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper';
import image from '../../assets/image'
import { NavigationEvents } from 'react-navigation';
import { FlatGrid, SectionGrid } from 'react-native-super-grid';
import { screenWidth, screenHeight } from '../../util/AdapterUtil'

class HomeScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bannerData: [],
            gridData: [],
        };
    }

    componentDidMount() {
        this.setState({
            bannerData: [
                {
                    url_path: 'http://pic8.iqiyipic.com/image/20181124/6a/c1/a_100035270_m_601_m13_180_236.jpg',
                },  {
                    url_path: 'http://pic8.iqiyipic.com/image/20181124/6a/c1/a_100035270_m_601_m13_180_236.jpg',
                },  {
                    url_path: 'http://pic8.iqiyipic.com/image/20181124/6a/c1/a_100035270_m_601_m13_180_236.jpg',
                },  {
                    url_path: 'http://pic8.iqiyipic.com/image/20181124/6a/c1/a_100035270_m_601_m13_180_236.jpg',
                }
            ],

            gridData: [
                { name: '我的问诊', code: '#1abc9c' }, { name: '我的患者', code: '#2ecc71' },
                { name: '开处方', code: '#3498db' }, { name: '我的主页', code: '#9b59b6' },
                { name: '药品订单', code: '#34495e' }, { name: '处方审核', code: '#16a085' }
            ],
        })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <NavigationEvents
                    onWillFocus={payload => {
                        this.bannerView && this.bannerView.scrollBy(1);
                    }}/>
                <NavigationBar navigation={this.props.navigation} isBack={false} title={"首页"} />
                <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
                    {this.renderBanner(this.state.bannerData)}
                    {this.renderGrid(this.state.gridData)}
                    <View style={{
                        height: 1,
                        backgroundColor: "#ccc",
                        transform: [{ scaleY: 0.5 }]
                    }}/>
                    {this.renderSystemMessage()}
                </ScrollView>
            </View>
        )
    }

    //banner
    renderBanner = (data) => {
        return (
            <View style={styles.bannerView}>
                {
                    data.length > 0 ?
                        <Swiper
                            ref={e => { this.bannerView = e }}
                            autoplay={true}
                            autoplayTimeout={5}
                            dot={<View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -15, }} />}
                            activeDot={<View style={{ backgroundColor: '#007aff', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -15, }} />}
                        >
                            {
                                data.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.banner_img}>
                                            <ImageView
                                                imageBackground={true}
                                                source={{ uri: item.url_path }}
                                                resizeMode='cover'
                                                style={styles.banner_img} >
                                            </ImageView>
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </Swiper> :
                        <ImageView
                            imageBackground={true}
                            source={image.account_error}
                            style={styles.banner_img}>
                        </ImageView>
                }
            </View>
        );
    }

    //功能模块
    renderGrid = (data) => {
        return (
            <FlatGrid
                itemDimension={screenWidth/3-20}
                items={data}
                fixed={false}
                spacing={10}
                style={styles.gridView}
                staticDimension={screenWidth}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.itemContainer]}
                        onPress={() => {
                            switch (index) {
                                case 0:
                                    Toast.show("我的问诊", 2000);
                                    break;
                                case 1:
                                    Toast.show("我的患者", 2000);
                                    break;
                                case 2:
                                    Toast.show("开处方", 2000);
                                    break;
                                case 3:
                                    Toast.show("我的主页", 2000);
                                    break;
                                case 4:
                                    Toast.show("药品订单", 2000);
                                    break;
                                case 5:
                                    Toast.show("处方审核", 2000);
                                    break;
                            }
                        }}>
                        <ImageView
                            imageBackground={false}
                            source={image.account_error}
                            style={{ flex: 1}}>
                        </ImageView>
                        <Text style={styles.itemName}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        );

    }
    //系统消息
    renderSystemMessage = () => {
        return (
            <TouchableOpacity style={{ marginTop: 5,height:100, flexDirection: "row",justifyContent: "center",paddingTop:10,paddingBottom:10,}}>
                <ImageView
                    source={image.account_error}
                    style={{ width: 76, height: "100%", marginLeft: 13, marginBottom: 13, marginTop: 13, justifyContent: "center", alignItems: "center" }}>
                </ImageView>
                <View style={{ flex: 1, marginLeft: 13,justifyContent: "center" }}>
                    <Text style={{ color: "#202020", fontSize: 16 }}>系统消息</Text>
                    <View style={{ flex: 1}}/>
                    <Text style={{ color: "#F98240", fontSize: 18,
                        //fontWeight: 'bold',
                        }}
                          numberOfLines={1}>
                        患者 张峰支付了你的图文资讯，请及时就诊
                    </Text>
                </View>
            </TouchableOpacity >
        );
    }
}

const styles = StyleSheet.create({
    titleStyle: {
        color: "#202020",
        fontSize: 30
    },
    banner_img: {
        width: '100%',
        height: '100%',
    },
    bannerView: {
        width: '100%',
        height: 180,
    },
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: "center",
        //shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 2,
        borderRadius: 5,
        height: 100,
    },
    itemName: {
        fontSize: 16,
        color: 'black',
    }
});

export default connect(
    ({ userInfo }) => ({
        userInfo
    }), {
        getAllCategoryListData: actions.getAllCategoryListData
    }
)(HomeScreen);
