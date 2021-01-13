

import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import ApplicationProfile from '../../../models/ApplicationProfile';
import { baseImageUrl } from '../../../constant/Url';

class HomeMain extends BaseComponent {
    constructor(props: any) {
        super(props, false);
    }

    componentDidMount() {
        document.title = "Home";
    }
    render() {
        const applicationProfile: ApplicationProfile = this.getApplicationProfile();
        const imageUrl: string = baseImageUrl + applicationProfile.backgroundUrl;
        return (
            <div className="container-fluid">
                <div className="jumbotron"
                    style={{
                        marginTop: '20px',
                        backgroundImage: 'url("' + imageUrl + '")',
                        backgroundSize: 'cover',
                        color: applicationProfile.fontColor
                    }}
                >
                    <h1 className="display-4">{applicationProfile.name}</h1>
                    <p className="lead">{applicationProfile.welcomingMessage}</p>
                    <hr className="my-4" />
                    <p>{applicationProfile.shortDescription}</p>
                    <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
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
)(HomeMain))