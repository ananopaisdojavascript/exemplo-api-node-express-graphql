import { promises as fs } from "fs";
const { readFile, writeFile } = fs;

const insertAccount = async (account) => {
  const data = JSON.parse(await readFile(global.fileName));
  if (!account.name || account.balance === null) {
    throw new Error("O nome e o saldo da conta são obrigatórios");
  }
  account = {
    id: data.nextId++,
    name: account.name,
    balance: account.balance,
  };
  data.accounts.push(account);
  await writeFile("accounts.json", JSON.stringify(data, null, 2));
  return account;
};

const getAccounts = async () => {
  const data = JSON.parse(await readFile(global.fileName));
  return data.accounts;
};

const getAccountById = async (id) => {
  const data = JSON.parse(await readFile(global.fileName));
  const account = data.accounts.find((account) => {
    return account.id === parseInt(id);
  });
  return account;
};

const updateAccount = async (account) => {
  const data = JSON.parse(await readFile(global.fileName));
  if (!account.id || !account.name || account.balance === null) {
    throw new Error("O nome e o saldo da conta são obrigatórios");
  }
  const index = data.accounts.findIndex((item) => {
    return item.id === account.id;
  });

  if (index === -1) {
    throw new Error("Registro não encontrado.");
  }

  data.accounts[index].name = account.name;
  data.accounts[index].balance = account.balance;

  await writeFile(global.fileName, JSON.stringify(data, null, 2));
  return data.accounts[index];
};

const deleteAccount = async (id) => {
  const data = JSON.parse(await readFile(global.fileName));
  data.accounts = data.accounts.filter((account) => {
    return account.id !== parseInt(id);
  });
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
};

export default {
  getAccounts,
  insertAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
};