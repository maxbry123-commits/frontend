'use strict';

const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const Common = require('../lib/common');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const { expect } = Code;


describe('Common', () => {

    describe('assertOptions', () => {

        it('validates null', () => {

            expect(() => Common.assertOptions()).to.throw('Options must be of type object');
        });
    });

    describe('intersect', () => {

        it('intersects two sets', () => {

            const a = new Set([1, 2, 3]);
            const b = new Set([2, 3, 4]);
            expect(Common.intersect(a, b)).to.equal(new Set([2, 3]));
        });

        it('returns empty set when no intersection', () => {

            const a = new Set([1, 2]);
            const b = new Set([3, 4]);
            expect(Common.intersect(a, b)).to.equal(new Set());
        });
    });
});
