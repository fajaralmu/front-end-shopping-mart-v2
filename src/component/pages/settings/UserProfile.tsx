import React, { ChangeEvent, Component, FormEvent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from '../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import User from './../../../models/User';
import Card from '../../container/Card';
import FormGroup from '../../form/FormGroup';
import { baseImageUrl } from '../../../constant/Url';
import { setLoggedUser } from './../../../redux/actionCreators';
import AnchorButton from '../../navigation/AnchorButton';
import UserService from './../../../services/UserService';
import WebResponse from './../../../models/WebResponse';
import { toBase64v2 } from '../../../utils/ComponentUtil';
interface EditField { username: boolean, displayName: boolean, password: boolean, profileImage: boolean }
class IState {
    user?: User = undefined;
    editFields: EditField = {
        username: false,
        displayName: false,
        password: false,
        profileImage: false
    };
    fieldChanged = (): boolean => {
        return this.editFields.profileImage || this.editFields.username || this.editFields.displayName || this.editFields.password;
    }
}
class UserProfile extends BaseComponent {

    userService: UserService = UserService.getInstance();
    state: IState = new IState();
    constructor(props: any) {
        super(props, true);
        this.state.user = Object.assign(new User(), this.getLoggedUser());
    }
    componentDidMount() {
        this.validateLoginStatus();
        document.title = "User Profile";
    }
    updateProfileProperty = (e: ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const user: User | undefined = this.state.user;
        if (!user) return;

        user[target.name] = target.value;
        this.setState({ user: user });
    }
    updateProfleImage = (e:ChangeEvent) => {
        const target: HTMLInputElement | null = e.target as HTMLInputElement;
        if (null == target) return;
        const app = this;
        toBase64v2(target).then(function(imageData) {
            app.setProfileImage(imageData);
        }).catch(console.error);
    }
    setProfileImage = (imageData:string) => {
        const user:User|undefined = this.state.user;
        if (!user) return;
        user.profileImage = imageData;
        this.setState({user:user});
    }
    toggleInput = (e: MouseEvent) => {
        const target: HTMLAnchorElement | null = e.target as HTMLAnchorElement;
        const user: User | undefined = this.state.user;
        const actualLoggedUser: User | undefined = this.getLoggedUser();
        if (null == target || !user || !actualLoggedUser) {
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
            user[propertyName] = actualLoggedUser[propertyName];
        }
        this.setState({ user: user, editFields: editFields });
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
        const user: User | undefined = this.getUserEditedData();
        if (!user) return;
        this.commonAjax(
            this.userService.updateProfile,
            this.profileSaved, this.showCommonErrorAlert,
            user
        )
    }
    getUserEditedData = (): User | undefined => {
        const user: User | undefined = this.state.user;
        const editFields: EditField = this.state.editFields;
        if (!user) return undefined;
        const editedUser: User = new User();
        if (editFields.displayName) {
            editedUser.displayName = user.displayName;
        }
        if (editFields.password) {
            editedUser.password = user.password;
        }
        if (editFields.username) {
            editedUser.username = user.username;
        }
        if (editFields.profileImage) {
            editedUser.profileImage = user.profileImage;
        }
        return editedUser;
    }
    profileSaved = (response: WebResponse) => {
        this.showInfo("Success");
        this.props.setLoggedUser(response.user);
    }

    render() {
        const user: User | undefined = this.state.user;
        if (!user) return null;
        const editFields: EditField = this.state.editFields;
        return (
            <div id="UserProfile" className="container-fluid">
                <h2>User Profile</h2>
                <Card title="Profile Data">
                    <form onSubmit={this.saveRecord}>
                        <div className="container-fluid text-center">
                            <img style={{marginBottom:'10px'}} width="100" height="100" className="rounded-circle border border-primary" src={user.profileImage?.startsWith("data")?user.profileImage:baseImageUrl + user.profileImage} />
                            <EditImage edit={editFields.profileImage} updateProperty={this.updateProfleImage} toggleInput={this.toggleInput} />
                        </div>
                        <FormGroup label="User Name">
                            <EditField edit={editFields.username} updateProperty={this.updateProfileProperty} name="username" toggleInput={this.toggleInput} value={user.username} />
                        </FormGroup>
                        <FormGroup label="Name">
                            <EditField edit={editFields.displayName} updateProperty={this.updateProfileProperty} name="displayName" toggleInput={this.toggleInput} value={user.displayName} />
                        </FormGroup>
                        <FormGroup label="Password">
                            <EditField edit={editFields.password} updateProperty={this.updateProfileProperty} name="password" toggleInput={this.toggleInput} value={user.password} />
                        </FormGroup>
                        <FormGroup  >
                            <input type="submit" className="btn btn-primary" value="Save" />
                        </FormGroup>
                    </form>
                </Card>
            </div>
        )
    }

}
const EditImage = ({ edit, toggleInput, updateProperty }) => {
    return (edit == true ? <>
        <div>
            <AnchorButton attributes={{
                'data-name': 'profileImage', 'data-enabled': 'false'
            }} onClick={toggleInput} className=" btn btn-secondary btn-sm">cancel</AnchorButton>
        </div>
        <input onChange={updateProperty} className="form control" accept="image/*" type="file" name="profileImage" />
    </>
        :
        <div>
            <AnchorButton attributes={{
                'data-name': 'profileImage', 'data-enabled': 'true'
            }} onClick={toggleInput} className=" btn btn-info btn-sm">edit image</AnchorButton>
        </div>
    )
}
const EditField = ({ edit, name, toggleInput, value, updateProperty }) => {
    return (edit == true ?
        <PropertyInput updateProperty={updateProperty} name={name} toggleInput={toggleInput} value={value} />
        :
        <PropertyLabel name={name} toggleInput={toggleInput} value={value} />
    )
}
const PropertyInput = ({ name, toggleInput, value, updateProperty }) => {
    return (<div className="row">
        <p className="col-md-10"><input name={name} onChange={updateProperty} value={value} className="form-control" /></p>
        <div className="col-md-2">
            <AnchorButton attributes={{
                'data-name': name, 'data-enabled': 'false'
            }}
                onClick={toggleInput} className="btn btn-secondary btn-sm">cancel</AnchorButton>
        </div>
    </div>)
}

const PropertyLabel = ({ name, toggleInput, value }) => {

    return (<div className="row">
        <p className="col-md-10">{value}</p>
        <div className="col-md-2">
            <AnchorButton attributes={{
                'data-name': name, 'data-enabled': 'true'
            }} onClick={toggleInput} className=" btn btn-info btn-sm">edit</AnchorButton>
        </div>
    </div>)
}

const mapDispatchToProps = (dispatch: Function) => ({
    setLoggedUser: (user: User) => dispatch(setLoggedUser(user)),
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(UserProfile))