import React from "react";

import helper   from "@userPages/components/Biens/functions/helper";
import Sort     from "@commonComponents/functions/sort";

import {Input, Radiobox, SelectReactSelectize, TextArea} from "@dashboardComponents/Tools/Fields";
import { Alert }    from "@dashboardComponents/Tools/Alert";
import { Button }   from "@dashboardComponents/Tools/Button";
import { DatePick } from "@dashboardComponents/Tools/DatePicker";

import { ReadCard } from "@userComponents/Layout/Read";

const CURRENT_STEP = 1;

export function Step1({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeDate, negotiators,
                          codeTypeAd, codeTypeBien, codeTypeMandat, startAt, nbMonthMandat, endAt, priceEstimate, fee,
                          mandatRaison, mandatLastname, mandatFirstname, mandatPhone, mandatAddress, mandatZipcode, mandatCity, mandatCommentary,
                          negotiator })
{
    let typeAdItems = helper.getItems("ads");
    let typeBienItems = helper.getItems("biens");
    let typeMandatItems = helper.getItems("mandats");

    let itemNegotiator = null;
    let negociateurs = []
    negotiators.sort(Sort.compareLastname)
    negotiators.forEach(ne => {
        negociateurs.push({ value: ne.id, label: "#" + ne.code + " - " + ne.fullname, identifiant: "neg-" + ne.id });

        if(ne.id === negotiator){
            itemNegotiator = <ReadCard elem={ne} avatar={ne.avatarFile} displayActions={false} />
        }
    })

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line-infos">
            <Alert type="reverse">(*) Champs obligatoires.</Alert>
        </div>
        <div className="line special-line">
            <Radiobox items={typeAdItems} identifiant="codeTypeAd" valeur={codeTypeAd} errors={errors} onChange={onChange}>
                Type d'annonce *
            </Radiobox>
        </div>

        <div className="line special-line">
            <Radiobox items={typeBienItems} identifiant="codeTypeBien" valeur={codeTypeBien} errors={errors} onChange={onChange}>
                Type de bien *
            </Radiobox>
        </div>

        <div className="line special-line">
            <Radiobox items={typeMandatItems} identifiant="codeTypeMandat" valeur={codeTypeMandat} errors={errors} onChange={onChange}>
                Type de mandat *
            </Radiobox>

            {parseInt(codeTypeMandat) !== 0 && <>
                <div className="line line-3 line-mt">
                    <DatePick identifiant="startAt" valeur={startAt} errors={errors}
                              onChange={(e) => onChangeDate("startAt", e)}>
                        D??but du mandat
                    </DatePick>
                    <Input type="number" min={0} identifiant="nbMonthMandat" valeur={nbMonthMandat} errors={errors} onChange={onChange}>
                        <span>Nombre de mois</span>
                    </Input>
                    <DatePick identifiant="endAt" valeur={endAt} errors={errors}
                              minDate={startAt ? startAt : null} maxDate={null}
                              onChange={(e) => onChangeDate("endAt", e)}>
                        Fin du mandat
                    </DatePick>
                </div>
                {parseInt(codeTypeAd) === 0 && <>
                    {/*<div className="line line-3">*/}
                    {/*    <Input type="number" min={0} any="step" identifiant="priceEstimate" valeur={priceEstimate} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Prix estim??</span>*/}
                    {/*    </Input>*/}
                    {/*    <Input type="number" min={0} any="step" identifiant="fee" valeur={fee} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Commission vendeur</span>*/}
                    {/*    </Input>*/}
                    {/*    <div className="form-group" />*/}
                    {/*</div>*/}
                    {/*<div className="line line-3">*/}
                    {/*    <Input identifiant="mandatRaison" valeur={mandatRaison} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Raison sociale</span>*/}
                    {/*    </Input>*/}
                    {/*    <Input identifiant="mandatLastname" valeur={mandatLastname} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Nom</span>*/}
                    {/*    </Input>*/}
                    {/*    <Input identifiant="mandatFirstname" valeur={mandatFirstname} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Pr??nom</span>*/}
                    {/*    </Input>*/}
                    {/*</div>*/}
                    {/*<div className="line line-3">*/}
                    {/*    <Input identifiant="mandatAddress" valeur={mandatAddress} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Adresse</span>*/}
                    {/*    </Input>*/}
                    {/*    <Input identifiant="mandatZipcode" valeur={mandatZipcode} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Code postal</span>*/}
                    {/*    </Input>*/}
                    {/*    <Input identifiant="mandatCity" valeur={mandatCity} errors={errors} onChange={onChange}>*/}
                    {/*        <span>Ville</span>*/}
                    {/*    </Input>*/}
                    {/*</div>*/}
                    {/*<div className="line">*/}
                    {/*    <TextArea identifiant="mandatCommentary" valeur={mandatCommentary} errors={errors} onChange={onChange}>*/}
                    {/*        Commentaires*/}
                    {/*    </TextArea>*/}
                    {/*</div>*/}
                </>}
            </>}
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>N??gociateur *</label>
            </div>

            <div className="line line-3">
                <div className="form-group" />
                <SelectReactSelectize items={negociateurs} identifiant="negotiator" valeur={negotiator} errors={errors}
                                      onChange={(e) => onChangeSelect('negotiator', e)} />
                <div className="form-group" />
            </div>

            {itemNegotiator && <div className="line">
                <div className="form-group">{itemNegotiator}</div>
            </div>}
        </div>

        <div className="line line-buttons">
            <div/>
            <div className="btns-submit">
                <Button type="warning" onClick={onDraft}>Enregistrer le brouillon</Button>
                <Button onClick={() => onNext(2)}>Etape suivante</Button>
            </div>
        </div>
    </div>
}
