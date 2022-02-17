import React, { Component } from 'react';

import { Back }         from "@dashboardComponents/Layout/Elements";
import { AdCard }       from "@userPages/components/Biens/AdCard";
import { Alert }        from "@dashboardComponents/Tools/Alert";
import { ReadCard }     from "@userComponents/Layout/Read";

export class OwnerRead extends Component {
    render () {
        const { elem, onChangeContext, biens } = this.props;

        let totalBiens = 0;
        let itemsBien = [];
        if(biens) {
            biens.forEach(bien => {
                if (bien.owner && bien.owner.id === elem.id) {
                    itemsBien.push(bien);
                    totalBiens++;
                }
            })
        }

        return <>
            <div>
                <Back onChangeContext={onChangeContext} />

                <ReadCard elem={elem} onChangeContext={onChangeContext} totalBiens={totalBiens} />

                <div className="item-content-2">
                    {itemsBien.length !== 0 ? itemsBien.map(el => {
                        return <AdCard el={el} isOwnerPage={true} key={el.id}/>
                    }) : <Alert>Aucun bien</Alert>}
                </div>
            </div>
        </>
    }
}