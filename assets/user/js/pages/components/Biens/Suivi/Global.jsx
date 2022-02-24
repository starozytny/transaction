import React, { Component } from 'react';

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonComponents/functions/sort";

import { HelpBubble }      from "@dashboardComponents/Tools/HelpBubble";
import { VisitsMainInfos } from "@dashboardPages/components/Immo/Visits/VisitsItem";

export class Global extends Component {
    constructor(props) {
        super();

        this.state = {
            visit: null
        }

        this.helpBubble = React.createRef();

        this.handleOpenHelp = this.handleOpenHelp.bind(this);
    }

    handleOpenHelp = (visit) => {
        this.setState({ visit })
        this.helpBubble.current.handleOpen();
    }

    render () {
        const { elem, suivis, visits, maxResults = 99999 } = this.props;
        const { visit } = this.state;

        visits.sort(Sort.compareAgEventStartAt)

        let totalVisits = 0;
        let itemsVisits = [];
        visits.forEach(visit => {
            if(visit.agEvent.status === 1){
                totalVisits++;

                if(totalVisits < maxResults){
                    itemsVisits.push(<div className="visite" onClick={() => this.handleOpenHelp(visit)} key={visit.id}>
                        <VisitsMainInfos havePersons={false} haveBubble={true} event={visit.agEvent} persons={visit.agEvent.persons}/>
                    </div>)
                }
            }
        })

        let contentHelpBubble = visit ? <VisitsMainInfos havePersons={true} inline={false} event={visit.agEvent} persons={visit.agEvent.persons}/> : null;

        return <div className="suivi-global">
            {elem && <div className="cards">
                <a className="card" href={Routing.generate('user_biens_suivi', {'slug': elem.slug, "ct": "rapprochements"})}>
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

                <a className="card" href={Routing.generate('user_biens_suivi', {'slug': elem.slug, "ct": "visites"})}>
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
            </div>}

            <div className="global-visits">
                {itemsVisits}
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Détails de la visite</HelpBubble>
        </div>
    }
}