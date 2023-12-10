import Account from "../types/Account.js"
import AccountInput from "../types/AccountInput.js"
import AccountResolver from "../resolvers/account.resolver.js";
import { GraphQLBoolean, GraphQLInt } from "graphql"

const accountMutation = {
  createAccount: {
    type: Account,
    args: {
      account: {
        name: "account",
        type: AccountInput
      }
    },
    resolve(_, args) {
      return AccountResolver.createAccount(args.account)
    }
  },
  deleteAccount: {
    type: GraphQLBoolean,
    args: {
      id: {
        name: "id",
        type: GraphQLInt
      }
    },
    resolve(_, args) {
      AccountResolver.deleteAccount(args.id)
    }
  },
  updateAccount: {
    type: Account,
    args: {
      account: {
        name: "account",
        type: AccountInput
      }
    },
    resolve(_, args) {
      return AccountService.updateAccount(args.account)
    }
  }
}

export default accountMutation