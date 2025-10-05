<template>
    <div
      :class="`
          ${props.height || 'h-1'} 
          ${props.class}
          `"
      class="slider relative w-full"
    >
      <div
        :class="`${color1 || 'bg-primarySb-lite'} ${props.height || 'h-1'} `"
        class="line absolute w-full"
      ></div>
      <div
        :class="`${props.color2 || 'bg-primary'} ${props.height || 'h-1'} `"
        class="subline absolute inc"
      ></div>
      <div
        :class="`${props.color3 || 'bg-primary'} ${props.height || 'h-1'} `"
        class="subline absolute dec"
      ></div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    class: String,
    color1: String,
    color2: String,
    color3: String,
    height: String,
  });
  </script>
  
  <style scoped>
  .slider {
    overflow-x: hidden;
  }
  
  .inc {
    animation: increase 2s infinite;
  }
  .dec {
    animation: decrease 2s 0.5s infinite;
  }
  
  @keyframes increase {
    from {
      left: -5%;
      width: 5%;
    }
    to {
      left: 130%;
      width: 100%;
    }
  }
  @keyframes decrease {
    from {
      left: -80%;
      width: 80%;
    }
    to {
      left: 110%;
      width: 10%;
    }
  }
  </style>
  