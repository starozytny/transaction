import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/helper";
import Sanitaze from "@commonComponents/functions/sanitaze";

const CURRENT_STEP = 6;

export function Step6({ step, errors, onNext, onDraft, onChange, onChangeSelect,
                          typeCalcul, price, provisionCharges, provisionOrdures, tva, totalTerme, caution, honoraireTtc,
                          honoraireBail, edl, typeCharges, totalGeneral, typeBail, durationBail })
{
    let calculItems = helper.getItems("calculs")
    let chargesItems = helper.getItems("charges")
    let bailsItems = helper.getItems("bails")

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">(*) Champs obligatoires.</Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Financier</label>
            </div>
            <div className="line line-2">
                <SelectReactSelectize items={calculItems} identifiant="typeCalcul" valeur={typeCalcul} errors={errors}
                                      onChange={(e) => onChangeSelect('typeCalcul', e)}>
                    Type de calcul *
                </SelectReactSelectize>
                <Input type="number" step="any" identifiant="price" valeur={price} errors={errors} onChange={onChange}>
                    <span>Loyer *</span>
                </Input>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="provisionCharges" valeur={provisionCharges} errors={errors} onChange={onChange}>
                    <span>Provision pour charges</span>
                </Input>
                <Input type="number" step="any" identifiant="provisionOrdures" valeur={provisionOrdures} errors={errors} onChange={onChange}>
                    <span>Provision ordures ménagères</span>
                </Input>
            </div>
            <div className="line line-2">
                <div className="form-group">
                    <label>Montant T.V.A</label>
                    <div>{Sanitaze.toFormatCurrency(tva)}</div>
                </div>
                <div className="form-group">
                    <label>Total Terme</label>
                    <div>{Sanitaze.toFormatCurrency(totalTerme)}</div>
                </div>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-2">
                <Input type="number" step="any" identifiant="caution" valeur={caution} errors={errors} onChange={onChange}>
                    <span>Caution</span>
                </Input>
                <Input type="number" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Honoraires TTC *</span>
                </Input>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="honoraireBail" valeur={honoraireBail} errors={errors} onChange={onChange}>
                    <span>Honoraires rédaction bail</span>
                </Input>
                <Input type="number" step="any" identifiant="edl" valeur={edl} errors={errors} onChange={onChange}>
                    <span>- dont état des lieux *</span>
                </Input>
            </div>
            <div className="line line-2">
                <SelectReactSelectize items={chargesItems} identifiant="typeCharges" valeur={typeCharges} errors={errors}
                                      onChange={(e) => onChangeSelect('typeCharges', e)}>
                    Type de charges
                </SelectReactSelectize>
                <div className="form-group">
                    <label>Total général</label>
                    <div>{Sanitaze.toFormatCurrency(totalGeneral)}</div>
                </div>
            </div>
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