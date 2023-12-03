import moment from "moment";

class DateHelper {
  constructor() {
    this.today = moment();
  }

  getNextWeekDates() {
    const nextWeekStart = this.today.clone().startOf("isoWeek").add(7, "days");
    const nextWeekEnd = this.today.clone().endOf("isoWeek").add(7, "days");

    return {
      start: nextWeekStart.format("YYYY-MM-DD"),
      end: nextWeekEnd.format("YYYY-MM-DD"),
    };
  }

  isDateInWeek(date, weekDates) {
    return moment(date).isBetween(weekDates.start, weekDates.end, null, "[]");
  }

  getDatesInRange(start, end) {
    const startDate = moment(start);
    const endDate = moment(end);
    const dates = [];

    while (startDate.isSameOrBefore(endDate)) {
      dates.push(startDate.format("YYYY-MM-DD"));
      startDate.add(1, "day");
    }

    return dates;
  }
}

export default DateHelper;
