import React from "react";

import Sort from "@commonComponents/functions/sort";

import { Checkbox }     from "@dashboardComponents/Tools/Fields";
import { FormActions }  from "@userPages/components/Biens/Form/Form";

const CURRENT_STEP = 11;

export function Step11({ step, errors, onDraft, onSubmit, onNext, onChange, allSupports, supports })
{
    let supportsItems = [];
    allSupports.sort(Sort.compareName)
    allSupports.forEach(ne => {
        supportsItems.push({ value: ne.id, label: ne.name, identifiant: "neg-" + ne.id });
    })

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line">
            <Checkbox items={supportsItems} identifiant="supports" valeur={supports} errors={errors} onChange={onChange}>
                Supports *
            </Checkbox>
        </div>

        <FormActions onNext={onNext} onDraft={onDraft} onSubmit={onSubmit} isFinal={true} currentStep={CURRENT_STEP} />
    </div>
}
