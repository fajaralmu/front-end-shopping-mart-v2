

import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import ApplicationProfile from '../../../models/ApplicationProfile';
import { baseImageUrl } from '../../../constant/Url';

class HomeMain extends BaseComponent{
    constructor(props: any) {
        super(props, false);
    }

    componentDidMount() {
        document.title = "Home";
    }
    render() {
        const applicationProfile: ApplicationProfile = this.getApplicationProfile();
        const imageUrl:string = baseImageUrl +applicationProfile.backgroundUrl;
        return (
            <div className="jumbotron"
                    style={{
                        backgroundImage: 'url("'+imageUrl+'")',
                        backgroundSize: 'cover'
                    }}
                >
                    <h1 className="display-4">{applicationProfile.name}</h1>
                    <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                    <hr className="my-4" />
                    <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                    <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
                </div>
           
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
})


export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(HomeMain))