import React, {Component} from "react";

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Visits } from "@userPages/components/Biens/Suivi/Visits";

export class Global extends Component {
    render () {
        const { elem, prospects, visits } = this.props;

        return <div className="suivi-global">
            <div className="card">
                <div>
                    <span className="icon-group" />
                    <span>
                        <a href={Routing.generate('user_biens_suivi', {'slug': elem.slug, "ct": "prospects"})}>
                            {prospects.length} prospect{prospects.length > 1 ? "s" : ""}
                        </a>
                    </span>
                </div>
            </div>

            <Visits elem={elem} visits={visits} maxResults={4} />
        </div>
    }
}