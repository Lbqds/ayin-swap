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
import { default as StakingContractJson } from "../ayin/staking.ral.json";

// Custom types for the contract
export namespace StakingTypes {
  export type Fields = {
    tokenId: HexString;
    rewardsTokenId: HexString;
    stakingAccountTemplateId: HexString;
    rewardRate: bigint;
    totalAmountStaked: bigint;
    rewardPerTokenStored: bigint;
    lastUpdateTime: bigint;
    owner_: Address;
    paused_: boolean;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    stakingAccountExists: {
      params: CallContractParams<{ staker: Address }>;
      result: CallContractResult<boolean>;
    };
    getStakingAccount: {
      params: CallContractParams<{ staker: Address }>;
      result: CallContractResult<HexString>;
    };
    getTokenId: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getRewardsTokenId: {
      params: Omit<CallContractParams<{}>, "args">;
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

class Factory extends ContractFactory<StakingInstance, StakingTypes.Fields> {
  at(address: string): StakingInstance {
    return new StakingInstance(address);
  }

  tests = {
    stakingAccountExists: async (
      params: TestContractParams<StakingTypes.Fields, { staker: Address }>
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "stakingAccountExists", params);
    },
    getStakingAccount: async (
      params: TestContractParams<StakingTypes.Fields, { staker: Address }>
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getStakingAccount", params);
    },
    createStakingAccount: async (
      params: TestContractParams<
        StakingTypes.Fields,
        { staker: Address; amount: bigint; rewardPerTokenPaid: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "createStakingAccount", params);
    },
    pause: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "pause", params);
    },
    unpause: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "unpause", params);
    },
    whenNotPaused: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "whenNotPaused", params);
    },
    onlyOwner: async (
      params: TestContractParams<StakingTypes.Fields, { caller: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "onlyOwner", params);
    },
    changeOwner: async (
      params: TestContractParams<StakingTypes.Fields, { newOwner: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "changeOwner", params);
    },
    getTokenId: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getTokenId", params);
    },
    getRewardsTokenId: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getRewardsTokenId", params);
    },
    updateStakerReward: async (
      params: TestContractParams<StakingTypes.Fields, { account: HexString }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "updateStakerReward", params);
    },
    updateReward: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "updateReward", params);
    },
    earned: async (
      params: TestContractParams<StakingTypes.Fields, { acc: HexString }>
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "earned", params);
    },
    calculateRewardPerToken: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "calculateRewardPerToken", params);
    },
    stake: async (
      params: TestContractParams<StakingTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "stake", params);
    },
    unstake: async (
      params: TestContractParams<StakingTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "unstake", params);
    },
    claimRewards: async (
      params: Omit<TestContractParams<StakingTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claimRewards", params);
    },
    setRewardRate: async (
      params: TestContractParams<StakingTypes.Fields, { rate: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setRewardRate", params);
    },
  };
}

// Use this object to test and deploy the contract
export const Staking = new Factory(
  Contract.fromJson(
    StakingContractJson,
    "",
    "dc15de6cab78009858fb60242af464c5cd20e8608c2a0442036c8d5e5f88577d"
  )
);

// Use this class to interact with the blockchain
export class StakingInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<StakingTypes.State> {
    return fetchContractState(Staking, this);
  }

  methods = {
    stakingAccountExists: async (
      params: StakingTypes.CallMethodParams<"stakingAccountExists">
    ): Promise<StakingTypes.CallMethodResult<"stakingAccountExists">> => {
      return callMethod(Staking, this, "stakingAccountExists", params);
    },
    getStakingAccount: async (
      params: StakingTypes.CallMethodParams<"getStakingAccount">
    ): Promise<StakingTypes.CallMethodResult<"getStakingAccount">> => {
      return callMethod(Staking, this, "getStakingAccount", params);
    },
    getTokenId: async (
      params?: StakingTypes.CallMethodParams<"getTokenId">
    ): Promise<StakingTypes.CallMethodResult<"getTokenId">> => {
      return callMethod(
        Staking,
        this,
        "getTokenId",
        params === undefined ? {} : params
      );
    },
    getRewardsTokenId: async (
      params?: StakingTypes.CallMethodParams<"getRewardsTokenId">
    ): Promise<StakingTypes.CallMethodResult<"getRewardsTokenId">> => {
      return callMethod(
        Staking,
        this,
        "getRewardsTokenId",
        params === undefined ? {} : params
      );
    },
  };

  async multicall<Calls extends StakingTypes.MultiCallParams>(
    calls: Calls
  ): Promise<StakingTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      Staking,
      this,
      calls
    )) as StakingTypes.MultiCallResults<Calls>;
  }
}
