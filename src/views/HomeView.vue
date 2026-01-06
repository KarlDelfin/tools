<template>
  <div>
    <h2>Image to Text</h2>
    
    <input 
      type="file" 
      accept="image/*" 
      @change="handleImageUpload"
    />
    
    <!-- Preview -->
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Uploaded" style="max-width: 300px;" />
    </div>
    
    
    <textarea 
      v-model="extractedText" 
      rows="10" 
      style="width: 100%;"
      readonly
      @paste="pasteImage"
    ></textarea>
    <button v-if="extractedText != ''" @click="copyToClipboard">Copy Text</button>
    
    <!-- Error Message -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import Tesseract from 'tesseract.js';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      imageUrl: null,
      extractedText: '',
      error: null,
      progress: 0
    }
  },
  methods: {
    async pasteImage(event) {
      event.preventDefault();
  
      const items = event.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          
          if (file) {
            this.loading = true;
            
            this.imageUrl = URL.createObjectURL(file);
            
            await this.performOCR(file);
            break;
          }
        }
      }
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.error = null;
      this.extractedText = '';
      
      this.imageUrl = URL.createObjectURL(file);
      
      await this.performOCR(file);
    },
    
    async performOCR(imageFile) {
      
      try {
        const result = await Tesseract.recognize(
          imageFile,
          'eng', // Language (can be 'chi_sim' for Chinese, etc.)
          {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                this.progress = Math.round(m.progress * 100);
              }
            }
          }
        );
        
        this.extractedText = result.data.text;
      } catch (err) {
        this.error = 'OCR processing failed: ' + err.message;
        console.error('OCR Error:', err);
      }
    },
    
    copyToClipboard() {
      navigator.clipboard.writeText(this.extractedText)
        .then(() => {
          ElMessage.success('Text copied!')
        })
        .catch(err => {
          this.error = 'Failed to copy text: ' + err;
        });
    },
  },
  
  // Clean up URL object
  beforeUnmount() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
</script>

<style scoped>
</style>