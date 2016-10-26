'use strict';

import md5 from 'md5';

var apiUriDev = {};
apiUriDev[md5('wwww.dev.91songli.cc')] = 'http://apidev.91songli.cc';

var apiUriPro = {};
apiUriPro[md5('91songli.cc')] = 'http://api.91songli.cc';
apiUriPro[md5('wx.songni.cc')] = 'http://api.91songli.cc';
apiUriPro[md5('dalibao.com')] = 'http://api.dalibao.com';

exports = module.exports = {
  development:{//开发版
    uri: 'http://apidev.91songli.cc',
    imgUri:'img.91pintuan.com',
    phtUri:'photo.91pintuan.com',
    phtUriExotic:'http://photo.91pintuan.com',
    component: '5726bf8700bbe21526c4ccbe',
    apiUri: apiUriDev,
    debug:true,
    from:'client'
  },
  production:{//产品版本
    uri: 'http://api.91songli.cc',
    imgUri:'img.91pintuan.com',
    phtUri:'photo.91pintuan.com',
    phtUriExotic:'http://photo.91pintuan.com',
    component: '5581117b5f225e4c401c9259',
    apiUri: apiUriPro,
    debug:false,
    from:'client'
  }
};
