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