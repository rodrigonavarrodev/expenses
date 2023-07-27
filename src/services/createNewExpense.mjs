const createNewExpense = (body) => {
  let Expense = {};

  const {
    amount,
    fees,
    description,
    paymentType,
    paymentMethod,
    date,
    username,
  } = body;
  let debts = [];
  const { monthNumber, yearNumber } = getMonth(date);
  const feeAmount = amount / fees;

  // armo el objeto de cada cuota
  for (let i = 1; i <= fees; i++) {
    const fee = {
      fee: `${i}/${fees}`,
      month: getDebt(monthNumber, yearNumber, i),
      feeAmount: feeAmount,
      status: 'pending',
    };
    debts.push(fee);
  }
  // mostrar cuanto tengo que pagar mes a mes
  Expense = {
    username,
    amount,
    feeAmount,
    fees,
    debts,
    description,
    paymentType,
    paymentMethod,
    date,
  };
  return Expense;
};

export { createNewExpense };

const getMonth = (date) => {
  const [day, month, year] = date.split('-');
  const formatDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
  const monthNumber = formatDate.getMonth();
  const yearNumber = formatDate.getFullYear();
  return { monthNumber, yearNumber };
};

const getDebt = (monthNumber, yearNumber, i) => {
  const year = yearNumber + Math.floor((monthNumber + i - 1) / 12); // Calcula el año ajustado
  const month = ((monthNumber + i - 1) % 12) + 1; // Calcula el mes ajustado
  return `${month}-${year}`;
};
