
import React, { useRef, Fragment } from 'react';
import BaseComponent from './../BaseComponent';
import { mapCommonUserStateToProps } from './../../constant/stores';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { performLogout } from './../../redux/actionCreators';
import { getMenus } from '../../constant/Menus';

class Header extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }
    onLogout = (e: any) => {
        const app = this;
        app.showConfirmation("Logout?").then(
            function (ok) {
                if (ok) {
                    app.props.performLogout(app.parentApp);
                }
            }
        )
    }
    render() {
        const menus = getMenus();
        return (
            <div className="bg-dark container-fluid" style={{ padding: 0, margin: 0 }}>
                <div id="navbar-brand-top" style={{paddingLeft:'0.5rem'}} className="container-fluid"><a style={{fontSize:'15px'}} className="text-white navbar-brand" href="#"><strong>{this.getApplicationProfile().name}</strong></a></div>

                <nav id="navbar" className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ zIndex: 55, position: 'fixed', width: '100%' }}>
                    {/* <div className="container-fluid"></div> */}
                    <a id="navbar-brand" className="navbar-brand" href="#">{this.getApplicationProfile().name}</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarToggler" aria-controls="navbarToggler"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse bg-secondary" id="navbarToggler">
                        <ul id="navbar-top" className="navbar-nav mr-auto mt-2 mt-lg-0">
                            {menus.map(menu => {
                                if (menu == null || menu.authenticated && this.isLoggedUserNull()) return null;
                                const isActive = this.props.activeMenuCode == menu.code;
                                return (
                                    <li key={"header-menu-" + new String(menu.code)} className={"nav-item " + (isActive ? "active nav-active" : "nav-inactive")}>
                                        <Link onClick={() => this.props.setMenu(menu)} className={isActive?"nav-link bg-secondary":"nav-link bg-secondary"}
                                            to={menu.url}><span>{menu.name}</span>
                                        </Link></li>
                                )
                            })}
                        </ul >
                        <form className="form-inline my-2 my-lg-0">
                            <UserIcon setMenuNull={this.props.setMenuNull} authenticated={this.isUserLoggedIn()}
                                onLogout={this.onLogout} user={this.getLoggedUser()}
                            />
                        </form >
                    </div >

                </nav >
            </div>
        )
    }

}
const UserIcon = (props: any) => {
    if (props.authenticated) {
        return (
            <Fragment>
                <Link onClick={props.setMenuNull} style={{ marginRight: "5px" }} className="btn btn-success btn-sm my-2 my-sm-0"
                    to='/profile'><i className="fas fa-user-circle"></i>&nbsp;{props.user.displayName}
                </Link>
                <a className="btn btn-danger btn-sm  my-2 my-sm-0"
                    onClick={props.onLogout}><i className="fas fa-sign-out-alt"></i>&nbsp;Logout
				</a>
            </Fragment>);
    }
    return (

        <Link onClick={props.setMenuNull} className="btn btn-sm btn-info my-2 my-sm-0"
            to='/login'> <i className="fas fa-sign-in-alt"></i>&nbsp;Login
        </Link>
    );
}

const mapDispatchToProps = (dispatch: Function) => ({
    performLogout: (app: any) => dispatch(performLogout(app))
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(Header))