import React from "react";

import { Input, Radiobox, SelectReactSelectize, TextArea } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/helper";
import Sanitaze from "@commonComponents/functions/sanitaze";

const CURRENT_STEP = 6

export function Step6Vente({ step, errors, onNext, onDraft, onChange, onChangeSelect,
                        price, chargesMensuelles, notaire, foncier, taxeHabitation, honoraireChargeDe,
                        honorairePourcentage, honoraireTtc, totalGeneral, priceHorsAcquereur,
                        isCopro, nbLot, chargesLot, isSyndicProcedure, detailsProcedure })
{
    let honoraireItems = helper.getItems("honoraires");

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
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
                <Input type="number" step="any" identifiant="chargesMensuelles" valeur={chargesMensuelles} errors={errors} onChange={onChange}>
                    <span>Charges mensuelles</span>
                </Input>
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="notaire" valeur={notaire} errors={errors} onChange={onChange}>
                    <span>Frais notaire</span>
                </Input>
                <div className="form-group" />
            </div>
            <div className="line line-2">
                <Input type="number" step="any" identifiant="foncier" valeur={foncier} errors={errors} onChange={onChange}>
                    <span>Impôt foncier</span>
                </Input>
                <Input type="number" step="any" identifiant="taxeHabitation" valeur={taxeHabitation} errors={errors} onChange={onChange}>
                    <span>Taxe habitation</span>
                </Input>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-3">
                <SelectReactSelectize items={honoraireItems} identifiant="honoraireChargeDe" valeur={honoraireChargeDe} errors={errors}
                                      onChange={(e) => onChangeSelect('honoraireChargeDe', e)}>
                    Honoraires à la charge *
                </SelectReactSelectize>
                <Input type="number" step="any" identifiant="honorairePourcentage" valeur={honorairePourcentage} errors={errors} onChange={onChange} placeholder="%">
                    <span>Pourcentage des honoraires (%) *</span>
                </Input>
                <Input type="number" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChange}>
                    <span>Honoraires TTC *</span>
                </Input>
            </div>
            <div className="line line-3">
                {(honoraireChargeDe === 0 || honoraireChargeDe === 2) ? <>
                    <Input type="number" step="any" identifiant="priceHorsAcquereur" valeur={priceHorsAcquereur} errors={errors} onChange={onChange}>
                        <span>Prix hors honoraire acquéreur</span>
                    </Input>
                </> : <div className="form-group" />}
                <div className="form-group" />
                <div className="form-group">
                    <label>Total général</label>
                    <div>{Sanitaze.toFormatCurrency(totalGeneral)}</div>
                </div>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-3">
                <Radiobox items={helper.getItems("answers-simple", 3)} identifiant="isCopro" valeur={isCopro} errors={errors} onChange={onChange}>
                    Bien en copropriété ?
                </Radiobox>
                {parseInt(isCopro) === 1 ? <>
                    <Input type="number" step="any" identifiant="nbLot" valeur={nbLot} errors={errors} onChange={onChange}>
                        <span>Nombre de lots</span>
                    </Input>
                    <Input type="number" step="any" identifiant="chargesLot" valeur={chargesLot} errors={errors} onChange={onChange}>
                        <span>Montant annuel des charges du lot</span>
                    </Input>
                </> : <>
                    <div className="form-group" />
                    <div className="form-group" />
                </>}
            </div>
            <div className="line line-2">
                <Radiobox items={helper.getItems("answers-simple", 4)} identifiant="isSyndicProcedure" valeur={isSyndicProcedure} errors={errors} onChange={onChange}>
                    Le syndicat fait l'objet d'une procédure ?
                </Radiobox>
                {parseInt(isSyndicProcedure) === 1 ? <TextArea identifiant="detailsProcedure" valeur={detailsProcedure} errors={errors} onChange={onChange}>
                    <span>Détails de la procédure en cours</span>
                </TextArea> : <div className="form-group" />}
            </div>
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}