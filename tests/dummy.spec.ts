import {expect} from 'chai';
import * as unit from '@src/dummy';

describe('module:dummy', () => {
    describe('.helloWorld', () => {
        it('should return a greeting', () => {
            expect(unit.helloWorld()).to.equal('Hello world!');
        });
    });
});
