import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { NegotiatorsList }       from "./NegotiatorsList";
import { NegotiatorFormulaire } from "./NegotiatorForm";

const URL_DELETE_ELEMENT = 'api_negotiators_delete';
const MSG_DELETE_ELEMENT = 'Supprimer ce négociateur ?';
const URL_DELETE_GROUP   = 'api_negotiators_delete_group';
const MSG_DELETE_GROUP   = 'Aucun négociateur sélectionnés.';
const SORTER = Sort.compareName;

export class Negotiators extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "negotiators.pagination",
            agencies: props.agencies ? JSON.parse(props.agencies) : [],
            biens: props.biens ? JSON.parse(props.biens) : [],
            isClient: props.isClient ? props.isClient : false,
            isUser: props.isUser ? props.isUser : false,
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleSearch = (search) => { this.layout.current.handleSearch(search, "negotiator"); }

    handleContentList = (currentData, changeContext) => {
        return <NegotiatorsList onChangeContext={changeContext}
                                onDelete={this.layout.current.handleDelete}
                                onDeleteAll={this.layout.current.handleDeleteGroup}
                                onSearch={this.handleSearch}
                                isClient={this.state.isClient}
                                isUser={this.state.isUser}
                                biens={this.state.biens}
                                data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { agencies, isClient, isUser } = this.state;
        return <NegotiatorFormulaire type="create" agencies={agencies} isClient={isClient} isUser={isUser}
                                     onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { agencies, isClient, isUser } = this.state;
        return <NegotiatorFormulaire type="update" agencies={agencies} isClient={isClient} isUser={isUser} element={element}
                                     onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}