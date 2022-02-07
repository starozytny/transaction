import React from "react";

import { Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Alert }  from "@dashboardComponents/Tools/Alert";
import { Button } from "@dashboardComponents/Tools/Button";

import helper from "@userPages/components/Biens/helper";
import Sort from "@commonComponents/functions/sort";
import {DatePick} from "@dashboardComponents/Tools/DatePicker";

const CURRENT_STEP = 1;

export function Step1({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeDate, negotiators,
                          codeTypeAd, codeTypeBien, codeTypeMandat, startAt, endAt, negotiator })
{
    let typeAdItems = helper.getItems("ads");
    let typeBienItems = helper.getItems("biens");
    let typeMandatItems = helper.getItems("mandats");

    let negociateurs = []
    negotiators.sort(Sort.compareLastname)
    negotiators.forEach(ne => {
        negociateurs.push({ value: ne.id, label: "#" + ne.code + " - " + ne.fullname, identifiant: "neg-" + ne.id })
    })

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">(*) Champs obligatoires.</Alert>
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

            {parseInt(codeTypeMandat) !== 0 && <div className="line line-2">
                <DatePick identifiant="startAt" valeur={startAt} errors={errors}
                          onChange={(e) => onChangeDate("startAt", e)}>
                    Date disponible
                </DatePick>
                <DatePick identifiant="endAt" valeur={endAt} errors={errors}
                          onChange={(e) => onChangeDate("endAt", e)}>
                    Date disponible
                </DatePick>
            </div>}
        </div>

        <div className="line line-2">
            <SelectReactSelectize items={negociateurs} identifiant="negotiator" valeur={negotiator} errors={errors}
                                  onChange={(e) => onChangeSelect('negotiator', e)}>
                Négociateur *
            </SelectReactSelectize>
            <div className="form-group" />
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