

<template>
  <div>
    <h2>Hyphen String</h2>
    <input type="text" v-model="string" @input="inputString" style="width: 100%;"/>
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
    inputString(e: any) {
      let temp = ''
      let word = e.target.value
      
      for (let i = 0; i < word.length; i++) {
        if (word[i] == ' ') {
          if (temp.length === 0 || temp[temp.length - 1] !== '-') {
            temp += '-'
          }
        } else {
          temp += word[i]
        }
      }
      
      this.formattedString = temp.toLowerCase()
    }
  }
}
</script>