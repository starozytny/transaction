import React, { Component } from 'react';

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Back }          from "@dashboardComponents/Layout/Elements";
import { Alert }         from "@dashboardComponents/Tools/Alert";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

export class SearchRead extends Component {
    constructor(props) {
        super();

        this.state = {
            loadData: true,
            data: [],
            data2: []
        }
    }

    componentDidMount = () => {
        const { elem } = this.props;

        let self = this;
        axios({ method: "GET", url: Routing.generate('api_searchs_results', {'id': elem.id}) })
            .then(function (response) {
                let data = response.data;
                self.setState({ loadData: false })
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
        ;
    }

    render () {
        const { onChangeContext } = this.props;
        const { loadData, data, data2 } = this.state;

        return loadData ? <LoaderElement /> : <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="search-read">
                    <div className="col-1">
                        <div className="title">Biens</div>
                        <DataBiens data={data} />
                    </div>
                    <div className="col-2">
                        <div className="title">Biens similaires</div>
                        <DataBiens data={data2} />
                    </div>
                </div>
            </div>
        </>
    }
}

function DataBiens ({ data }) {
    return <div className="content">
        {data.length !== 0 ? "ok" : <Alert>Aucun résultat</Alert>}
    </div>
}