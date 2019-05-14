import React, { PureComponent } from "react"
import { requireNativeComponent } from "react-native"
import PropTypes from 'prop-types'
const RNWebp = requireNativeComponent("WebpImage", WebImageiOS)

class WebImageiOS extends PureComponent {

    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        imageUri: PropTypes.string,
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <RNWebp  {...this.props} />
        )
    }
}

export default WebImageiOS