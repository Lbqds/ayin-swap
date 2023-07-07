import { ONE_ALPH, web3, Address, SignerProvider, groupOfAddress, DUST_AMOUNT, ALPH_TOKEN_ID } from '@alephium/web3'
import { buildProject, randomP2PKHAddress, } from './fixtures/DexFixture'
import { testAddress, testPrivateKey } from '@alephium/web3-test'
import { MintAyin, BurnAyin, AyinToken, AyinTokenInstance, ChangeAyinOwner } from '../src/contracts/ts'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { waitTxConfirmed as _waitTxConfirmed } from '../scripts/utils'

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
const defaultSigner = new PrivateKeyWallet({ privateKey: testPrivateKey })
const groupIndex = groupOfAddress(testAddress)
const totalSupply = 1n << 255n
const errorPrefix = '[API Error] - Execution error when estimating gas for tx script or contract: '

async function waitTxConfirmed<T extends { txId: string }>(promise: Promise<T>): Promise<T> {
  const result = await promise
  await _waitTxConfirmed(web3.getCurrentNodeProvider(), result.txId, 1)
  return result
}

async function transferAlphTo(to: Address, amount: bigint) {
  return await waitTxConfirmed(defaultSigner.signAndSubmitTransferTx({
    signerAddress: testAddress,
    destinations: [{ address: to, attoAlphAmount: amount }]
  }))
}

async function deployAyinToken(owner: Address) {
  const result = await waitTxConfirmed(AyinToken.deploy(defaultSigner, {
    initialFields: { totalSupply: 0n, owner_: owner },
    initialAttoAlphAmount: ONE_ALPH,
    issueTokenAmount: totalSupply
  }))
  const ayinToken = result.contractInstance
  const contractState = await ayinToken.fetchState()
  expect(contractState.fields.owner_).toEqual(testAddress)
  expect(contractState.fields.totalSupply).toEqual(0n)
  expect(contractState.asset.tokens).toEqual([{ id: ayinToken.contractId, amount: totalSupply }])
  return result
}

async function mintAyin(ayin: AyinTokenInstance, to: Address, amount: bigint, signer: SignerProvider = defaultSigner) {
  return await waitTxConfirmed(MintAyin.execute(signer, {
    initialFields: { ayin: ayin.contractId, to, amount },
    attoAlphAmount: DUST_AMOUNT * 2n
  }))
}

async function changeOwner(ayin: AyinTokenInstance, newOwner: Address, signer: SignerProvider = defaultSigner) {
  return await waitTxConfirmed(ChangeAyinOwner.execute(signer, {
    initialFields: { ayin: ayin.contractId, newOwner }
  }))
}

async function burnAyin(ayin: AyinTokenInstance, amount: bigint, signer: SignerProvider) {
  return await waitTxConfirmed(BurnAyin.execute(signer, {
    initialFields: { ayin: ayin.contractId, amount },
    attoAlphAmount: DUST_AMOUNT * 2n,
    tokens: [{ id: ayin.contractId, amount }]
  }))
}

async function balanceOf(tokenId: string, address = testAddress): Promise<bigint> {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(address)
  if (tokenId === ALPH_TOKEN_ID) return BigInt(balances.balance)
  const balance = balances.tokenBalances?.find((t) => t.id === tokenId)
  return balance === undefined ? 0n : BigInt(balance.amount)
}

describe('test ayin token', () => {
  let ayinToken: AyinTokenInstance
  beforeEach(async () => {
    await buildProject()

    const deployResult = await deployAyinToken(testAddress)
    ayinToken = deployResult.contractInstance
  })

  test('mint', async () => {
    const address = randomP2PKHAddress(groupIndex)
    const ayinBalance0 = await balanceOf(ayinToken.contractId, address)
    expect(ayinBalance0).toEqual(0n)
    const ayinContractState0 = await ayinToken.fetchState()
    expect(ayinContractState0.fields.totalSupply).toEqual(0n)
    expect(ayinContractState0.asset.tokens).toEqual([{ id: ayinToken.contractId, amount: totalSupply }])

    const mintAmount = 100n
    await mintAyin(ayinToken, address, mintAmount)
    const ayinBalance1 = await balanceOf(ayinToken.contractId, address)
    expect(ayinBalance1).toEqual(mintAmount)

    const ayinContractState1 = await ayinToken.fetchState()
    expect(ayinContractState1.fields.totalSupply).toEqual(mintAmount)
    expect(ayinContractState1.asset.tokens).toEqual([{ id: ayinToken.contractId, amount: totalSupply - mintAmount }])
  })

  test('mint:invalid caller', async () => {
    const invalidCaller = PrivateKeyWallet.Random(groupIndex)
    await transferAlphTo(invalidCaller.address, ONE_ALPH)

    const error = `${errorPrefix}AssertionFailedWithErrorCode(${ayinToken.address},${Number(AyinToken.consts.PermissionsErrorCodes.Forbidden)})`
    await expect(mintAyin(ayinToken, randomP2PKHAddress(groupIndex), 10n, invalidCaller)).rejects.toThrowError(error)
  })

  test('burn', async () => {
    const receiver = PrivateKeyWallet.Random(groupIndex)
    await transferAlphTo(receiver.address, ONE_ALPH)
    const mintAmount = 200n
    await mintAyin(ayinToken, receiver.address, mintAmount)
    const ayinBalance0 = await balanceOf(ayinToken.contractId, receiver.address)
    expect(ayinBalance0).toEqual(mintAmount)

    const ayinContractState0 = await ayinToken.fetchState()
    expect(ayinContractState0.fields.totalSupply).toEqual(mintAmount)
    expect(ayinContractState0.asset.tokens).toEqual([{ id: ayinToken.contractId, amount: totalSupply - mintAmount }])

    const burnAmount = 100n
    await burnAyin(ayinToken, burnAmount, receiver)
    const ayinBalance1 = await balanceOf(ayinToken.contractId, receiver.address)
    expect(ayinBalance1).toEqual(mintAmount - burnAmount)

    const ayinContractState1 = await ayinToken.fetchState()
    expect(ayinContractState1.fields.totalSupply).toEqual(mintAmount - burnAmount)
    expect(ayinContractState1.asset.tokens).toEqual([{ id: ayinToken.contractId, amount: totalSupply - mintAmount + burnAmount }])
  })

  test('changeOwner', async () => {
    const newOwner = randomP2PKHAddress(groupIndex)
    const ayinContractState0 = await ayinToken.fetchState()
    expect(ayinContractState0.fields.owner_).toEqual(testAddress)

    await changeOwner(ayinToken, newOwner)
    const ayinContractState1 = await ayinToken.fetchState()
    expect(ayinContractState1.fields.owner_).toEqual(newOwner)
  })

  test('changeOwner:invalid caller', async () => {
    const newOwner = randomP2PKHAddress(groupIndex)
    const invalidCaller = PrivateKeyWallet.Random(groupIndex)
    await transferAlphTo(invalidCaller.address, ONE_ALPH)

    const error = `${errorPrefix}AssertionFailedWithErrorCode(${ayinToken.address},${Number(AyinToken.consts.PermissionsErrorCodes.Forbidden)})`
    await expect(changeOwner(ayinToken, newOwner, invalidCaller)).rejects.toThrowError(error)
  })
})