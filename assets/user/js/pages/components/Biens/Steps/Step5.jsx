import React from "react";

import { Input, Radiobox } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import { FormActions }  from "@userPages/components/Biens/Form/Form";
import { DiagDetails }  from "@userPages/components/Biens/Read/Data/Diag";

import helper from "@userPages/components/Biens/functions/helper";

const CURRENT_STEP = 5;
const BIEN_TERRAIN = 3;

export function Step5({ step, errors, onNext, onDraft, onChange, onChangeDate,
                          codeTypeBien,
                          beforeJuly, isVirgin, isSend, createdAtDpe, referenceDpe, dpeLetter,
                          gesLetter, dpeValue, gesValue, minAnnual, maxAnnual })
{

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        {parseInt(codeTypeBien) === BIEN_TERRAIN ? <Alert type="reverse">Rien à renseigner dans cette <b><u>partie {CURRENT_STEP}</u></b>.</Alert>
            : <>
                <div className="line special-line">
                    <div className="form-group">
                        <label>Diagnostique</label>
                    </div>

                    <div className="line line-3">
                        <Radiobox items={helper.getItems("answers", "diag-1")} identifiant="beforeJuly" valeur={beforeJuly} errors={errors} onChange={onChange}>
                            DPE avant le 1 juil. 2021
                        </Radiobox>
                        {parseInt(beforeJuly) !== 1 && <>
                            <Radiobox items={helper.getItems("answers", "diag-2")} identifiant="isVirgin" valeur={isVirgin} errors={errors} onChange={onChange}>
                                DPE vierge
                            </Radiobox>
                            <Radiobox items={helper.getItems("answers", "diag-3")} identifiant="isSend" valeur={isSend} errors={errors} onChange={onChange}>
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
                        <Input type="number" step="any" min={0} identifiant="dpeValue" valeur={dpeValue} errors={errors} onChange={onChange}>
                            <span>Consommation énergétique DPE en KWh/m² an</span>
                        </Input>
                        <Input type="number" step="any" min={0} identifiant="gesValue" valeur={gesValue} errors={errors} onChange={onChange}>
                            <span>Bilan émission GES en Kg/co² an</span>
                        </Input>
                    </div>

                    <div className="line line-2">
                        <div className="form-group form-group-diag">
                            <DiagDetails isDpe={true} elem={{
                                diag: {
                                    dpeValue: dpeValue,
                                    gesValue: gesValue,
                                    dpeLetter: dpeLetter,
                                    gesLetter: gesLetter,
                                }
                            }}/>
                        </div>
                        <div className="form-group form-group-diag">
                            <DiagDetails isDpe={false} elem={{
                                diag: {
                                    gesValue: gesValue,
                                    gesLetter: gesLetter
                                }
                            }}/>
                        </div>
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
            </>}

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
