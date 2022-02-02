import React, { Component } from 'react';

import axios   from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@dashboardComponents/functions/Formulaire";

import { Back }          from "@dashboardComponents/Layout/Elements";
import { Alert }         from "@dashboardComponents/Tools/Alert";
import { LoaderElement } from "@dashboardComponents/Layout/Loader";

import { AdCard }        from "@userPages/components/Biens/AdCard";
import {Button} from "@dashboardComponents/Tools/Button";

export class SearchRead extends Component {
    constructor(props) {
        super();

        this.state = {
            context: 'main',
            loadData: true,
            data: [],
            data2: []
        }

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    componentDidMount = () => {
        const { elem } = this.props;

        let self = this;
        axios({ method: "GET", url: Routing.generate('api_searchs_results', {'id': elem.id}) })
            .then(function (response) {
                let data = response.data;
                self.setState({ loadData: false, data: data })
            })
            .catch(function (error) {
                Formulaire.displayErrors(self, error);
            })
        ;
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { onChangeContext } = this.props;
        const { loadData, context, data, data2 } = this.state;

        return loadData ? <LoaderElement /> : <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <div className="search-read">
                    <div className="col-1">
                        <Button type={context === "main" ? "primary" : "default"}
                                onClick={() => this.handleChangeContext("main")}>
                            Par rapport à la recherche
                        </Button>
                        <Button type={context !== "main" ? "primary" : "default"}
                                onClick={() => this.handleChangeContext("second")}>
                            Similaire à la recherche
                        </Button>
                    </div>
                    <div className="col-2">
                        <DataBiens data={context === "main" ? data : data2} />
                    </div>
                </div>
            </div>
        </>
    }
}

function DataBiens ({ data }) {
    return <div className="content">
        {data.length !== 0 ? data.map(el => {
            return <AdCard el={el} key={el.id}/>
        }) : <Alert>Aucun résultat</Alert>}
    </div>
}