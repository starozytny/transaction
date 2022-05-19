const axios = require("axios");
const Swal = require("sweetalert2");
const Routing = require("@publicFolder/bundles/fosjsrouting/js/router.min.js");

const SwalOptions = require("@commonComponents/functions/swalOptions");
const Formulaire = require("@dashboardComponents/functions/Formulaire");


function setEndMandat(self, startAt, nbMonthMandat)
{
    if(startAt !== "" && nbMonthMandat !== "" && parseInt(nbMonthMandat) !== 0){
        let nValue = new Date(startAt);
        let nEndAt = nValue.setMonth(startAt.getMonth() + parseInt(nbMonthMandat));

        self.setState({ endAt: new Date(nEndAt) })
    }
}

function changeStatus (self, url, elem, status)
{
    let title = "";
    switch (parseInt(status)){
        case 1:
            title = "Transférer ce bien en actif ?";
            break;
        case 0:
            title = elem.status === 2 ? "Désarchiver ce bien ?" : "Transférer ce bien en inactif ?";
            break;
        case 3:
            title = "Le bien restera en brouillon. Pour le transférer en actif, veuillez passer par le formulaire d'édition complet.";
            break;
        default:
            title = "Transférer ce bien aux archives ?";
            break;
    }

    Swal.fire(SwalOptions.options(title, "" ))
        .then((result) => {
            if (result.isConfirmed) {
                Formulaire.loader(true);
                axios({ method: "PUT", url: Routing.generate(url, {'id': elem.id, 'status': status}), data: {} })
                    .then(function (response) {
                        if(self.props.onUpdateList){
                            Formulaire.loader(false);
                            self.props.onUpdateList(response.data, "update");
                        }else{
                            location.reload();
                        }
                    })
                    .catch(function (error) {
                        Formulaire.loader(false);
                        Formulaire.displayErrors(this, error)
                    })
                ;
            }
        })
    ;
}

module.exports = {
    setEndMandat,
    changeStatus
}
