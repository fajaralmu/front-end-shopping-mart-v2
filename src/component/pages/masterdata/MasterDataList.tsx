


import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseMainMenus from './../../layout/BaseMainMenus';
import BaseComponent from './../../BaseComponent';
import MasterDataService from './../../../services/MasterDataService';
import Modal from '../../container/Modal';

class MasterDataList extends BaseComponent {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    constructor(props: any) {
        super(props, true);
    }

    render() {
        return (
            <div id="MasterDataList" className="container-fluid">
                <Modal title="Data List">
                    
                </Modal>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MasterDataList))