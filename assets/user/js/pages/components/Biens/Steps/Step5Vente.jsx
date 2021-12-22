import React from "react";

import {Input, Radiobox, SelectReactSelectize, TextArea} from "@dashboardComponents/Tools/Fields";

import { Alert }    from "@dashboardComponents/Tools/Alert";
import { Button }   from "@dashboardComponents/Tools/Button";

import helper from "@userPages/components/Biens/helper";
import Sanitaze from "@commonComponents/functions/sanitaze";

export function Step5Vente({ step, onChange, onChangeSelect, onNext, errors,
                      typeCalcul, price, provisionCharges, provisionOrdures, tva, totalTerme, caution, honoraireTtc,
                          honoraireBail, edl, typeCharges, totalGeneral, typeBail, durationBail })
{
    let calculItems = helper.getItems("calculs")
    let chargesItems = helper.getItems("charges")
    let bailsItems = helper.getItems("bails")

    return <div className={"step-section" + (step === 5 ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">(*) Champs obligatoires.</Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Financier</label>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="price" valeur={price} errors={errors} onChange={onChange}>
                    <span>Prix *</span>
                </Input>
                <Input type="number" step="any" identifiant="provisionCharges" valeur={provisionCharges} errors={errors} onChange={onChange}>
                    <span>Charges mensuelles</span>
                </Input>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="provisionCharges" valeur={provisionCharges} errors={errors} onChange={onChange}>
                    <span>Frais notaire</span>
                </Input>
                <div className="form-group">
                    <label>Total Terme</label>
                    <div>{Sanitaze.toFormatCurrency(totalTerme)}</div>
                </div>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="provisionCharges" valeur={provisionCharges} errors={errors} onChange={onChange}>
                    <span>Impôt foncier</span>
                </Input>
                <Input type="number" step="any" identifiant="provisionOrdures" valeur={provisionOrdures} errors={errors} onChange={onChange}>
                    <span>Taxe habitation</span>
                </Input>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-3">
                <SelectReactSelectize items={chargesItems} identifiant="typeCharges" valeur={typeCharges} errors={errors}
                                      onChange={(e) => onChangeSelect('typeCharges', e)}>
                    Honoraires à la charge
                </SelectReactSelectize>
                <Input type="number" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Pourcentage des honoraires *</span>
                </Input>
                <Input type="number" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Honoraires TTC *</span>
                </Input>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <div className="form-group" />
                <div className="form-group">
                    <label>Total général</label>
                    <div>{Sanitaze.toFormatCurrency(totalGeneral)}</div>
                </div>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-3">
                <Radiobox items={helper.getItems("answers-simple", 3)} identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    Bien en copropriété ?
                </Radiobox>
                <Input type="number" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Nombre de lots</span>
                </Input>
                <Input type="number" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Montant annuel des charges du lot</span>
                </Input>
            </div>
            <div className="line line-2">
                <Radiobox items={helper.getItems("answers-simple", 3)} identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    Le syndicat fait l'objet d'un plan de sauvegarde ?
                </Radiobox>
                <TextArea identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Détails de la procédure en cours</span>
                </TextArea>
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