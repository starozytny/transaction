import React from "react";

import { Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/functions/helper";

const CURRENT_STEP = 3;

export function Step3({ step, errors, onNext, onDraft, onChange, onChangeSelect, sols, sousTypes,
                          caseTypeBien,
                          hasGarden, hasTerrace, hasPool, hasCave, hasDigicode, hasInterphone, hasGuardian,
                          hasAlarme, hasLift, hasClim, hasCalme, hasInternet,
                          hasHandi, hasFibre, situation, sousType, sol })
{
    let solItems = helper.getItemsFromDB(sols, sol, 'sol');
    let soustypeItems = helper.getItemsFromDB(sousTypes, sousType, 'sous-types');
    let situationItems = helper.getItems("situations", 'situation');

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        {caseTypeBien === 1 && <>
            <div className="line special-line">
                <div className="form-group">
                    <label>Les avantages</label>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 3)} identifiant="hasGarden" valeur={hasGarden} errors={errors} onChange={onChange}>
                        Jardin
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 4)} identifiant="hasTerrace" valeur={hasTerrace} errors={errors} onChange={onChange}>
                        Terrasse
                    </Radiobox>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 5)} identifiant="hasPool" valeur={hasPool} errors={errors} onChange={onChange}>
                        Piscine
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 6)} identifiant="hasCave" valeur={hasCave} errors={errors} onChange={onChange}>
                        Cave
                    </Radiobox>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 7)} identifiant="hasDigicode" valeur={hasDigicode} errors={errors} onChange={onChange}>
                        Digicode
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 8)} identifiant="hasInterphone" valeur={hasInterphone} errors={errors} onChange={onChange}>
                        Interphone
                    </Radiobox>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 9)} identifiant="hasGuardian" valeur={hasGuardian} errors={errors} onChange={onChange}>
                        Gardien
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 10)} identifiant="hasAlarme" valeur={hasAlarme} errors={errors} onChange={onChange}>
                        Alarme
                    </Radiobox>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 11)} identifiant="hasLift" valeur={hasLift} errors={errors} onChange={onChange}>
                        Ascenseur
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 12)} identifiant="hasClim" valeur={hasClim} errors={errors} onChange={onChange}>
                        Climatisation
                    </Radiobox>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 13)} identifiant="hasCalme" valeur={hasCalme} errors={errors} onChange={onChange}>
                        Calme
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 14)} identifiant="hasInternet" valeur={hasInternet} errors={errors} onChange={onChange}>
                        Internet
                    </Radiobox>
                </div>
                <div className="line line-2">
                    <Radiobox items={helper.getItems("answers", 15)} identifiant="hasHandi" valeur={hasHandi} errors={errors} onChange={onChange}>
                        Aménagement pour handicapés
                    </Radiobox>
                    <Radiobox items={helper.getItems("answers", 16)} identifiant="hasFibre" valeur={hasFibre} errors={errors} onChange={onChange}>
                        Internet avec la fibre
                    </Radiobox>
                </div>

                <div className="line line-2">
                    <SelectReactSelectize items={situationItems} identifiant="situation" valeur={situation} errors={errors}
                                          onChange={(e) => onChangeSelect('situation', e)}>
                        Situation
                    </SelectReactSelectize>
                    <SelectReactSelectize items={soustypeItems} identifiant="sousType" valeur={sousType} errors={errors}
                                          onChange={(e) => onChangeSelect('sousType', e)}>
                        Sous type de bien
                    </SelectReactSelectize>
                </div>

                <div className="line line-2">
                    <SelectReactSelectize items={solItems} identifiant="sol" valeur={sol} errors={errors}
                                          onChange={(e) => onChangeSelect('sol', e)}>
                        Type de sol
                    </SelectReactSelectize>
                    <div className="form-group" />
                </div>
            </div>
        </>}
        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
