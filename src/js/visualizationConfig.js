import colors from '../style/colors.scss';

/* alternatives:
  locationSymbol: './src/img/circle-orange.svg',
  locationColor: colors.orange,
  locationSymbol: './src/img/circle-blue.svg',
  locationColor: colors.cyan,
 */

export default {
  allLocationsSymbol: './src/img/circle-blue.svg',
  allLocationsColor: colors.cyan,
  minCount: 1,
  maxCount: 3,
  minSize: 20,
  maxSize: 40,
  getLocationSize(count) {
    return (this.maxSize - this.minSize) * (count - this.minCount) / (this.maxCount - this.minCount) + this.minSize;
  }
};