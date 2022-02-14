import "../../css/pages/setting.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { SettingsBiens } from "@userPages/components/Settings/Biens/SettingsBiens";

Routing.setRoutingData(routes);

let el = document.getElementById("settings-biens");
if(el){
    render(<SettingsBiens {...el.dataset} isClient={true} />, el)
}