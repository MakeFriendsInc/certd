<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="toHome">返回首页（ Back Home ） </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: "Exception404",
  methods: {
    toHome() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>
