import { connect } from 'react-redux'

import BindCode from './container/index'

import actions from '../../../models/actions'

export default connect(
    ({ userInfo }) => ({
        userInfo
    }), {
        getUserMessgaeCode: actions.getUserMessgaeCode,
        bindPhone: actions.bindPhone
    }
)(BindCode)