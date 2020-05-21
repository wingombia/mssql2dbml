const P = require('parsimmon');
const BP = require('../base_parsers');
const CP = require('../composite_parsers');
const { makeNode } = require('../utils');

const Lang = P.createLanguage({
  ColumnIndex: (r) => P.seqMap(
    BP.KeywordIndex,
    CP.Identifier,
    CP.KeywordClusteredOrNon.fallback(null),
    // eslint-disable-next-line no-unused-vars
    (_keyword, columnName, _clustered) => {
      return {
        type: 'index',
        value: {
          type: 'btree',
          columns: [
            {
              name: columnName,
              type: 'column',
            },
          ],
        },
      };
    },
  ).thru(makeNode()).skip(r.USIndexOptions),

  USIndexOptions: (r) => P.alt(r.WithIndexOption, r.ColumnIndexFilestream, r.OnIndexOption).many(),

  WithIndexOption: () => P.seq(BP.KeywordWith, CP.OptionList),
  OnIndexOption: () => P.seq(BP.KeywordOn, P.alt(CP.Identifier, CP.Function)),
  ColumnIndexFilestream: () => P.seq(BP.KeywordFilestream_On, CP.Identifier),
});
module.exports = {
  pColumnIndex: Lang.ColumnIndex,
  pUSIndexOptions: Lang.USIndexOptions,
};