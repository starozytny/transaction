import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";
import Sort              from "@commonComponents/functions/sort";

import { AgencyList }       from "./AgencyList";
import { AgencyFormulaire } from "./AgencyForm";
import { AgencyRead }       from "./AgencyRead";

const URL_DELETE_ELEMENT = 'api_agencies_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cette agence ?';
const SORTER = Sort.compareName;

export class Agency extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            sorter: SORTER,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "agencies.pagination",
            societies: props.societies ? JSON.parse(props.societies) : [],
            biens: props.biens ? JSON.parse(props.biens) : []
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);

        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        return <AgencyList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           biens={this.state.biens}
                           data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        const { societies } = this.state;
        return <AgencyFormulaire type="create" societies={societies} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        const { societies } = this.state;
        return <AgencyFormulaire type="update" societies={societies} element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <AgencyRead element={element} onChangeContext={changeContext}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}
                    onContentRead={this.handleContentRead} />
        </>
    }
}