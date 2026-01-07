<template>
  <div>
    <h2>Image Alt Text Generator</h2>
    <input type="file" @change="handleImageUpload" accept="image/*" />
    <div v-if="imageUrl">
      <img :src="imageUrl" :alt="altText" style="max-width: 300px;" />
      <p v-if="altText != ''">Generated Alt Text: <strong>{{ altText }}</strong></p>
    </div>
    <p v-if="loading">Generating alt text...</p>
    <p v-if="error" class="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: null,
      altText: '',
      loading: false,
      error: null,
      // Your Hugging Face API key
      hf: 'hf_',
      hfApiKey: 'IJckhnuWFGPdYHUsbLcycoktakqdLoIsfU'
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
    
    async generateAltText(file) {
      this.loading = true;
      this.error = null;
      
      try {
        const base64Image = await this.fileToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64Image}`;
        
        const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.hf+this.hfApiKey}`,
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
    }
  },
  
  beforeUnmount() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
};
</script>