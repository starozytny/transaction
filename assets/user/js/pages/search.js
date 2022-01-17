import "../../css/pages/search.scss";

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from "react";
import { render } from "react-dom";
import { Searchs } from "@dashboardPages/components/Immo/Searchs/Searchs";

Routing.setRoutingData(routes);

let el = document.getElementById("list-searchs");
if(el){
    render(<Searchs {...el.dataset} isClient={true} />, el)
}