const PROTO_PATH = __dirname + '/bank.proto';
const port ='5000';
const REMOTE_URL = 'localhost:'+port;
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const util = require('util');
const { request } = require('http');
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

var balance = 0;
var ID = '000';

function addDeposit(call, callback) {
    console.log(`addDeposit called with ${call.request.id}, ${call.request.amount}, ${call.request.description}`);
    if (call.request.id == ID) {
        balance += call.request.amount;
        console.log('Operation successfully executed');
        callback(null,{status:0});
    } else
        callback(null,{status:1}); 
}

function addWithdrawal(call, callback) {
    console.log(`addWithdrawal called with ${call.request.id}, ${call.request.amount}, ${call.request.description}`);
    if (call.request.id == ID) {
        var amount = call.request.amount;
        if (balance<amount) 
            if (!request.reducible)
                return callback(null,{status:2}); // not enough money
            else
                amount = balance; // reduce amount to balance
        balance -= amount;
        console.log('Operation successfully executed with amount '+amount);
        let response = {
            status : 0,
            withdrawn : amount
        };
        callback(null,response);   
    } else
        callback(null,{status:1}); // unknown id
}

if (require.main === module) {
    console.log('initializing server');
    var server = new grpc.Server();
    server.addService(bank.BankOperations.service, {
      addDeposit: addDeposit,
      addWithdrawal: addWithdrawal
    });
    server.bindAsync(REMOTE_URL, grpc.ServerCredentials.createInsecure(), function (error, actualPort) {
        if (error) {
          console.log(error);
          return;
        }
        console.log(`Starting server on port ${actualPort}`);
        server.start();
        console.log(`Server ready`);
      }
    );
}
