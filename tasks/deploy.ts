import { task } from 'hardhat/config'
import verify from '../scripts/verify'
import fs from 'fs'

task('deploy').setAction(async ({}, { ethers, network, upgrades }) => {
  const content = JSON.parse(
    fs.readFileSync('./resources/contract-network-config.json', 'utf-8')
  )
  const networkDetails = content['networks'][network.name]

  const ReclaimFactory = await ethers.getContractFactory('Reclaim')
  const Reclaim = await ReclaimFactory.deploy();
  // const Reclaim = await upgrades.deployProxy(
  //   ReclaimFactory,
  //   [],
  //   {
  //     kind: 'uups',
  //     initializer: 'initialize'
  //   }
  // )
  const tx = await Reclaim.deployed()
  const res = await tx.deployTransaction.wait()

  //console.log('Reclaim Implementation deployed to:', res.events[0].args[0])
  console.log('Reclaim Proxy deployed to: ', Reclaim.address)

  
  networkDetails['Reclaim'] = {
    address: Reclaim.address,
    explorer: ''
  }
  content['networks'][network.name] = networkDetails

  fs.writeFileSync(
    './resources/contract-network-config.json',
    JSON.stringify(content)
  )

  await verify(Reclaim.address, network.name, [])
})
