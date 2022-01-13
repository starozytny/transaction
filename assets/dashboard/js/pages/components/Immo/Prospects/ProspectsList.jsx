import React, { Component } from 'react';

import { Alert }                  from "@dashboardComponents/Tools/Alert";
import { Button, ButtonIcon }     from "@dashboardComponents/Tools/Button";
import { Search }                 from "@dashboardComponents/Layout/Search";

import { ProspectsItem }   from "./ProspectsItem";

export class ProspectsList extends Component {
    constructor(props) {
        super(props);

        this.filter = React.createRef();

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter = (e) => {
        this.filter.current.handleChange(e, true);
    }

    render () {
        const { isSelect=false, isFromRead=false, isClient, data, onSearch, onChangeContext, onDeleteAll } = this.props;

        return <>
            <div>
                {!isSelect && <div className="toolbar toolbar-prospect">
                    <div className="item create">
                        <Button onClick={() => onChangeContext("create")}>Ajouter un prospect</Button>
                    </div>
                    {isFromRead && <div className="item">
                        <Button onClick={() => onChangeContext("select")}>Sélectionner un existant</Button>
                    </div>}
                    {!isFromRead && <div className="item filter-search">
                        <Search onSearch={onSearch} placeholder="Recherche par nom, prénom.."/>
                    </div>}
                </div>}

                <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            {(!isClient || isSelect) && <div className="item-header-selector" />}
                            <div className="item-content">
                                <div className="item-body">
                                    {isFromRead ? <div className="infos infos-col-2">
                                        <div className="col-1">Prospect</div>
                                        <div className="col-2 actions">Actions</div>
                                    </div> :  <div className="infos infos-col-5">
                                        <div className="col-1">Prospect</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                        <div className="col-4">Status</div>
                                        <div className="col-5 actions">Actions</div>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {data && data.length !== 0 ? data.map(elem => {
                            return <ProspectsItem {...this.props} elem={elem} key={elem.id}/>
                        }) : <Alert>Aucun résultat</Alert>}
                    </div>
                </div>

                {(!isFromRead && data && data.length !== 0 && !isClient) && <div className="page-actions">
                    <div className="selectors-actions">
                        <div className="item" onClick={onDeleteAll}>
                            <ButtonIcon icon="trash" text="Supprimer la sélection" />
                        </div>
                    </div>
                </div>}
            </div>
        </>
    }
}