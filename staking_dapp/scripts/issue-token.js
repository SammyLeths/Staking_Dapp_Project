const StakingDapp = artifacts.require('Staking_Dapp')

module.exports = async function(callback){

    let stakingdapp = await StakingDapp.deployed()
    await stakingdapp.issuedummy()

    console.log("dummy tokens issued!")
    callback()


}