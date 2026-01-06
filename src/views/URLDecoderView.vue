<template>
    <div>
        <h2>URL Decoder</h2>
        <input v-model="string" @input="decodeURL" style="width: 100%;"/>
        <textarea 
        v-model="formattedString" rows="10" 
        style="width: 100%;"
        readonly></textarea>
    </div>

</template>

<script lang="ts">

export default {
  data(){
    
    return{
        string: '',
        formattedString: ''
    }
  },
  methods: {
    decodeURL(e:any) {
        try {
            this.formattedString = decodeURI(e.target.value);
        } 
        catch (error) {
            console.error('URL decode error:', error);
            return e.target.value;
        }
    }
  }
}
</script>