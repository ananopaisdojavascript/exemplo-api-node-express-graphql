import AccountRepository from '../repository/account.repository.js'

const createAccount = async account => {
  return await AccountRepository.insertAccount(account)
}

const getAccounts = async () => {
  return await AccountRepository.getAccounts();
};

const getAccountById = async (id) => {
  return await AccountRepository.getAccountById(id);
};

const updateAccount = async (account) => {
  return await AccountRepository.updateAccount(account);
};

const deleteAccount = async (id) => {
  return await AccountRepository.deleteAccount(id);
};

export default {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};