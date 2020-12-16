

import  React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseComponent from '../../BaseComponent';
import { mapCommonUserStateToProps } from '../../../constant/stores';

class MasterDataMain extends BaseComponent
{
    constructor(props:any){
        super(props, true);
    }
    
    componentDidMount() {
        document.title = "Master Data";
    }
    render(){
        return (
            <div id="MasterDataMain">
                <h2>MasterDataMain</h2>
            </div>
        )
    }

}
const mapDispatchToProps = (dispatch: Function) => ({
  })
  

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
  )(MasterDataMain))