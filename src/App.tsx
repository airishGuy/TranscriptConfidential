import React, { Children, useEffect, useState } from 'react';   
import { ethers } from 'ethers';
import { initializeFheInstance, requestUserDecryption } from './lib/fhevm';

import './App.css';
import './index.css';


import {
  GraduationCap,
  Shield,
  Settings,
  FileText,
  Award,
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  Upload,
  File,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../src/components/ui/card"
import { Button } from "../src/components/ui/button"
import { Input } from "../src/components/ui/input"
import { Label } from "../src/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/ui/tabs"
import { Badge } from "../src/components/ui/badge"
import { Alert, AlertDescription } from "../src/components/ui/alert"

import { ConfidentialTranscriptAddresses } from "./abi/ConfidentialTranscriptAddresses";
import { ConfidentialTranscriptABI } from "./abi/ConfidentialTranscriptABI";

import { useMetaMaskEthersSigner } from "./hooks/metamask/useMetaMaskEthersSigner";
import { toast, Toaster } from "sonner";
import { Providers } from './Providers';



// Sepolia network configuration
const SEPOLIA_CONFIG = {
  chainId: '0xaa36a7', // 11155111 in hex
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
}

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
      isConnected?: () => boolean;
    };
  }
}

function AppRoot() {


  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadinguni, setLoadinguni] = useState(false)
  const [loadingpg, setLoadingpg] = useState(false)
  const [loadingcid, setLoadingcid] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [newCID, setNewCID] = useState("")

  // Admin/Owner functions
  const [newUniAddress, setNewUniAddress] = useState("")
  const [newPGAddress, setNewPGAddress] = useState("")

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [cidNumber, setCidNumber] = useState("")
   const [GPA, setGPA] = useState("")


  // University functions
  const [studentAddress, setStudentAddress] = useState("")
  const [studentID, setStudentID] = useState("")
 


  // PG Authority functions
  const [checkStudentAddress, setCheckStudentAddress] = useState("")
  const [gpaThreshold, setGpaThreshold] = useState("350")

  const [isEligibleForScholarship, setIsEligibleForScholarship] = useState(false);
  const [decryptedCid, setDecryptedCid] = useState("")
  const [baseCid, setBaseCid] = useState("");

  // Student functions
  const [tokenIdToRevoke, setTokenIdToRevoke] = useState("");

  const { account, isConnected, disconnect, connect, provider, chainId, ethersSigner, initialMockChains } = useMetaMaskEthersSigner();







  // Initialize FHEVM
//   const initializeFhevm = async () => {
//     setFhevmStatus('loading');
    
//     try {
//       await initializeFheInstance();
//       setFhevmStatus('ready');
//       console.log('✅ FHEVM initialized for React!');
//     } catch (error) {
//       setFhevmStatus('error');
//       console.error('FHEVM initialization failed:', error);
//     }
//   };


  // Wallet connection
//   const connectWallet = async () => {
//     console.log('🔗 Attempting to connect wallet...');
    
//     if (typeof window === 'undefined') {
//       console.error('❌ Window is undefined - not in browser environment');
//       return;
//     }
    
//     if (!window.ethereum) {
//       console.error('❌ No Ethereum provider found. Please install MetaMask or connect a wallet.');
//       alert('Please install MetaMask or connect a wallet to use this app.');
//       return;
//     }
    
//     try {
//       console.log('📱 Requesting accounts...');
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       console.log('✅ Accounts received:', accounts);
      
//       const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
//       console.log('🔗 Chain ID:', chainIdHex);
      
//       setAccount(accounts[0]);
//       setChainId(parseInt(chainIdHex, 16));
//       setIsConnected(true);
      
//       console.log('✅ Wallet connected successfully!');
      
//       // Initialize FHEVM after wallet connection
//       await initializeFhevm();
//     } catch (error) {
//       console.error('❌ Wallet connection failed:', error);
//       alert(`Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   };



const connectWallet = async () => {
    setLoading(true)
    // Simulate wallet connection
    connect();
    setTimeout(() => {
      setWalletConnected(true)
      setWalletAddress(account);
      setLoading(false)
    }, 1000)
  }

