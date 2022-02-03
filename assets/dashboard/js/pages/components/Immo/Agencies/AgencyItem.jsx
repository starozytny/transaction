import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import Sanitize         from "@commonComponents/functions/sanitaze";
import Helper           from "@commonComponents/functions/helper";

export class AgencyItem extends Component {
    render () {
        const { elem, biens, onChangeContext, onDelete } = this.props

        let totalBiens = biens ? biens.length : 0;
        let total = 0;
        if(biens){
            biens.forEach(item => {
                if(item.agency.id === elem.id){
                    total++;
                }
            })
        }

        let progress = Helper.countProgress(total, totalBiens);

        return <div className="item">
            <div className="item-content">
                <div className="item-body item-body-image">
                    <div className="item-image">
                        <img src={elem.logoFile} alt={`Image de ${elem.name}`}/>
                    </div>
                    <div className="infos infos-col-4">
                        <div className="col-1" onClick={() => onChangeContext("read", elem)}>
                            <div className="name">
                                <span>{elem.name}</span>
                                <a target="_blank" href={"/" + elem.website}><span className="icon-link-2" /></a>
                            </div>
                            <div className="sub">{elem.society.fullname}</div>
                            <div className="sub">{elem.dirname}</div>
                        </div>
                        <div className="col-2">
                            <div className="sub">{elem.address},</div>
                            <div className="sub">{elem.zipcode} {elem.city}</div>
                            <div className="sub">{elem.email}</div>
                            <div className="sub">{Sanitize.toFormatPhone(elem.phone)}</div>
                        </div>
                        <div className="col-3">
                            <div className="sub">{total} / {totalBiens}</div>
                            <div className={"sub progress progress-" + progress} />
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

