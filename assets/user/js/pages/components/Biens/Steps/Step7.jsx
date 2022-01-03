import React from "react";

import { Input } from "@dashboardComponents/Tools/Fields";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";
import { Alert } from "@dashboardComponents/Tools/Alert";
import { Aside } from "@dashboardComponents/Tools/Aside";

import Sanitaze from "@commonComponents/functions/sanitaze";
import Sort     from "@commonComponents/functions/sort";
import { Owners } from "@dashboardPages/components/Immo/Owners/Owners";

export function Step7({ step, onChange, onOpenAside, onNext, errors })
{
    return <div className={"step-section" + (step === 7 ? " active" : "")}>
        <div className="line special-line">
            <div className="form-group">
                <label>Propriétaire</label>

                <div className="form-group">
                    <Button type="default" onClick={() => onOpenAside("owner-select")}>Sélectionner/ajouter un propriétaire</Button>
                </div>
            </div>
        </div>

        <div className="line line-buttons">
            <Button type="reverse" onClick={() => onNext(6, 7)}>Etape précédente</Button>
            <div/>
            <div className="btns-submit">
                <Button type="warning">Enregistrer le brouillon</Button>
                <Button onClick={() => onNext(8)}>Etape suivante</Button>
            </div>
        </div>
    </div>
}