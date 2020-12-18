


import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { mapCommonUserStateToProps } from './../../../constant/stores';
import BaseComponent from './../../BaseComponent';
import MasterDataService from './../../../services/MasterDataService';
import Modal from '../../container/Modal';
import Filter from './../../../models/Filter';
import EntityProperty from './../../../models/EntityProperty';
import WebRequest from './../../../models/WebRequest';
import WebResponse from './../../../models/WebResponse';
import HeaderProps from './../../../models/HeaderProps';
import BaseEntity from './../../../models/BaseEntity';
import './DataTable.css'
import EntityValues from './../../../utils/EntityValues';
import NavigationButtons from './../../navigation/NavigationButtons';
interface IState {
    recordData?: WebResponse
}
class MasterDataList extends BaseComponent {
    masterDataService: MasterDataService = MasterDataService.getInstance();
    filter: Filter = {
        limit: 5,
        page: 0,
        fieldsFilter: {}
    };
    state: IState = {}
    entityProperty: EntityProperty;
    constructor(props: any) {
        super(props, true);
        this.entityProperty = this.props.entityProperty;
    }
    loadEntities = (page: number = 0) => {

        const entityName = this.entityProperty.entityName;
        this.filter.page = page;

        const request: WebRequest = {
            entity: entityName,
            filter: this.filter
        }
        this.commonAjax(
            this.masterDataService.loadEntities,
            this.entitiesLoaded,
            this.showCommonErrorAlert,
            request
        )
    }
    entitiesLoaded = (response: WebResponse) => {
        this.setState({ recordData: response });
    }
    checkDefaultData = () => {
        if (this.entityProperty == this.props.entityProperty && this.state.recordData != undefined) {
            return;
        }

        this.entityProperty = this.props.entityProperty;
        this.loadEntities(0);
    }
    componentDidUpdate() {
        super.componentDidUpdate();
        this.checkDefaultData();
    }
    componentDidMount() {
        this.checkDefaultData();
    }
    getRecordNumber = (i: number): number => {
        let res = 0;
        res = (this.filter.page ?? 0) * (this.filter.limit ?? 5) + i + 1;
        return res;
    }
    filterFormSubmit = (e) => {
        e.preventDefault();
        this.loadEntities(0);
    }
    filterOnChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (this.filter.fieldsFilter==undefined) {
            this.filter.fieldsFilter = {};
        }
        this.filter.fieldsFilter[name] = value;
    }
    filterReset = (e) => {
        this.filter.fieldsFilter = {};
    }
    render() {
        if (undefined == this.state.recordData) {
            return <h2>Please Wait..</h2>
        }
        const headerProps: HeaderProps[] = EntityProperty.getHeaderLabels(this.props.entityProperty);
        const resultList: any[] = this.state.recordData.entities ? this.state.recordData.entities : [];
        if (headerProps == undefined || resultList == undefined) {
            return <h3>Error</h3>
        }
        return (
            <div id="MasterDataList" className="container-fluid">
                <form id="filter-form" onSubmit={(e) => {  this.filterFormSubmit(e) }}>
                    <Modal title="Data List">
                        <div style={{ overflow: 'scroll' }}>
                            <div>
                                <NavigationButtons 
                                limit={this.filter.limit??5}
                                totalData={this.state.recordData.totalData??0}
                                activePage={this.filter.page??0}
                                onClick={this.loadEntities} />
                                <button className="btn btn-light">
                                    Reload
                                </button>
                                <button onClick={this.filterReset} type="reset" className="btn btn-warning">
                                    Reset
                                </button>
                            </div>
                            <table className="table">
                                <DataTableHeader filterOnChange={this.filterOnChange} headerProps={headerProps} />
                                <tbody>
                                    {resultList.map((result, i) => {
                                        const number = this.getRecordNumber(i);
                                        const values: Array<any> = EntityValues.parseValues(result, this.props.entityProperty);
                                        return (<tr>
                                            <td>{number}</td>
                                            {values.map(value => <td>{value}</td>)}
                                            <td>Action</td>
                                        </tr>)

                                    })}
                                </tbody>
                            </table>
                        </div>

                    </Modal>
                </form>
            </div >
        )
    }

}
const DataTableHeader = (props: any) => {
    const headerProps: HeaderProps[] = props.headerProps;
    return (<thead>
        <tr>
            <th>No</th>
            {headerProps.map(headerProp => {
                return (
                    <th>
                        <p>{headerProp.label}</p>
                        <input onChange={(e)=>props.filterOnChange(e)} placeholder={headerProp.label} className="input" name={headerProp.value} />
                    </th>
                )
            })}
            <th>Action</th>
        </tr>
    </thead>)
}
const mapDispatchToProps = (dispatch: Function) => ({
})

export default withRouter(connect(
    mapCommonUserStateToProps,
    mapDispatchToProps
)(MasterDataList))