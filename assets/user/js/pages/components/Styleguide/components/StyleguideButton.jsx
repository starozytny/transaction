import React from "react";

import { Button, ButtonDropdown,
    ButtonIcon, ButtonIconDropdown } from "@dashboardComponents/Tools/Button";

export function StyleguideButton () {
    let items = [
        {data: <a href="/">Link 1</a>},
        {data: <a href="/">Link 2</a>},
        {data: <a href="/">Link 3</a>},
        {data: <div>Div 1</div>},
    ]
    return (
        <section>
            <h2>Boutons</h2>
            <div className="styleguide-items">
                <div className="interactions">
                    <Button type="default">Default</Button>
                    <Button type="color0">Color0</Button>
                    <Button type="primary">Primary</Button>
                    <Button type="danger">Danger</Button>
                    <Button type="warning">Warning</Button>
                    <Button type="success">Success</Button>
                    <Button type="reverse">Cancel</Button>
                    <Button type="default" icon="heart">Default</Button>

                    <ButtonIcon icon="heart">Modifier</ButtonIcon>
                    <ButtonIcon icon="heart" text="Default" />
                </div>
            </div>

            <div className="styleguide-items">
                <div className="interactions">
                    <Button outline={true} type="default">Default</Button>
                    <Button outline={true} type="color0">Color0</Button>
                    <Button outline={true} type="primary">Primary</Button>
                    <Button outline={true} type="danger">Danger</Button>
                    <Button outline={true} type="warning">Warning</Button>
                    <Button outline={true} type="success">Success</Button>
                    <Button outline={true} type="default" icon="heart">Default</Button>
                </div>
            </div>

            <div className="styleguide-items">
                <div className="interactions">
                    <ButtonDropdown type="default" icon="padlock" items={items}>Dropdown</ButtonDropdown>
                    <ButtonIconDropdown icon="pencil" items={items}>Modifier</ButtonIconDropdown>
                    <ButtonIconDropdown icon="pencil" text="Default" items={items} />
                </div>
            </div>
        </section>
    )
}