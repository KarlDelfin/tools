<template>
  <div>
    <input 
      type="file" 
      id="file" 
      accept="image/*"
      @change="handleFileUpload"
      :disabled="isUploading"
    >
    <p v-if="isUploading">Uploading...</p>
    <p v-if="uploadError" style="color: red;">Error: {{ uploadError }}</p>
    <p v-if="uploadSuccess" style="color: green;">Upload successful!</p>

    <img :src="file" alt="" style="width: 200px">
    <button v-if="file != ''" @click="downloadBase64File">Download</button>
  </div>
</template>

<script>
import Compressor from 'compressorjs';

export default {
  name: 'ImageUploader',
  data() {
    return {
      isUploading: false,
      uploadError: null,
      uploadSuccess: false,
      file: '',
      fileName: '',
      fileExtension: ''
    };
  },
  methods: {
    downloadBase64File() {
      const base64EncodedData = this.file; // e.g., "/9j/4AAQSkZJ..."
      const fileName = this.fileName

      const downloadLink = document.createElement('a');
      downloadLink.href = base64EncodedData;
      downloadLink.download = fileName;

      document.body.appendChild(downloadLink);
      downloadLink.click();

      document.body.removeChild(downloadLink);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      const fileName = event.target.files[0].name.split('.')[0]
      const fileExtension = event.target.files[0].name.split('.')[1]

      this.fileName = fileName
      this.fileExtension = fileExtension

      console.log(fileName)
      console.log(fileExtension)

      if (!file) {
        return;
      }

      this.isUploading = true;
      this.uploadError = null;
      this.uploadSuccess = false;

      new Compressor(file, {
        quality: 0.6,
        
        success: (result) => {
          console.log(result)
          const reader = new FileReader()

          reader.readAsDataURL(result)
          reader.onload = () => {
            this.file = reader.result;
            this.isUploading = false
          }

        

          
        },
        error: (err) => {
          console.log(err.message);
          this.uploadError = err.message;
          this.isUploading = false;
        }
      });
    },
    
    // uploadToServer(formData) {
    //   axios.post('/path/to/upload', formData)
    //     .then(() => {
    //       console.log('Upload success');
    //       this.uploadSuccess = true;
    //       this.isUploading = false;
    //       this.$emit('upload-success');
    //     })
    //     .catch((error) => {
    //       console.error('Upload failed:', error);
    //       this.uploadError = error.message;
    //       this.isUploading = false;
    //       this.$emit('upload-error', error.message);
    //     });
    // }
  }
}
</script>