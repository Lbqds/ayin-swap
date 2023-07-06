import {
  addressFromContractId,
  binToHex,
  DUST_AMOUNT,
  encodeAddress,
  ONE_ALPH,
  stringToHex,
} from '@alephium/web3';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import {
  ClaimRewards,
  Stake,
  StakingAccount,
  StakingAccountTypes,
  StakingTypes,
  Unstake,
} from '../contracts/ts';
import { network } from '../utils/consts';
import { bigIntToString } from '../utils/dex';
import { useAlephiumWallet, useAvailableBalances } from './useAlephiumWallet';

export function useStaking() {
  const wallet = useAlephiumWallet();
  const [stakingState, setStakingState] = useState<StakingTypes.Fields>();
  const [lpTokenBalance, setLpTokenBalance] = useState('0.0');
  const [stakingAccountState, setStakingAccountState] =
    useState<StakingAccountTypes.Fields>();
  const [currentRewards, setCurrentRewards] = useState('0.0');

  const balance = useAvailableBalances();

  const { staking } = network;

  useEffect(() => {
    if (balance === undefined) return;
    if (stakingState === undefined) return;

    const { tokenId } = stakingState;
    const lpBalance = balance.get(tokenId);

    if (lpBalance) {
      setLpTokenBalance(bigIntToString(lpBalance, 18));
    }
  }, [balance, stakingState]);

  useEffect(() => {
    if (stakingAccountState === undefined) return;
    if (stakingState === undefined) return;

    const { rewards, amountStaked } = stakingAccountState;

    const { rewardRate, totalAmountStaked, lastUpdateTime } = stakingState;

    const interval = setInterval(() => {
      const timeDelta = BigInt(Date.now()) - lastUpdateTime;

      const earnedRewards =
        ((amountStaked * rewardRate) / totalAmountStaked) * timeDelta + rewards;

      setCurrentRewards(bigIntToString(earnedRewards, 18));
    }, 1000);

    return () => clearInterval(interval);
  }, [stakingState, stakingAccountState]);

  const getStakingAccount = async (address: string) => {
    const result = await staking.methods.getStakingAccount({
      args: {
        staker: address,
      },
    });

    const stakingAcc = StakingAccount.at(addressFromContractId(result.returns));

    return stakingAcc;
  };

  const fetchStakingState = async () => {
    const state = await staking.fetchState();

    setStakingState(state.fields);
  };

  const fetchStakingAccountState = async () => {
    if (wallet === undefined || wallet.signer.explorerProvider === undefined)
      return;

    const stakingAcc = await getStakingAccount(wallet.address);

    try {
      const res = await stakingAcc.fetchState();
      setStakingAccountState(res.fields);
    } catch {
      void 0;
    }
  };

  const stake = useCallback(
    async (ayinAmount: string) => {
      if (wallet === undefined) return;
      if (stakingState === undefined) return;

      const alphAmount =
        stakingAccountState !== undefined
          ? DUST_AMOUNT
          : ONE_ALPH + DUST_AMOUNT;

      const amount = parseUnits(ayinAmount, 18).toBigInt();

      await Stake.execute(wallet.signer, {
        initialFields: {
          staking: staking.contractId,
          amount,
        },
        attoAlphAmount: alphAmount,
        tokens: [
          {
            id: stakingState.tokenId,
            amount,
          },
        ],
      });
    },
    [wallet, stakingState]
  );

  const unstake = useCallback(
    async (ayinAmount: string) => {
      if (wallet === undefined) return;
      if (stakingState === undefined) return;

      const amount = parseUnits(ayinAmount, 18).toBigInt();

      await Unstake.execute(wallet.signer, {
        initialFields: {
          staking: staking.contractId,
          amount,
        },
      });
    },
    [wallet, stakingState]
  );

  const claimRewards = useCallback(async () => {
    if (wallet === undefined) return;
    if (stakingAccountState === undefined) return;

    await ClaimRewards.execute(wallet.signer, {
      initialFields: {
        staking: staking.contractId,
      },
      attoAlphAmount: DUST_AMOUNT,
    });
  }, [wallet, stakingAccountState]);

  useEffect(() => {
    if (wallet === undefined) return;

    fetchStakingState();
    fetchStakingAccountState();
  }, [wallet]);

  return {
    stakingState,
    stakingAccountState,
    currentRewards,
    lpTokenBalance,
    stake,
    unstake,
    claimRewards,
  };
}
