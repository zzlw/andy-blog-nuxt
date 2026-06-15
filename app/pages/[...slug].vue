<script setup lang="ts">
const { t } = useI18n()
throw createError({ statusCode: 404, message: t('error.pageNotFound'), fatal: true })
</script>

<template>
  <div />
</template>
