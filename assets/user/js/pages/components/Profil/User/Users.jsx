import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import Sort              from "@commonComponents/functions/sort";
import Filter            from "@commonComponents/functions/filter";

import { UsersList }      from "./UsersList";
import TopToolbar from "@commonComponents/functions/topToolbar";

const URL_DELETE_ELEMENT    = 'api_users_delete';
const MSG_DELETE_ELEMENT    = 'Supprimer cet utilisateur ?';
let SORTER = Sort.compareLastname;

let sorters = [
    { value: 0, label: 'Nom',           identifiant: 'sorter-nom' },
    { value: 1, label: 'Identifiant',   identifiant: 'sorter-identifiant' },
    { value: 2, label: 'Email',         identifiant: 'sorter-email' },
]

let sortersFunction = [Sort.compareLastname, Sort.compareUsername, Sort.compareEmail];

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 5,
            currentPage: 0,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "user.users.pagination",
            classes: ""
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGetFilters = this.handleGetFilters.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleGetFilters = (filters) => { this.layout.current.handleGetFilters(filters, Filter.filterHighRoleCode); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "user", true, Filter.filterHighRoleCode); }

    handlePerPage = (perPage) => { TopToolbar.onPerPage(this, perPage, SORTER) }

    handleChangeCurrentPage = (currentPage) => { this.setState({ currentPage }); }

    handleSorter = (nb) => { SORTER = TopToolbar.onSorter(this, nb, sortersFunction, this.state.perPage) }

    handleContentList = (currentData, changeContext, getFilters, filters, data) => {
        const { perPage, currentPage } = this.state;

        return <UsersList onChangeContext={changeContext}
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
                          id={this.props.id}
                          isUser={this.props.isUser}
                          data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}