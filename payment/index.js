const Axios = require("axios");
const { config } = require("dotenv");
config();
const https = require('https');

const PAYSTACK_SEC_KEY = process.env.PAYSTACK_SEC_KEY;
const PAYMENT_REDIRECT_URL= process.env.PAYMENT_REDIRECT_URL;

 const makeFiatDeposit = async (amount, email) => {

    const params = JSON.stringify({
        "email": email,
        "amount": amount,
        "callback_url": PAYMENT_REDIRECT_URL
    })


    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${PAYSTACK_SEC_KEY}`,
            'Content-Type': 'application/json'
        }
    }

    return new Promise((resolve) => {
        const req = https.request(options, res => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            })
        }).on('error', error => {
            console.error(error)
        })

        req.write(params)
        req.end()

    });


}

const verifyDepositedFunds = async (reference) => {

    const options = {
                // hostname: 'api.paystack.co',
                port: 443,
                // path: `/transaction/verify/${reference}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SEC_KEY}`,
                }
            };

            let resp;


    await Axios.get(`https://api.paystack.co/transaction/verify/${reference}`, options)
      .then((result) => {
        resp = result.data

        // console.log (resp);
      })
      .catch((error) => {
        // resp = error.response.data;
        console.log("web3-mint-token", error.message);
      });
    return resp;
  };


//  const verifyDepositedFunds = async (reference) => {

//     const options = {
//         hostname: 'api.paystack.co',
//         port: 443,
//         path: `/transaction/verify/${reference}`,
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${PAYSTACK_SEC_KEY}`,
//         }
//     };

//     return new Promise((resolve) => {
//         const req = https.request(options, res => {
//             // console.log(`statusCode: ${res.statusCode}`);

//             res.on('data', d => {
//                 resolve(process.stdout.write(d))
//             });
//         });

//         req.on('error', error => {
//             console.error(error);
//         });

//         req.end();

//     });

// }

module.exports = {
    makeFiatDeposit,
    verifyDepositedFunds
}