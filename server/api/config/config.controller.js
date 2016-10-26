'use strict';

import md5 from 'md5';
import _ from 'lodash';
import config from '../../config/environment/shared';

var exportCfg = config[process.env.NODE_ENV || "development"];

exports.index = function(req, res) {
  res.send({
    config: exportCfg,
    api: exportCfg.apiUri[md5(req.hostname.substring(19))],
    debugWx: false
  });
};
