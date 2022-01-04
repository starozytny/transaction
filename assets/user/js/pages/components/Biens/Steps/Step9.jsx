import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import {Button, ButtonIcon, ButtonIconDropdown} from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper   from "@userPages/components/Biens/helper";

import {
    OwnerContact,
    OwnerMainInfos,
    OwnerNegotiator,
} from "@dashboardPages/components/Immo/Owners/OwnersItem";
import {
    TenantContact,
    TenantMainInfos,
    TenantNegotiator
} from "@dashboardPages/components/Immo/Tenants/TenantsItem";
import {AdCard} from "@userPages/components/Biens/AdCard";
import {Selector} from "@dashboardComponents/Layout/Selector";
import Sanitaze from "@commonComponents/functions/sanitaze";
import {HelpBubble} from "@dashboardComponents/Tools/HelpBubble";

const CURRENT_STEP = 9;

function toString (tab, value) {
    let label = "";
    tab.forEach(item => {
        if(item.value === value){
            label = item.label
        }
    })

    return label;
}

export function Step9({ step, onChange, onNext, error, negotiator, negotiators,
                        typeAdvert, contentSimple, contentFull,
                        codeTypeBien, codeTypeAd, codeTypeMandat, libelle, address, zipcode, city, price, areaTotal, piece,
                        areaGarden, areaTerrace, room, balcony, parking, box, dispoAt, busy,
                        isMeuble, isNew, floor, nbFloor, codeHeater0, codeHeater, codeKitchen, exposition,
                        hasGarden, hasTerrace, hasPool, hasCave, hasDigicode, hasInterphone, hasGuardian, hasAlarme,
                        hasLift, hasClim, hasCalme, hasInternet, hasHandi, hasFibre, situation,
                        dpeLetter, gesLetter, dpeValue, gesValue,
                        provisionCharges, caution, honoraireTtc, honoraireBail, edl, chargesMensuelles, notaire, foncier })
{
    let typeAdItems = helper.getItems("ads");
    let typeBienItems = helper.getItems("biens");
    let typeMandatItems = helper.getItems("mandats");
    let diagItems = helper.getItems("diags");
    let expositionItems = helper.getItems("expositions");
    let chauffage0Items = helper.getItems("chauffages-0");
    let chauffage1Items = helper.getItems("chauffages-1");
    let cuisineItems = helper.getItems("cuisines");
    let occupationItems = helper.getItems("occupations");

    let nego = null;
    negotiators.forEach(n => {
        if(n.id === negotiator){
            nego = n;
        }
    })

    let typeBienString = toString(typeBienItems, codeTypeBien);
    let typeAdString = toString(typeAdItems, codeTypeAd);
    let typeMandatString = toString(typeMandatItems, codeTypeMandat);

    let dpeLetterString = toString(diagItems, dpeLetter);
    let gesLetterString = toString(diagItems, gesLetter);
    let expositionString = toString(expositionItems, exposition).toLowerCase();
    let heater0String = toString(chauffage0Items, codeHeater0).toLowerCase();
    let heaterString = toString(chauffage1Items, codeHeater).toLowerCase();
    let kitchenString = toString(cuisineItems, codeKitchen).toLowerCase();
    let busyString = toString(occupationItems, busy);


    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line contact-line">
            <div className="form-group">
                <label>Synthèse</label>
            </div>

            <div className="synthese-bloc">
                <div className="card-ad">
                    <div className="card-main">
                        <div className="card-body">
                            <div className="image">
                                <img src="/build/user/images/menu.jpg" alt="illustration"/>
                            </div>

                            <div className="infos">
                                <div className="col-1">
                                    <div className="badges">
                                        <div className="status">{typeBienString}</div>
                                    </div>
                                    <div className="identifier">
                                        <div className="title">
                                            <span>{libelle}</span>
                                        </div>
                                        <div className="address">
                                            <div>{address}</div>
                                            <div>{zipcode}, {city}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="badges">
                                        <div className="status">{typeAdString}</div>
                                        <div className="status">Mandat {typeMandatString}</div>
                                    </div>
                                    <div className="identifier">
                                        <div className="price">{Sanitaze.toFormatCurrency(price)} cc/mois</div>
                                        <div className="carac">{areaTotal}m² - {piece} pièce{piece > 1 ? "s" : ""}</div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="references">
                                        <div>SYNTHESE</div>
                                    </div>
                                    <div className="negociateur">
                                        {nego && <>
                                            <div className="avatar">
                                                <img src={`https://robohash.org/${nego.fullname}?size=64x64`} alt="Avatar" />
                                            </div>
                                            <span className="tooltip">{nego.fullname}</span>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div>
                                {areaGarden !== "" && <div>Jardin : {areaGarden}m²</div>}
                                {areaTerrace !== "" && <div>Terrasse : {areaTerrace}m²</div>}
                                {room !== "" && <div>Chambres : {room}</div>}
                                {balcony !== "" && <div>Balcons : {balcony}</div>}
                                {parking !== "" && <div>Parkings : {parking}</div>}
                                {box !== "" && <div>Box : {box}</div>}
                                {codeTypeAd === 1 && isMeuble !== 99 && <div>Le bien est {isMeuble === 1 ? "meublé" : "non meublé"}</div>}
                                {isNew === 1 && <div>Le bien est refait à neuf</div>}
                                {floor !== "" && <div>{floor} / {nbFloor} étages</div>}
                                {(codeHeater0 !== "" || codeHeater !== "") && <div>Chauffage {heater0String} {heaterString}</div>}
                                {codeKitchen !== "" && <div>Cuisine {kitchenString}</div>}
                            </div>
                            <div>
                                {dpeLetter !== "" && <div>DPE : [{dpeLetterString}] {dpeValue} KWh/m² an</div>}
                                {gesLetter !== "" && <div>GES : [{gesLetterString}] {gesValue} Kg/co² an</div>}
                                {provisionCharges !== "" && <div>Provision pour charges : {Sanitaze.toFormatCurrency(provisionCharges)}</div>}
                                {caution !== "" && <div>Caution : {Sanitaze.toFormatCurrency(caution)}</div>}
                                {honoraireTtc !== "" && <div>Honoraire TTC : {Sanitaze.toFormatCurrency(honoraireTtc)}</div>}
                                {edl !== "" && <div>Honoraire EDL : {Sanitaze.toFormatCurrency(edl)}</div>}
                                {chargesMensuelles !== "" && <div>Charges mensuelles EDL : {Sanitaze.toFormatCurrency(chargesMensuelles)}</div>}
                                {notaire !== "" && <div>Notaire : {Sanitaze.toFormatCurrency(notaire)}</div>}
                                {foncier !== "" && <div>Foncier : {Sanitaze.toFormatCurrency(foncier)}</div>}
                            </div>

                            <div>
                                {exposition !== 99 && <div>Exposition {expositionString}</div>}
                                {hasGarden === 1 && <div>Possède un jardin</div>}
                                {hasTerrace === 1 && <div>Possède une terrasse</div>}
                                {hasPool === 1 && <div>Possède une piscine</div>}
                                {hasCave === 1 && <div>Possède une cave</div>}
                                {hasDigicode === 1 && <div>Possède un digicode</div>}
                                {hasInterphone === 1 && <div>Possède un interphone</div>}
                                {hasGuardian === 1 && <div>Possède un gardien</div>}
                                {hasAlarme === 1 && <div>Possède une alarme</div>}
                                {hasLift === 1 && <div>Possède un ascenseur</div>}
                                {hasClim === 1 && <div>Possède une climatisation</div>}
                                {hasCalme === 1 && <div>Se situe dans un lieu calme</div>}
                                {hasInternet === 1 && <div>Possède une connexion internet (max ADSL)</div>}
                                {hasFibre === 1 && <div>Possède une connexion internet à la fibre</div>}
                                {hasHandi === 1 && <div>Possède un aménagement handicapé</div>}
                                {situation !== "" && <div>Situation : {situation}</div>}
                            </div>

                            <div className="footer-actions">
                                {dispoAt !== "" && <div className="createdAt">{new Date(dispoAt).toLocaleDateString()} {busy !== "" && " - " + busyString}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <FormActions onNext={onNext} currentStep={CURRENT_STEP} />
    </div>
}