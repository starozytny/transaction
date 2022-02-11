import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { BuyersList }       from "./BuyersList";
import { BuyerFormulaire }  from "./BuyerForm";

const URL_DELETE_ELEMENT = 'api_buyers_delete';
const URL_DELETE_GROUP   = 'api_buyers_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer cet acquéreur ?';
const MSG_DELETE_GROUP   = 'Aucun acquéreur sélectionné.';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 2, label: 'Email',         identifiant: 'sorter-email' },
]

let sortersFunction = [Sort.compareLastname, Sort.compareEmail];

export class Buyers extends Component {
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
            sessionName: "buyers.pagination",
            idAgency: parseInt(props.agencyId),
            idSociety: parseInt(props.societyId),
            societies: props.societies ? JSON.parse(props.societies) : [],
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            negotiators: props.negotiators ? JSON.parse(props.negotiators) : [],
            isClient: props.isClient ? props.isClient : false,
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleGetFiltersNego = this.handleGetFiltersNego.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterType, null,
        this.layout.current.state.filtersTwo, Filter.filterNego); }

    handleGetFiltersNego = (filters) => { this.layout.current.handleGetFiltersTwo(filters, Filter.filterNego, null,
        this.layout.current.state.filters, Filter.filterType); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "buyer", true, Filter.filterType); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data, filtersTwo) => {
        const { perPage, currentPage, isClient } = this.state;

        return <BuyersList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           onDeleteAll={this.layout.current.handleDeleteGroup}
                           //filter-search
                           onSearch={this.handleSearch}
                           filters={filters}
                           filtersNego={filtersTwo}
                           onGetFilters={this.handleGetFilters}
                           onGetFiltersNego={this.handleGetFiltersNego}
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
                           isClient={isClient}
                           dataImmuable={this.layout.current.state.dataImmuable}
                           data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <BuyerFormulaire type="create" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
                                societyId={idSociety} agencyId={idAgency}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies, agencies, negotiators, idSociety, idAgency, isClient } = this.state;
        return <BuyerFormulaire type="update" societies={societies} agencies={agencies} negotiators={negotiators} isClient={isClient}
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