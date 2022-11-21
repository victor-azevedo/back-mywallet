import { ObjectId } from "mongodb";
import { transactionsCollection } from "../database/db.js";

export async function checkUserTransactionsMiddleware(req, res, next) {
  const user = res.locals.user;
  const { id: transactionId } = req.params;
  console.log(transactionId);

  try {
    const transactionFind = await transactionsCollection.findOne({
      _id: new ObjectId(transactionId),
    });

    if (!transactionFind) {
      return res.status(404).send({ message: "Transação não encontrada" });
    }

    if (JSON.stringify(transactionFind.userId) !== JSON.stringify(user._id)) {
      return res
        .status(401)
        .send({
          message: "Usuário não tem permissão para acessar essa transação",
        });
    }
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }

  res.locals.transactionId = transactionId;

  next();
}
