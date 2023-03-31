import formatNumber from '../../helpers/formatNumber';

describe('FormatNumber helper function', () => {
    it('formats a number', () => {
        expect(formatNumber(1002003)).toBe("1,002,003");
    });
});
