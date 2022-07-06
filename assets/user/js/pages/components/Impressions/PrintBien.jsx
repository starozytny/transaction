import React, { Component } from "react";

import parse from "html-react-parser";

import Sanitaze from "@commonComponents/functions/sanitaze";

import { Printer } from "@userPages/components/Impressions/Printer";
import { Diag } from "@userPages/components/Biens/Read/Data/Diag";

export class PrintBien extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: props.donnees ? JSON.parse(props.donnees) : [],
            photos: props.photos ? JSON.parse(props.photos) : [],
        }
    }

    render () {
        const { ori } = this.props;
        const { data, photos } = this.state;

        let items = [];
        data.forEach(elem => {
            items.push((ori === "landscape") ? <PrintBienLandscape elem={elem} photos={photos} key={elem.id} />
                : <PrintBienPortrait elem={elem} photos={photos} key={elem.id} />)
        })

        return <>
            <Printer content={items} />
        </>
    }
}


export function PrintBienPortrait ({ elem, photos }){
    return <div className="print-ad print-ad-portrait">
        <div className="line-1">
            <div className="col-1">
                <Image elem={elem} />
            </div>
            <div className="col-2">
                <Infos elem={elem} />
                <Price elem={elem} />
                <InfosPrice elem={elem} />
            </div>
        </div>

        <div className="line-2">
            <Photos elem={elem} photos={photos} />
        </div>

        <div className="line-3">
            <div className="col-1">
                <Description content={elem.advert.contentFull} />
                <Reference elem={elem} />
            </div>
            <div className="col-2 col-agency">
                <Agence elem={elem.agency} codeTypeAd={elem.codeTypeAd} />
            </div>
        </div>

        <div className="line-4">
            <div className="col-1">
                <Diag elem={elem} />
            </div>
        </div>
    </div>
}

export function PrintBienLandscape ({ elem, photos }){
    return <div className="print-ad print-ad-landscape">
        <div className="col-1">
            <div className="line-1">
                <Image elem={elem} />
            </div>
            <div className="line-2">
                <Photos elem={elem} photos={photos} />
            </div>
        </div>
        <div className="col-2">
            <div className="line-1">
                <div className="col-2-line-1-col-1">
                    <Infos elem={elem} />
                    <Price elem={elem} />
                    <InfosPrice elem={elem} />
                </div>
                <div className="col-2-line-1-col-2 col-agency">
                    <Agence elem={elem.agency} codeTypeAd={elem.codeTypeAd} />
                </div>
            </div>
            <div className="line-2">
                <Description content={elem.advert.contentSimple} />
                <Reference elem={elem} />
            </div>
        </div>
        <div className="col-3">
            <Diag elem={elem} />
        </div>
    </div>
}

function Image ({ elem }) {
    return <div className="image">
        <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
    </div>
}

function Infos ({ elem }) {
    return <>
        <div className="infos">
            <h1>{elem.libelle}</h1>
            <div className="address">{elem.localisation.zipcode}, {elem.localisation.city}</div>
            <div className="features">
                <span>{elem.area.habitable}m²</span>
                {elem.number.room ? <span> - {elem.number.room} chambre{elem.number.room > 1 ? "s" : ""}</span> : null}
            </div>
        </div>
    </>
}

function Price ({ elem }) {
    let financial = elem.financial;

    return <div className="price">
        <span>{Sanitaze.toFormatCurrency(financial.price)} {elem.codeTypeAd === 1 ? "/mois CC" : ""}</span>
        {elem.codeTypeAd !== 1 && financial.honoraireChargeDe !== 1 && <span>Honoraires inclus</span>}
    </div>
}

function InfosPrice ({ elem }) {
    let financial = elem.financial;

    return <div className="infos-price">
        {elem.codeTypeAd === 1 ? <>
            {financial.provisionCharges && <div>
                <div>Provision pour charges<sup>(1)</sup> : {Sanitaze.toFormatCurrency(financial.provisionCharges)}</div>
                <div className="sub"><sup>(1)</sup> {(financial.typeChargesString).toLowerCase()}</div>
            </div>}
            {financial.honoraireTtc && <div>
                <div>Honoraires TTC : {Sanitaze.toFormatCurrency(financial.honoraireTtc)}</div>
                <div>- dont état des lieux : {Sanitaze.toFormatCurrency(financial.edl)}</div>
            </div>}
            {financial.caution && <div>Caution : {Sanitaze.toFormatCurrency(financial.caution)}</div>}
        </> : <>
            {financial.chargesMensuelles && <div>Charges mensuelles : {Sanitaze.toFormatCurrency(financial.chargesMensuelles)}</div>}
            <div>Honoraires à la charge de l'{financial.honoraireChargeDeString ? (financial.honoraireChargeDeString).toLowerCase() : ""}</div>
            {financial.honoraireChargeDe !== 1 && <>
                {financial.honorairePourcentage && <div>{Sanitaze.toFormatCurrency(financial.honorairePourcentage)} % du prix du bien hors honoraires</div>}
                {financial.priceHorsAcquereur && <div>Prix du bien hors honoraires : {Sanitaze.toFormatCurrency(financial.priceHorsAcquereur)}</div>}
            </>}
        </>}
    </div>
}

function Photos ({ elem, photos }) {
    return <>
        <div className="images">
            {/*{photos.map((photo, index) => {*/}
            {/*    if(index !== 0){*/}
            {/*        return <img src={location.origin + photo.photoFile} alt="illustration photo" key={photo.id}/>*/}
            {/*    }*/}
            {/*})}*/}
            <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
            <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
            <img src={location.origin + elem.mainPhotoFile} alt="illustration"/>
        </div>
    </>
}

function Description({ content }) {
    return <div className="content">{parse(content)}</div>
}

function Reference ({ elem }){
    return <>
        <div className="infos-footer">
            <div className="badge badge-4">{elem.typeAdString}</div>
            <div className="reference">Référence : {elem.reference}</div>
        </div>
    </>
}

function Agence ({ elem, codeTypeAd }){
    return <>
        <div className="image">
            <img src={elem.logo ? location.origin + elem.logoFile : elem.logoFile} alt="logo agence"/>
        </div>
        <div className="infos">
            <div className="name">{elem.name}</div>
            <div>{elem.website}</div>
            <div>SIRET : {elem.siret}</div>
            <div>RCS : {elem.rcs}</div>
        </div>
        {codeTypeAd === 1 ? <>
            <div className="infos">
                <div className="name-sub">Location</div>
                <div>{elem.phoneLocation}</div>
                <div>{elem.emailLocation}</div>
            </div>
        </> : <>
            <div className="infos">
                <div className="name-sub">Vente</div>
                <div>{elem.phoneVente}</div>
                <div>{elem.emailVente}</div>
            </div>
        </>}
    </>
}
