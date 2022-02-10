import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon, ButtonIconContact } from "@dashboardComponents/Tools/Button";
import { Selector } from "@dashboardComponents/Layout/Selector";
import { UtPhones } from "@dashboardComponents/Tools/Utilitaire";

import { OwnerContact, OwnerNegotiator } from "@dashboardPages/components/Immo/Owners/OwnersItem";

export class TenantsItem extends Component {
    render () {
        const { isReadBien=false, isClient, isFormBien, tenants, elem,
            onDelete, onSelectors, onChangeContext, onSelectTenant } = this.props;

        let active = false;
        tenants.forEach(te => {
            if(te.id === elem.id){
                active = true;
            }
        })

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isFormBien && <div className="selector" onClick={() => onSelectTenant(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className={"infos infos-col-" + ((isReadBien || isFormBien) ? "3" : "4")}>
                        <div className="col-1" onClick={onSelectTenant ? () => onSelectTenant(elem) : null}>
                            <TenantMainInfos elem={elem} isClient={isClient} />
                        </div>
                        {!isFormBien && <div className="col-2">
                            <OwnerContact elem={elem} />
                        </div>}
                        <div className={isFormBien ? "col-2" : "col-3"} onClick={onSelectTenant ? () => onSelectTenant(elem) : null}>
                            <OwnerNegotiator elem={elem} />
                        </div>
                        {!isReadBien && <div className={isFormBien ? "col-3 actions" : "col-4 actions"}>
                            {(elem.bien && !isFormBien) &&
                                <ButtonIcon icon="layer" element="a" onClick={Routing.generate('user_biens', {'ft': elem.bien.id})}>
                                    Bien
                                </ButtonIcon>}
                            <ButtonIconContact isClient={isClient} email={elem.email} />
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            {!isFormBien && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    }
}

export function TenantMainInfos ({ elem, isClient }) {
    return <>
        <div className="name">
            <span>{elem.lastname} {elem.firstname}</span>
        </div>
        {!isClient && <div className="sub">{elem.agency.name}</div>}
    </>
}