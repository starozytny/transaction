import React, { Component } from 'react';
import ReactPaginate      from 'react-paginate';

import { Input, Select } from "@dashboardComponents/Tools/Fields";

export class Pagination extends Component {
    constructor (props) {
        super(props)

        this.state = {
            offset: 0,
            inputPage: 0,
            currentPage: 0,
            perPage: props.perPage !== undefined ? props.perPage : 20,
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleComeback = this.handleComeback.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePerPage = this.handlePerPage.bind(this);
    }

    componentDidMount() {
        sessionStorage.setItem(this.props.sessionName, "0");
    }

    handlePerPage = (perPage) => { this.setState({ perPage }) }

    handleClick = (e) => {
        const { perPage, items, sessionName } = this.props;

        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        if(items !== null){
            this.setState({ currentPage: selectedPage, offset: offset })
            this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
            sessionStorage.setItem(sessionName, selectedPage);
        }
    }

    handleComeback = () => {
        const { perPage, items, sessionName, currentPage } = this.props;

        if(currentPage){
            const selectedPage = localStorage.getItem(sessionName);
            const offset = selectedPage * perPage;

            this.setState({ currentPage: selectedPage, offset: offset })
            this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
        }
    }

    handlePageOne = () => {
        const { perPage, items } = this.props;

        const offset = 0;

        this.setState({ currentPage: 0, offset: offset })
        this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
    }

    handleChange = (e) => {
        const { perPage, items, sessionName } = this.props;

        let selectedPage = 1;
        let offset = selectedPage * perPage;

        if(e.currentTarget.value !== ""){
            selectedPage = parseInt(e.currentTarget.value) - 1;
            offset = selectedPage * perPage;
        }

        if(items !== null){
            this.setState({ inputPage: selectedPage, currentPage: selectedPage, offset: offset })
            this.props.onUpdate(items.slice(offset, offset + parseInt(perPage)))
            sessionStorage.setItem(sessionName, e.currentTarget.value);
        }
    }

    render () {
        const { havePagination, taille } = this.props;
        const { perPage, currentPage, inputPage } = this.state;

        let pageCount = Math.ceil(taille / perPage);

        let content = <>
            <ReactPaginate
                previousLabel={<span className="icon-left-arrow" />}
                nextLabel={<span className="icon-right-arrow" />}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                onPageChange={this.handleClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
                initialPage={parseInt(currentPage)}
                forcePage={parseInt(currentPage)}
            />
            {pageCount > 1 && <div className="input-page">
                <Input value={inputPage} identifant="inputPage" placeholder="Aller à la page.." errors={[]} onChange={this.handleChange} />
            </div>}
        </>

        return <>
            {havePagination && content}
        </>
    }
}

export class TopPagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            perPage: props.perPage,
            errors: []
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (e) => {
        let value = parseInt(e.currentTarget.value);
        this.setState({ [e.currentTarget.name]: value })
        this.props.onPerPage(value)
    }

    render () {
        const { perPage, errors } = this.state;

        let selectItems = [
            { value: 10, label: '10', identifiant: 'perpage-10' },
            { value: 15, label: '15', identifiant: 'perpage-15' },
            { value: 20, label: '20', identifiant: 'perpage-20' },
            { value: 25, label: '25', identifiant: 'perpage-25' },
            { value: 30, label: '30', identifiant: 'perpage-30' },
            { value: 35, label: '35', identifiant: 'perpage-35' },
            { value: 40, label: '40', identifiant: 'perpage-40' },
            { value: 45, label: '45', identifiant: 'perpage-45' },
            { value: 50, label: '50', identifiant: 'perpage-50' },
        ]

        return <div className="sorter-pagination">
            <div className="nbPerPage">
                <div className="line">
                    <Select items={selectItems} identifiant="perPage" valeur={perPage} errors={errors} onChange={this.handleChange}>Nombre de résultats par page</Select>
                </div>
            </div>
        </div>
    }
}