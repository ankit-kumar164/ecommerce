const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox, // Production
  merchantId: w8n3qfypkxdft4ck,
  publicKey: "76g6t493rf8jsptk" ,
  privateKey: "6e6f576f69b070d983156ed0e1dd4029",
});

exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  // charge
  let newTransaction = gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.json(result);
      }
    }
  );
};
