<template>
  <div class="bg">
    <p class="title">Cancel UI</p>
    <div>
      <div class="mb-1">
          <label for="2020-12-24-programId-escrow-alice">Throwaway private key (as byte array from sollet.io, without the '[]')</label>
          <input class="display-block" type="text" v-model="formState.privateKey">
        </div>
        <div class="mb-1">
          <label for="2020-12-24-programId-escrow-alice">Program id</label>
          <input class="display-block" type="text" id="2020-12-24-programId-escrow-alice" v-model="formState.programId">
        </div>
        <div class="mb-1">
          <label for="">Alice's X token account pubkey</label>
          <input class="display-block" type="text" v-model="formState.takerXAccAddress">
        </div>
        <div class="mb-1">
          <label for="">Escrow account pubkey</label>
          <input class="display-block" type="text" v-model="formState.escrowAccAddress">
        </div>
        <div class="mb-1">
          <input style="margin-right: 5px;" class="cursor-pointer border-none bg-btn normal-font-size" type="submit" value="Reset UI" @click="resetUI">
          <input class="cursor-pointer border-none bg-btn normal-font-size" type="submit" value="Cancel trade" @click="onCancelTrade">
        </div>
    </div>
  </div>
</template>

<script lang="ts"> 
import { defineComponent, reactive } from 'vue';
import { cancelTrade } from "./util/cancelTrade";

export default defineComponent({
    setup() {
        const formState = reactive({
            privateKey: "",
            programId: "",
            takerXAccAddress: "",
            escrowAccAddress: ""
        })

        const resetUI = () => {
          formState.privateKey = "";
          formState.programId = "";
          formState.takerXAccAddress = "",
          formState.escrowAccAddress = ""
        }
        
        const onCancelTrade = async () => {
          try {
            await cancelTrade(
              formState.privateKey,
              formState.escrowAccAddress,
              formState.takerXAccAddress,
              formState.programId
              );
              alert("Success! Alice has canceled trade, got fee and token back and all temporary accounts have been closed");
          } catch (err) {
            alert(err.message);
          }
        }

        return { formState, resetUI, onCancelTrade };
    }
})
</script>
