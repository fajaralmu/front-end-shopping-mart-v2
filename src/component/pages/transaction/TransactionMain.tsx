

import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';

class TransactionMain extends BaseMainMenus {
    constructor(props: any) {
        super(props, "Transaction", true);

    }

    render() {
        return (
            <div id="TransactionMain" className="container-fluid">
                <h2>Transaction Page</h2>
                <div className="row">
                    <div className="col-md-2 text-center">
                        <h1> <Link className="btn btn-info btn-lg" to="/transaction/selling"><i className="fas fa-cash-register" /></Link></h1>
                        <p>Selling</p>
                    </div>
                    <div className="col-md-2 text-center">
                        <h1><Link className="btn btn-info btn-lg" to="/transaction/purchasing"><i className="fas fa-shopping-basket" /></Link></h1>
                        <p>Purchasing</p>
                    </div>
                </div>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(TransactionMain))