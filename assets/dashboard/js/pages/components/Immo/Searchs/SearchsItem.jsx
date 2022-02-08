import React, { Component } from 'react';

import { ButtonIcon }   from "@dashboardComponents/Tools/Button";
import { Selector }     from "@dashboardComponents/Layout/Selector";
import Sanitaze         from "@commonComponents/functions/sanitaze";

export class SearchsItem extends Component {
    render () {
        const { isRead=false, elem, onDelete, onSelectors, onChangeContext, onDuplicate } = this.props;

        return <div className="item">
            {!isRead && <Selector id={elem.id} onSelectors={onSelectors} />}

            <div className="item-content">
                <div className="item-body">
                    <div className="infos infos-col-5">
                        <div className="col-1">
                            <div className={"badge badge-" + elem.codeTypeAd}>{elem.typeAdString}</div>
                            <div className="name">{elem.typeBienString}</div>
                        </div>

                        <div className="col-2">
                            <div className="sub">
                                {elem.zipcode} {elem.city}
                            </div>
                        </div>

                        <div className="col-3">
                            <div className="sub">
                                {Sanitaze.toFormatCurrency(elem.minPrice)} à {Sanitaze.toFormatCurrency(elem.maxPrice)}
                            </div>
                            <div className="sub">{elem.minPiece} à {elem.maxPiece} pièces</div>
                            <div className="sub">{elem.minRoom} à {elem.maxRoom} chambres</div>
                            <div className="sub">Surface : {elem.minArea} m² à {elem.maxArea} m²</div>
                            <div className="sub">Terrain : {elem.minLand} m² à {elem.maxLand} m²</div>
                        </div>

                        <div className="col-4">
                            <div className="sub">Ascenseur : {Sanitaze.toTrilleanString(elem.hasLift, "Indifférent")}</div>
                            <div className="sub">Terrasse : {Sanitaze.toTrilleanString(elem.hasTerrace, "Indifférent")}</div>
                            <div className="sub">Balcon : {Sanitaze.toTrilleanString(elem.hasBalcony, "Indifférent")}</div>
                            <div className="sub">Parking : {Sanitaze.toTrilleanString(elem.hasParking, "Indifférent")}</div>
                            <div className="sub">Box : {Sanitaze.toTrilleanString(elem.hasBox, "Indifférent")}</div>
                        </div>

                        <div className="col-5 actions">
                            {!isRead && <>
                                <ButtonIcon icon="layer" onClick={() => onChangeContext("read", elem)}>Résultats</ButtonIcon>
                                <ButtonIcon icon="copy" onClick={() => onDuplicate(elem)}>Dupliquer</ButtonIcon>
                                <ButtonIcon icon="pencil" onClick={() => onChangeContext("update", elem)}>Modifier</ButtonIcon>
                                <ButtonIcon icon="trash" onClick={() => onDelete(elem)}>Supprimer</ButtonIcon>
                            </>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}