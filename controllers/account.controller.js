import AccountService from '../services/account.service.js'


const createAccount = async (request, response, next) => {
  try {
    let account = request.body;

    account = await AccountService.createAccount(account);

    response.send(account);
    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

const getAccounts = async (_request, response, next) => {
  try {
    response.send(await AccountService.getAccounts());
    logger.info("GET /account");
  } catch (error) {
    next(error);
  }
};

const getAccountById = async (request, response, next) => {
  try {
    response.send(await AccountService.getAccountById(request.params.id));
    logger.info("GET /account/:id");
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (request, response, next) => {
  try {
    const account = request.body;
    response.send(await AccountService.updateAccount(account));
    logger.info(`PUT /account - ${JSON.stringify(account)}`);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (request, response, next) => {
  try {
    await AccountService.deleteAccount(request.params.id);
    response.end();
    logger.info(`DELETE /account/:id - ${request.params.id}`);
  } catch (error) {
    next(error);
  }
};

export default {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};