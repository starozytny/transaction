import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { OwnersList }      from "./OwnersList";

const URL_DELETE_ELEMENT    = 'api_users_delete';
const URL_DELETE_GROUP      = 'api_users_delete_group';
const MSG_DELETE_ELEMENT    = 'Supprimer cet propriétaire ?';
const MSG_DELETE_GROUP      = 'Aucun propriétaire sélectionné.';
const SORTER = Sort.compareLastname;

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
            sessionName: "user.owners.pagination"
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "owner"); }

    handleContentList = (currentData, changeContext) => {
        return <OwnersList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           onDeleteAll={this.layout.current.handleDeleteGroup}
                           onSearch={this.handleSearch}
                           data={currentData} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}/>
        </>
    }
}