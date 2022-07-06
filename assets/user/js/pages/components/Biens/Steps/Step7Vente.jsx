import React from "react";

import { Input, Radiobox, SelectReactSelectize, TextArea } from "@dashboardComponents/Tools/Fields";

import { Alert }        from "@dashboardComponents/Tools/Alert";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/functions/helper";
import Sanitaze from "@commonComponents/functions/sanitaze";

const AD_VIAGER= 2;
const AD_FOND_COMMERCE= 7;

const CURRENT_STEP = 7

export function Step7Vente({ step, errors, onNext, onDraft, onChange, onChangeCleave, onChangeSelect,
                        codeTypeAd,
                        price, chargesMensuelles, notaire, foncier, taxeHabitation, honoraireChargeDe,
                        honorairePourcentage, honoraireTtc, totalGeneral, priceHorsAcquereur,
                        isCopro, nbLot, chargesLot, isSyndicProcedure, detailsProcedure, rente,
                        repartitionCa, resultatN2, resultatN1, resultatN0, natureBailCommercial })
{
    let honoraireItems = helper.getItems("honoraires");

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
                    <span>{codeTypeAdInt !== AD_VIAGER ? "Prix" : "Bouquet"} *</span>
                </Input>
                <SelectReactSelectize items={honoraireItems} identifiant="honoraireChargeDe" valeur={honoraireChargeDe} errors={errors}
                                      onChange={(e) => onChangeSelect('honoraireChargeDe', e)}>
                    Honoraires à la charge *
                </SelectReactSelectize>
            </div>

            <div className="line line-2">
                <Input type="number" step="any" identifiant="honorairePourcentage" valeur={honorairePourcentage} errors={errors} onChange={onChange} placeholder="%">
                    <span>Pourcentage des honoraires (%) *</span>
                </Input>
                <Input type="cleave" step="any" identifiant="honoraireTtc" valeur={honoraireTtc} errors={errors} onChange={onChangeCleave}>
                    <span>Honoraires TTC *</span>
                </Input>
            </div>

            {(honoraireChargeDe !== 1) && <div className="line line-2">
                <Input type="cleave" step="any" identifiant="priceHorsAcquereur" valeur={priceHorsAcquereur} errors={errors} onChange={onChangeCleave}>
                    <span>Prix hors honoraire acquéreur</span>
                </Input>
                <div className="form-group" />
            </div>}
            {codeTypeAdInt === AD_VIAGER && <div className="line line-2">
                <Input type="cleave" step="any" identifiant="rente" valeur={rente} errors={errors} onChange={onChangeCleave}>
                    <span>Rente mensuelle</span>
                </Input>
                <div className="form-group" />
            </div>}
        </div>
        <div className="line special-line">
            <div className="line line-2">
                <Input type="cleave" step="any" identifiant="chargesMensuelles" valeur={chargesMensuelles} errors={errors} onChange={onChangeCleave}>
                    <span>Charges mensuelles</span>
                </Input>
                <Input type="cleave" step="any" identifiant="notaire" valeur={notaire} errors={errors} onChange={onChangeCleave}>
                    <span>Frais notaire</span>
                </Input>
            </div>
        </div>

        <div className="line special-line">
            <div className="line line-2">
                <Input type="cleave" step="any" identifiant="foncier" valeur={foncier} errors={errors} onChange={onChangeCleave}>
                    <span>Impôt foncier</span>
                </Input>
                <Input type="cleave" step="any" identifiant="taxeHabitation" valeur={taxeHabitation} errors={errors} onChange={onChangeCleave}>
                    <span>Taxe habitation</span>
                </Input>
            </div>
            <div className="line line-2">
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
                    <Input type="cleave" step="any" identifiant="chargesLot" valeur={chargesLot} errors={errors} onChange={onChangeCleave}>
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

        {codeTypeAdInt === AD_FOND_COMMERCE && <div className="line special-line">
            <div className="line line-2">
                <Input identifiant="repartitionCa" valeur={repartitionCa} errors={errors} onChange={onChange} placeholder="ex: 70% bar / 30% restaurant">
                    <span>Répartition du chiffre d'affaire</span>
                </Input>
                <Input identifiant="natureBailCommercial" valeur={natureBailCommercial} errors={errors} onChange={onChange} placeholder="ex: Tous commerces sauf restauration">
                    <span>Nature du bail commercial</span>
                </Input>
            </div>

            <div className="line line-3">
                <Input type="cleave" identifiant="resultatN0" valeur={resultatN0} errors={errors} onChange={onChangeCleave}>
                    <span>Résultat Année en cours</span>
                </Input>
                <Input type="cleave" identifiant="resultatN1" valeur={resultatN1} errors={errors} onChange={onChangeCleave}>
                    <span>Résultat Année N-1</span>
                </Input>
                <Input type="cleave" identifiant="resultatN2" valeur={resultatN2} errors={errors} onChange={onChangeCleave}>
                    <span>Résultat Année N-2</span>
                </Input>
            </div>
        </div>}

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
