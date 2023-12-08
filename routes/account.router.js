import express from 'express'
import AccountController from '../controllers/account.controller.js'

const router = express.Router()

global.fileName = "accounts.json";

router.use((error, request, response, _next) => {
  logger.error(`${request.method} ${request.baseUrl} - ${error.message}`);
  response.status(400).send({
    error: error.message,
  });
});

router.post("/", AccountController.createAccount);

router.get("/",  AccountController.getAccounts);

router.get("/:id", AccountController.getAccountById);

router.put("/", AccountController.updateAccount);

router.delete("/:id", AccountController.deleteAccount);

export default router