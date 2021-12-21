import React, { Component } from 'react';

import Routing                    from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Button }                 from "@dashboardComponents/Tools/Button";
import { Search }                 from "@dashboardComponents/Layout/Search";

import { OwnersItem }   from "./OwnersItem";

export class OwnersList extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { data, onSearch, onChangeContext } = this.props;
        return <>
            <div>
                <div className="toolbar">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un propriétaire</Button>
                    </div>
                    <div className="item filter-search">
                        <Search onSearch={onSearch} placeholder="Recherche par code, nom, prénom.."/>
                    </div>
                </div>

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-3">
                                        <div className="col-1">Equipe</div>
                                        <div className="col-2">Identifiant</div>
                                        <div className="col-3 actions">Actions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <OwnersItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>
            </div>
        </>
    }
}