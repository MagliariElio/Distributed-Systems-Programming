const PROTO_PATH = __dirname + '/bank.proto';
const REMOTE_URL = "localhost:5000";
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const util = require('util');
console.log('proto file:'+PROTO_PATH);
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let protoD = grpc.loadPackageDefinition(packageDefinition);
let bank = protoD.it.polito.dsp.bank;
let client = new bank.BankOperations(REMOTE_URL,
             grpc.credentials.createInsecure());

function main() {
    console.log('starting client');
    let request = {
        id: "000",
        amount: 2000.00,
        description: "operation from node client"
    };
    function operationCallback(error, response) {
        if (error) {
          console.log('error in operation esecution '+error);
          return;
        }
        if (response.status=="OK") {
          console.log('Operation successfully executed by node client');
        } else if (response.status == "UNKNOWN_ACCOUNT_ID") {
          console.log('Unknown account');
        } else if (response.status == "NO_AVAILABILITY") {
          console.log('No availability');
        } else
          console.log('status '+response.status)
    }

    client.addDeposit(request,operationCallback);
    request.reducible=true;
    client.addWithdrawal(request,operationCallback);
    request.id="001";
    client.addDeposit(request,operationCallback);
}

if (require.main === module) {
    main();
}