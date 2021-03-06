import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";

import helper   from "@userPages/components/Biens/functions/helper";

import { ReadCard } from "@userComponents/Layout/Read";

const CURRENT_STEP = 9;

export function Step9({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeDate, onOpenAside, onSelectOwner,
                         owners, inform, lastname, phone1, email, visiteAt, keysNumber, keysWhere })
{
    let informItems = helper.getItems("informs");

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line contact-line">
            <div className="form-group">
                <label>Propriétaire(s)</label>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <div className="form-group">
                    <Button type="default" outline={true} onClick={() => onOpenAside("owner-select")}>Sélectionner ou ajouter un propriétaire</Button>
                </div>
                <div className="form-group" />
            </div>

            <div className="owners">
                {owners.map((owner, index) => {
                    if(owner !== null){
                        let actions = <div className="actions">
                            <ButtonIcon icon="cancel" onClick={() => onSelectOwner(owner)} text="Enlever" />
                        </div>

                        return <ReadCard elem={owner} displayActions={false} actions={actions} key={index} />
                    }
                })}
            </div>
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Confidentiel</label>
            </div>
            <div className="line line-3">
                <DatePick identifiant="visiteAt" valeur={visiteAt} errors={errors}
                          onChange={(e) => onChangeDate("visiteAt", e)}>
                    Visite à partir de quelle date
                </DatePick>
                <Input valeur={keysNumber} identifiant="keysNumber" errors={errors} onChange={onChange} type="number">
                    Nombre de clés
                </Input>
                <Input valeur={keysWhere} identifiant="keysWhere" errors={errors} onChange={onChange} placeholder="A récupérer auprès de..">
                    Où trouver les clés
                </Input>
            </div>
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Contact à afficher sur l'annonce</label>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <SelectReactSelectize items={informItems} identifiant="inform" valeur={inform} errors={errors}
                                      onChange={(e) => onChangeSelect('inform', e)}>
                    Qui contacter ?
                </SelectReactSelectize>
                <div className="form-group" />
            </div>
            {inform === 3 && <div className="line line-3">
                <Input identifiant="lastname" valeur={lastname} errors={errors} onChange={onChange}>
                    <span>Nom</span>
                </Input>
                <Input identifiant="phone1" valeur={phone1} errors={errors} onChange={onChange} type="number">
                    <span>Téléphone</span>
                </Input>
                <Input identifiant="email" valeur={email} errors={errors} onChange={onChange} type="email">
                    <span>Email</span>
                </Input>
            </div>}
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
