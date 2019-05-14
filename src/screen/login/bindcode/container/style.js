import { StyleSheet } from "react-native"
import {
    screenWidth,
    statusBarHeight,
    safeAreaBottomHeight
} from '../../../../util/AdapterUtil'

export default StyleSheet.create({
    loginTitle: {
        marginLeft: 15,
        marginTop: 25,
        color: "#202020",
        fontSize: 30,
        fontWeight: "bold"
    },
    codeBackView: {
        marginTop: 50,
        marginLeft: 22, 
        marginRight: 37,
        flexDirection: "row"
    }
})