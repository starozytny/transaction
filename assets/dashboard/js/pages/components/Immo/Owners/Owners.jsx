import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { OwnersList }       from "./OwnersList";
import { OwnerFormulaire }  from "./OwnerForm";
import { OwnerRead }        from "@dashboardPages/components/Immo/Owners/OwnerRead";

const URL_DELETE_ELEMENT = 'api_owners_delete';
const URL_DELETE_GROUP   = 'api_owners_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer ce propriétaire ?';
const MSG_DELETE_GROUP   = 'Aucun propriétaire sélectionné.';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',    identifiant: 'sorter-nom' },
    { value: 1, label: 'Code',   identifiant: 'sorter-code' },
    { value: 2, label: 'Email',  identifiant: 'sorter-email' },
];

let sortersFunction = [Sort.compareLastname, Sort.compareCode, Sort.compareEmail];

export class Owners extends Component {
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
            sessionName: "owners.pagination",
            idAgency: parseInt(props.agencyId),
            idSociety: parseInt(props.societyId),
            societies: props.societies ? JSON.parse(props.societies) : [],
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            biens: props.biens ? JSON.parse(props.biens) : [],
            isClient: props.isClient ? props.isClient : false,
            isFormBien: props.isFormBien ? props.isFormBien : false,
            owners: props.owners ? props.owners : [],
            classes: props.isFormBien ? "" : "main-content",
            filters: [[], []]
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleUpdateSelectOwner = this.handleUpdateSelectOwner.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, Filter.filterOwners); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterOwners); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "owner", true, Filter.filterOwners); }

    handleUpdateSelectOwner = (owner) => {
        const { owners } = this.state;

        let nOwners = owners;
        if(owners.includes(owner)){
            nOwners = nOwners.filter(el => el.id !== owner.id);
        }else{
            nOwners.push(owner);
        }

        this.setState({ owners: nOwners });

        return nOwners;
    }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <OwnersList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           onDeleteAll={this.layout.current.handleDeleteGroup}
                           //filter-search
                           onSearch={this.handleSearch}
                           filters={filters}
                           onGetFilters={this.handleGetFilters}
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
                           //data
                           isClient={this.state.isClient}
                           isFormBien={this.state.isFormBien}
                           owners={this.state.owners}
                           onSelectOwner={this.props.onSelectOwner ? this.props.onSelectOwner : null}
                           biens={this.state.biens}
                           dataImmuable={this.layout.current.state.dataImmuable}
                           data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <OwnerFormulaire type="create" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <OwnerFormulaire type="update" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency} element={element}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <OwnerRead elem={element} onChangeContext={changeContext} biens={this.state.biens} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} search={this.props.search} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onChangeCurrentPage={this.handleChangeCurrentPage}/>
        </>
    }
}
