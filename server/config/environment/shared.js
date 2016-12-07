'use strict';

import md5 from 'md5';

var apiUri = {};
//pro
apiUri[md5('91songli.cc')] = 'http://api.91songli.cc';
apiUri[md5('91songli.com')] = 'http://api.91songli.com';
apiUri[md5('wx.songni.cc')] = 'http://api.91songli.cc';
apiUri[md5('dalibao.com')] = 'http://api.dalibao.com';
//dev
apiUri[md5('dev.91songli.cc')] = 'http://apidev.91songli.cc';
apiUri[md5('dev.songni.cc')] = 'http://apidev.91songli.cc';

exports = module.exports = {
  development:{//开发版
    uri: 'http://apidev.91songli.cc',
    imgUri: 'img.91pintuan.com',
    phtUri: 'photo.91pintuan.com',
    phtUriExotic: 'http://photo.91pintuan.com',
    component: '5726bf8700bbe21526c4ccbe',
    apiUri: apiUri,
    debug: true,
    from: 'client'
  },
  production: {//产品版本
    uri: 'http://api.91songli.cc',
    imgUri: 'img.91pintuan.com',
    phtUri: 'photo.91pintuan.com',
    phtUriExotic: 'http://photo.91pintuan.com',
    component: '5581117b5f225e4c401c9259',
    apiUri: apiUri,
    debug: false,
    from: 'client'
  }
};
