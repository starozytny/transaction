import React, { Component } from 'react';
import Sort from "@commonComponents/functions/sort";

import { HelpBubble }      from "@dashboardComponents/Tools/HelpBubble";
import { VisitsMainInfos } from "@dashboardPages/components/Immo/Visits/VisitsItem";

export class LastVisites extends Component {
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
        const { visits, maxResults = 99999 } = this.props;
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

        return <div className="last-visits">
            <div className="items">
                {itemsVisits}
            </div>

            <HelpBubble ref={this.helpBubble} content={contentHelpBubble}>Détails de la visite</HelpBubble>
        </div>
    }
}
