import "../../css/pages/setting.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { SettingsBiens } from "@dashboardPages/components/Immo/Settings/Biens/SettingsBiens";
import {GenerauxFormulaire} from "@dashboardPages/components/Immo/Settings/Generaux/GenerauxForm";

Routing.setRoutingData(routes);

let el = document.getElementById("settings-biens");
if(el){
    render(<SettingsBiens {...el.dataset} isClient={true} />, el)
}

el = document.getElementById("settings-generaux");
if(el){
    render(<div className="main-content">
        <GenerauxFormulaire type="update"
                            element={JSON.parse(el.dataset.element)}
                            negotiators={JSON.parse(el.dataset.negotiators)} />
    </div>, el)
}