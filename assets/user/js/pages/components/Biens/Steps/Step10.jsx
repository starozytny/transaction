import React from "react";

import { FormActions }  from "@userPages/components/Biens/Form/Form";

const CURRENT_STEP = 10;

export function Step10({ step, errors, onSubmit, onNext, allSupports })
{
    console.log(allSupports)

    return <div className={"step-section" + (step === CURRENT_STEP ? " active" : "")}>
        <div className="line special-line">
            <div className="form-group">
                <label>Supports</label>
            </div>
        </div>

        <FormActions onNext={onNext} onSubmit={onSubmit} isFinal={true} currentStep={CURRENT_STEP} />
    </div>
}