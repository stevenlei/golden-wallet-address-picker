const prompt = require("prompt");
const EthCrypto = require("eth-crypto");

const main = async () => {
  const results = [];

  var schema = {
    properties: {
      keyword: {
        pattern: /^[0-9A-F]+$/i,
        description: "Keywords (For example, 999 / 888 / abc)",
        message: "Must be the following characters: 0123456789abcdef",
        required: true,
      },
      isSuffix: {
        pattern: /^[1|2]$/,
        description: "1 = suffix | 2 = prefix",
        message: "Must be either 1 (suffix) or 2 (prefix)",
        default: 1,
        required: true,
      },
      maxAttempts: {
        required: true,
        description: "How many times to try",
        type: "number",
        default: 10000,
      },
      maxResults: {
        required: true,
        description: "Maximum results to be returned",
        type: "number",
        default: 10,
      },
    },
  };

  prompt.start();
  let { keyword, isSuffix, maxAttempts, maxResults } = await prompt.get(schema);

  keyword = keyword.toLowerCase();

  for (var i = 0; i < maxAttempts; i++) {
    let identity = EthCrypto.createIdentity();

    let { address, privateKey } = identity;

    let subset;

    if (+isSuffix === 1) {
      subset = address.substr(address.length - keyword.length, keyword.length).toLowerCase();
    } else {
      subset = address.substr(2, keyword.length).toLowerCase();
    }

    if (subset === keyword) {
      results.push({
        address,
        privateKey,
      });

      if (results.length >= maxResults) {
        break;
      }
    }
  }

  console.log(`Completed, found ${results.length} result(s) from ${i} attempts for keyword "${keyword}":${"\n"}`);

  for (let index in results) {
    console.log(`#${+index + 1}`);
    console.log(`Wallet Address: ${results[index].address}`);
    console.log(`Private Key: ${results[index].privateKey.substr(2, results[index].privateKey.length - 2)}`);
    console.log(``);
  }

  console.log(`*** Please save the results if needed, the results above cannot be regenerated ***`);
};

main();
