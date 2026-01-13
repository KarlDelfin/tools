<template>
  <div>
    <h2>Image Alt Text Generator</h2>
    <input type="file" @change="handleImageUpload" accept="image/*" />
    <div v-if="imageUrl">
      <img :src="imageUrl" :alt="altText" style="max-width: 300px;" />
    </div>
    <textarea 
      v-model="altText" 
      rows="10" 
      style="width: 100%;"
      readonly
      @paste="pasteImage"
    ></textarea>
    <button v-if="altText != ''" @click="copyToClipboard">Copy Text</button>
    
    <p v-if="loading">Generating alt text...</p>
    <p v-if="error" class="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      imageUrl: null,
      altText: '',
      loading: false,
      error: null,
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
        this.generateAltText(file);
      }
    },

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
            
            await this.generateAltText(file);
            break;
          }
        }
      }
    },
    
    async generateAltText(file) {
      this.loading = true;
      this.error = null;
      
      try {
        const base64Image = await this.fileToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_APP_HUGGINGFACE_API}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "CohereLabs/aya-vision-32b:cohere",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Describe this image in one sentence for alt text.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: dataUrl,
                    },
                  },
                ],
              },
            ],
            max_tokens: 100,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle response
        if (data.choices && data.choices[0] && data.choices[0].message) {
          this.altText = data.choices[0].message.content;
        } else {
          throw new Error('Unexpected response format');
        }
        
      } catch (err) {
        this.error = 'Failed to generate alt text. Please try again.';
        console.error('Error details:', err);
      } finally {
        this.loading = false;
      }
    },
    
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = error => reject(error);
      });
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.altText)
        .then(() => {
          ElMessage.success('Text copied!')
        })
        .catch(err => {
          this.error = 'Failed to copy text: ' + err;
        });
    },
  },
  
  beforeUnmount() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
};
</script>