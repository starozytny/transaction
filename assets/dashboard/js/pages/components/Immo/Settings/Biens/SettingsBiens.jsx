import React, { Component } from 'react';

import { PageInfos } from "@userComponents/Layout/Page";

import { Quartiers } from "@dashboardPages/components/Immo/Settings/Biens/Quartiers/Quartiers";
import { Sols }      from "@dashboardPages/components/Immo/Settings/Biens/Sols/Sols";
import { SousTypes } from "@dashboardPages/components/Immo/Settings/Biens/SousTypes/SousTypes";

export class SettingsBiens extends Component {
    constructor(props) {
        super(props);

        this.state = {
            context: "quartier"
        }

        this.layout = React.createRef();

        this.handleChangeContext = this.handleChangeContext.bind(this);
    }

    handleChangeContext = (context) => { this.setState({ context }) }

    render () {
        const { quartiers, sols, sousTypes } = this.props;
        const { context } = this.state;

        let menu = [
            { value: "quartier",  label: "Quartiers" },
            { value: "sol",       label: "Sols" },
            // { value: "sous-type", label: "Sous types de biens" },
        ];

        let content;
        switch (context){
            case "sous-type":
                content = <div id="list-sous-types"><SousTypes donnees={sousTypes}/></div>
                break;
            case "sol":
                content = <div id="list-sols"><Sols donnees={sols}/></div>
                break;
            default:
                content = <div id="list-quartiers"><Quartiers donnees={quartiers} /></div>
                break;
        }

        return <div className="main-content">
            <div className="page-default">
                <div className="page-col-1">
                    <div className="body-col-1">
                        <div className="title-col-1">
                            <span>Infos biens :</span>
                        </div>
                        <div className="content-col-1">
                            <div className="page-default-menu">
                                <div className="items">
                                    {menu.map((el, index) => {
                                        return <div key={index} className={"item" + (el.value === context ? " active" : "")}
                                                    onClick={() => this.handleChangeContext(el.value)}
                                        >
                                            {el.label}
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-col-2">
                    <PageInfos>
                        <p>
                            Les données ci-dessous sont les éléments sélectionnables lors de la
                            création ou la modification d'un bien. <br/> Vous pouvez personnaliser cette liste
                            en ajoutant manuellement un élément.
                            <br/><br/>
                            Les éléments <span className="badge">Natif</span> ne peuvent pas être supprimés ou modifiés.
                        </p>
                    </PageInfos>
                    {content}
                </div>
            </div>
        </div>
    }
}