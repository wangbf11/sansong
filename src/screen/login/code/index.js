import { connect } from 'react-redux'

import Code from './container/index'

import actions from '../../../models/actions'

export default connect(
    ({ userInfo }) => ({
        userInfo
    }), {
        getLoginToken: actions.getLoginToken,
        getUserMessgaeCode: actions.getUserMessgaeCode
    }
)(Code)