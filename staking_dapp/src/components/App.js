import { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import TetherToken from '../build/Tether_Token.json';
import DummyToken from '../build/Dummy_Token.json';
import StakingDapp from '../build/Staking_Dapp.json';
import Navbar from '../components/Navbar.js'
import Main from '../components/Main.js'

class App extends Component{

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account : accounts[0]})

    const netwrokId = await web3.eth.net.getId()

    const TetherTokenData = TetherToken.networks[netwrokId]

    if(TetherTokenData){

      const tetherToken = new web3.eth.Contract(TetherToken.abi,TetherTokenData.address)
      this.setState({tetherToken})
      let tethertokenbalance = await tetherToken.methods.balance(this.state.account).call()
      this.setState({ tethertokenbalance : tethertokenbalance.toString() })

    }else {
      window.alert('Tether token contract not deployed to detected network.')
    }

    const DummyTokenData = DummyToken.networks[netwrokId]

    if(DummyTokenData){

      const dummyToken = new web3.eth.Contract(DummyToken.abi,DummyTokenData.address)
      this.setState({dummyToken})
      let dummytokenbalance = await dummyToken.methods.balance(this.state.account).call()
      this.setState({dummytokenbalance : dummytokenbalance.toString()})

    }else {
      window.alert('Dummy token contract not deployed to detected network.')
    }

    const StakingDappData = DummyToken.networks[netwrokId]

    if(StakingDappData){

      const stakingdapp = new web3.eth.Contract(StakingDapp.abi,StakingDappData.address)
      this.setState({stakingdapp})
      let stakingdappbalance = await stakingdapp.methods.stakingBalance(this.state.account).call()
      this.setState({stakingdappbalance : stakingdappbalance.toString()})
    }else {
      window.alert('Staking Dapp contract not deployed to detected network.')
    }

    this.setState({ loading: false })

  }

  async loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
}

  stakeTokens = (amount) =>{
    this.setState({loading: true})
    this.state.tetherToken.methods.approve(this.state.stakingdapp._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.stakingdapp.methods.stakeTokens(amount).send({from:this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading:false})
      })
    })
  }

  unstakeTokens = (amount) =>{
    this.setState({loading: true})
    this.state.stakingdapp.methods.unstakeTokens().send({from:this.state.account}).on('transactionHash', (hash) =>{
      this.setState({loading: false})
    })
  }

  constructor(props){
    super(props)
    this.state = {
      account:'0x0',
      tetherToken:{},
      dummyToken:{},
      stakingdapp:{},
      tethertokenbalance: '0',
      dummytokenbalance: '0',
      stakingdappbalance: '0',
      loading: true

    }
  }

  render(){
    let content
    if(this.state.loading){
      content = <p id='loader' className="text-center">Loading...</p>
    } else{
      content = <Main
        tethertokenbalance = {this.state.tethertokenbalance}
        dummytokenbalance = {this.state.dummytokenbalance}
        stakingdappbalance = {this.state.stakingdappbalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens = {this.unstakeTokens}
      /> 
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://www.blockchain-council.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
export default App;



