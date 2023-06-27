import { web3 } from '@alephium/web3';
import {
  Staking,
  StakingAccountTypes,
  StakingTypes,
} from '../src/contracts/ts';
import {
  buildProject,
  createStaking,
  oneAlph,
  randomP2PKHAddress,
  randomTokenId,
} from './fixtures/DexFixture';

describe('Staking ', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973');

  beforeEach(async () => {
    await buildProject();
  });

  test('create staking account', async () => {
    const reward = randomTokenId();
    const rate = (oneAlph * 100n) / 1000n;
    const staker1 = randomP2PKHAddress();
    const staker2 = randomP2PKHAddress();
    const staker3 = randomP2PKHAddress();
    const staking = createStaking(reward, rate);
    const token = staking.selfState.fields.tokenId;

    let res = await Staking.tests.stake({
      initialFields: staking.selfState.fields,
      initialAsset: staking.selfState.asset,
      existingContracts: staking.dependencies,
      address: staking.address,
      blockTimeStamp: 0,
      testArgs: {
        amount: oneAlph * 80n,
      },
      inputAssets: [
        {
          address: staker1,
          asset: {
            alphAmount: oneAlph * 2n,
            tokens: [{ id: token, amount: oneAlph * 80n }],
          },
        },
      ],
    });

    let st = res.contracts.find(
      (c) => c.address === staking.address
    ) as StakingTypes.State;

    const stAcc1 = res.contracts.find(
      (c) => c.fields['staker'] === staker1
    ) as StakingAccountTypes.State;

    res = await Staking.tests.stake({
      initialFields: st.fields,
      initialAsset: st.asset,
      existingContracts: staking.dependencies,
      address: st.address,
      blockTimeStamp: 0,
      testArgs: {
        amount: oneAlph * 20n,
      },
      inputAssets: [
        {
          address: staker2,
          asset: {
            alphAmount: oneAlph * 2n,
            tokens: [{ id: token, amount: oneAlph * 20n }],
          },
        },
      ],
    });

    st = res.contracts.find(
      (c) => c.address === staking.address
    ) as StakingTypes.State;

    const stAcc2 = res.contracts.find(
      (c) => c.fields['staker'] === staker2
    ) as StakingAccountTypes.State;

    let earned1 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc1],
      blockTimeStamp: 1000,
      testArgs: {
        acc: stAcc1.address,
      },
    });

    let earned2 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc2],
      blockTimeStamp: 1000,
      testArgs: {
        acc: stAcc2.address,
      },
    });

    expect(earned1.returns).toEqual(oneAlph * 80n);
    expect(earned2.returns).toEqual(oneAlph * 20n);

    earned1 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc1],
      blockTimeStamp: 2000,
      testArgs: {
        acc: stAcc1.address,
      },
    });

    earned2 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc2],
      blockTimeStamp: 2000,
      testArgs: {
        acc: stAcc2.address,
      },
    });

    expect(earned1.returns).toEqual(oneAlph * 160n);
    expect(earned2.returns).toEqual(oneAlph * 40n);

    res = await Staking.tests.stake({
      initialFields: st.fields,
      initialAsset: st.asset,
      existingContracts: staking.dependencies,
      address: st.address,
      blockTimeStamp: 3000,
      testArgs: {
        amount: oneAlph * 100n,
      },
      inputAssets: [
        {
          address: staker3,
          asset: {
            alphAmount: oneAlph * 2n,
            tokens: [{ id: token, amount: oneAlph * 100n }],
          },
        },
      ],
    });

    st = res.contracts.find(
      (c) => c.address === staking.address
    ) as StakingTypes.State;

    const stAcc3 = res.contracts.find(
      (c) => c.fields['staker'] === staker3
    ) as StakingAccountTypes.State;

    earned1 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc1],
      blockTimeStamp: 3000,
      testArgs: {
        acc: stAcc1.address,
      },
    });

    earned2 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc2],
      blockTimeStamp: 3000,
      testArgs: {
        acc: stAcc2.address,
      },
    });

    const earned3 = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc3],
      blockTimeStamp: 4000,
      testArgs: {
        acc: stAcc3.address,
      },
    });

    expect(earned1.returns).toEqual(oneAlph * 240n);
    expect(earned2.returns).toEqual(oneAlph * 60n);
    expect(earned3.returns).toEqual(oneAlph * 50n);
  }, 10000);

  test('claim and withdraw', async () => {
    const reward = randomTokenId();
    const rate = (oneAlph * 100n) / 1000n;
    const staker = randomP2PKHAddress();
    const staking = createStaking(reward, rate);
    const token = staking.selfState.fields.tokenId;

    let res = await Staking.tests.stake({
      initialFields: staking.selfState.fields,
      initialAsset: staking.selfState.asset,
      existingContracts: staking.dependencies,
      address: staking.address,
      blockTimeStamp: 0,
      testArgs: {
        amount: oneAlph,
      },
      inputAssets: [
        {
          address: staker,
          asset: {
            alphAmount: oneAlph * 2n,
            tokens: [{ id: token, amount: oneAlph }],
          },
        },
      ],
    });

    let st = res.contracts.find(
      (c) => c.address === staking.address
    ) as StakingTypes.State;
    let stAcc = res.contracts.find(
      (c) => c.fields['staker'] === staker
    ) as StakingAccountTypes.State;

    const earned = await Staking.tests.earned({
      initialFields: st.fields,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc],
      blockTimeStamp: 1000,
      testArgs: {
        acc: stAcc.address,
      },
    });

    expect(earned.returns).toEqual(oneAlph * 100n);

    res = await Staking.tests.claimRewards({
      initialFields: st.fields,
      initialAsset: st.asset,
      address: st.address,
      existingContracts: [...staking.dependencies, stAcc],
      blockTimeStamp: 1000,
      inputAssets: [{ address: staker, asset: { alphAmount: oneAlph * 2n } }],
    });

    st = res.contracts.find(
      (c) => c.address === staking.address
    ) as StakingTypes.State;
    stAcc = res.contracts.find(
      (c) => c.address === stAcc.address
    ) as StakingAccountTypes.State;

    const transferedReward = res.txOutputs.find((o) => o.address === staker);
    const rewardTokens = transferedReward?.tokens?.[0];

    expect(rewardTokens?.id).toEqual(reward);
    expect(rewardTokens?.amount).toEqual(oneAlph * 100n);

    res = await Staking.tests.unstake({
      initialFields: st.fields,
      initialAsset: st.asset,
      address: st.address,
      existingContracts: [stAcc],
      blockTimeStamp: 1000,
      testArgs: {
        amount: oneAlph,
      },
      inputAssets: [{ address: staker, asset: { alphAmount: oneAlph * 2n } }],
    });

    st = res.contracts.find(
      (c) => c.address === staking.address
    ) as StakingTypes.State;

    stAcc = res.contracts.find(
      (c) => c.address === stAcc.address
    ) as StakingAccountTypes.State;

    const transferedTokens = res.txOutputs.find((c) => c.address === staker);
    const tokens = transferedTokens?.tokens?.[0];

    expect(tokens?.id).toEqual(token);
    expect(tokens?.amount).toEqual(oneAlph);
    expect(stAcc).toBe(undefined);
  }, 10000);
});
