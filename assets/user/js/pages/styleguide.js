import "../../css/pages/styleguide.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Styleguide } from "./components/Styleguide/Styleguide";

Routing.setRoutingData(routes);

let el = document.getElementById("styleguide");
if(el){
    render(<Styleguide />, el)
}
