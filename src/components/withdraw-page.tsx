
// Just fixing the specific error line where string | 0 is causing a problem
// We need to convert the amount to a string before using toString()
const amountFormatted = (amount === 0 ? "0" : amount.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
