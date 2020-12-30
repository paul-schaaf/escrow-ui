<template>
  <div class="bg">
    <p class="title">Escrow UI (devnet)</p>
    <div>
      <div class="mb-1">
          <label for="2020-12-24-programId-escrow-alice">Throwaway private key</label>
          <input class="display-block" type="text" v-model="privateKey">
      </div>
      <div class="mb-1">
          <label for="2020-12-24-programId-escrow-alice">Program id</label>
          <input class="display-block" type="text" id="2020-12-24-programId-escrow-alice" v-model="programId">
      </div>
      <div class="mb-1">
          <label for="">Alice's X token account pubkey</label>
          <input class="display-block" type="text" v-model="aliceTokenXPubkey">
      </div>
      <div class="mb-1">
          <label for="">Amount of X tokens to send to escrow</label>
          <input class="display-block" type="number" v-model="amountXTokensToSendToEscrow">
      </div>
      <div class="mb-1">
          <label for="">Alice's Y token account pubkey</label>
          <input class="display-block" type="text" v-model="aliceTokenYPubkey">
      </div>
      <div class="mb-1">
          <label for="">Amount of Y tokens Alice wants</label>
          <input class="display-block" type="number" v-model="amountYTokensAliceExpects">
      </div>
      <div class="mb-1">
          <input style="margin-right: 5px;" class="cursor-pointer border-none bg-btn normal-font-size" type="submit" value="Reset UI" @click="resetAliceUI">
          <input class="cursor-pointer border-none bg-btn normal-font-size" type="submit" value="Init escrow" @click="onInitEscrow">
      </div>
    </div>
    <div>
      <div class="mb-1">
        Escrow account:
        <div>{{ escrowState.escrowAccountPubkey ?? '--' }}</div>
      </div>
      <div class="mb-1">
        Decoded State
      </div>
      <div class="mb-1">
        Is initialized:
        <div>{{ escrowState.isInitialized ?? '--' }}</div>
      </div>
      <div class="mb-1">
        Initializer account:
        <div>{{ escrowState.initializerAccountPubkey ?? '--' }}</div>
      </div>
      <div class="mb-1">
        X token temp account:
        <div>{{ escrowState.XTokenTempAccountPubkey ?? '--' }}</div>
      </div>
      <div class="mb-1">
        Initializer Y token account:
        <div>{{ escrowState.initializerYTokenAccount ?? '--' }}</div>
      </div>
      <div class="mb-1">
        ExpectedAmount:
        <div>{{ escrowState.expectedAmount ?? '--' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { initEscrow } from "./util/initEscrow";

interface EscrowState {
    escrowAccountPubkey: null | string;
    isInitialized: null | boolean;
    initializerAccountPubkey: null | string;
    XTokenTempAccountPubkey: null | string;
    initializerYTokenAccount: null | string;
    expectedAmount: null | number;
}

export default defineComponent({
  setup() {
    const privateKey = ref("");
    const programId = ref("");
    const aliceTokenXPubkey = ref("");
    const aliceTokenYPubkey = ref("");
    const amountXTokensToSendToEscrow = ref(0);
    const amountYTokensAliceExpects = ref(0);

    const escrowState: EscrowState = reactive({
      escrowAccountPubkey: null,
      isInitialized: null,
      initializerAccountPubkey: null,
      XTokenTempAccountPubkey: null,
      initializerYTokenAccount: null,
      expectedAmount: null
    });

    const resetAliceUI = () => {
      privateKey.value = "";
      programId.value = "";
      aliceTokenXPubkey.value = "";
      aliceTokenYPubkey.value = "";
      amountXTokensToSendToEscrow.value = 0;
      amountYTokensAliceExpects.value = 0;
      Object.keys(escrowState).forEach(key => escrowState[key as keyof EscrowState] = null);
    }

    const onInitEscrow = async () => {
      try {
        const { 
          escrowAccountPubkey,
          isInitialized,
          initializerAccountPubkey,
          XTokenTempAccountPubkey,
          initializerYTokenAccount,
          expectedAmount
        } = await initEscrow(
          privateKey.value,
          aliceTokenXPubkey.value,
          amountXTokensToSendToEscrow.value,
          aliceTokenYPubkey.value,
          amountYTokensAliceExpects.value,
          programId.value
        );
        escrowState.escrowAccountPubkey = escrowAccountPubkey;
        escrowState.isInitialized = isInitialized;
        escrowState.initializerAccountPubkey = initializerAccountPubkey;
        escrowState.XTokenTempAccountPubkey = XTokenTempAccountPubkey;
        escrowState.initializerYTokenAccount = initializerYTokenAccount;
        escrowState.expectedAmount = expectedAmount;
      } catch(err) {
        alert(err.message);
      }
    }

    return {
      programId,
      aliceTokenXPubkey,
      aliceTokenYPubkey,
      amountXTokensToSendToEscrow,
      amountYTokensAliceExpects,
      resetAliceUI,
      onInitEscrow,
      privateKey,
      escrowState
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap');

html, body {
  font-family: 'PT Serif', serif;
  margin: 0;
}

.bg {
  margin: 0;
  margin-top: .5rem;
  padding: .1rem 1rem;
  border-radius: 0.4rem;
  background-color: #f0f4f8;
}

.title {
  font-weight: bold;
}

.mb-1 {
    margin-bottom: 1rem;
}

.display-block {
    display:block
}

.cursor-pointer {
    cursor: pointer
}

.border-none {
  border: none;
}

.bg-btn {
  background-color: #ededed;
  transition: .3s;
}

.bg-btn:hover {
  background-color: #02b57b;
}

.normal-font-size {
  font-size: .85rem;
}
</style>
