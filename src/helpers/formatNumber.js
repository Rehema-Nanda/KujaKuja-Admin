/**
 * Formats a number by adding a comma after every 3 digits
 *
 * @param {Number} number
 */
const formatNumber = (number) => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export default formatNumber;
