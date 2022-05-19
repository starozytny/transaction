import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonComponents/functions/sort";

export class Global extends Component {
    render () {
        const { elem, suivis, visits, onChangeContext, isFromListBien = false } = this.props;

        visits.sort(Sort.compareAgEventStartAt)

        let totalVisits = 0;
        visits.forEach(visit => {
            if(visit.agEvent.status === 1){
                totalVisits++;
            }
        })

        return <div className="suivi-global">
            <div className="cards">
                <a className="card"
                   href={!isFromListBien ? Routing.generate('user_biens_suivi', {'slug': elem.slug, "ct": "rapprochements"}) : "#"}
                   onClick={isFromListBien ? () => onChangeContext("rapprochements") : null}
                >
                    <div className="card-header">
                        <div className="icon">
                            <span className="icon-group" />
                        </div>
                        <div className="title">Rapprochements</div>
                    </div>
                    <div className="card-body">
                        <div className="number">{suivis.length}</div>
                    </div>
                </a>

                <a className="card"
                   href={!isFromListBien ? Routing.generate('user_biens_suivi', {'slug': elem.slug, "ct": "visites"}) : "#"}
                   onClick={isFromListBien ? () => onChangeContext("visites") : null}
                >
                    <div className="card-header">
                        <div className="icon">
                            <span className="icon-calendar" />
                        </div>
                        <div className="title">Visites</div>
                    </div>
                    <div className="card-body">
                        <div className="number">{totalVisits}</div>
                    </div>
                </a>
            </div>
        </div>
    }
}
