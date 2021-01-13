import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout"; 
const bs58 = require('bs58');

const connection = new Connection("http://localhost:8899", 'singleGossip');

export const takeTrade = async (
    privateKey: string,
    escrowAccountAddressString: string,
    bobXTokenAccountAddressString: string,
    bobYTokenAccountAddressString: string,
    bobExpectedXTokenAmount: number,
    programIdString: string,
) => {
    const bobAccount = new Account(bs58.decode(privateKey));
    const escrowAccountPubkey = new PublicKey(escrowAccountAddressString);
    const bobXTokenAccountPubkey = new PublicKey(bobXTokenAccountAddressString);
    const bobYTokenAccountPubkey = new PublicKey(bobYTokenAccountAddressString);
    const programId = new PublicKey(programIdString);

    let encodedEscrowState;
    try {
        encodedEscrowState = (await connection.getAccountInfo(escrowAccountPubkey, 'singleGossip'))!.data;
    } catch (err) {
        throw new Error("Could not find escrow at given address!")
    }
    const decodedEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
    const escrowState =  {
        escrowAccountPubkey: escrowAccountPubkey,
        isInitialized: !!decodedEscrowLayout.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedEscrowLayout.initializerPubkey),
        XTokenTempAccountPubkey: new PublicKey(decodedEscrowLayout.initializerTempTokenAccountPubkey),
        initializerYTokenAccount: new PublicKey(decodedEscrowLayout.initializerReceivingTokenAccountPubkey),
        expectedAmount: new BN(decodedEscrowLayout.expectedAmount, 10, "le")
    };

    const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], programId);

    const exchangeInstruction = new TransactionInstruction({
        programId,
        data: Buffer.from(Uint8Array.of(1, ...new BN(bobExpectedXTokenAmount).toArray("le", 8))),
        keys: [
            { pubkey: bobAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: bobYTokenAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: bobXTokenAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: escrowState.XTokenTempAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowState.initializerAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowState.initializerYTokenAccount, isSigner: false, isWritable: true},
            { pubkey: escrowAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
            { pubkey: PDA[0], isSigner: false, isWritable: false}
        ] 
    })

    await connection.sendTransaction(new Transaction().add(exchangeInstruction), [bobAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});
}
