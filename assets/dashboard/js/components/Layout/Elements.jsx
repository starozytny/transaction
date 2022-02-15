import React, { Component } from "react";

import { Button } from "@dashboardComponents/Tools/Button";

export function ButtonBack ({ onChangeContext, url = null, text = "Retour à la liste"})
{
    return onChangeContext ? <Button icon="left-arrow" type="reverse" onClick={() => onChangeContext("list")}>{text}</Button>
        :  <Button element="a" icon="left-arrow" type="reverse" onClick={url}>{text}</Button>
}

export class FormLayout extends Component{
    render() {
        const { onChangeContext, children, form, url = null, text = "Retour à la liste" } = this.props;

        return <div>
            <div className="toolbar">
                <div className="item">
                    <ButtonBack onChangeContext={onChangeContext} url={url} text={text} />
                </div>
            </div>

            <div className="form">
                <h2>{children}</h2>
                {form}
            </div>
        </div>
    }
}

export function Back ({ onChangeContext, url = null, text = "Retour" }) {
    return <div className="toolbar">
        <div className="item">
            <ButtonBack onChangeContext={onChangeContext} url={url} text={text} />
        </div>
    </div>
}