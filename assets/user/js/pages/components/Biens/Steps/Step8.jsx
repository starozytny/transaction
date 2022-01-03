import React from "react";

import { Input, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";
import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import { Button }       from "@dashboardComponents/Tools/Button";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper   from "@userPages/components/Biens/helper";

import {
    OwnerContact,
    OwnerMainInfos,
    OwnerNegotiator,
} from "@dashboardPages/components/Immo/Owners/OwnersItem";
import {
    TenantContact,
    TenantMainInfos,
    TenantNegotiator
} from "@dashboardPages/components/Immo/Tenants/TenantsItem";

const CURRENT_STEP = 8;

export function Step8({ step, onChange, onChangeSelect, onChangeDate, onOpenAside, onNext, errors, allOwners,
                          owner, tenants,
                          inform, lastname, phone1, email, visiteAt, visiteTo, keysNumber, keysWhere })
{
    let itemOwner = null;
    if(owner){
        allOwners.forEach(ow => {
            if(ow.id === owner){
                itemOwner = ow;
            }
        })
    }

    let informItems = helper.getItems("informs")

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line contact-line">
            <div className="form-group">
                <label>Propriétaire</label>

                <Button type="default" onClick={() => onOpenAside("owner-select")}>Sélectionner/ajouter un propriétaire</Button>

                {itemOwner && <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Propriétaire</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                        <div className="col-4 actions" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">
                                            <OwnerMainInfos elem={itemOwner} />
                                        </div>

                                        <div className="col-2">
                                            <OwnerContact elem={itemOwner} />
                                        </div>

                                        <div className="col-3">
                                            <OwnerNegotiator elem={itemOwner} />
                                        </div>
                                        <div className="col-4 actions">
                                            <div className="sub">Sélectionné</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>

        <div className="line special-line contact-line">
            <div className="form-group">
                <label>Locataire(s)</label>

                <Button type="default" onClick={() => onOpenAside("tenant-select")}>Sélectionner/ajouter un locataire</Button>

                {tenants.length !== 0 && <div className="items-table">
                    <div className="items items-default">
                        <div className="item item-header">
                            <div className="item-content">
                                <div className="item-body">
                                    <div className="infos infos-col-4">
                                        <div className="col-1">Locataire</div>
                                        <div className="col-2">Contact</div>
                                        <div className="col-3">Négociateur</div>
                                        <div className="col-4 actions" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {tenants.map(tenant => {
                            return <div className="item" key={tenant.id}>
                                <div className="item-content">
                                    <div className="item-body">
                                        <div className="infos infos-col-4">
                                            <div className="col-1">
                                                <TenantMainInfos elem={tenant} />
                                            </div>

                                            <div className="col-2">
                                                <TenantContact elem={tenant} />
                                            </div>

                                            <div className="col-3">
                                                <TenantNegotiator elem={tenant} />
                                            </div>
                                            <div className="col-4 actions">
                                                <div className="sub">Sélectionné</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>}
            </div>
        </div>

        <div className="line special-line">
            <div className="form-group">
                <label>Confidentiel</label>
            </div>
            <div className="line">
                <SelectReactSelectize items={informItems} identifiant="inform" valeur={inform} errors={errors}
                                      onChange={(e) => onChangeSelect('inform', e)}>
                    Qui prévenir ?
                </SelectReactSelectize>
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
            <div className="line" />
            <div className="line line-2">
                <div className="form-group">
                    <div className="line line-2">
                        <DatePick identifiant="visiteAt" valeur={visiteAt} errors={errors}
                                  onChange={(e) => onChangeDate("visiteAt", e)}>
                            Date de la visite
                        </DatePick>
                        <Input valeur={visiteTo} identifiant="visiteTo" errors={errors} onChange={onChange}>
                            Lieu de la visite
                        </Input>
                    </div>
                </div>

                <div className="form-group" />
            </div>
            <div className="line line-2">
                <div className="form-group">
                    <div className="line line-2">
                        <Input valeur={keysNumber} identifiant="keysNumber" errors={errors} onChange={onChange} type="number">
                            Nombre de clés
                        </Input>
                        <Input valeur={keysWhere} identifiant="keysWhere" errors={errors} onChange={onChange}>
                            Où trouver les clés
                        </Input>
                    </div>
                </div>

                <div className="form-group" />
            </div>
        </div>

        <FormActions onNext={onNext} currentStep={CURRENT_STEP} />
    </div>
}