<template>
  <div>
    <section>
      <h1>Terms of Service</h1>
      <ContentDoc class="text" path="/tos" />
    </section>
  </div>
</template>

<script scoped>
  useHead({
    title: "metagen | Terms of Service",
  });
</script>

<style scoped>
  * {
    line-height: 2rem;
  }

  h1 {
    margin-bottom: 8rem;
  }
</style>