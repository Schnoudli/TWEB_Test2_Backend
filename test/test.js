
const expect = require('chai');

expect.should();

describe('String', () => {
  it('should replace some characters', () => {
    const name = 'paulnta'.replace('au', 'o').replace('n', 'en');
    name.should.equal('polenta');
  });

  /*
  it('will fail', () => {
    ('1' + '1').should.equal('2');
    // AssertionError [ERR_ASSERTION]: '11' == '2'
  });
  */

  it('will pass', () => {
    (1 + 1).should.equal(2);
  });
});
