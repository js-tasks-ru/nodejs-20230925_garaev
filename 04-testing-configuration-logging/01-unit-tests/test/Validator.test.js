const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('Проверка аргументов валидатора', ()=> {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      expect(validator.rules).to.have.property('name');
      expect(validator.rules.name).to.have.property('type').and.be.equal('string');
      expect(validator.rules.name).to.have.property('min').to.be.equal(10);
      expect(validator.rules.name).to.have.property('max').to.be.equal(20);

      expect(validator.rules).to.have.property('age');
      expect(validator.rules.age).to.have.property('type').and.be.equal('number');
      expect(validator.rules.age).to.have.property('min').to.be.equal(18);
      expect(validator.rules.age).to.have.property('max').to.be.equal(27);
    });

    it('Валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
      });

      const errors = validator.validate({name: 'BananaBananaBanana', age: 25});
      expect(errors).to.have.length(0);

      const errors1 = validator.validate({name: 'La', age: '25'});
      expect(errors1).to.have.length(2);
      expect(errors1[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors1[0]).to.have.property('error').and.to.be
          .equal('too short, expect 10, got 2');

      expect(errors1[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors1[1]).to.have.property('error').and.to.be
          .equal('expect number, got string');

      const errors2 = validator.validate({age: 29});

      expect(errors2).to.have.length(2);
      expect(errors2[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors2[0]).to.have.property('error').and.to.be
          .equal('expect value, got undefined');

      expect(errors2[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors2[1]).to.have.property('error').and.to.be
          .equal('too big, expect 27, got 29');

      const errors3 = validator.validate({name: 20});
      expect(errors3).to.have.length(2);
      expect(errors3[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors3[0]).to.have.property('error').and.to.be
          .equal('expect string, got number');

      expect(errors3[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors3[1]).to.have.property('error').and.to.be
          .equal('expect value, got undefined');

      const errors4 = validator.validate();
      expect(errors4.length).to.be.equal(1);
      expect(errors4[0]).to.have.property('error').and.be.equal('object is not passed');

      const errors5 = validator.validate({
        name: 'cherrycherrycherrycherrycherrycherrych',
        age: 5,
      });
      expect(errors5.length).to.be.equal(2);
      expect(errors5[0]).to.have.property('field').and.be.equal('name');
      expect(errors5[0]).to.have.property('error').and.be.equal('too long, expect 20, got 38');

      expect(errors5[1]).to.have.property('field').and.be.equal('age');
      expect(errors5[1]).to.have.property('error').and.be.equal('too little, expect 18, got 5');
    });
  });
});
