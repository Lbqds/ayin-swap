import { DUST_AMOUNT, ONE_ALPH, web3 } from '@alephium/web3';
import {
  expectAssertionError,
  randomContractAddress,
  randomContractId,
} from '@alephium/web3-test';
import { AyinPresale } from '../src/contracts/ts';
import { buildProject, randomP2PKHAddress } from './fixtures/DexFixture';

describe('Presale', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973');

  beforeEach(async () => {
    await buildProject();
  });

  test('Presale flow', async () => {
    const owner = randomP2PKHAddress();
    const buyer = randomP2PKHAddress();
    const ayinToken = randomContractId();
    const tokensForSale = 100n * ONE_ALPH;
    const alphPerToken = ONE_ALPH;

    const state = AyinPresale.stateForTest(
      {
        ayinToken,
        tokensForSale,
        alphPerToken,
        saleOpen: true,
        tokensSold: 0n,
        owner_: owner,
      },
      {
        alphAmount: ONE_ALPH,
        tokens: [
          {
            id: ayinToken,
            amount: tokensForSale,
          },
        ],
      },
      randomContractAddress()
    );

    // Happy path
    const result = await AyinPresale.tests.buy({
      initialFields: state.fields,
      initialAsset: state.asset,
      testArgs: {
        amount: tokensForSale,
      },
      inputAssets: [
        {
          address: buyer,
          asset: {
            alphAmount: tokensForSale + ONE_ALPH,
          },
        },
      ],
    });

    const token = result.txOutputs.find((t) => t.address === buyer);
    expect(token?.tokens?.[0]).toMatchObject({
      id: ayinToken,
      amount: tokensForSale,
    });

    // Fail (not enough ayin)
    const failResult = AyinPresale.tests.buy({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      testArgs: {
        amount: tokensForSale + ONE_ALPH,
      },
      inputAssets: [
        {
          address: buyer,
          asset: {
            alphAmount: tokensForSale + ONE_ALPH,
          },
        },
      ],
    });

    expectAssertionError(failResult, state.address, 1);
  });
});
