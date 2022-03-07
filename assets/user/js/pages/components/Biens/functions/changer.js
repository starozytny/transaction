function setEndMandat(self, startAt, nbMonthMandat) {
    if(startAt !== "" && nbMonthMandat !== "" && parseInt(nbMonthMandat) !== 0){
        let nValue = new Date(startAt);
        let nEndAt = nValue.setMonth(startAt.getMonth() + parseInt(nbMonthMandat));

        self.setState({ endAt: new Date(nEndAt) })
    }
}

module.exports = {
    setEndMandat
}
