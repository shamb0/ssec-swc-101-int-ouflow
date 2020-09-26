import { expect } from './setup'

/* External Imports */
import { ethers } from '@nomiclabs/buidler'
import { Contract, ContractFactory, Signer, BigNumber, utils, providers } from 'ethers'
import {
  getContractFactory, sleep, sendLT, getBalanceLT
} from './test-utils'

import { getLogger } from './test-utils'

import { GAS_LIMIT } from './test-helpers'

const log = getLogger('TimeLock-Test')

describe('TimeLock Attack Test', () => {
  let wallet: Signer
  let owner1: Signer
  let owner2: Signer
  let deployproxycont:boolean = false

  before(async () => {
    ;[wallet, owner1, owner2] = await ethers.getSigners()

    log.info(`Admin :: ${await wallet.getAddress()}`)
    log.info(`Own1 :: ${await owner1.getAddress()}`)
    log.info(`Own2 :: ${await owner2.getAddress()}`)
  })

  let timelockfact: ContractFactory
  let timelockinst: Contract
  before(async () => {

    timelockfact = getContractFactory( "TimeLock", wallet )

    log.debug( `Network Gas price @ ${await ethers.provider.getGasPrice()}`)

    // Deploy the implementation part of the logic
    timelockinst = await timelockfact.deploy();

    log.debug( `TimeLock @ ${timelockinst.address}`)

    log.debug(`S1-Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    const transamount = ethers.utils.parseUnits( "2", 18 );

    const receipt = await wallet.sendTransaction({
                              to: timelockinst.address,
                              value: transamount,
                              gasLimit: GAS_LIMIT,
                            })

    await timelockinst.provider.waitForTransaction( receipt.hash )

    const bal = await timelockinst.provider.getBalance( timelockinst.address );

    log.debug(`timelockinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S1-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  let attackfact: ContractFactory
  let attackinst: Contract
  before(async () => {

    log.debug(`S2-Ent wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

    attackfact = getContractFactory( "TimeLockAttack", wallet )

    // Deploy the implementation part of the logic
    attackinst = await attackfact.deploy( timelockinst.address )

    const transamount = ethers.utils.parseUnits( "2", 18 );

    const receipt = await wallet.sendTransaction({
      to: attackinst.address,
      value: transamount,
      gasLimit: GAS_LIMIT,
    })

    await timelockinst.provider.waitForTransaction( receipt.hash )

    const bal = await attackinst.provider.getBalance( attackinst.address );

    log.debug(`timelockattackinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug( `Attack @ ${attackinst.address}`)

    log.debug(`S2-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)
  })

  it("tst-item-001", async () => {

      try {

      log.debug(`S3-Ent :: ${ethers.utils.formatUnits( await wallet.getBalance(), "ether")}`)

      const transamount = ethers.utils.parseUnits( "1", 18 );

      // calldata to invoke the function pwnTimeLock
      const pwnTimeLockCalldata = attackinst.interface.encodeFunctionData(
                                                        'pwnTimeLock'
                                                        )

      await attackinst.provider.call({
        to: attackinst.address,
        data: pwnTimeLockCalldata,
        value: transamount,
        gasLimit: GAS_LIMIT,
      })

      log.debug(`S3-Ext :: ${ethers.utils.formatUnits( await wallet.getBalance(), "ether")}`)
    }
    catch( err ){

      log.error(`Exception Err ${err}`)
    }

  })

  afterEach("Test-Case End Contract Status", async () => {

    let bal = await timelockinst.provider.getBalance( timelockinst.address );

    log.debug(`timelockinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await attackinst.provider.getBalance( attackinst.address );

    log.debug(`attackinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S4-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

  afterEach("Test Done Cleanup", async () => {

    await timelockinst.withdrawEth();
    await attackinst.withdrawEth();

    let bal = await timelockinst.provider.getBalance( timelockinst.address );

    log.debug(`timelockinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    bal = await attackinst.provider.getBalance( attackinst.address );

    log.debug(`attackinst balance :: ${ethers.utils.formatUnits( bal , "ether" )}`)

    log.debug(`S5-Ext wallet bal :: ${ethers.utils.formatUnits(await wallet.getBalance(), "ether")}`)

  })

})
