import React, { Component } from "react";

import Routing  from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonComponents/functions/sort";

import { HelpBubble } from "@dashboardComponents/Tools/HelpBubble";

import { VisitsMainInfos } from "@dashboardPages/components/Immo/Visits/VisitsItem";

export class Visits extends Component {
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
        const { elem, visits, maxResults = 99999 } = this.props;
        const { visit } = this.state;

        visits.sort(Sort.compareAgEventStartAt)
        let totalVisits = 0;
        let itemsVisits = [];
        visits.forEach(visit => {
            if(visit.agEvent.status === 1){
                totalVisits++;

                if(totalVisits < maxResults){
                    itemsVisits.push(<div className="item" onClick={() => this.handleOpenHelp(visit)} key={visit.id}>
                        <VisitsMainInfos havePersons={false} inline={false} event={visit.agEvent} persons={visit.agEvent.persons}/>
                        <div className="item-details">Voir le details</div>
                    </div>)
                }
            }
        })

        let contentHelpBubble = visit ? <VisitsMainInfos havePersons={true} inline={false} event={visit.agEvent} persons={visit.agEvent.persons}/> : null;

        return <>
            {elem && <div className="card">
                <div>
                    <span className="icon-calendar" />
                    <span>
                        <a href={Routing.generate('user_biens_suivi', {'slug': elem.slug, "ct": "visites"})}>
                            {totalVisits} visite{totalVisits > 1 ? "s" : ""}
                        </a>
                    </span>
                </div>
            </div>}

            <div className="global-visits">
                {itemsVisits}
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Détails de la visite</HelpBubble>
        </>
    }
}