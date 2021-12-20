import React, { Component } from 'react';

import { Search }            from "@dashboardComponents/Layout/Search";
import { Alert }             from "@dashboardComponents/Tools/Alert";
import { Button }            from "@dashboardComponents/Tools/Button";

import { NegotiatorsItem }   from "./NegotiatorsItem";

export class NegotiatorsList extends Component {
    render () {
        const { data, onSearch, onChangeContext } = this.props;

        return <>
            <div>

                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un négociateur</Button>
                    </div>
                    <div className="item filter-search">
                        <Search onSearch={onSearch} placeholder="Recherche par code, nom, prénom ou email.."/>
                    </div>
                </div>
                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Negociateur</div>
                                        <div className="col-2">Informations</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <NegotiatorsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}