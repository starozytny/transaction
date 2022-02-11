import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import Sort              from "@commonComponents/functions/sort";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { TenantsList }       from "./TenantsList";
import { TenantFormulaire }  from "./TenantForm";

const URL_DELETE_ELEMENT = 'api_tenants_delete';
const URL_DELETE_GROUP   = 'api_tenants_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer ce locataire ?';
const MSG_DELETE_GROUP   = 'Aucun locataire sélectionné.';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 2, label: 'Email',         identifiant: 'sorter-email' },
]

let sortersFunction = [Sort.compareLastname, Sort.compareEmail];

export class Tenants extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "tenants.pagination",
            idAgency: parseInt(props.agencyId),
            idSociety: parseInt(props.societyId),
            societies: props.societies ? JSON.parse(props.societies) : [],
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            isClient: props.isClient ? props.isClient : false,
            isFormBien: props.isFormBien ? props.isFormBien : false,
            tenants: props.tenants ? (props.tenants !== "" ? props.tenants : []) : [],
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleUpdateSelectTenants = this.handleUpdateSelectTenants.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "tenant"); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleUpdateSelectTenants = (tenants) => { this.setState({ tenants }) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <TenantsList onChangeContext={changeContext}
                            onDelete={this.layout.current.handleDelete}
                            onDeleteAll={this.layout.current.handleDeleteGroup}
                            onSearch={this.handleSearch}
                            //changeNumberPerPage
                            perPage={perPage}
                            onPerPage={this.handlePerPage}
                            //twice pagination
                            currentPage={currentPage}
                            onPaginationClick={this.layout.current.handleGetPaginationClick(this)}
                            taille={data.length}
                            //sorter
                            sorters={sorters}
                            onSorter={this.handleSorter}
                            isClient={this.state.isClient}
                            isFormBien={this.state.isFormBien}
                            onSelectTenant={this.props.onSelectTenant}
                            tenants={this.state.tenants}
                            data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <TenantFormulaire type="create" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <TenantFormulaire type="update" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency} element={element}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}