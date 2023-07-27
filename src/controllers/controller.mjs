// controller.mjs
import { Expense } from '../models/Expense.mjs';
import { createNewExpense } from '../services/createNewExpense.mjs';

// Crear un nuevo Expense
async function createExpense(req, res) {
  try {
    const payment = await createNewExpense(req.body);
    const expense = new Expense(payment);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'Error create expense' });
  }
}

// Borrar un Expense
async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: `It was deleted expense with id ${id}` });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: 'Error deleting expense' });
  }
}

// Obtener todos los expenses
async function getAllExpenses(req, res) {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error obtaining expenses' });
  }
}

// Obtener todos los expenses del month X
async function getDebts(req, res) {
  const { username, month } = req.body;
  try {
    const expenses = await Expense.find(
      {
        username: username,
        debts: {
          $elemMatch: {
            month: month,
            status: 'pending',
          },
        },
      },
      {
        'debts.$': 1,
        _id: 0, // Excluimos el campo _id del resultado
        description: 1, // Incluimos el campo description en el resultado
      },
    );

    if (expenses.length === 0) {
      // Si no se encontraron documentos o no hay debts pendientes, retornamos un resultado vacío
      res.status(200).json({ message: 'No expenses found' });
      return;
    }

    // Creamos un array para almacenar las debts pendientes con sus descriptiones
    const pendingDebts = [];

    // Iteramos sobre el array de documentos expenses
    expenses.forEach((Expense) => {
      // Iteramos sobre las debts del Expense actual
      Expense.debts.forEach((fee) => {
        // Si la fee coincide con el month y está pending, agregamos la descripción
        if (fee.month === month && fee.status === 'pending') {
          fee.description = Expense.description;
          pendingDebts.push(fee);
        }
      });
    });

    // Calculamos el monto total sumando los valores de las debts
    const montoTotal = pendingDebts.reduce(
      (total, fee) => total + fee.feeAmount,
      0,
    );

    res.status(200).json({ pendingDebts: pendingDebts, montoTotal });
  } catch (error) {
    res.status(500).json({ message: 'Error getting expenses' });
  }
}

// Obtener todos los expenses de los proximos 3 meses
async function getDebts3Months(req, res) {
  const { username, month } = req.body;
  try {
    // Obtener el month actual y los próximos 3 meses
    const nextMonths = [];
    const [actualMonth, actualYear] = month.split('-');
    for (let i = 0; i < 3; i++) {
      let nextMonth = ((parseInt(actualMonth) + i) % 12) + 1;
      let nextYear =
        nextMonth > actualMonth ? actualYear : parseInt(actualYear) + 1;
      nextMonths.push(`${nextMonth}-${nextYear}`);
    }

    // Realizar la consulta para obtener las debts pendientes de los próximos 3 meses
    const expenses = await Expense.find({
      username: username,
      'debts.month': { $in: nextMonths },
      'debts.status': 'pending',
    });

    if (expenses.length === 0) {
      res.status(200).json({ message: 'No pending debts' });
      return;
    }

    // Crear un objeto para almacenar las debts pendientes divididas por month, junto con la suma total de debts por month
    const pendingDebts = {};

    expenses.forEach((Expense) => {
      Expense.debts.forEach((fee) => {
        if (nextMonths.includes(fee.month) && fee.status === 'pending') {
          fee.description = Expense.description;
          const [month, year] = fee.month.split('-');
          const mesKey = `${month}-${year}`;
          if (!pendingDebts[mesKey]) {
            pendingDebts[mesKey] = {
              debts: [], // Mantener debts como un array
              totalAmount: 0,
            };
          }
          pendingDebts[mesKey].debts.push(fee); // Usar push para agregar la fee al array
          pendingDebts[mesKey].totalAmount += fee.feeAmount; // Sumar el valor de la fee al total del month
        }
      });
    });

    // Calcular el monto total de todas las debts pendientes
    let totalAmount = 0;
    for (const mesKey in pendingDebts) {
      pendingDebts[mesKey].debts.forEach((fee) => {
        totalAmount += fee.feeAmount;
      });
    }

    res.status(200).json({
      pendingDebts,
      totalAmount,
    });
  } catch (error) {
    
    console.log({ error });
    res.status(500).json({ message: 'Error getting pending debts' });
  }
}


export {
  getAllExpenses,
  getDebts,
  getDebts3Months,
  createExpense,
  deleteExpense,
};
