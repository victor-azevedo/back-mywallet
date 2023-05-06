import { handleRequestError } from "../errors/index.js";
import { transactionsService } from "../services/transaction-service.js";

export async function addUserTransaction(req, res) {
  /*
    #swagger.tags = ['Transactions']
    #swagger.description = 'Route to add user transactions.'
    #swagger.parameters['obj'] = {
      in: 'body',
      name: 'Add Transactions',
      description: 'Data to add a user transaction',
      required: true,
      schema: {
        $ref: '#/definitions/transactionCreateSchemaSwagger',
      },
    },   
  */
  const { userId } = res.locals.user;
  const transactionData = req.body;

  try {
    await transactionsService.create({ userId, transactionData });
    res.sendStatus(201);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export async function getAllUserTransactions(req, res) {
  /*
    #swagger.tags = ['Transactions']
    #swagger.description = 'Route to get all user transactions and balance.'    
    },   
  */
  const { userId } = res.locals.user;

  try {
    const transactionsUser = await transactionsService.getByUserId(userId);
    res.status(200).send(transactionsUser);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export async function deleteUserTransaction(req, res) {
  /*
    #swagger.tags = ['Transactions']
    #swagger.description = 'Route to delete a user transaction.'    
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Transaction ID',
      required: true,
      schema: {
        $ref: '#/definitions/transactionParamsSchemaSwagger',
      },
    },   
  */
  const { userId } = res.locals.user;
  const { id } = req.params;

  try {
    await transactionsService.deleteUserTransaction({ id, userId });
    res.sendStatus(200);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export async function updateUserTransaction(req, res) {
  /*
    #swagger.tags = ['Transactions']
    #swagger.description = 'Route to update a user transaction.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'Transaction ID',
      required: true,
      schema: {
        $ref: '#/definitions/transactionParamsSchemaSwagger',
      },
    },   
    #swagger.parameters['obj'] = {
      in: 'body',
      name: 'Update a Transaction',
      description: 'Data to update a user transaction',
      required: true,
      schema: {
        $ref: '#/definitions/transactionUpdateSchemaSwagger',
      },
    },
  */
  const { userId } = res.locals.user;
  const { id } = req.params;
  const transactionData = req.body;

  try {
    await transactionsService.updateUserTransaction({
      id,
      userId,
      transactionData,
    });
    res.sendStatus(200);
  } catch (error) {
    handleRequestError(res, error);
  }
  return;
}

export const transactionsController = {
  addUserTransaction,
  getAllUserTransactions,
  deleteUserTransaction,
  updateUserTransaction,
};
