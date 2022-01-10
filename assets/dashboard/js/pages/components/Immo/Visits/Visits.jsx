import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import { VisitsList }       from "./VisitsList";
import { VisitFormulaire }  from "./VisitForm";

const URL_DELETE_ELEMENT = 'api_prospects_delete';
const MSG_DELETE_ELEMENT = 'Supprimer cette visite ?';

export class Visits extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            sessionName: "visits.pagination",
            isClient: props.isClient ? props.isClient : false,
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleContentList = (currentData, changeContext) => {
        return <VisitsList onChangeContext={changeContext}
                           onDelete={this.layout.current.handleDelete}
                           isClient={this.state.isClient}
                           data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <VisitFormulaire type="create" onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <VisitFormulaire type="update" element={element} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}