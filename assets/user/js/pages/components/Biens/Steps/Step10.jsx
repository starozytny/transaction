import React from "react";

import { Input, SelectReactSelectize, TextArea } from "@dashboardComponents/Tools/Fields";
import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper    from "@userPages/components/Biens/functions/helper";
import Sort      from "@commonComponents/functions/sort";
import Sanitaze  from "@commonComponents/functions/sanitaze";

const CURRENT_STEP = 10;

export function Step10({ step, errors, onNext, onDraft, onChange, onChangeSelect, onGenerateContent, negotiators, negotiator,
                        typeAdvert, contentSimple, contentFull, onOpenHelp,
                        codeTypeBien, codeTypeAd, codeTypeMandat, libelle, address, zipcode, city, price, areaTotal, piece,
                        areaGarden, areaTerrace, room, balcony, parking, box, dispoAt, busy,
                        isMeuble, isNew, floor, nbFloor, codeHeater0, codeHeater, codeKitchen, exposition,
                        hasGarden, hasTerrace, hasPool, hasCave, hasDigicode, hasInterphone, hasGuardian, hasAlarme,
                        hasLift, hasClim, hasCalme, hasInternet, hasHandi, hasFibre, situation,
                        dpeLetter, gesLetter, dpeValue, gesValue,
                        provisionCharges, caution, honoraireTtc, edl, chargesMensuelles, notaire, foncier, photos })
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
    let advertItems = helper.getItems("adverts");

    let nego = null;
    negotiators.forEach(n => {
        if(n.id === negotiator){
            nego = n;
        }
    })

    let typeBienString = helper.selectToString(typeBienItems, codeTypeBien);
    let typeAdString = helper.selectToString(typeAdItems, codeTypeAd);
    let typeMandatString = helper.selectToString(typeMandatItems, codeTypeMandat);

    let dpeLetterString = helper.selectToString(diagItems, dpeLetter);
    let gesLetterString = helper.selectToString(diagItems, gesLetter);
    let expositionString = helper.selectToString(expositionItems, exposition).toLowerCase();
    let heater0String = helper.selectToString(chauffage0Items, codeHeater0).toLowerCase();
    let heaterString = helper.selectToString(chauffage1Items, codeHeater).toLowerCase();
    let kitchenString = helper.selectToString(cuisineItems, codeKitchen).toLowerCase();
    let busyString = helper.selectToString(occupationItems, busy);

    photos.sort(Sort.compareRank);
    let photo = null;
    photos.forEach(ph => {
        if(photo === null && !ph.isTrash){
            photo = ph;
        }
    })

    let srcFormPhoto = photo ? (photo.is64 ? photo.file : photo.photoFile) : "/build/user/images/menu.jpg";

    contentFull = contentFull.replaceAll("<br />", "\n")

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line">
            <div className="form-group">
                <label>Synthèse</label>
            </div>

            <div className="synthese-bloc">
                <div className="card-ad">
                    <div className="card-main">
                        <div className="card-body">
                            <div className="image">
                                <img src={srcFormPhoto} alt="illustration"/>
                            </div>

                            <div className="infos">
                                <div className="col-1">
                                    <div className="badges">
                                        <div className="badge-bien badge">{typeBienString}</div>
                                    </div>
                                    <div className="identifier">
                                        <div className="title">
                                            <span>{libelle}</span>
                                        </div>
                                        <div className="address">
                                            <div>{address ? address : "[Adresse ?]"}</div>
                                            <div>{zipcode ? zipcode : "[Code postal ?]"}, {city ? city : "[Ville ?]"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="badges">
                                        <div className="badge-bien badge">{typeAdString}</div>
                                        <div className="badge-bien badge">Mandat {typeMandatString}</div>
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
                                                <img src={`https://robohash.org/${nego.fullname}`} alt="Avatar" />
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
                                <div className="synthese-financial">
                                    {provisionCharges !== "" && <div>Provision pour charges : {Sanitaze.toFormatCurrency(provisionCharges)}</div>}
                                    {caution !== "" && <div>Caution : {Sanitaze.toFormatCurrency(caution)}</div>}
                                    {honoraireTtc !== "" && <div>Honoraire TTC : {Sanitaze.toFormatCurrency(honoraireTtc)}</div>}
                                    {edl !== "" && <div>Honoraire EDL : {Sanitaze.toFormatCurrency(edl)}</div>}
                                    {chargesMensuelles !== "" && <div>Charges mensuelles : {Sanitaze.toFormatCurrency(chargesMensuelles)}</div>}
                                    {notaire !== "" && <div>Notaire : {Sanitaze.toFormatCurrency(notaire)}</div>}
                                    {foncier !== "" && <div>Foncier : {Sanitaze.toFormatCurrency(foncier)}</div>}
                                </div>

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

        <div className="line special-line">
            <Input identifiant="libelle" valeur={libelle} errors={errors} onChange={onChange}
                   placeholder="Exemple : Appartement T1 Centre ville (max 64 caractères)"
            >
                <span>Libellé de l'annonce *</span>
                <div className="input-label-help">
                    <ButtonIcon icon="question" onClick={() => onOpenHelp("libelle")}>Aide</ButtonIcon>
                </div>
            </Input>
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Publicité</label>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <SelectReactSelectize items={advertItems} identifiant="typeAdvert" valeur={typeAdvert} errors={errors}
                                      onChange={(e) => onChangeSelect('typeAdvert', e)}>
                    Type de publicité
                </SelectReactSelectize>
            </div>

            <div className="line">
                <TextArea identifiant="contentSimple" valeur={contentSimple} errors={errors} onChange={onChange}>
                    Description simple
                </TextArea>
            </div>
            <div className="line line-2">
                <div className="form-group">
                    <Button type="default" outline={true} onClick={() => onGenerateContent("simple")}>Générer un texte simple par défaut</Button>
                </div>
                <div className="form-group">
                    Nombre de caractères : {contentSimple ? contentSimple.length : 0}/250
                </div>
            </div>
            <div className="line">
                <TextArea identifiant="contentFull" valeur={contentFull} errors={errors} onChange={onChange}>
                    Description complète
                </TextArea>
            </div>
            <div className="line line-2">
                <div className="form-group">
                    <Button type="default" outline={true} onClick={() => onGenerateContent("complexe")}>Générer un texte complexe par défaut</Button>
                </div>
                <div className="form-group">
                    Nombre de caractères : {contentFull ? contentFull.length : 0}/4000
                </div>
            </div>
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
