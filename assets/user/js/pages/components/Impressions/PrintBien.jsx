import React, { Component } from "react";

import Sanitaze from "@commonComponents/functions/sanitaze";

import { Printer } from "@userPages/components/Impressions/Printer";
import { Diag }    from "@userPages/components/Biens/Read/Data/Diag";

export class PrintBien extends Component{
    constructor(props) {
        super(props);

        this.state = {
            elem: props.donnees ? JSON.parse(props.donnees) : null,
            photos: props.photos ? JSON.parse(props.photos) : [],
        }
    }

    render () {
        const { elem, photos } = this.state;

        let content = <div className="print-ad">
            <div className="line-1">
                <div className="col-1">
                    <div className="image">
                        <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
                    </div>
                </div>
                <div className="col-2">
                    <div className="infos">
                        <h1>{elem.libelle}</h1>
                        <div className="address">{elem.localisation.zipcode}, {elem.localisation.city}</div>
                        <div className="features">
                            <span>{elem.area.habitable}m²</span>
                            {elem.number.room &&<span> - {elem.number.room} chambre{elem.number.room > 1 ? "s" : ""}</span>}
                        </div>
                    </div>
                    <div className="price">
                        <span>{Sanitaze.toFormatCurrency(elem.financial.price)} {elem.codeTypeAd === 1 ? "cc/mois" : ""}</span>
                    </div>
                    <div className="infos-price">
                        {elem.codeTypeAd === 1 ? <>
                            {elem.financial.provisionCharges && <div>
                                <div>Provision pour charges<sup>(1)</sup> : {Sanitaze.toFormatCurrency(elem.financial.provisionCharges)}</div>
                                <div className="sub"><sup>(1)</sup> {(elem.financial.typeChargesString).toLowerCase()}</div>
                            </div>}
                            {elem.financial.honoraireTtc && <div>
                                <div>Honoraires TTC : {Sanitaze.toFormatCurrency(elem.financial.honoraireTtc)}</div>
                                <div>- dont état des lieux : {Sanitaze.toFormatCurrency(elem.financial.edl)}</div>
                            </div>}
                            {elem.financial.caution && <div>Caution : {Sanitaze.toFormatCurrency(elem.financial.caution)}</div>}
                        </> : <>
                            <div>Honoraires à la charge de {(elem.financial.honoraireChargeDeString).toLowerCase()}</div>
                        </>}
                    </div>
                    <div className="infos-footer">
                        <div className="badge badge-default">{elem.typeAdString}</div>
                        <div className="reference">Référence : {elem.reference}</div>
                    </div>
                </div>
            </div>

            <div className="line-2">
                <div className="images">
                    {photos.map(photo => {
                        return <img src={location.origin + photo.photoFile} alt="illustration photo" key={photo.id}/>
                    })}
                    <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
                    <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
                    <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
                </div>
            </div>

            <div className="line-3">
                <div className="col-1">
                    <div className="content">{elem.advert.contentFull}</div>
                </div>
                <div className="col-2">
                    <Diag elem={elem} isPrint={true} />
                </div>
            </div>

            <div className="line-4">
                <div className="col-1">
                    <div className="image">
                        <img src={elem.agency.logo ? location.origin + elem.agency.logoFile : elem.agency.logoFile} alt="logo agence"/>
                    </div>
                    <div className="infos">
                        <div className="name">{elem.agency.name}</div>
                        <div>{elem.agency.phone}</div>
                        <div>{elem.agency.email}</div>
                    </div>
                    <div className="infos">
                        <div className="name name-sub">Location</div>
                        <div>{elem.agency.phoneLocation}</div>
                        <div>{elem.agency.emailLocation}</div>
                    </div>
                    <div className="infos">
                        <div className="name name-sub">Vente</div>
                        <div>{elem.agency.phoneVente}</div>
                        <div>{elem.agency.emailVente}</div>
                    </div>
                </div>
            </div>
        </div>

        return <>
            <Printer content={content} />
        </>
    }
}