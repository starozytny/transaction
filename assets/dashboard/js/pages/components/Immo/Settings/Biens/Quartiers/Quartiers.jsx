import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { QuartiersList }    from "./QuartiersList";
import { OwnerFormulaire }  from "./QuartierForm";

const URL_DELETE_ELEMENT = 'api_owners_delete';
const URL_DELETE_GROUP   = 'api_owners_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer ce quartier ?';
const MSG_DELETE_GROUP   = 'Aucun quartier sélectionné.';
let SORTER = Sort.compareName;

let sorters = [
    { value: 0, label: 'Nom',    identifiant: 'sorter-nom' }
];

let sortersFunction = [Sort.compareLastname];

export class Quartiers extends Component {
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
            sessionName: "settings.biens.quartier.pagination",
            idAgency: props.agencyId,
            idSociety: props.societyId
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, Filter.filterNative); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterNative); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "quartier", true, Filter.filterNative); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <QuartiersList onChangeContext={changeContext}
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
                              data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { idSociety, idAgency } = this.state;
        return <OwnerFormulaire type="create" societyId={idSociety} agencyId={idAgency}
                                onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { idSociety, idAgency } = this.state;
        return <OwnerFormulaire type="update" societyId={idSociety} agencyId={idAgency} element={element}
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