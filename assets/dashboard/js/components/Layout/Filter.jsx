import React, { Component } from 'react';

export class Filter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: props.filters ? props.filters : []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    // from fo uncheck via toolbar filter checked
    handleChange = (e, from=false) => {
        const { filters } = this.state;

        let value = parseInt(e.currentTarget.value);
        let newFilter;
        if(!from){
            newFilter = (e.currentTarget.checked) ? [...filters, ...[value]] : filters.filter(v => v !== value)
        }else{
            newFilter = filters.filter(v => v !== value)
            document.getElementById(e.currentTarget.dataset.id).click();
        }

        this.setState({filters: newFilter});

        this.props.onGetFilters(newFilter);
    }

    render () {
        const { items, title, icon, width, classes } = this.props;
        const { filters } = this.state;

        let style = null;
        if(width){
            style = { width: width + "px" }
        }

        return <div className={"filter" + (classes ? " " + classes : "")} style={style}>
            <div className="dropdown">
                <div className={`dropdown-btn ${filters.length !== 0 ? "active" : ""}`}>
                    <span>{title ? title : "Filtre"}</span>
                    <span className={"icon-" + (icon ? icon : "filter")} />
                </div>
                <div className="dropdown-items">
                    {items.map((el, index) => {
                        let checked = false;
                        filters.forEach(filter => {
                            if(el.value === filter){
                                checked = true;
                            }
                        })

                        return <div className="item" key={index}>
                            <input type="checkbox" name="filters" id={el.id} value={el.value} defaultChecked={checked} onChange={this.handleChange}/>
                            <label htmlFor={el.id}>{el.label}</label>
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}

export class FilterSelected extends Component {
    render () {
        const { filters, items, itemsFiltersLabel, itemsFiltersId, onChange } = this.props;

        return <div className="filters-items-checked">
            {filters && filters.map(el => {

                let id = itemsFiltersId ? itemsFiltersId[el] : "";
                let label = itemsFiltersLabel ? itemsFiltersLabel[el] : "";

                if(items){
                    items.forEach(item => {
                        if(item.value === el){
                            id = item.id; label = item.label;
                        }
                    })
                }

                return <div className="item" key={el}>
                    <div className="role">
                        <input type="checkbox" name="filters-checked" id={`fcheck-${el}`} data-id={id} value={el} onChange={onChange}/>
                        <label htmlFor={`fcheck-${el}`}>
                            {label}
                            <span className="icon-cancel" />
                        </label>
                    </div>
                </div>
            })}
        </div>
    }
}