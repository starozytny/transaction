import React, {Component} from "react";

import Sort from "@commonComponents/functions/sort";

import { HelpBubble } from "@dashboardComponents/Tools/HelpBubble";

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
        const { elem, prospects, visits } = this.props;
        const { visit } = this.state;

        visits.sort(Sort.compareAgEventStartAt)
        let totalVisits = 0; let itemsVisits = [];
        visits.forEach(visit => {
            if(visit.agEvent.status === 1){
                totalVisits++;

                if(totalVisits < 4){
                    itemsVisits.push(<div className="item" onClick={() => this.handleOpenHelp(visit)} key={visit.id}>
                        <VisitsMainInfos havePersons={false} inline={false} event={visit.agEvent} persons={visit.agEvent.persons}/>
                        <div className="item-details">Voir le details</div>
                    </div>)
                }
            }
        })

        let contentHelpBubble = visit ? <VisitsMainInfos havePersons={true} inline={false} event={visit.agEvent} persons={visit.agEvent.persons}/> : null;

        return <div className="suivi-global">
            <div className="card">
                <div>
                    <span className="icon-group" />
                    <span>{prospects.length} prospect{prospects.length > 1 ? "s" : ""}</span>
                </div>
            </div>
            <div className="card">
                <div>
                    <span className="icon-calendar" />
                    <span>{totalVisits} visite{totalVisits > 1 ? "s" : ""}</span>
                </div>
            </div>

            <div className="global-visits">
                {itemsVisits}
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Détails de la visite</HelpBubble>
        </div>
    }
}