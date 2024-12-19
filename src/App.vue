<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <button @click="re">点我1</button>
    </nav>
    <router-view />
  </div>
</template>
<script>
import { startRecording } from 'vad-web';

const audioWorkletURL = '/vad-audio-worklet.js';
export default {
  name: 'App',
  data(){
    return {
      a:null,
      dispose:null,
    }
  },
  mounted(){
 this.han1()
  },
  methods: {

    re() {
      console.log('refersh---Recording');
      if (this.dispose!==null) {
        this.dispose();
        this.dispose = null;
      }
   
      this.dispose = startRecording({
        // The URL of the audio worklet script. More on this below.
        audioWorkletURL,

        // The maximum duration of `audioData` received by `onAudioData`.
        maxDurationSeconds: 30,

        // Called when audio data is received.
        onAudioData: (audioData, sampleRate) => {
          console.log(` samples @ ${sampleRate}Hz`);
        },

        // Called when silence is detected.
        onSilence: () => {
          console.log('Silence detected');
        },

        // Called when speech is detected.
        onSpeech: () => {
          console.log('Speech detected');
        },
      });
    },

  },
  mounted() {
    this.re();
  },
  components: {},
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
