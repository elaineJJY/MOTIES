<template>
  <div>
    <document-menu></document-menu>
  </div>
</template>

<script>
// @ is an alias to /src
//这里可以写这个页面里搭载什么组件
import documentMenu from '@/components/document-menu'

export default {
  name: 'Home',
  components: {
    documentMenu
  }
}
</script>

<style scoped>


</style>
