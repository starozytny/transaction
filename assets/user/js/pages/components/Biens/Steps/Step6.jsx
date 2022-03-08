import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/functions/helper";

const AD_CESSION_BAIL = 4;

const CURRENT_STEP = 6;

export function Step6({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeCleave,
                          codeTypeAd,
                          price, provisionCharges, caution, honoraireTtc, edl, typeCharges, typeBail, durationBail,
                          priceMurs })
{
    let chargesItems = helper.getItems("charges")
    let bailsItems = helper.getItems("bails")

    let codeTypeAdInt = parseInt(codeTypeAd);

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">(*) Champs obligatoires.</Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Financier</label>
            </div>
            <div className="line line-2">
                <Input type="cleave" step="any" identifiant="price" valeur={price} errors={errors} onChange={onChangeCleave}>
                    <span>{codeTypeAdInt !== AD_CESSION_BAIL ? "Loyer" : "Prix de cession"} *</span>
                </Input>
                {codeTypeAdInt !== AD_CESSION_BAIL ? <div className="form-group" /> : <>
                    <Input type="cleave" step="any" identifiant="priceMurs" valeur={priceMurs} errors={errors} onChange={onChangeCleave}>
                        <span>Loyer / mois murs</span>
                    </Input>
                </>}
            </div>
            <div className="line line-2">
                <Input type="cleave" step="any" identifiant="provisionCharges" valeur={provisionCharges} errors={errors} onChange={onChangeCleave}>
                    <span>Provision pour charges</span>
                </Input>
                <SelectReactSelectize items={chargesItems} identifiant="typeCharges" valeur={typeCharges} errors={errors}
                                      onChange={(e) => onChangeSelect('typeCharges', e)}>
                    Type de charges
                </SelectReactSelectize>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-2">
                <Input type="cleave" step="any" identifiant="caution" valeur={caution} errors={errors} onChange={onChangeCleave}>
                    <span>Caution</span>
                </Input>
                <div className="form-group" />
            </div>
            <div className="line line-2">
                <Input type="cleave" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChangeCleave}>
                    <span>Honoraires (avec état des lieux) TTC *</span>
                </Input>
                <Input type="cleave" step="any" identifiant="edl" valeur={edl} errors={errors} onChange={onChangeCleave}>
                    <span>Honoraires état des lieux *</span>
                </Input>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-2">
                <SelectReactSelectize items={bailsItems} identifiant="typeBail" valeur={typeBail} errors={errors}
                                      onChange={(e) => onChangeSelect('typeBail', e)}>
                    Type de bail
                </SelectReactSelectize>
                <Input type="number" identifiant="durationBail" valeur={durationBail} errors={errors} onChange={onChange}>
                    <span>Durée du bail en mois</span>
                </Input>
            </div>
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
