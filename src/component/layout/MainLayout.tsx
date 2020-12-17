

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import Header from '../navigation/Header';
import ApplicationContent from './ApplicationContent';
import SideBar from '../navigation/SideBar';
import './Layout.css';
import Menu from './../../models/Menu';
import { getMenuByPathName } from './../../constant/Menus';

class MainLayout extends BaseComponent {
    state: any = {
        showSidebar: false,
        activeMenuCode:null
    };
    constructor(props: any) {
        super(props, false);
        this.state = {
            ...this.state,
        }
    }
    setMenu = (menu:Menu) => {
        this.setState({showSidebar:menu.showSidebar, activeMenuCode:menu.code});
    }
    componentDidMount() {
        this.setCurrentMenu();
    }
    setCurrentMenu = () => {
        const pathName = this.props.location.pathname;
        const menu = getMenuByPathName(pathName);
        if (null == menu) return;
        this.setMenu(menu);
    }
    render() {
        const showSidebar = this.state.showSidebar == true;
        return (
            <div id="main-layout">
                <Header activeMenuCode={this.state.activeMenuCode} setMenu={this.setMenu} app={this.parentApp} />
                <div id="page-content" className="container-fluid" style={{ margin: 0, padding: 0, minHeight: '80vh' }}>
                    {/* <div className="?"> */}
                    {showSidebar == true ? <div style={{ position: 'absolute' }}>
                        <div id="sidebar">
                            <SideBar app={this.props.app} />
                        </div>
                    </div> : null}
                    <div id={showSidebar?"app-content":"content"}>
                        <ApplicationContent app={this.props.app} />
                    </div>
                    {/* </div> */}
                    
                </div>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
    performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MainLayout))