<template>
  <el-menu
    :default-active="activeIndex"
    :router="true"
  >
    <el-menu-item index="/">
      <template #title>
        <span>Image to Text</span>
      </template>
    </el-menu-item>
    
    <el-menu-item index="/hyphen-string">
      <template #title>
        <span>Hyphen String</span>
      </template>
    </el-menu-item>
    
    <el-menu-item index="/url-decoder">
      <template #title>
        <span>URL Decoder</span>
      </template>
    </el-menu-item>

    <el-menu-item index="/alt-text-generator">
      <template #title>
        <span>Alt Text Generator</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'SideMenu',
  computed: {
    activeIndex() {
      return this.$route.path;
    }
  }
}
</script>