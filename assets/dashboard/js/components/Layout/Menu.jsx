import React, { Component } from 'react';

export class Menu extends Component {
    constructor(props) {
        super();

        this.state = {
            isOpened: false
        }

        this.handleOpenMenu = this.handleOpenMenu.bind();
    }

    componentDidMount () {
        const { menu } = this.props

        let tab = location.pathname.split("/");
        tab = tab.filter(elem => elem !== "");

        let find = false;
        tab.forEach(element => {
            JSON.parse(menu).forEach(el => {
                if(el.dropdown && el.dropdown === true){
                    el.items.forEach(elem => {
                        if(element === elem.name){
                            find = true;
                            this.setState({active: element})
                        }
                    })
                }else{
                    if(element === el.name){
                        find = true;
                        this.setState({active: element})
                    }
                }
            })
        });

        if(!find){
            this.setState({active: 'accueil'})
        }
    }

    handleOpenMenu = () => {
        this.setState(prevState => {
            return { isOpened: !prevState.isOpened }
        })
    }

    render () {
        const { isVertical = false, menu, menuBottom } = this.props
        const { isOpened, active } = this.state

        return <>
            <div className="nav-mobile" onClick={this.handleOpenMenu}>
                <span className={`icon-${ isOpened ? "cancel" : "menu" }`} />
            </div>
            <div className={`nav-body ${isOpened}`}>
                <div className="items">
                    { <MenuItem menu={menu} isVertical={isVertical} active={active} /> }
                </div>
                {menuBottom &&  <div className="items">
                    { <MenuItem menu={menuBottom} isVertical={isVertical} active={active}/> }
                </div>}
            </div>
        </>
    }
}

function MenuItem (props){
    const { menu, isVertical, active } = props

    return (
        JSON.parse(menu).map((el, index) => {
            if(el.dropdown && el.dropdown === true){

                let items = el.items.map((elem, index) => {
                    return <Item key={index} active={active} el={elem} />
                })

                return <div key={index} className="item item-dropdown">
                    <div className="item-dropdown-title">
                        {(isVertical && el.icon) && <span className={`icon-${el.icon}`} />} <span>{el.label} {!isVertical && <span className="icon-right-chevron" />}</span>
                    </div>
                    <div className="item-dropdown-items">
                        <div className="item-dropdown-items-container">
                            {items}
                        </div>
                    </div>
                </div>
            }else{
                return <Item key={index} active={active} el={el} />
            }


        })
    )
}

function Item({ el, active }){
    return (
        <div className="item">
            <a href={el.path} className={ active === el.name ? "active" : "" }>
                {el.icon && <span className={`icon-${el.icon}`} />}
                <span>{el.label}</span>
            </a>
        </div>
    )
}