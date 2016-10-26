'use strict';

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shared = require('../../config/environment/shared');

var _shared2 = _interopRequireDefault(_shared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exportCfg = _shared2.default[process.env.NODE_ENV || "development"];

exports.index = function (req, res) {
  res.send({
    config: exportCfg,
    api: exportCfg.apiUri[(0, _md2.default)(req.hostname.substring(19))],
    debugWx: false
  });
};
//# sourceMappingURL=config.controller.js.map
