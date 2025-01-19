package it.polito.dsp.bank;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import it.polito.dsp.bank.Bank.AddDepositRequest;
import it.polito.dsp.bank.Bank.AddDepositResponse;
import it.polito.dsp.bank.Bank.ExitStatus;
import it.polito.dsp.bank.BankOperationsGrpc.BankOperationsBlockingStub;

public class BankClient {

	public BankClient(String host, int port) {
		try {
			ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
			BankOperationsBlockingStub blockingStub = BankOperationsGrpc.newBlockingStub(channel);
			AddDepositRequest request = AddDepositRequest.newBuilder()
														 .setId("000")
														 .setAmount((float) 1000.00)
														 .setDescription("first operation")
														 .build();
			printExit(blockingStub.addDeposit(request));
			request = AddDepositRequest.newBuilder()
					 .setId("001")
					 .setAmount((float) 1000.00)
					 .setDescription("second operation")
					 .build();
			printExit(blockingStub.addDeposit(request));
		} catch (StatusRuntimeException e) {
			System.out.println("Unsuccessful remote operation");
		}
	}

	private void printExit(AddDepositResponse response) {
		if (response.getStatusValue()==ExitStatus.OK_VALUE)
			System.out.println("Deposit successfully executed");
		else if (response.getStatus()==ExitStatus.UNKNOWN_ACCOUNT_ID)
			System.out.println("Unknown account");
		else if (response.getStatus()==ExitStatus.BAD_AMOUNT)
			System.out.println("Bad amount");
	}

	public static void main(String[] args) {
		new BankClient("localhost",5000);
	}

}
