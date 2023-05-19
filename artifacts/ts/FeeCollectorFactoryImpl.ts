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
import { default as FeeCollectorFactoryImplContractJson } from "../examples/FeeCollectorFactoryImpl.ral.json";

// Custom types for the contract
export namespace FeeCollectorFactoryImplTypes {
  export type Fields = {
    feeCollectorPerTokenPairTemplateId: HexString;
    tokenPairFactory: HexString;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    createFeeCollector: {
      params: CallContractParams<{
        caller: Address;
        alphAmount: bigint;
        tokenPairId: HexString;
      }>;
      result: CallContractResult<HexString>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  FeeCollectorFactoryImplInstance,
  FeeCollectorFactoryImplTypes.Fields
> {
  consts = {
    ErrorCodes: {
      ReserveOverflow: BigInt(0),
      InsufficientInitLiquidity: BigInt(1),
      InsufficientLiquidityMinted: BigInt(2),
      InsufficientLiquidityBurned: BigInt(3),
      InvalidToAddress: BigInt(4),
      InsufficientLiquidity: BigInt(5),
      InvalidTokenInId: BigInt(6),
      InvalidCalleeId: BigInt(7),
      InvalidK: BigInt(8),
      InsufficientOutputAmount: BigInt(9),
      InsufficientInputAmount: BigInt(10),
      IdenticalTokenIds: BigInt(11),
      Expired: BigInt(12),
      InsufficientToken0Amount: BigInt(13),
      InsufficientToken1Amount: BigInt(14),
      TokenNotExist: BigInt(15),
      InvalidCaller: BigInt(16),
    },
  };

  at(address: string): FeeCollectorFactoryImplInstance {
    return new FeeCollectorFactoryImplInstance(address);
  }

  tests = {
    createFeeCollector: async (
      params: TestContractParams<
        FeeCollectorFactoryImplTypes.Fields,
        { caller: Address; alphAmount: bigint; tokenPairId: HexString }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "createFeeCollector", params);
    },
  };
}

// Use this object to test and deploy the contract
export const FeeCollectorFactoryImpl = new Factory(
  Contract.fromJson(
    FeeCollectorFactoryImplContractJson,
    "",
    "966f75cddefe774a87dbf778012f4f3f494b3a860f4c975d0c5262a1be185d49"
  )
);

// Use this class to interact with the blockchain
export class FeeCollectorFactoryImplInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<FeeCollectorFactoryImplTypes.State> {
    return fetchContractState(FeeCollectorFactoryImpl, this);
  }

  methods = {
    createFeeCollector: async (
      params: FeeCollectorFactoryImplTypes.CallMethodParams<"createFeeCollector">
    ): Promise<
      FeeCollectorFactoryImplTypes.CallMethodResult<"createFeeCollector">
    > => {
      return callMethod(
        FeeCollectorFactoryImpl,
        this,
        "createFeeCollector",
        params
      );
    },
  };

  async multicall<Calls extends FeeCollectorFactoryImplTypes.MultiCallParams>(
    calls: Calls
  ): Promise<FeeCollectorFactoryImplTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      FeeCollectorFactoryImpl,
      this,
      calls
    )) as FeeCollectorFactoryImplTypes.MultiCallResults<Calls>;
  }
}
