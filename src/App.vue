<template>
  <div>
    <app-header></app-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import Header from "./components/shared/Header"
  import Footer from "./components/shared/Footer"

  export default {
    components: {
      appHeader : Header,
      appFooter : Footer,
    },
    created() {
      this.$store.dispatch('getTradeResult')
      this.$store.dispatch('initApp')
    },
  }
</script>

<style>
  body {
    background-color: #a7a0bb5c;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    transition: opacity .3s ease-out;
  }
  .fade-leave-active {
    transition: opacity .3s ease-out;
    opacity: 0;
  }

  .loading{
  background-color: rgba(0,0,0,.6);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 130%;
  z-index: 999999;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  top: calc(100% / 2);
  left: calc(100% / 2);
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>

