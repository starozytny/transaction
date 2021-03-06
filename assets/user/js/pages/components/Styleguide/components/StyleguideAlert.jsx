import React from "react";

import { Alert } from "@dashboardComponents/Tools/Alert";

export function StyleguideAlert () {
    return (
        <section>
            <h2>Alerts</h2>
            <div className="styleguide-items">
                <div className="interactions">
                    <Alert>Default</Alert>
                    <Alert type="reverse">Reverse</Alert>
                    <Alert type="info">Info</Alert>
                    <Alert type="danger">Danger</Alert>
                    <Alert type="warning">Warning</Alert>
                    <Alert title="Title">Default</Alert>
                    <Alert withIcon={false} title="Title">Default</Alert>
                    <Alert withIcon={false}>Default</Alert>
                </div>
            </div>
        </section>
    )
}