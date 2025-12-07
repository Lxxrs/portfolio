<script setup lang="ts">
defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <!-- Light Mode -->
  <svg
    class="block dark:hidden"
    :width="size || 24"
    :height="size || 24"
    viewBox="0 0 4.2333332 4.2333335"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <linearGradient
        xlink:href="#linearGradient6924"
        id="linearGradient6918"
        x1="42519.285"
        y1="-7078.7891"
        x2="42575.336"
        y2="-6966.9307"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient id="linearGradient6924">
        <stop style="stop-color:#2185d0;stop-opacity:0" offset="0" />
        <stop offset="0.49517274" style="stop-color:#2185d0;stop-opacity:0.48923996" />
        <stop style="stop-color:#2185d0;stop-opacity:0.63279623" offset="1" />
      </linearGradient>
      <linearGradient
        xlink:href="#linearGradient6924-6"
        id="linearGradient6918-3"
        x1="42519.285"
        y1="-7078.7891"
        x2="42575.336"
        y2="-6966.9307"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient id="linearGradient6924-6">
        <stop style="stop-color:#2185d0;stop-opacity:0;" offset="0" />
        <stop offset="0.49517274" style="stop-color:#2185d0;stop-opacity:0.30000001;" />
        <stop style="stop-color:#2185d0;stop-opacity:0.30000001;" offset="1" />
      </linearGradient>
    </defs>
    <g transform="matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)">
      <path
        style="fill:url(#linearGradient6918-3);fill-opacity:1;stroke:none;"
        d="m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z"
        transform="matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"
      />
      <path
        style="fill:#2185d0;fill-opacity:1;"
        d="m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z"
        transform="matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"
      />
    </g>
  </svg>

  <!-- Dark Mode -->
  <svg
    class="hidden dark:block"
    :width="size || 24"
    :height="size || 24"
    viewBox="0 0 4.2333332 4.2333335"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <linearGradient
        xlink:href="#linearGradient6924_dark"
        id="linearGradient6918_dark"
        x1="42519.285"
        y1="-7078.7891"
        x2="42575.336"
        y2="-6966.9307"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient id="linearGradient6924_dark">
        <stop style="stop-color:#ffffff;stop-opacity:0" offset="0" />
        <stop offset="0.49517274" style="stop-color:#ffffff;stop-opacity:0.30000001" />
        <stop style="stop-color:#ffffff;stop-opacity:0.30000001" offset="1" />
      </linearGradient>
      <linearGradient
        xlink:href="#linearGradient6924-6_dark"
        id="linearGradient6918-3_dark"
        x1="42519.285"
        y1="-7078.7891"
        x2="42575.336"
        y2="-6966.9307"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient id="linearGradient6924-6_dark">
        <stop style="stop-color:#ffffff;stop-opacity:0;" offset="0" />
        <stop offset="0.49517274" style="stop-color:#ffffff;stop-opacity:0.30000001;" />
        <stop style="stop-color:#ffffff;stop-opacity:0.30000001;" offset="1" />
      </linearGradient>
    </defs>
    <g transform="matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)">
      <path
        style="fill:url(#linearGradient6918-3_dark);fill-opacity:1;stroke:none;"
        d="m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z"
        transform="matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"
      />
      <path
        style="fill:#ffffff;fill-opacity:1;"
        d="m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z"
        transform="matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"
      />
    </g>
  </svg>
</template>
