import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import { TenantContact, TenantMainInfos, TenantNegotiator } from "@dashboardPages/components/Immo/Tenants/TenantsItem";

export class ProspectsItem extends Component {
    render () {
        const { isClient, elem, onDelete, onSelectors, onChangeContext } = this.props;

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-5">
                        <div className="col-1">
                            <TenantMainInfos elem={elem} isClient={isClient} />
                        </div>
                        <div className="col-2">
                            <TenantContact elem={elem} />
                        </div>
                        <div className="col-3">
                            <TenantNegotiator elem={elem} />
                            {elem.lastContactAtAgo && <div className="sub">Dernier contact : {elem.lastContactAtAgo}</div>}
                        </div>
                        <div className="col-5">
                            <div className="role">{elem.statusString}</div>
                            <div className="sub">Type : {elem.typeString}</div>
                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}