#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, token, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Installment { pub amount: i128, pub due_date: u64, pub paid_at: u64 }

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum LoanStatus { Active, Completed, Defaulted }

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Loan { pub borrower: Address, pub lender: Address, pub merchant: Address, pub total_amount: i128, pub installments: Vec<Installment>, pub status: LoanStatus }

#[contracttype]
pub enum DataKey { Loan(u64), LastLoanId }

#[contract]
pub struct RepaymentContract;

#[contractimpl]
impl RepaymentContract {
      pub fn create_loan(env: Env, borrower: Address, lender: Address, merchant: Address, installments: Vec<Installment>) -> u64 {
                lender.require_auth();
                let mut last_id: u64 = env.storage().instance().get(&DataKey::LastLoanId).unwrap_or(0);
                last_id += 1;
                let mut total_amount: i128 = 0;
                for i in 0..installments.len() { total_amount += installments.get(i).unwrap().amount; }
                let loan = Loan { borrower, lender, merchant, total_amount, installments, status: LoanStatus::Active };
                env.storage().instance().set(&DataKey::Loan(last_id), &loan);
                env.storage().instance().set(&DataKey::LastLoanId, &last_id);
                env.events().publish((Symbol::new(&env, "loan_created"), last_id), total_amount);
                last_id
      }
      pub fn pay(env: Env, borrower: Address, loan_id: u64, installment_idx: u32, token_address: Address) {
                borrower.require_auth();
                let mut loan: Loan = env.storage().instance().get(&DataKey::Loan(loan_id)).expect("Loan not found");
                if loan.borrower != borrower { panic!("Unauthorized borrower"); }
                if let LoanStatus::Active = loan.status {} else { panic!("Loan is not active"); }
                let mut installments = loan.installments.clone();
                let mut installment = installments.get(installment_idx).expect("Invalid installment index");
                if installment.paid_at > 0 { panic!("Installment already paid"); }
                let token_client = token::Client::new(&env, &token_address);
                token_client.transfer(&borrower, &loan.lender, &installment.amount);
                installment.paid_at = env.ledger().timestamp();
                installments.set(installment_idx, installment);
                loan.installments = installments;
                let mut all_paid = true;
                for i in 0..loan.installments.len() { if loan.installments.get(i).unwrap().paid_at == 0 { all_paid = false; break; } }
                if all_paid { loan.status = LoanStatus::Completed; env.events().publish((Symbol::new(&env, "loan_completed"), loan_id), loan.total_amount); }
                env.storage().instance().set(&DataKey::Loan(loan_id), &loan);
                env.events().publish((Symbol::new(&env, "payment_received"), loan_id, installment_idx), installment.amount);
      }
      pub fn get_loan(env: Env, loan_id: u64) -> Loan { env.storage().instance().get(&DataKey::Loan(loan_id)).expect("Loan not found") }
}
