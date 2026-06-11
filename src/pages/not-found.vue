<template>
  <ErrorPanel :error="{ code: 404, message: '页面不存在' }" />
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { pageTitle } from '/@/configs/app.config'
import ErrorPanel from '/@/components/common/error-panel.vue'

useHead({ title: pageTitle('404') })
</script>
