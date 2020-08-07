/**
 * Recalculates deltas and calculated values helper model
 */
class RecalculateDelta {

    /**
     * Create a new instance for recalculating deltas and calculated values
     * @param uuid UUID to associate this instance with
     * @param start Day to start from
     * @param end Day to stop at
     */
    constructor(uuid, start, end) {
        this.uuid = uuid;
        this.timestampStart = Date.now();
        this.state = "PREPARING";
        this.timestampEnd = null;
        this.startDay = start;
        this.currentDay = start;
        this.endDay = end;
    }

    /**
     * Start processing
     */
    start() { this.state = "PROCESSING INFO - Day " + this.currentDay; }

    /**
     * Switch to calculating delta values
     */
    stage() { this.state = "PROCESSING DELTA - Day " + this.currentDay; }

    /**
     * Switch to the next day
     */
    step() {
        this.currentDay++;
        this.state = "PROCESSING INFO - Day " + this.currentDay;
    }

    /**
     * Mark task as complete
     */
    complete() {
        this.state = "COMPLETE";
        this.timestampEnd = Date.now();
    }

    /**
     * Recalculate Delta Values
     * @param prevData Previous day info record
     * @param curData Current day info record
     * @returns {{}} Recalculated delta values
     */
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

    /**
     * Recalculate calculated info statistics
     * @param prevDay Previous day Info Record
     * @param data Current day Info record
     * @returns {*} Updated info record with calculated statistics updated
     */
    calculateInfo(prevDay, data) {
        data.TotalLocalCase_Day = data.ConfirmedCases_Day + data.ImportedCase_Day;
        data.CumulativeLocal = prevDay.CumulativeLocal + data.TotalLocalCase_Day;
        data.CumulativeDischarged = prevDay.CumulativeDischarged + data.Recovered_Day + data.Deaths_Day;
        data.CumulativeDeaths = prevDay.CumulativeDeaths + data.Deaths_Day;
        data.CumulativeConfirmed = prevDay.CumulativeConfirmed + data.ConfirmedCases_Day;
        data.HospitalizedTotal = data.CumulativeConfirmed - data.CumulativeDischarged - data.CumulativeDeaths - data.HospitalizedOtherArea;
        data.TotalCloseContacts = prevDay.TotalCloseContacts + data.DailyQuarantineOrdersIssued;
        data.Quarantined = data.QUO_Pending + data.QUO_TransferHospital + data.QUO_NonGazettedDorm + data.QUO_GazettedDorm + data.QUO_GovtQuarantinedFacilities + data.QUO_HomeQuarantinedOrder;

        data.LocalLinked = data.CumulativeLocal - data.LocalUnlinked;
        data.Hospital_OtherAreas = data.HospitalizedTotal + data.HospitalizedOtherArea;
        data.HospitalizedStable = data.HospitalizedTotal - data.HospitalizedICU;
        data.CumulativeImported = prevDay.CumulativeImported + data.ImportedCase_Day;
        data.CumulativeRecovered = prevDay.CumulativeRecovered + data.Recovered_Day;
        data.CompletedQuarantine = data.TotalCloseContacts - data.Quarantined;

        return data;
    }
}

module.exports = RecalculateDelta