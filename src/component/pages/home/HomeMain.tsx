

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';

class HomeMain extends BaseComponent
{
    constructor(props:any){
        super(props, true);
    }
    
    componentDidMount() {
        document.title = "Home";
    }
    render(){
        return (
            <div id="HomeMain">
                <h2>HomeMain</h2>
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