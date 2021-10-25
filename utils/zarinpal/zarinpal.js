const { default: Axios } = require('axios');
const appConfig = require('./appConfig');

module.exports = {
  request: function (zpamount, zpemail, zpphone, zpdesc, zppid, zpcallback) {
    var url = 'https://api.zarinpal.com/pg/v4/payment/request.json';
    var args = {
      merchant_id: appConfig.zarinpalMerchant,
      amount: zpamount,
      description: zpdesc,
      email: zpemail,
      mobile: zpphone,
      callback_url: 'http://localhost:4020/verify_cart',
    };
    Axios.post(url, args)
      .then((res) => {
        if (!res) return Promise.reject();
        if (Number(res.data.data.code) === 100) {
          var status = true;
          var url =
            'https://www.zarinpal.com/pg/StartPay/' + res.data.data.authority;
          zpcallback({
            status: status,
            url: url,
            authority: res.data.data.authority,
          });
        } else {
          var status = false;
          var code = res.data.data.code;
          zpcallback({ status: status, code: 'خطایی پیش آمد! ' + code });
        }
      })
      .catch((err) => {
        zpcallback({ status: false, code: 'خطایی پیش آمد! ', err });
      });
  },
  verify: function (zpamount, zpau, zpcallback) {
    var url = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
    var args = {
      merchant_id: appConfig.zarinpalMerchant,
      amount: zpamount,
      authority: zpau,
    };
    Axios.post(url, args)
      .then((res) => {
        if (!res) return Promise.reject();
        if (Number(res.data.data.code) === 100) {
          var status = true;
          zpcallback({ data: res.data, status });
        } else {
          var status = false;
          var code = res.data.data.code;
          zpcallback({ status: status, code: 'خطایی پیش آمد! ' + code });
        }
      })
      .catch((err) => {
        zpcallback({ status: false, code: 'خطایی پیش آمد! ', err });
      });
  },
};
