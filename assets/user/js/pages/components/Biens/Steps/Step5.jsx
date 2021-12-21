import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { Button }   from "@dashboardComponents/Tools/Button";

import helper from "@userPages/components/Biens/helper";
import Sanitaze from "@commonComponents/functions/sanitaze";

export function Step5({ step, onChange, onChangeSelect, onNext, errors,
                      typeCalcul, price, provisionCharges, provisionOrdures, tva, totalTerme, caution, honoraireTtc,
                          honoraireBail, edl, typeCharges, totalGeneral, typeBail, durationBail })
{
    let calculItems = helper.getItems("calculs")
    let chargesItems = helper.getItems("charges")
    let bailsItems = helper.getItems("bails")

    return <div className={"step-section" + (step === 5 ? " active" : "")}>
        <div className="line special-line">
            <div className="form-group">
                <label>Financier</label>
            </div>
            <div className="line line-2">
                <SelectReactSelectize items={calculItems} identifiant="typeCalcul" valeur={typeCalcul} errors={errors}
                                      onChange={(e) => onChangeSelect('typeCalcul', e)}>
                    Type de calcul
                </SelectReactSelectize>
                <Input type="number" step="any" identifiant="price" valeur={price} errors={errors} onChange={onChange}>
                    <span>Prix/Loyer/Prix de cession</span>
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
                    <span>Honoraire TTC</span>
                </Input>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="honoraireBail" valeur={honoraireBail} errors={errors} onChange={onChange}>
                    <span>Honoraire rédaction bail</span>
                </Input>
                <Input type="number" step="any" identifiant="edl" valeur={edl} errors={errors} onChange={onChange}>
                    <span>- dont état des lieux</span>
                </Input>
            </div>
            <div className="line line-2">
                <SelectReactSelectize items={chargesItems} identifiant="typeCharges" valeur={typeCharges} errors={errors}
                                      onChange={(e) => onChangeSelect('typeCharges', e)}>
                    Type de calcul
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

        <div className="line line-buttons">
            <Button type="reverse" onClick={() => onNext(4, 5)}>Etape précédente</Button>
            <div/>
            <div className="btns-submit">
                <Button type="warning">Enregistrer le brouillon</Button>
                <Button onClick={() => onNext(6)}>Etape suivante</Button>
            </div>
        </div>
    </div>
}