import React, { Component } from 'react';

import Routing          from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import { TenantContact, TenantMainInfos, TenantNegotiator } from "@dashboardPages/components/Immo/Tenants/TenantsItem";

export class BuyersItem extends Component {
    render () {
        const { isSelect, isFromRead, isClient, elem, buyers, onDelete, onSelectors, onChangeContext, onSelectBuyer } = this.props;

        let active = false;
        if(buyers){
            buyers.forEach(item => {
                if(item.id === elem.id){
                    active = true;
                }
            })
        }

        return <div className="item">
            {!isClient && <Selector id={elem.id} onSelectors={onSelectors} />}
            {isSelect && <div className="selector" onClick={() => onSelectBuyer(elem)}>
                <label className={"item-selector " + active} />
            </div>}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-4">
                        <div className="col-1" onClick={isSelect ? () => onSelectBuyer(elem) : null}>
                            <TenantMainInfos elem={elem} isClient={isClient} />
                            <div className="sub">Type d'acquéreur : {elem.typeString}</div>
                        </div>

                        <div className="col-2">
                            <TenantContact elem={elem} />
                        </div>

                        <div className="col-3">
                            <TenantNegotiator elem={elem} />
                        </div>

                        <div className="col-4 actions">
                            <ButtonIcon icon="chat-2" onClick={Routing.generate(isClient ? "user_mails_send" : "admin_mails_send", {'dest': [elem.email]})} element="a">
                                Contacter
                            </ButtonIcon>
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            {(isFromRead && !isSelect) && <ButtonIcon icon="cancel" onClick={() => onSelectBuyer(elem)}>Enlever</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}