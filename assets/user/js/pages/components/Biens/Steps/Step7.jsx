import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Alert } from "@dashboardComponents/Tools/Alert";
import { Aside } from "@dashboardComponents/Tools/Aside";
import { FormActions } from "@userPages/components/Biens/Form/Form";

import Sanitaze from "@commonComponents/functions/sanitaze";
import Sort     from "@commonComponents/functions/sort";

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

export function Step7({ step, onChange, onOpenAside, onNext, errors, allOwners, owner, tenants })
{
    let itemOwner = null;
    if(owner){
        allOwners.forEach(ow => {
            if(ow.id === owner){
                itemOwner = ow;
            }
        })
    }

    return <div className={"step-section" + (step === 7 ? " active" : "")}>
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

        <FormActions onNext={onNext} currentStep={7} />
    </div>
}