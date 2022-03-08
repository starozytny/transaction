import React from "react";

import { Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/functions/helper";

const CURRENT_STEP = 3;

export function Step3({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeDate, sols, sousTypes,
                          codeTypeBien,
                          hasGarden, hasTerrace, hasPool, hasCave, hasDigicode, hasInterphone, hasGuardian,
                          hasAlarme, hasLift, hasClim, hasCalme, hasInternet,
                          hasHandi, hasFibre, situation, sousType, sol,
                          beforeJuly, isVirgin, isSend, createdAtDpe, referenceDpe, dpeLetter,
                          gesLetter, dpeValue, gesValue, minAnnual, maxAnnual })
{
    let solItems = helper.getItemsFromDB(sols, sol, 'sol');
    let soustypeItems = helper.getItemsFromDB(sousTypes, sousType, 'sous-types');
    let situationItems = helper.getItems("situations", 'situation');
    let diag0Items = helper.getItems("diags", 0);
    let diag1Items = helper.getItems("diags", 1);

    let codeTypeBienInt = helper.getIntValue(codeTypeBien);

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        {codeTypeBienInt !== 2 ? <>
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

            <div className="line special-line">
                <div className="form-group">
                    <label>Diagnostique</label>
                </div>

                <div className="line line-3">
                    <Radiobox items={helper.getItems("answers", 17)} identifiant="beforeJuly" valeur={beforeJuly} errors={errors} onChange={onChange}>
                        DPE avant le 1 juil. 2021
                    </Radiobox>
                    {parseInt(beforeJuly) !== 1 && <>
                        <Radiobox items={helper.getItems("answers", 18)} identifiant="isVirgin" valeur={isVirgin} errors={errors} onChange={onChange}>
                            DPE vierge
                        </Radiobox>
                        <Radiobox items={helper.getItems("answers", 19)} identifiant="isSend" valeur={isSend} errors={errors} onChange={onChange}>
                            DPE non soumis
                        </Radiobox>
                    </>}
                </div>

                <div className="line line-2">
                    <DatePick identifiant="createdAtDpe" valeur={createdAtDpe} errors={errors}
                              onChange={(e) => onChangeDate("createdAtDpe", e)}>
                        Date de réalisation du DPE
                    </DatePick>
                    <Input type="number" min={1200} identifiant="referenceDpe" valeur={referenceDpe} errors={errors} onChange={onChange}>
                        <span>Année de référence conso DPE</span>
                    </Input>
                </div>

                <div className="line line-2">
                    <Radiobox items={diag0Items} identifiant="dpeLetter" valeur={dpeLetter} errors={errors} onChange={onChange}>
                        Consommation énergétique DPE
                    </Radiobox>
                    <Radiobox items={diag1Items} identifiant="gesLetter" valeur={gesLetter} errors={errors} onChange={onChange}>
                        Bilan émission GES
                    </Radiobox>
                </div>

                <div className="line line-2">
                    <Input type="number" step="any" min={0} identifiant="dpeValue" valeur={dpeValue} errors={errors} onChange={onChange}>
                        <span>en KWh/m² an</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="gesValue" valeur={gesValue} errors={errors} onChange={onChange}>
                        <span>en Kg/co² an</span>
                    </Input>
                </div>

                <div className="line line-2">
                    <Input type="number" step="any" min={0} identifiant="minAnnual" valeur={minAnnual} errors={errors} onChange={onChange}>
                        <span>Estimation des coûts annuels minimun</span>
                    </Input>
                    <Input type="number" step="any" min={0} identifiant="maxAnnuel" valeur={maxAnnual} errors={errors} onChange={onChange}>
                        <span>Estimation des coûts annuels maximum</span>
                    </Input>
                </div>
            </div>
        </> : <Alert type="reverse">Rien à renseigner dans cette <b><u>partie {CURRENT_STEP}</u></b>.</Alert>}

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
