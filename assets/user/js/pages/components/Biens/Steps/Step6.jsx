import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

import { Alert }    from "@dashboardComponents/Tools/Alert";
import {Button, ButtonIcon} from "@dashboardComponents/Tools/Button";
import {Selector} from "@dashboardComponents/Layout/Selector";

export function Step6({ step, onChange, onNext, errors,
                      photos })
{
    return <div className={"step-section" + (step === 6 ? " active" : "")}>
        <div className="line-infos">
            <Alert iconCustom="exclamation" type="reverse">
                Les photos peuvent avoir un poids maximum de 1Mb  afin de ne pas réduire le temps de chargement. <br/>
                Pour réduire le poids de vos photos, vous pouvez redimensionner
                la taille et/ou utiliser le compresseur en ligne suivant : <a href="https://tinyjpg.fr">tinyjpg.fr</a>
            </Alert>
        </div>
        <div className="line special-line">
            <div className="form-group">
                <label>Photos</label>
            </div>
            <div className="items-table">
                <div className="items items-default">
                    <div className="item item-header">
                        <div className="item-content">
                            <div className="item-body item-body-image">
                                <div className="infos infos-col-5">
                                    <div className="col-1">Ordre</div>
                                    <div className="col-2">Photo</div>
                                    <div className="col-3">Légende</div>
                                    <div className="col-4">Taille</div>
                                    <div className="col-5 actions">Actions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="line line-3">
                <div className="form-group" />
                <div className="form-group" />
                <Input type="file" identifiant="photos" isMultiple={true} valeur={photos} errors={errors} onChange={onChange}>
                    <span>Photos</span>
                </Input>
            </div>
        </div>

        <div className="line line-buttons">
            <Button type="reverse" onClick={() => onNext(5, 6)}>Etape précédente</Button>
            <div/>
            <div className="btns-submit">
                <Button type="warning">Enregistrer le brouillon</Button>
                <Button onClick={() => onNext(7)}>Etape suivante</Button>
            </div>
        </div>
    </div>
}