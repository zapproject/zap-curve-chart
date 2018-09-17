import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
export const providerUrl = 'wss://kovan.infura.io/ws';


async function main() {
  const mnemonic = 'protect dumb smart toddler journey spawn same dry season ecology scissors more';

  const web3: any = new Web3(new HDWalletProvider(mnemonic, providerUrl));
  const accounts: string[] = await web3.eth.getAccounts();
  const account = accounts[0];


  const canvas = document.getElementById('chart');
  console.log('canvas', canvas);
}

main();