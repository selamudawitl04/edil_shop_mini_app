<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <div class="hidden lg:block">
      <LayoutHeader />
    </div>
    <!-- Main layout content -->
    <div class="flex flex-1 max-w-7xl mx-auto w-full lg:mt-[90px]">
      <!-- Main content -->
      <main class="flex-1  max-w-full">
        <slot />
      </main>
    </div>


  </div>
</template>
