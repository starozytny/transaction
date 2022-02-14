import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";
import TopToolbar        from "@commonComponents/functions/topToolbar";

import { QuartiersList }      from "./QuartiersList";
import { QuartierFormulaire } from "./QuartierForm";

const URL_DELETE_ELEMENT = 'api_donnees_quartiers_delete';
const MSG_DELETE_ELEMENT = 'Supprimer ce quartier ?';
let SORTER = Sort.compareName;

let sorters = [
    { value: 0, label: 'Nom',            identifiant: 'sorter-nom' },
    { value: 1, label: 'Code postal',    identifiant: 'sorter-code-postal' },
    { value: 2, label: 'Ville',          identifiant: 'sorter-ville' },
];

let sortersFunction = [Sort.compareName, Sort.compareZipcode, Sort.compareCity];

export class Quartiers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 20,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "settings.biens.quartier.pagination",
            classes: props.classes ? props.classes : ""
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
        return <QuartierFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <QuartierFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
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