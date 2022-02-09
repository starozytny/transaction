import React, { Component } from 'react';

import Sanitaze         from "@commonComponents/functions/sanitaze";

export class SearchsItem extends Component {
    render () {
        const { elem } = this.props;

        return <div className="item">
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
                            <SearchMainInfos1 elem={elem} />
                        </div>

                        <div className="col-4">
                            <SearchMainInfos2 elem={elem} />
                        </div>

                        <div className="col-5 actions" />
                    </div>
                </div>
            </div>
        </div>
    }
}

export function SearchMainInfos1({ elem, isRa = false }) {
    return <>
        <div className="sub">
            {Sanitaze.toFormatCurrency(elem.minPrice)} à {Sanitaze.toFormatCurrency(elem.maxPrice)}
        </div>
        <div className="sub">{elem.minPiece} à {elem.maxPiece} pièces</div>
        {!isRa && <div className="sub">{elem.minRoom} à {elem.maxRoom} chambres</div>}
        <div className="sub">{!isRa && "Surface :"}{elem.minArea} m² à {elem.maxArea} m²</div>
        {!isRa && <div className="sub">Terrain : {elem.minLand} m² à {elem.maxLand} m²</div>}
    </>
}

export function SearchMainInfos2({ elem }) {
    return <>
        <div className="sub">Ascenseur : {Sanitaze.toTrilleanString(elem.hasLift, "Indifférent")}</div>
        <div className="sub">Terrasse : {Sanitaze.toTrilleanString(elem.hasTerrace, "Indifférent")}</div>
        <div className="sub">Balcon : {Sanitaze.toTrilleanString(elem.hasBalcony, "Indifférent")}</div>
        <div className="sub">Parking : {Sanitaze.toTrilleanString(elem.hasParking, "Indifférent")}</div>
        <div className="sub">Box : {Sanitaze.toTrilleanString(elem.hasBox, "Indifférent")}</div>

        <div className="sub">{elem.zipcode} {elem.city}</div>
    </>
}