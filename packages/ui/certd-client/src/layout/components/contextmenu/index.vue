<template>
  <div v-show="flag" class="fs-contextmenu" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  name: "FsContextmenu",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  },
  computed: {
    flag: {
      get() {
        if (this.visible) {
          // 注册全局监听事件 [ 目前只考虑鼠标解除触发 ]
          window.addEventListener("mousedown", this.watchContextmenu);
        }
        return this.visible;
      },
      set(newVal) {
        this.$emit("update:visible", newVal);
      }
    },
    style() {
      return {
        left: this.x + "px",
        top: this.y + "px",
        display: this.visible ? "block" : "none "
      };
    }
  },
  mounted() {
    // 将菜单放置到body下
    document.querySelector("body").appendChild(this.$el);
  },
  methods: {
    watchContextmenu(event) {
      if (!this.$el.contains(event.target) || event.button !== 0) this.flag = false;
      window.removeEventListener("mousedown", this.watchContextmenu);
    }
  }
};
</script>

<style>
.fs-contextmenu {
  position: absolute;
  padding: 5px 0;
  z-index: 2018;
  background: #fff;
  border: 1px solid #cfd7e5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
