function changeSelectNegotiator (self, negotiator, name, e) {
    let nego = negotiator;
    if(name === "society" || name === "agency"){
        if(e === undefined){
            nego = "";
            let label = document.querySelector("label[for='negotiator'] + .react-selectize .simple-value > span");
            if(label){
                label.innerHTML = "";
            }
        }
    }

    if(name !== "negotiator"){
        self.setState({ [name]: e !== undefined ? e.value : "", negotiator: nego })
    }else{
        self.setState({ [name]: e !== undefined ? e.value : ""})
    }
}

module.exports = {
    changeSelectNegotiator
}