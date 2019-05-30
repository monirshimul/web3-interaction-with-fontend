const W3 = require('web3');
const Tx = require('ethereumjs-tx');
const fs = require('fs');
const path = require('path');

var ethPath = path.join(__dirname, '../config/eth.json');

const ethConf = JSON.parse(fs.readFileSync(ethPath));

const web3 = new W3(new W3.providers.HttpProvider(ethConf.provider));

web3.eth.defaultAccount = ethConf.defaultAccount;

const contractAddress = ethConf.contractAddress;

const priKey = ethConf.defaultAccountPrivateKey;

const KycContract = new web3.eth.Contract(ethConf.contractABI, contractAddress, {
    from: web3.eth.defaultAccount, // default from address
    gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

async function setNID(key, nid, nidImage, response) {
    var privateKey = Buffer.from(priKey, 'hex');
    let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);

    var rawTransaction = {
        "from": web3.eth.defaultAccount,
        "gasPrice": web3.utils.toHex(20 * 1e9),
        "gasLimit": web3.utils.toHex(210000),
        "to": contractAddress,
        "value": "0x0",
        "data": KycContract.methods.setNID(key, nid, nidImage).encodeABI(),
        "nonce": web3.utils.toHex(nonce)
    };

    var transaction = new Tx(rawTransaction);

    transaction.sign(privateKey);

    web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'), (err, txHash) => {
        console.log(txHash);
        return response.send(txHash.toString());
    });
    // .once('receipt', function(receipt){console.log("Receipt: ", receipt)})
    // .on('confirmation', function(confNumber, receipt){console.log("conf: ", confNumber)})
    // .on('error', function(error){console.log(error)})
    // .then(function(receipt){
    //     // will be fired once the receipt is mined
    //     console.log("from receipt: ", receipt);
    // })
    
    console.log("Exiting...");
    //return tx;
}

async function getNID(key) {
    let nidDetails = await KycContract.methods.getNID(key).call();
    //console.log(nidDetails);
    return nidDetails;
}




// async function main() {
//    // setNID("mehedi", "{name: 'mehedi hasan'}", "jsbfbjkdfbjfbsjkgbjksdgbljkdgbjkdgbkjsdgbfsjkbfgjksbfjsbjgk");

//     //console.log(tx);

//     let nd = await getNID("mehedi");

//     nd.forEach(item => {
//         console.log(item);
//     })
// }

// main();

module.exports = {
    setNid: setNID,
    getNid: getNID
}