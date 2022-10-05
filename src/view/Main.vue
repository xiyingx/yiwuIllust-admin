<template>
    <core-container>
      <router-view></router-view>
    </core-container>
</template>
  
<script>
import CoreContainer from '@/layout/CoreContainer.vue';
export default {

    name: 'Main',
    components: {
        CoreContainer
    }
}
</script>
  
<style scoped>

</style>
  