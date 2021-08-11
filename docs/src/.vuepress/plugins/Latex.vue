<template>
  <div ref="latex"
      class="katex-page katex-post"
      v-html="html">
  </div>
</template>

<script>

export default {
  name : "Latex",
  props : {
    content : String
  },
  data() {
    if (this.content) {
      let s = this.content.split('.').join('_');
      import('@dynamic/latex-content').then((latexContent) => {
        this.html = latexContent.default[s];
      });
    }
    return {
      html : '',
    }
  },
}
</script>


<style scoped
    src="../public/css/katex.css"></style>
<style scoped
    src="../public/css/article.css"></style>
<style scoped
    src="../public/css/post.css"></style>
<style scoped>
</style>
