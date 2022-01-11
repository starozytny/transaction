import React from "react";

import { Input, Radiobox, SelectReactSelectize } from "@dashboardComponents/Tools/Fields";

import { DatePick }     from "@dashboardComponents/Tools/DatePicker";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

import helper from "@userPages/components/Biens/helper";

const CURRENT_STEP = 4;

export function Step4({ step, errors, onNext, onDraft, onChange, onChangeSelect })
{
    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line">
            <div className="form-group">
                <label>Les pièces</label>
            </div>
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} currentStep={CURRENT_STEP} />
    </div>
}