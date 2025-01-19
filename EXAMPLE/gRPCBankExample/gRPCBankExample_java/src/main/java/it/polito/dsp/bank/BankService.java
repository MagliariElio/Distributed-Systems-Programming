package it.polito.dsp.bank;

import java.util.HashSet;
import java.util.concurrent.ConcurrentHashMap;

import io.grpc.stub.StreamObserver;
import it.polito.dsp.bank.Bank.AddDepositRequest;
import it.polito.dsp.bank.Bank.AddDepositResponse;
import it.polito.dsp.bank.Bank.AddWithdrawalRequest;
import it.polito.dsp.bank.Bank.AddWithdrawalResponse;
import it.polito.dsp.bank.Bank.ExitStatus;
import it.polito.dsp.bank.BankOperationsGrpc.BankOperationsImplBase;

public class BankService extends BankOperationsImplBase {
	double balance = 0.0;
	ConcurrentHashMap<String,HashSet<Operation>> operations =
			new ConcurrentHashMap<String, HashSet<Operation>>(); ;
	
	private class Operation {
		float amount;
		String description;
		public Operation(float amount, String description) {
			 this.amount = amount;
			 this.description = description;
		}
		public float getAmount() {
			return amount;
		}
		public String getDescription() {
			return description;
		}
	}

	public BankService() {
		operations.put("000", new HashSet<BankService.Operation>());
	}

	@Override
	public synchronized void addDeposit(AddDepositRequest request, StreamObserver<AddDepositResponse> responseObserver) {
		if (!operations.containsKey(request.getId())) {
			responseObserver.onNext(AddDepositResponse.newBuilder().setStatus(ExitStatus.UNKNOWN_ACCOUNT_ID).build());
			responseObserver.onCompleted();
		} else if (request.getAmount()<=0) {
			responseObserver.onNext(AddDepositResponse.newBuilder().setStatus(ExitStatus.BAD_AMOUNT).build());
			responseObserver.onCompleted();
		} else {
			operations.get(request.getId()).add(new Operation(request.getAmount(),request.getDescription()));
			balance += request.getAmount();
			System.out.println("deposit of "+request.getAmount()+" executed.");
			responseObserver.onNext(AddDepositResponse.newBuilder().setStatus(ExitStatus.OK).build());
			responseObserver.onCompleted();
		}
	}
	
	@Override
	public synchronized void addWithdrawal(AddWithdrawalRequest request, StreamObserver<AddWithdrawalResponse> responseObserver) {
		if (!operations.containsKey(request.getId())) {
			responseObserver.onNext(AddWithdrawalResponse.newBuilder().setStatus(ExitStatus.UNKNOWN_ACCOUNT_ID).build());
			responseObserver.onCompleted();
			return;
		} else if (request.getAmount()<=0) {
			responseObserver.onNext(AddWithdrawalResponse.newBuilder().setStatus(ExitStatus.BAD_AMOUNT).build());
			responseObserver.onCompleted();
		}
		float amount = request.getAmount();
		if (balance<amount)
			if (request.getReducible() && balance>0)
				amount = (float) balance;
			else {
				responseObserver.onNext(AddWithdrawalResponse.newBuilder().setStatus(ExitStatus.NO_AVAILABILITY).build());
				responseObserver.onCompleted();
				return;
			}	
		operations.get(request.getId()).add(new Operation(request.getAmount(),request.getDescription()));
		balance -= amount;
		System.out.println("withdrawal of "+amount+" executed.");
		responseObserver.onNext(AddWithdrawalResponse.newBuilder().setStatus(ExitStatus.OK).setWithdrawn(amount).build());
		responseObserver.onCompleted();
	}

}
