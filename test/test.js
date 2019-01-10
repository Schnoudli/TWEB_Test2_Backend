
const expect = require('chai');

expect.should();

describe('String', () => {
  it('should replace some characters', () => {
    const name = 'paulnta'.replace('au', 'o').replace('n', 'en');
    // expect(name).to.equal('polenta');
    name.should.equal('polenta');
  });

  it('will fail', () => {
    // expect('1' + '1').to.equal('2');
    ('1' + '1').should.equal('2');
    // AssertionError [ERR_ASSERTION]: '11' == '2'
  });

  it('will pass', () => {
    (1 + 1).should.equal(2);
  });
});
