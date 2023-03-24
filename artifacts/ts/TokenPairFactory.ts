/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  SubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as TokenPairFactoryContractJson } from "../dex/token_pair_factory.ral.json";

// Custom types for the contract
export namespace TokenPairFactoryTypes {
  export type Fields = {
    pairTemplateId: HexString;
    pairSize: bigint;
  };

  export type State = ContractState<Fields>;

  export type PairCreatedEvent = ContractEvent<{
    token0: HexString;
    token1: HexString;
    pair: HexString;
    currentPairSize: bigint;
  }>;
}

class Factory extends ContractFactory<
  TokenPairFactoryInstance,
  TokenPairFactoryTypes.Fields
> {
  at(address: string): TokenPairFactoryInstance {
    return new TokenPairFactoryInstance(address);
  }

  tests = {
    sortTokens: async (
      params: TestContractParams<
        TokenPairFactoryTypes.Fields,
        { tokenA: HexString; tokenB: HexString }
      >
    ): Promise<TestContractResult<[HexString, HexString]>> => {
      return testMethod(this, "sortTokens", params);
    },
    createPair: async (
      params: TestContractParams<
        TokenPairFactoryTypes.Fields,
        {
          payer: HexString;
          alphAmount: bigint;
          tokenAId: HexString;
          tokenBId: HexString;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "createPair", params);
    },
  };
}

// Use this object to test and deploy the contract
export const TokenPairFactory = new Factory(
  Contract.fromJson(
    TokenPairFactoryContractJson,
    "",
    "6e20ca1d1474ca5d61542b180e858beac69c23e5feb6cb5c1a53c68e0e6a5d36"
  )
);

// Use this class to interact with the blockchain
export class TokenPairFactoryInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TokenPairFactoryTypes.State> {
    return fetchContractState(TokenPairFactory, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribePairCreatedEvent(
    options: SubscribeOptions<TokenPairFactoryTypes.PairCreatedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TokenPairFactory.contract,
      this,
      options,
      "PairCreated",
      fromCount
    );
  }
}
