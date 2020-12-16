
import React, { Component, Fragment, RefObject } from 'react';
import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import * as actions from './redux/actionCreators'
import { connect } from 'react-redux'
import * as menus from './constant/Menus'
import SockJsClient from 'react-stomp';
import * as url from './constant/Url';
import { mapCommonUserStateToProps } from './constant/stores';
import Loader from './component/loader/Loader';
import Alert from './component/alert/Alert';
import MainLayout from './component/layout/MainLayout';

interface IState {
  loading: boolean;
  loadingPercentage: number;
  requestId?: undefined;
  mainAppUpdated: Date;
  showAlert: boolean;
  realtime: boolean;
}
class App extends Component<any, IState> {

  loadings: number = 0;
  alertTitle: String = "Info";
  alertBody: any = null;
  alertIsYesOnly: boolean = true;
  alertIsError: boolean = false;
  alertOnYesCallback: Function = function (e) { };
  alertOnCancelCallback: Function = function (e) { };
  clientRef: RefObject<SockJsClient> = React.createRef();
  // alertRef: RefObject<Alert> = React.createRef();
  alertCallback = {
    title: "Info",
    message: "Info",
    yesOnly: false,
    onOk: () => { },
    onNo: () => { }
  }

  constructor(props: any) {
    super(props);
    this.state = {
      ...this.state,
      loading: false,
      loadingPercentage: 0,
      requestId: undefined,
      mainAppUpdated: new Date(),
      showAlert: false,
      realtime: false,
    };

  }
  refresh() {
    this.setState({ mainAppUpdated: new Date() });
  }

  requestAppId() {
    this.props.requestAppId(this);
  }

  incrementLoadings() {
    this.loadings++;
  }

  decrementLoadings() {
    this.loadings--;
    if (this.loadings < 0) {
      this.loadings = 0;
    }
  }

  startLoading(realtime) {
    this.incrementLoadings();
    this.setState({ loading: true, realtime: realtime });
  }

  endLoading() {
    this.decrementLoadings();
    if (this.loadings == 0) {
      this.setState({ loading: false, loadingPercentage: 0 });
    }

  }

  handleMessage(msg: any) {
    let percentage = Math.floor(msg.percentage);
    if (msg.percentage < 0 || msg.percentage > 100) {
      this.endLoading();
    }
    this.setState({ loadingPercentage: percentage });
  }

  showAlert(title: string, body: any, yesOnly: boolean, yesCallback: Function, noCallback?: Function) {
    this.alertTitle = title;
    this.alertBody = body;
    this.alertIsYesOnly = yesOnly;
    const app = this;
    this.alertOnYesCallback = function (e) {
      app.dismissAlert();
      yesCallback(e);
    }
    if (!yesOnly) {
      this.alertOnCancelCallback = function (e) {
        app.dismissAlert();
        if (noCallback != null) {
          noCallback(e);
        }
      };
    }
    this.setState({ showAlert: true });
  }

  dismissAlert() {
    this.alertIsError = false;
    this.setState({ showAlert: false })
  }
  showAlertError(title: string, body: any, yesOnly: boolean, yesCallback: Function, noCallback?: Function) {
    this.alertIsError = true;
    this.showAlert(title, body, yesOnly, yesCallback, noCallback)
  }

  componentDidUpdate() {
    if (this.props.applicationProfile) {
      updateFavicon(this.props.applicationProfile);
    }

  }

  componentDidMount() {
    this.requestAppId();
    this.setState({ loadingPercentage: 0 });
  }

  render() {

    if (!this.props.requestId) {
      return (<Loader realtime={false} text="Please wait..." type="loading" />)
    }

    const usedHost = url.contextPath();
    const applicationProfile = this.props.applicationProfile;

    return (
      <Fragment>
        <Loading realtime={this.state.realtime} loading={this.state.loading} loadingPercentage={this.state.loadingPercentage} />
        {this.state.showAlert ?
          <Alert
            isError={this.alertIsError}
            onClose={(e)=>this.setState({showAlert:false})}
            yesOnly={this.alertIsYesOnly}
            title={this.alertTitle}
            onYes={this.alertOnYesCallback} onNo={this.alertOnCancelCallback}
          >{this.alertBody}</Alert> :
          null}
        <MainLayout app={this} />
        <SockJsClient url={usedHost + 'realtime-app'} topics={['/wsResp/progress/' + localStorage.getItem("requestId")]}
          onMessage={(msg) => { this.handleMessage(msg) }}
          ref={(client) => { this.clientRef = client }} />

      </Fragment>
    )
  }

}


function Loading(props) {
  if (props.loading == true) {
    return (
      <Loader realtime={props.realtime} progress={props.loadingPercentage} text="Please wait..." type="loading" />
    );
  }
  return null;
}

function updateFavicon(profile: any) {
  if (profile.pageIcon) {
    let link = document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.id = 'favicon';
      link.setAttribute("rel", 'shortcut icon');
      document.head.appendChild(link);
    }

    link.setAttribute("href", url.baseImageUrl + 'ICON/' + profile.pageIcon);
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  requestAppId: (app: App) => dispatch(actions.requestAppId(app)),
})

export default withRouter(connect(
  mapCommonUserStateToProps,
  mapDispatchToProps
)(App))
