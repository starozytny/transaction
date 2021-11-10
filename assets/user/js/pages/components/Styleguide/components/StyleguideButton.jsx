import React from "react";

import { Button, ButtonIcon } from "@dashboardComponents/Tools/Button";

export function StyleguideButton () {
    return (
        <section>
            <h2>Boutons</h2>
            <div className="styleguide-items">
                <div className="interactions">
                    <Button>Default</Button>
                    <Button>Active</Button>
                    <Button>Disabled</Button>
                </div>
            </div>

            <div className="styleguide-items">
                <div className="interactions">
                    <Button type="default">Default</Button>
                    <Button type="primary">Primary</Button>
                    <Button type="danger">Danger</Button>
                    <Button type="warning">Warning</Button>
                    <Button type="success">Success</Button>
                    <Button type="default" icon="padlock">Default</Button>

                    <ButtonIcon icon="heart">Modifier</ButtonIcon>
                    <ButtonIcon icon="heart" text="Default" />
                </div>
            </div>

            <div className="styleguide-items">
                <div className="interactions">
                    <Button outline={true} type="default">Default</Button>
                    <Button outline={true}>Primary</Button>
                    <Button outline={true} type="danger">Danger</Button>
                    <Button outline={true} type="warning">Warning</Button>
                    <Button outline={true} type="success">Success</Button>
                    <Button outline={true} type="default" icon="padlock">Default</Button>
                </div>
            </div>
        </section>
    )
}