class RecalculateDelta {

    constructor(uuid, start, end) {
        this.uuid = uuid;
        this.timestampStart = Date.now();
        this.state = "PREPARING";
        this.timestampEnd = null;
        this.startDay = start;
        this.currentDay = start;
        this.endDay = end;
    }

    start() { this.state = "PROCESSING - Day " + this.currentDay; }
    step() {
        this.currentDay++;
        this.state = "PROCESSING - Day " + this.currentDay;
    }
    complete() {
        this.state = "COMPLETE";
        this.timestampEnd = Date.now();
    }
    
    recalculate(prevData, curData) {
        // Match confirmaddstats.pug
        let delta = {}
        delta.dConfirmedCases_Day = curData.ConfirmedCases_Day - prevData.ConfirmedCases_Day;
        delta.dImportedCase_Day = curData.ImportedCase_Day - prevData.ImportedCase_Day;
        delta.dTotalLocalCase_Day = curData.TotalLocalCase_Day - prevData.TotalLocalCase_Day;
        delta.dLocalLinked = curData.LocalLinked - prevData.LocalLinked;
        delta.dLocalUnlinked = curData.LocalUnlinked - prevData.LocalUnlinked;
        delta.dHospital_OtherAreas = curData.Hospital_OtherAreas - prevData.Hospital_OtherAreas;
        delta.dHospitalizedTotal = curData.HospitalizedTotal - prevData.HospitalizedTotal;
        delta.dHospitalizedStable = curData.HospitalizedStable - prevData.HospitalizedStable;
        delta.dHospitalizedICU = curData.HospitalizedICU - prevData.HospitalizedICU;
        delta.dHospitalizedOtherArea = curData.HospitalizedOtherArea - prevData.HospitalizedOtherArea;
        delta.dRecovered_Day = curData.Recovered_Day - prevData.Recovered_Day;
        delta.dDeaths_Day = curData.Deaths_Day - prevData.Deaths_Day;
        delta.dCumulativeConfirmed = curData.CumulativeConfirmed - prevData.CumulativeConfirmed;
        delta.dCumulativeImported = curData.CumulativeImported - prevData.CumulativeImported;
        delta.dCumulativeLocal = curData.CumulativeLocal - prevData.CumulativeLocal;
        delta.dCumulativeRecovered = curData.CumulativeRecovered - prevData.CumulativeRecovered;
        delta.dCumulativeDeaths = curData.CumulativeDeaths - prevData.CumulativeDeaths;
        delta.dCumulativeDischarged = curData.CumulativeDischarged - prevData.CumulativeDischarged;
        delta.dDailyQuarantineOrdersIssued = curData.DailyQuarantineOrdersIssued - prevData.DailyQuarantineOrdersIssued;
        delta.dTotalCloseContacts = curData.TotalCloseContacts - prevData.TotalCloseContacts;
        delta.dQuarantined = curData.Quarantined - prevData.Quarantined;
        delta.dCompletedQuarantine = curData.CompletedQuarantine - prevData.CompletedQuarantine;
        delta.dQUO_Pending = curData.QUO_Pending - prevData.QUO_Pending;
        delta.dQUO_TransferHospital = curData.QUO_TransferHospital - prevData.QUO_TransferHospital;
        delta.dQUO_NonGazettedDorm = curData.QUO_NonGazettedDorm - prevData.QUO_NonGazettedDorm;
        delta.dQUO_GazettedDorm = curData.QUO_GazettedDorm - prevData.QUO_GazettedDorm;
        delta.dQUO_GovtQuarantinedFacilities = curData.QUO_GovtQuarantinedFacilities - prevData.QUO_GovtQuarantinedFacilities;
        delta.dQUO_HomeQuarantinedOrder = curData.QUO_HomeQuarantinedOrder - prevData.QUO_HomeQuarantinedOrder;
        return delta;
    }
}

module.exports = RecalculateDelta