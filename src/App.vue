<template>
  <div id="app">
    <div :class="'container'">
      <div :class="['ctaContainer', 'hideOnDesktop']">
        <p :class="'cta'" @click="toggleAnimationMode()"><strong>{{ $t('cta.animationMode') }}</strong></p>
      </div>
      <div :class="'ctaContainer'">
        <p :class="'cta'" @click="toggleInfoPopup()"><strong>{{ $t('app.whatIsIt') }}</strong></p>
      </div>
      <h1>{{ $t('app.header') }}</h1>
      <div :class="['ctaContainer', 'hideOnMobile']">
        <p :class="'cta'" @click="toggleAnimationMode()"><strong>{{ $t('cta.animationMode') }}</strong></p>
      </div>
    </div>
    <grid :forceStop="infoPopupOpen" :animationMode="animationMode"/>
    <div v-if="infoPopupOpen" :class="'infoPopupContainer'">
      <div :class="'popupInnerContainer'">
        <div :class="'closeButton'" @click="toggleInfoPopup()"></div>
        <div
          v-for="section, index in $tm('gameOfLifeInfo')"
          :key="`info-section-${index}`">
          <h2 v-if="section.header">{{ section.header }}</h2>
          <div v-if="section.content || section.listItems">
            <p
              v-for="item, index in section.content || section.listItems"
              :key="`${section.header}-item-${index}`"
              :class="{'listItem': section.listItems}">{{ item }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Grid from './components/Grid/Grid.vue';

export default {
  name: 'App',
  components: {
    Grid
  },
  data() {
    return {
      infoPopupOpen: false,
      animationMode: false
    }
  },
  methods: {
    toggleInfoPopup() {
      this.infoPopupOpen = !this.infoPopupOpen;
    },
    toggleAnimationMode() {
      this.animationMode = !this.animationMode;
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  width: 100%;
}

.infoPopupContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.7);
}

.popupInnerContainer {
  max-width: 500px;
  background-color: white;
  position: relative;
  padding: 0 15px;
  overflow: scroll;
  text-align: start;
}

.listItem {
  display: block;
  margin-left: 20px;
  position: relative;

  &::before {
    content: "-";
    width: 10px;
    position: absolute;
    top: 0;
    left: -20px;
  }
}

.closeButton {
  position: absolute;
  top: 5px;
  right: 10px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  
  &::before {
    position: absolute;
    content: "";
    width: 15px;
    height: 4px;
    background-color: #2c3e50;
    transform: rotate(45deg);
    border-radius: 4px;
    top: 10px;
    left: 0;
  }

  &::after {
    position: absolute;
    content: "";
    width: 15px;
    height: 4px;
    background-color: #2c3e50;
    transform: rotate(135deg);
    border-radius: 4px;
    top: 10px;
    left: 0;
  }
}

.container {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  max-width: 500px;
  margin: 0 auto;

  h1 {
    width: 100%;
    margin-bottom: 10px; 
  }
}

.cta {
  display: inline-block;
  cursor: pointer;
  border-bottom: 2px solid white;
  margin: 0 0 20px;

  &:hover {
    border-color: #2c3e50;
  }
}

.hideOnMobile {
  display: none;
}

@media (min-width: 1024px) {
  .hideOnMobile {
    display: initial;
  }

  .hideOnDesktop {
    display: none;
  }

  .container {
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    max-width: 500px;
    margin: 0 auto;

    h1 {
      width: initial;
      margin-bottom: 21px;
    }
  }

  .infoPopupContainer {
    display: flex;
    justify-content: center;
  }

  .popupInnerContainer {
    position: fixed;
    width: calc(100% - 30px);
    height: calc(100% - 60px);
    margin: 30px auto 0;
  }

  .ctaContainer {
    height: 100%;
    margin: auto 0;
  }

  .cta {
    margin: 3px 0 0;
    font-size: 16px;
  }

  .closeButton {
    top: 10px;
    width: 30px;
  
    &::before {
      width: 30px;
    }

    &::after {
      width: 30px;
    }
  }
}
</style>
