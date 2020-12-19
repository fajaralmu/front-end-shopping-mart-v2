

import React, { Component, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import Menu from './../../models/Menu';
import './SideBar.css'

class SideBar extends BaseComponent {
    constructor(props: { brand: any, sidebarMenus?: Menu[] }) {
        super(props, false);
    }

    render() {
        const parentMenu: Menu = this.props.parentMenu;
        if (null == parentMenu) { return null }
        const menus: Menu[] = this.props.sidebarMenus == null ? [] : this.props.sidebarMenus;

        return (
            <div id="sidebar" className="sidebar-nav bg-secondary">
                <Brand show={parentMenu != null} brand={parentMenu} />
                {menus.map(menu => {
                    return (
                        <li><Link to={parentMenu.url + "/" + menu.url}>
                            <span style={{marginRight:'5px'}}><i className={Menu.getIconClassName(menu)}></i></span>
                            <span>{menu.name}</span>
                        </Link></li>
                    )
                })
                }
            </div >
        )
    }

}
const Brand = (props) => {
    if (props.show == false) return null;
    return (
        <li className="sidebar-brand" style={{ marginBottom: '20px' }}><div
            style={{
                textAlign: 'center', paddingTop: '10px',
                paddingBottom: '10px'
            }}>
            <h3 className="text-light">
                <i className={Menu.getIconClassName(props.brand)}></i>
            </h3>
            <h4 className="text-light">{props.brand.name}</h4>
        </div></li>
    )
}
const mapDispatchToProps = (dispatch: Function) => ({
    performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(SideBar))