// const connectWallet = async () => {
//   try {
//     setLoading(true);
//     connect(); //
//     if (account) {
//       setWalletConnected(true);
//       setWalletAddress(account);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

  const disconnectWallet = () => {
    disconnect();
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        alert("Please select a PDF file")
      }
    }
  }





  const handleSetUniversity = async (account: any) => {
    setLoadinguni(true)
    try {

        const contract = new ethers.Contract(
          ConfidentialTranscriptAddresses["11155111"].address,
          ConfidentialTranscriptABI.abi,
          ethersSigner
        );
        console.log({account});
        const tx = await contract.setUniversity(account);
        const response = await tx.wait()
        console.log({response});
        toast.success("handleSetUniversity Txn success");
        setLoadinguni(false)
    } catch (err) {
        toast.error(JSON.stringify(err));
         setLoadinguni(false)
    }

  }

  const handleSetPGAddress = async (account: any) => {
    setLoadingpg(true)

    try {

        const contract = new ethers.Contract(
          ConfidentialTranscriptAddresses["11155111"].address,
          ConfidentialTranscriptABI.abi,
          ethersSigner
        );
        console.log({account});
        const tx = await contract.setPGAddress(account);
        const response = await tx.wait()
        console.log({response});

        toast.success("handleSetPGAddress Txn success");
        setLoadingpg(false)
    } catch (err) {
        toast.error(JSON.stringify(err));
        setLoadingpg(false)
    }
  }

  

  const handleMintTranscript = async () => {
    setLoading(true)
    console.log(`Signer: ${ethersSigner?.address}`);
     console.log(`Account: ${account}`);
    try {

        // we already have the cid/number from pinata
        //..
         const contract = new ethers.Contract(
          ConfidentialTranscriptAddresses["11155111"].address,
          ConfidentialTranscriptABI.abi,
          ethersSigner
        );

        const formattedGpa = BigInt(Number(GPA) * 100);
        console.log({studentAddress, studentID, cidNumber, formattedGpa});


        const fhe = await initializeFheInstance();
        console.log({fhe});
        const result = await fhe!
        .createEncryptedInput(ConfidentialTranscriptAddresses["11155111"].address, ethersSigner?.address)
        .add256(BigInt(cidNumber))
        .add16(formattedGpa)
        .encrypt();
        console.log({result});


        const tx = await contract.mintTranscriptExternal(studentAddress, studentID, result.handles[0], result.handles[1], result.inputProof);
        const response = await tx.wait()
        console.log({response});


        toast.success("mintTranscriptExternal Txn success");

        setLoading(false)
    } catch(err) {
        console.log(err)
        toast.error(JSON.stringify(err));
        setLoading(false)
    }
 
  }

  const handleCheckEligibility = async () => {

    // pg address decrypts students gpa
    setLoading(true)
    console.log({checkStudentAddress})

    try {
        const contract = new ethers.Contract(
          ConfidentialTranscriptAddresses["11155111"].address,
          ConfidentialTranscriptABI.abi,
          ethersSigner?.provider
        );
        // read encrypted student gpa
        const res = await contract._transcripts(checkStudentAddress);
        const encGpa = res[3];
        console.log({encGpa});

        
        const fhe = await initializeFheInstance();


        let value = BigInt(0);
        const keypair = fhe!.generateKeypair();
        const handleContractPairs = [
            {
                handle: encGpa,
                contractAddress: ConfidentialTranscriptAddresses["11155111"].address,
            },
        ];
        const startTimeStamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = "2"; // String for consistency
        const contractAddresses = [ConfidentialTranscriptAddresses["11155111"].address];

        const eip712 = fhe!.createEIP712(
            keypair.publicKey, 
            contractAddresses, 
            startTimeStamp, 
            durationDays
        );
        

        const signature = await ethersSigner!.signTypedData(
            eip712.domain,
            {
                UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
            },
            eip712.message,
        );

        console.log('Signature:', signature);

        const result = await fhe.userDecrypt(
            handleContractPairs,
            keypair.privateKey,
            keypair.publicKey,
            signature!.replace("0x", ""),
            contractAddresses,
            ethersSigner!.address,
            startTimeStamp,
            durationDays,
        );

        value = BigInt(result[encGpa]);
        console.log({result, value})

        console.log({decryptedValue: String(Number(value) / 100)});
        

        if(Number(gpaThreshold) <= Number(value)) {
            setIsEligibleForScholarship(true)
        } else {
            setIsEligibleForScholarship(false)
        }

        toast.success("handleCheckEligibility Txn success");
        setLoading(false)
    } catch (err) {
        toast.error(JSON.stringify(err));
        setLoading(false)
    }
  }

  const handleRevokeTranscript = async () => {

    
      setLoading(true);
      try {

        const contract = new ethers.Contract(
          ConfidentialTranscriptAddresses["11155111"].address,
          ConfidentialTranscriptABI.abi,
          ethersSigner
        );

 
        const tx = await contract.revokeTranscript(tokenIdToRevoke);
        const response = await tx.wait()
        console.log({response});
        if(!response) return;

        toast.success("revokeTranscript Txn success");
        setLoading(false)
    } catch (err) {
        toast.error(JSON.stringify(err));
        setLoading(false)
    }
  }

  const handleDecryptCID = async () => {
    console.log("handleDecryptCID")
    console.log("Address of student: ", ethersSigner?.address)
    setLoading(true)

    // try {

    //     const contract = new ethers.Contract(
    //       ConfidentialTranscriptAddresses["11155111"].address,
    //       ConfidentialTranscriptABI.abi,
    //       ethersSigner
    //     );

 
    //     const tx = await contract.decryptCid();
    //     const response = await tx.wait()
    //     console.log({response});
    //     if(!response) return;

        // // read value and set
        // const baseCid_ = await contract.cid();
        // console.log({baseCid_});
        // setBaseCid(baseCid_);

    //     const transcript = await contract._transcripts(ethersSigner?.address)
    //     const decryptedVal = await contract.getClearTranscript(ethersSigner?.address);
        
    //     console.log({transcript});
    //     console.log({decryptedValll: decryptedVal});
    //     setDecryptedCid(decryptedVal.toString());


        // toast.success("handleDecryptCID Txn success");
        // setLoading(false)
    // } catch (err) {
        // toast.error(JSON.stringify(err));
        // setLoading(false)
    // }

     try {
        const contract = new ethers.Contract(
          ConfidentialTranscriptAddresses["11155111"].address,
          ConfidentialTranscriptABI.abi,
          ethersSigner?.provider
        );
        // read encrypted student gpa
        const res = await contract._transcripts(ethersSigner?.address);
        const encCID = res[2];
        console.log({encCID});

        
        const fhe = await initializeFheInstance();


        let value = BigInt(0);
        const keypair = fhe!.generateKeypair();
        const handleContractPairs = [
            {
                handle: encCID,
                contractAddress: ConfidentialTranscriptAddresses["11155111"].address,
            },
        ];
        const startTimeStamp = Math.floor(Date.now() / 1000).toString();
        const durationDays = "2"; // String for consistency
        const contractAddresses = [ConfidentialTranscriptAddresses["11155111"].address];

        const eip712 = fhe!.createEIP712(
            keypair.publicKey, 
            contractAddresses, 
            startTimeStamp, 
            durationDays
        );
        

        const signature = await ethersSigner!.signTypedData(
            eip712.domain,
            {
                UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
            },
            eip712.message,
        );

        console.log('Signature:', signature);

        const result = await fhe.userDecrypt(
            handleContractPairs,
            keypair.privateKey,
            keypair.publicKey,
            signature!.replace("0x", ""),
            contractAddresses,
            ethersSigner!.address,
            startTimeStamp,
            durationDays,
        );

        value = BigInt(result[encCID]);
        console.log({result, value})

        console.log({decryptedValue: value.toString()});

        // read value and set
        const baseCid_ = await contract.cid();
        console.log({baseCid_});
        setBaseCid(baseCid_);

        
        setDecryptedCid(value.toString());

        toast.success("handleDecryptCID Txn success");
        setLoading(false)
        
    } catch (err) {
        toast.error(JSON.stringify(err));
        setLoading(false)
    }
  }


