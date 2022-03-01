import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { ContractsList }       from "@userPages/components/Biens/Suivi/Contract/ContractsList";
import { ContractFormulaire } from "@userPages/components/Biens/Suivi/Contract/ContractForm";

const URL_DELETE_ELEMENT = 'api_owners_delete';
const MSG_DELETE_ELEMENT = 'Supprimer ce propriétaire ?';
let SORTER = Sort.compareCreatedAtInverse;

let sorters = [
    { value: 0, label: 'Création',    identifiant: 'sorter-create' },
];

let sortersFunction = [Sort.compareCreatedAtInverse];

export class Contracts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "contracts.pagination",
            classes: props.classes !== null ? props.classes : "main-content",
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        this.handleSorter = this.handleSorter.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees, "read", "id", this.state.filters, Filter.filterStatus); }

    handleUpdateList = (element, newContext=null) => {
        this.layout.current.handleUpdateList(element, newContext);
        this.props.onUpdateContracts(element, "update");
    }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterStatus); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <ContractsList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
            //filter-search
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

    handleContentUpdate = (changeContext, element) => {
        return  <ContractFormulaire type="update" element={element} bien={this.props.bien}
                                    onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>;
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
