import React, { Component } from 'react';

import axios        from "axios";
import Formulaire   from "@dashboardComponents/functions/Formulaire";
import Routing      from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Layout }        from "@dashboardComponents/Layout/Page";

import { SearchsList }       from "@dashboardPages/components/Immo/Searchs/SearchsList";
import { SearchRead }        from "@dashboardPages/components/Immo/Searchs/SearchRead";
import { SearchFormulaire }  from "@dashboardPages/components/Immo/Searchs/SearchForm";

const URL_DUPLICATE_ELEMENT = 'api_searchs_duplicate';
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
            prospectFullname: props.prospectFullname ? props.prospectFullname : "Inconnu",
            follows: props.follows ? JSON.parse(props.follows) : [],
            isClient: props.isClient ? props.isClient : false
        }

        this.layout = React.createRef();

        this.handleGetData = this.handleGetData.bind(this);
        this.handleUpdateList = this.handleUpdateList.bind(this);
        this.handleUpdateFollows = this.handleUpdateFollows.bind(this);
        this.handleDuplicate = this.handleDuplicate.bind(this);

        this.handleContentCreate = this.handleContentCreate.bind(this);
        this.handleContentUpdate = this.handleContentUpdate.bind(this);
        this.handleContentList = this.handleContentList.bind(this);
        this.handleContentRead = this.handleContentRead.bind(this);
    }

    handleGetData = (self) => { self.handleSetDataPagination(this.props.donnees); }

    handleUpdateList = (element, newContext=null) => { this.layout.current.handleUpdateList(element, newContext); }

    handleUpdateFollows = (bien, methode) => {
        const { follows } = this.state;

        let nFollows;
        if(methode === "create"){
            nFollows = follows;
            nFollows.push({id: (new Date()).getTime(), bien: {id: bien.id}})
        }else{
            nFollows = follows.filter(el => el.bien.id !== bien.id);
        }

        this.setState({ follows: nFollows })
    }

    handleDuplicate = (element) => {
        Formulaire.loader(true);
        axios.post(Routing.generate(URL_DUPLICATE_ELEMENT, {'id': element.id}), {})
            .then(function (response) {
                location.reload();
            })
            .catch(function (error) {
                Formulaire.loader(false);
                Formulaire.displayErrors(self, error, "Une erreur est survenue, veuillez contacter le support.")
            })
        ;
    }

    handleContentList = (currentData, changeContext) => {
        return <SearchsList onChangeContext={changeContext}
                            onDelete={this.layout.current.handleDelete}
                            onDeleteAll={this.layout.current.handleDeleteGroup}
                            onDuplicate={this.handleDuplicate}
                            prospectFullname={this.state.prospectFullname}
                            isClient={this.state.isClient}
                            data={currentData} />
    }

    handleContentCreate = (changeContext) => {
        return <SearchFormulaire type="create" prospectId={this.state.prospectId} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentUpdate = (changeContext, element) => {
        return <SearchFormulaire type="update" element={element} prospectId={this.state.prospectId} onChangeContext={changeContext} onUpdateList={this.handleUpdateList}/>
    }

    handleContentRead = (changeContext, element) => {
        return <SearchRead elem={element} follows={this.state.follows} prospectId={this.state.prospectId}
                           onUpdateFollows={this.handleUpdateFollows} onChangeContext={changeContext} />
    }

    render () {
        return <>
            <Layout ref={this.layout} {...this.state} onGetData={this.handleGetData}
                    onContentList={this.handleContentList} onContentRead={this.handleContentRead}
                    onContentCreate={this.handleContentCreate} onContentUpdate={this.handleContentUpdate}/>
        </>
    }
}