import React, { Component } from 'react';

import { Layout }        from "@dashboardComponents/Layout/Page";

import { SearchsList }       from "@dashboardPages/components/Immo/Searchs/SearchsList";
import { SearchRead }        from "@dashboardPages/components/Immo/Searchs/SearchRead";
import { SearchFormulaire }  from "@dashboardPages/components/Immo/Searchs/SearchForm";

const URL_DELETE_ELEMENT = 'api_searchs_delete';
const URL_DELETE_GROUP   = 'api_searchs_delete_group';
const MSG_DELETE_ELEMENT = 'Supprimer cette recherche ?';
const MSG_DELETE_GROUP   = 'Aucune recherche sélectionné.';

export class Searchs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: 10,
            pathDeleteElement: URL_DELETE_ELEMENT,
            msgDeleteElement: MSG_DELETE_ELEMENT,
            pathDeleteGroup: URL_DELETE_GROUP,
            msgDeleteGroup: MSG_DELETE_GROUP,
            sessionName: "searchs.pagination",
            prospectId: props.prospectId ? parseInt(props.prospectId) : null,
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
        return <SearchsList onChangeContext={changeContext}
                            onDelete={this.layout.current.handleDelete}
                            onDeleteAll={this.layout.current.handleDeleteGroup}
                            data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <SearchFormulaire type="create" prospectId={this.state.prospectId} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <SearchFormulaire type="update" element={element} prospectId={this.state.prospectId} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <SearchRead element={element} onChangeContext={changeContext} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}