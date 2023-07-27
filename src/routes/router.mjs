// router.mjs
import express from 'express';
import {
  getAllExpenses,
  getDebts,
  getDebts3Months,
  createExpense,
  deleteExpense,
} from '../controllers/controller.mjs';

const router = express.Router();

// Definir rutas

// Crear nuevo pago
router.post('/expenses', createExpense); // crear un pago
router.get('/expenses', getAllExpenses); // todos los pagos
router.delete('/expenses/:id', deleteExpense); // eleminar un pago


router.post('/debts', getDebts); // todos las debts pendientes por mes
router.post('/debts/months', getDebts3Months); // todas las debts pendientes de los proximos 3 meses

export { router };


/*
Para ingresar pago:
tipo: credito, debito, transferencia, efectivo, suscription
medio de pago: mp, galicia, efectivo (descontar de cada billetera con un evento)
hacer bifurcacion de cuando es credito y cuando es gasto del mes
cuando es suscription, poder actualizar el monto y que repercuta en los meses siguientes
*/