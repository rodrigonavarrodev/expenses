// Expense.mjs
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  fees: { type: String },
  feeAmount: { type: Number },
  paymentType: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  description: { type: String, required: true },
  debts: { type: Array },
  activeSubscription: { type: Boolean },
  date: { type: String, required: true },
  username: { type: String, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);

export { Expense };
