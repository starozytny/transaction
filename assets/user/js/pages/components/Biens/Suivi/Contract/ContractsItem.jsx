import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { UtContact }    from "@dashboardComponents/Tools/Utilitaire";

export class ContractsItem extends Component {
    render () {
        const { elem, onChangeContext, contractants, onSwitchStatus } = this.props

        let owners = [];
        contractants.forEach(co => {
            if(co.contract.id === elem.id){
                owners.push(co.owner)
            }
        })

        return <div className="item">
            <div className="item-content">
                <div className="item-body ">
                    <div className="infos infos-col-4">
                        <div className="col-1">
                            <div className={"badge badge-" + elem.status}>{elem.statusString}</div>
                            <div className="name">
                                <span>{elem.sellAtString}</span>
                            </div>
                        </div>
                        <div className="col-2">
                            <div className="sub">Par qui : {elem.sellByString}</div>
                            <div className="sub">Pourquoi : {elem.sellWhyString}</div>
                        </div>
                        <div className="col-3">
                            <div className="owners-list">
                                {owners.map((owner, index) => {
                                    if(owner){
                                        return <div className="sub" key={index}>
                                            <div>{owner.fullnameCivility}</div>
                                            <UtContact elem={owner} />
                                        </div>
                                    }
                                })}
                            </div>
                        </div>
                        <div className="col-4 actions">
                            <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                            {elem.status !== 2 && <ButtonIcon icon="cancel" tooltipWidth={80} onClick={() => onSwitchStatus(elem, 2)}>Contrat annulé</ButtonIcon>}
                            {elem.status !== 0 && <ButtonIcon icon="flag"   tooltipWidth={85} onClick={() => onSwitchStatus(elem, 0)}>Contrat terminé</ButtonIcon>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}
