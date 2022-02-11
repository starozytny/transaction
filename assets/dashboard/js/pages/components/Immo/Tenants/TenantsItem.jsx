import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Actions from "@userComponents/functions/actions";

import { Selector }  from "@dashboardComponents/Layout/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";
import { UtContact, UtMainInfos }        from "@dashboardComponents/Tools/Utilitaire";

import { NegotiatorBubble } from "@dashboardPages/components/Immo/Negociators/NegotiatorsItem";

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
                            <UtMainInfos elem={elem} isClient={isClient} />
                        </div>
                        {!isFormBien && <div className="col-2">
                            <UtContact elem={elem} />
                        </div>}
                        <div className={isFormBien ? "col-2" : "col-3"} onClick={onSelectTenant ? () => onSelectTenant(elem) : null}>
                            <NegotiatorBubble elem={elem.negotiator} />
                        </div>
                        {!isReadBien && <div className={isFormBien ? "col-3 actions" : "col-4 actions"}>
                            {(elem.bien && !isFormBien) &&
                                <ButtonIcon icon="layer" element="a" onClick={Routing.generate('user_biens', {'ft': elem.bien.id})}>
                                    Bien
                                </ButtonIcon>}
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            {!isFormBien && <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>}
                            <ButtonIconDropdown icon="dropdown" items={Actions.getDefaultAction(isClient, elem, "tenant")}>Autres</ButtonIconDropdown>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    }
}