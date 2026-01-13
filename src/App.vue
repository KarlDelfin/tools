<template>
  <el-container>
    <el-header></el-header>
    <el-container>
      <el-aside width="250px">
        <SideMenu/>
      </el-aside>
      <el-main>  
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

</template>

<script lang="ts">
import SideMenu from './components/SideMenu.vue';

export default {
  components: {SideMenu},
  data(){
    
    return{}
  }
}
</script>