const {getPointsLabel} = require('./number-formats');

describe('getPointsLabel()', () => {
  it('should return valid label', () => {
    expect(getPointsLabel(0)).toBe('0 taškų');
    expect(getPointsLabel(1)).toBe('1 taškas');
    expect(getPointsLabel(2)).toBe('2 taškai');
    expect(getPointsLabel(9)).toBe('9 taškai');
    expect(getPointsLabel(10)).toBe('10 taškų');
    expect(getPointsLabel(11)).toBe('11 taškų');
    expect(getPointsLabel(12)).toBe('12 taškų');
    expect(getPointsLabel(20)).toBe('20 taškų');
    expect(getPointsLabel(21)).toBe('21 taškas');
  });
});
