import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import { Button }       from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper   from "@userPages/components/Biens/functions/helper";

import { ReadCard } from "@userComponents/Layout/Read";

const CURRENT_STEP = 8;

export function Step8({ step, errors, onNext, onDraft, onChange, onChangeSelect, onChangeDate, onOpenAside,
                          allOwners, owners, inform, lastname, phone1, email, visiteAt, keysNumber, keysWhere })
{
    console.log(owners)

    let informItems = helper.getItems("informs")

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line contact-line">
            <div className="form-group">
                <label>Propriétaire</label>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <div className="form-group">
                    <Button type="default" onClick={() => onOpenAside("owner-select")}>Sélectionner ou ajouter un propriétaire</Button>
                </div>
                <div className="form-group" />
            </div>

            {/*{itemOwner && <ReadCard elem={itemOwner} displayActions={false} />}*/}
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Contact</label>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <SelectReactSelectize items={informItems} identifiant="inform" valeur={inform} errors={errors}
                                      onChange={(e) => onChangeSelect('inform', e)}>
                    Qui prévenir ?
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

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}
