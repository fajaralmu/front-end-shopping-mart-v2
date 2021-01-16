import React, { ChangeEvent, Component, FormEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from '../../BaseComponent';
import ApplicationProfile from '../../../models/ApplicationProfile';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import { baseImageUrl } from '../../../constant/Url';
import { setApplicationProfile } from '../../../redux/actionCreators';
import AnchorButton from '../../navigation/AnchorButton';
import WebResponse from '../../../models/WebResponse';
import { resizeImage, toBase64v2 } from '../../../utils/ComponentUtil';
import { EditField } from './helper';
import MasterDataService from './../../../services/MasterDataService';
import { base64StringFileSize, fileExtension } from './../../../utils/StringUtil';
interface EditField { name: boolean, welcomingMessage: boolean, shortDescription: boolean, backgroundUrl: boolean, address: boolean, about: boolean, color: boolean, fontColor: boolean }
class IState {
    applicationProfile?: ApplicationProfile = undefined;
    editFields: EditField = {
        name: false,
        welcomingMessage: false,
        shortDescription: false,
        backgroundUrl: false,
        address: false,
        about: false,
        color: false,
        fontColor: false
    };
    fieldChanged = (): boolean => {
        for (const key in this.editFields) {
            if (this.editFields[key] == true) {
                return true;
            }
        }
        return false;
    }
}
class EditApplicationProfile extends BaseComponent {

    masterDataService: MasterDataService = MasterDataService.getInstance();
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.state.applicationProfile = Object.assign(new ApplicationProfile(), this.getApplicationProfile());
    }
    componentDidMount() {
        this.validateLoginStatus();
        document.title = "ApplicationProfile Profile";
    }
    updateProfileProperty = (e: ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        if (!applicationProfile) return;

        applicationProfile[target.name] = target.value;
        this.setState({ applicationProfile: applicationProfile });
    }
    updateProfleImage = (e: ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const app = this;
        const fileName:string|undefined = target.files ? target.files[0].name : undefined;
        if (!fileName) return;
        toBase64v2(target).then(function (imageData) {
            app.setProfileImage(imageData);
        }).catch(console.error);
    }
    setProfileImage = (imageData: string) => {
        const fileSize = base64StringFileSize(imageData);
        
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        if (!applicationProfile) return;
        applicationProfile.backgroundUrl = imageData;
        this.setState({ applicationProfile: applicationProfile });
    }
    toggleInput = (e: MouseEvent) => {
        const target: HTMLAnchorElement | null = e.target as HTMLAnchorElement;
        const appProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        const actualAppProfile: ApplicationProfile | undefined = this.getApplicationProfile();
        if (null == target || !appProfile || !actualAppProfile) {
            return;
        }

        const propertyName: string | null = target.getAttribute("data-name");
        if (null == propertyName) {
            return;
        }
        const enabled: boolean = target.getAttribute('data-enabled') == 'true';
        const editFields = this.state.editFields;
        editFields[propertyName] = enabled;
        if (!enabled) {
            appProfile[propertyName] = actualAppProfile[propertyName];
        }
        this.setState({ applicationProfile: appProfile, editFields: editFields });
    }
    saveRecord = (e: FormEvent) => {
        e.preventDefault();
        if (this.state.fieldChanged() == false) {
            return;
        }
        const app = this;
        this.showConfirmation("Save Data?")
            .then(function (ok) {
                if (ok) { app.doSaveRecord(); }
            })
    }
    doSaveRecord = () => {
        const applicationProfile: ApplicationProfile | undefined = this.getApplicationEditedData();
        if (!applicationProfile) return;
        if (applicationProfile.backgroundUrl) {
            this.commonAjaxWithProgress(
                this.masterDataService.updateApplicationProfile,
                this.profileSaved, this.showCommonErrorAlert,
                applicationProfile
            )
        } else {
            this.commonAjax(
                this.masterDataService.updateApplicationProfile,
                this.profileSaved, this.showCommonErrorAlert,
                applicationProfile
            )
        }
    }
    getApplicationEditedData = (): ApplicationProfile | undefined => {
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        const editFields: EditField = this.state.editFields;
        if (!applicationProfile) return undefined;
        const editedApplication: ApplicationProfile = new ApplicationProfile();
        for (const key in editFields) {
            const element: boolean = editFields[key];
            if (element && key != 'backgroundUrl') {
                editedApplication[key] = applicationProfile[key];
            }
        }
        if (editFields.backgroundUrl && applicationProfile.backgroundUrl?.startsWith("data:image")) {
            editedApplication.backgroundUrl = applicationProfile.backgroundUrl;
        }
        return editedApplication;
    }
    profileSaved = (response: WebResponse) => {
        this.showInfo("Success");
        this.props.setApplicationProfile(response.applicationProfile);
        const editFields = this.state.editFields;
        for (const key in editFields) {
            editFields[key] = false;
        }
        this.setState({editFields:editFields});
    }

    render() {
        const applicationProfile: ApplicationProfile | undefined = this.state.applicationProfile;
        if (!applicationProfile) return null;
        const editFields: EditField = this.state.editFields;
        const bgUrl: string = applicationProfile.backgroundUrl ?? "";
        return (
            <div id="ApplicationProfile" className="container-fluid">
                <h2>Application Profile</h2>
                <Card title="Profile Data">
                    <form onSubmit={this.saveRecord}>
                        <div className="container-fluid text-center" style={{ marginBottom: '10px' }}>
                            <img style={{ marginBottom: '10px' }} height="100" className="border border-primary" src={bgUrl.startsWith("data:image") ? bgUrl : baseImageUrl + bgUrl} />
                            <EditImage edit={editFields.backgroundUrl} updateProperty={this.updateProfleImage} toggleInput={this.toggleInput} />
                        </div>
                        <FormGroup label="Name">
                            <EditField edit={editFields.name} updateProperty={this.updateProfileProperty} name="name" toggleInput={this.toggleInput} value={applicationProfile.name} />
                        </FormGroup>
                        <FormGroup label="Welcoming Message">
                            <EditField edit={editFields.welcomingMessage} updateProperty={this.updateProfileProperty} name="welcomingMessage" toggleInput={this.toggleInput} value={applicationProfile.welcomingMessage} />
                        </FormGroup>
                        <FormGroup label="Short Description">
                            <EditField edit={editFields.shortDescription} updateProperty={this.updateProfileProperty} name="shortDescription" toggleInput={this.toggleInput} value={applicationProfile.shortDescription} />
                        </FormGroup>
                        <FormGroup label="Address">
                            <EditField edit={editFields.address} updateProperty={this.updateProfileProperty} name="address" toggleInput={this.toggleInput} value={applicationProfile.address} />
                        </FormGroup>
                        <FormGroup label="About">
                            <EditField edit={editFields.about} updateProperty={this.updateProfileProperty} name="about" toggleInput={this.toggleInput} value={applicationProfile.about} />
                        </FormGroup>
                        <FormGroup label="Background Color">
                            <EditField type="color" edit={editFields.color} updateProperty={this.updateProfileProperty} name="color" toggleInput={this.toggleInput} value={applicationProfile.color} />
                        </FormGroup>
                        <FormGroup label="Font Color">
                            <EditField type="color" edit={editFields.fontColor} updateProperty={this.updateProfileProperty} name="fontColor" toggleInput={this.toggleInput} value={applicationProfile.fontColor} />
                        </FormGroup>
                        <FormGroup  >
                            {this.state.fieldChanged() ? <input type="submit" className="btn btn-primary" value="Save" /> : null}
                        </FormGroup>
                    </form>
                </Card>
            </div>
        )
    }

}
const EditImage = ({ edit, toggleInput, updateProperty }) => {
    const name: string = "backgroundUrl";
    return (edit == true ? <>
        <div>
            <AnchorButton attributes={{
                'data-name': name, 'data-enabled': 'false'
            }} onClick={toggleInput} className=" btn btn-secondary btn-sm">cancel</AnchorButton>
        </div>
        <input onChange={updateProperty} className="form control" accept="image/*" type="file" name={name} />
    </>
        :
        <div>
            <AnchorButton attributes={{
                'data-name': name, 'data-enabled': 'true'
            }} onClick={toggleInput} className=" btn btn-info btn-sm">edit image</AnchorButton>
        </div>
    )
}

const mapDispatchToProps = (dispatch: Function) => ({
    setApplicationProfile: (applicationProfile: ApplicationProfile) => dispatch(setApplicationProfile(applicationProfile)),
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(EditApplicationProfile))