<template>
  <div id="app">
    <audio :src="preview" controls></audio>
    <p>{{ test }}</p>
    <p>{{ user }}</p>
  </div>
</template>

<script>
import liff from "liff";
import * as api from "./api";

export default {
  name: "app",
  data: function() {
    return {
      test: new URL(window.location.href).searchParams.get("track"),
      user: "",
      preview: ""
    };
  },
  created: async function() {
    liff.init(data => {
      this.user = data.context.userId;
    });
    this.preview = await api.getPreviewURL(this.test);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