//   const handleSetCID = async () => {

//     setLoadingcid(true);
//       try {

//         const contract = new ethers.Contract(
//           ConfidentialTranscriptAddresses["11155111"].address,
//           ConfidentialTranscriptABI.abi,
//           ethersSigner
//         );

 
//         const tx = await contract.setCid(newCID);
//         const response = await tx.wait()
//         console.log({response});
//         if(!response) return;

//         toast.success("setCid Txn success");
//         setLoadingcid(false)
//     } catch (err) {
//         toast.error(JSON.stringify(err));
//         setLoadingcid(false)
//     }

//   }

useEffect(() => {
  if (account) {
    setWalletConnected(true);
    setWalletAddress(account);
  }
}, [account]);


  return (
    <div>
            <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card mb-10">
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zama-gray-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Wagmi State University</h1>
              <p className="text-sm text-muted-foreground">Student Portal</p>
            </div>
          </div>

          {!walletConnected ? (
            <Button onClick={connectWallet} disabled={loading} className="bg-[#000000] text-[#ffffff]">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
                {/* <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                <button className="cursor-pointer" onClick={disconnectWallet}>Disconnect</button></Badge> */}
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Connected
              </Badge>
  
              {/* <code className="text-sm text-muted-foreground font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </code> */}

              {walletAddress ? (
  <code className="text-sm text-muted-foreground font-mono">
    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
  </code>
) : (
  <span className="text-sm text-muted-foreground">Not connected</span>
)}
            </div>
          )}
          
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!walletConnected ? (
          <Card className="max-w-md mx-auto mt-20 bg-card border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 bg-zama-gray-100">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-foreground">Connect Your Wallet</CardTitle>
              <CardDescription className="text-muted-foreground">
                Connect your wallet to interact with Wagmi State University Student Portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="w-full bg-[#000000] text-[#ffffff]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {txHash && (
              <Alert className="mb-6 bg-success/10 border-success/30">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success-foreground">
                  Transaction successful: <code className="text-xs font-mono">{txHash}</code>
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="admin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-card border border-border">
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-[#000000] data-[state=active]:text-[#ffffff]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
                <TabsTrigger
                  value="university"
                  className="data-[state=active]:bg-[#000000] data-[state=active]:text-[#ffffff]"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  University
                </TabsTrigger>
                <TabsTrigger
                  value="pg-authority"
                  className="data-[state=active]:bg-[#000000] data-[state=active]:text-[#ffffff]"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  PG Authority
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-[#000000] data-[state=active]:text-[#ffffff]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Student
                </TabsTrigger>
              </TabsList>

              {/* Admin Tab */}
              <TabsContent value="admin" className="space-y-6">
                
                <div className="grid gap-6 md:grid-cols-2">
                    
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Settings className="w-5 h-5 text-primary" />
                        Set University Address
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Update the authorized university address (Owner only)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="uni-address" className="text-foreground">
                          University Address
                        </Label>
                        <Input
                          id="uni-address"
                          placeholder="0x..."
                          value={newUniAddress}
                          onChange={(e) => setNewUniAddress(e.target.value)}
                          className="bg-input border-border text-foreground font-mono"
                        />
                      </div>
                      <Button
                        onClick={() => handleSetUniversity(newUniAddress)}
                        disabled={loading || !newUniAddress}
                        className="w-full bg-black text-[#ffffff] hover:bg-primary/90"
                      >
                        {loadinguni ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Set University"
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Shield className="w-5 h-5 text-primary" />
                        Set PG Authority Address
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Update the post-graduate authority address (Owner only)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pg-address" className="text-foreground">
                          PG Authority Address
                        </Label>
                        <Input
                          id="pg-address"
                          placeholder="0x..."
                          value={newPGAddress}
                          onChange={(e) => setNewPGAddress(e.target.value)}
                          className="bg-input border-border text-foreground font-mono"
                        />
                      </div>
                      <Button
                        onClick={() => handleSetPGAddress(newPGAddress)}
                        disabled={loading || !newPGAddress}
                        className="w-full bg-black text-[#ffffff] hover:bg-primary/90"
                      >
                        {loadingpg ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Set PG Authority"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* University Tab */}
              <TabsContent value="university" className="space-y-6">
                <div className="grid gap-6">

               

                  
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Mint Transcript
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Issue an encrypted transcript to a student (University only)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="student-address" className="text-foreground">
                            Student Address
                          </Label>
                          <Input
                            id="student-address"
                            placeholder="0x..."
                            value={studentAddress}
                            onChange={(e) => setStudentAddress(e.target.value)}
                            className="bg-input border-border text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-id" className="text-foreground">
                            Student ID
                          </Label>
                          <Input
                            id="student-id"
                            placeholder="12345"
                            value={studentID}
                            onChange={(e) => setStudentID(e.target.value)}
                            className="bg-input border-border text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enc-cid" className="text-foreground">
                            CID Number {/* Added helper text */}
                      
                              {/* <Badge variant="outline" className="ml-2 text-xs">
                                Auto-filled
                              </Badge> */}
       
                          </Label>
                          <Input
                            id="enc-cid"
                            placeholder="cid number"
                            value={cidNumber}
                            onChange={(e) => setCidNumber(e.target.value)}
                            className="bg-input border-border text-foreground font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="enc-gpa" className="text-foreground">
                            CGPA
                          </Label>
                          <Input
                            id="enc-gpa"
                            placeholder="CGPA"
                            value={GPA}
                            onChange={(e) => setGPA(e.target.value)}
                            className="bg-input border-border text-foreground font-mono"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleMintTranscript}
                        disabled={loading || !studentAddress || !studentID}
                        className="w-full bg-primary hover:bg-primary/90 text-[#ffffff]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          "Mint Transcript"
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground ">
                        <XCircle className="w-5 h-5 text-destructive" />
                        Revoke Transcript
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Revoke a student's transcript by token ID
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="revoke-token" className="text-foreground">
                          Token ID
                        </Label>
                        <Input
                          id="revoke-token"
                          placeholder="12345"
                          value={tokenIdToRevoke}
                          onChange={(e) => setTokenIdToRevoke(e.target.value)}
                          className="bg-input border-border text-foreground"
                        />
                      </div>
                      <Button
                        onClick={handleRevokeTranscript}
                        disabled={loading || !tokenIdToRevoke}
                        variant="destructive"
                        className="w-full text-[#ffffff]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Revoking...
                          </>
                        ) : (
                          "Revoke Transcript"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* PG Authority Tab */}
              <TabsContent value="pg-authority" className="space-y-6">
                <Card className="bg-card border-border max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Award className="w-5 h-5 text-primary" />
                      Check Student Scholarship Eligibility
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Verify if a student meets the CGPA threshold without revealing their actual CGPA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="check-student" className="text-foreground">
                        Student Address
                      </Label>
                      <Input
                        id="check-student"
                        placeholder="0x..."
                        value={checkStudentAddress}
                        onChange={(e) => setCheckStudentAddress(e.target.value)}
                        className="bg-input border-border text-foreground font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold" className="text-foreground">
                        CGPA Threshold (scaled by 100)
                      </Label>
                      <Input
                        id="threshold"
                        type="number"
                        placeholder="350"
                        value={gpaThreshold}
                        onChange={(e) => setGpaThreshold(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                      <p className="text-xs text-muted-foreground">Example: 350 = 3.50 CGPA</p>
                    </div>
                    <Button
                      onClick={handleCheckEligibility}
                      disabled={loading || !checkStudentAddress}
                      className="w-full bg-primary hover:bg-primary/90 text-[#ffffff]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        "Check Eligibility"
                      )}
                    </Button>
                  </CardContent>
                  {
                    isEligibleForScholarship 
                    ? (<div className="text-center text-xl font-bold text-green-400 mb-4">This student is eligible for scholarship.</div>)
                    : (<div className="text-center text-xl font-bold text-red-400 mb-4">This student is not eligible for scholarship.</div>)

                  }
                </Card>
              </TabsContent>

              {/* Student Tab */}
              <TabsContent value="student" className="space-y-6">
                <Card className="bg-card border-border max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="w-5 h-5 text-primary" />
                      Decrypt Your CID
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Request decryption of your transcript's CID
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert className="bg-muted/50 border-border">
                      <AlertDescription className="text-muted-foreground">
                        This will initiate a decryption request for your encrypted CID. The decrypted value will be
                        available after the callback is processed.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={handleDecryptCID}
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-[#ffffff]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Requesting...
                        </>
                      ) : (
                        "Reveal Transcript"
                      )}
                    </Button>
                  </CardContent>
                  
                </Card>
              </TabsContent>
            </Tabs>
            {
                    decryptedCid &&  (<div className="text-center text-green-400 mt-10">
                       <span className="font-bold text-xl">CID</span>
                    <br />
                    <a href={`https://ipfs.io/ipfs/${baseCid}/${decryptedCid}.pdf`} target="_blank">https://ipfs.io/ipfs/{baseCid}/{decryptedCid}.pdf</a>
                     </div>)
                    

                  }
          </>
        )}
      </main>
    </div>
    </div>
    
  )

}



export default function App() {
  return (
    <div>
      <Providers>
        <AppRoot />
      </Providers>
      <Toaster position="bottom-center" toastOptions={{ className: "toast" }} />
    </div>
  );
}


