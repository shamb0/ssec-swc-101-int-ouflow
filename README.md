# ssec-swc-101-int-ouflow | Solidity | Security | SWC-101 | Integer Overflow and Underflow

---

## Reference

* [HackPedia: 16 Solidity Hacks/Vulnerabilities, their Fixes and Real World Examples | by vasa | HackerNoon.com | Medium](https://medium.com/hackernoon/hackpedia-16-solidity-hacks-vulnerabilities-their-fixes-and-real-world-examples-f3210eba5148)

* [SWC-101 · Overview](https://swcregistry.io/docs/SWC-101)

* [Using the maximum integer in Solidity - General - OpenZeppelin Community](https://forum.openzeppelin.com/t/using-the-maximum-integer-in-solidity/3000/7)

---

## Example-1

**Howto Install & build**

```shell
git clone https://github.com/shamb0/ssec-swc-101-int-ouflow.git
cd ssec-swc-101-int-ouflow
yarn install
yarn build
```

### TimeLock ( Vulnarable One )

```shell
master $ env DEBUG="info*,debug*,error*" yarn run test ./test/TimeLock.spec.ts
yarn run v1.22.4
$ yarn run test:contracts ./test/TimeLock.spec.ts
$ cross-env SOLPP_FLAGS="FLAG_IS_TEST,FLAG_IS_DEBUG" buidler test --show-stack-traces ./test/TimeLock.spec.ts
$(process.argv.length)
All contracts have already been compiled, skipping compilation.


  TimeLock Attack Test
  info:TimeLock-Test Admin :: 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff +0ms
  info:TimeLock-Test Own1 :: 0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 +1ms
  info:TimeLock-Test Own2 :: 0xD1D84F0e28D6fedF03c73151f98dF95139700aa7 +0ms
  debug:TimeLock-Test Network Gas price @ 8000000000 +0ms
  debug:TimeLock-Test TimeLock @ 0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA +48ms
  debug:TimeLock-Test S1-Ent wallet bal :: 9.9979632 +3ms
Info@TimeLock.sol::receive ContBal(2000000000000000000)
  debug:TimeLock-Test timelockinst balance :: 2.0 +32ms
  debug:TimeLock-Test S1-Ext wallet bal :: 7.997783024 +3ms
  debug:TimeLock-Test S2-Ent wallet bal :: 7.997783024 +3ms
Info@TimeLockAttack.sol::constructor ContBal(0)
Info@TimeLockAttack.sol::receive ContBal(2000000000000000000)
  debug:TimeLock-Test timelockattackinst balance :: 2.0 +72ms
  debug:TimeLock-Test Attack @ 0xaC8444e7d45c34110B34Ed269AD86248884E78C7 +0ms
  debug:TimeLock-Test S2-Ext wallet bal :: 5.993891928 +3ms
  debug:TimeLock-Test S3-Ent :: 5.993891928 +4ms
Info@TimeLockAttack.sol::pwnTimeLock Sender(0x17ec8597ff92c3f44523bdc65bf0f1be632917ff)
Info@TimeLockAttack.sol::pwnTimeLock Val(1000000000000000000)
Info@TimeLockAttack.sol::pwnTimeLock ContBal(3000000000000000000)
Info@TimeLockAttack.sol::pwnTimeLock ContBal(2000000000000000000)
Info@TimeLockAttack.sol::pwnTimeLock L1 timelock(1601655717)
Info@TimeLockAttack.sol::pwnTimeLock L2 timelock(0)
Info@TimeLockAttack.sol::receive ContBal(3000000000000000000)
Info@TimeLockAttack.sol::pwnTimeLock ContBal(3000000000000000000)
  debug:TimeLock-Test S3-Ext :: 5.993891928 +56ms
    ✓ tst-item-001 (59ms)
  debug:TimeLock-Test timelockinst balance :: 2.0 +2ms
  debug:TimeLock-Test attackinst balance :: 2.0 +2ms
  debug:TimeLock-Test S4-Ext wallet bal :: 5.993891928 +2ms
  debug:TimeLock-Test timelockinst balance :: 0.0 +97ms
  debug:TimeLock-Test attackinst balance :: 0.0 +2ms
  debug:TimeLock-Test S5-Ext wallet bal :: 9.99343276 +2ms


  1 passing (537ms)

Done in 8.14s.
```

### EtherStoreFixed ( Fixed with best practise solutions )

```shell
master$ env DEBUG="info*,error*,debug*" yarn run test ./test/TimeLockFixed.spec.ts
yarn run v1.22.4
$ yarn run test:contracts ./test/TimeLockFixed.spec.ts
$ cross-env SOLPP_FLAGS="FLAG_IS_TEST,FLAG_IS_DEBUG" buidler test --show-stack-traces ./test/TimeLockFixed.spec.ts
$(process.argv.length)
All contracts have already been compiled, skipping compilation.

  TimeLock Attack Test
  info:TimeLock-Test Admin :: 0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff +0ms
  info:TimeLock-Test Own1 :: 0x63FC2aD3d021a4D7e64323529a55a9442C444dA0 +0ms
  info:TimeLock-Test Own2 :: 0xD1D84F0e28D6fedF03c73151f98dF95139700aa7 +0ms
  debug:TimeLock-Test Network Gas price @ 8000000000 +0ms
  debug:TimeLock-Test TimeLock @ 0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA +50ms
  debug:TimeLock-Test Ent wallet bal :: 25310251388.2015432504 +3ms
Info@TimeLock.sol::receive ContBal(5000000000000000000)
  debug:TimeLock-Test timelockinst balance :: 5.0 +22ms
  debug:TimeLock-Test Ext wallet bal :: 25310251383.2013630744 +3ms
Info@TimeLockAttack.sol::constructor ContBal(0)
  debug:TimeLock-Test Attack @ 0xaC8444e7d45c34110B34Ed269AD86248884E78C7 +58ms
  debug:TimeLock-Test Enter :: 25310251383.1976521544 +3ms
Info@TimeLockAttack.sol::pwnTimeLock Sender(0x17ec8597ff92c3f44523bdc65bf0f1be632917ff)
Info@TimeLockAttack.sol::pwnTimeLock Val(1000000000000000000)
Info@TimeLockAttack.sol::pwnTimeLock ContBal(1000000000000000000)
Info@TimeLockAttack.sol::pwnTimeLock ContBal(0)
Info@TimeLockAttack.sol::pwnTimeLock L1 timelock(1601625371)
  error:TimeLock-Test Exception Err Error: VM Exception while processing transaction: revert SafeMath: addition overflow +0ms

  info:TimeLock-Test Time Stamp after error :: 0 +230ms
    ✓ tst-item-001 (67ms)
  debug:TimeLock-Test timelockinst balance :: 5.0 +67ms
  debug:TimeLock-Test attackinst balance :: 0.0 +3ms
  debug:TimeLock-Test wallet bal :: 25310251383.1976521544 +2ms
  debug:TimeLock-Test timelockinst balance :: 0.0 +74ms
  debug:TimeLock-Test attackinst balance :: 0.0 +2ms
  debug:TimeLock-Test wallet bal :: 25310251388.1972465864 +3ms


  1 passing (497ms)

Done in 8.06s.
```

---
