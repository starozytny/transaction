import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import { TenantContact, TenantMainInfos, TenantNegotiator } from "@dashboardPages/components/Immo/Tenants/TenantsItem";

export class ProspectsItem extends Component {
    render () {
        const { isSelect, isFromRead, isClient, elem, prospects, onDelete, onSelectors, onChangeContext, onSelectProspect } = this.props;

        let active = false;
        if(prospects){
            prospects.forEach(te => {
                if(te.id === elem.id){
                    active = true;
                }
            })
        }

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isSelect && <div className="selector" onClick={() => onSelectProspect(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className={"infos infos-col-" + (isFromRead ? "3" : "5")}>
                        <div className="col-1">
                            <TenantMainInfos elem={elem} isClient={isClient} />
                            {isFromRead && <TenantNegotiator elem={elem} />}
                        </div>
                        <div className="col-2">
                            <TenantContact elem={elem} />
                            {(isFromRead && elem.lastContactAtAgo) && <div className="sub">
                                Dernier contact : {elem.lastContactAtAgo}
                            </div>}
                        </div>

                        {!isFromRead && <>
                            <div className="col-3">
                                <TenantNegotiator elem={elem} />
                            </div>
                            <div className="col-4">
                                <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                                <div className="sub">Type de prospect : {elem.typeString}</div>
                                {elem.lastContactAtAgo && <div className="sub">Dernier contact : {elem.lastContactAtAgo}</div>}
                            </div>
                        </>}
                        <div className={isFromRead ? "col-3 actions" : "col-5 actions"}>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            {(isFromRead && !isSelect) && <ButtonIcon icon="cancel" onClick={() => onSelectProspect(elem)}>Enlever</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}