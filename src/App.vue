<script setup lang="ts">
// Aqui no futuro importaremos nossos componentes e a lógica do Pinia
</script>

<template>
  <main class="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
    <div class="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
      
      <header class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-emerald-400 tracking-tight">
          Emagrac.ia
        </h1>
        <p class="text-slate-400 mt-2">Sua jornada de saúde v0.0.1</p>
      </header>

      <section class="space-y-4">
        <div class="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p class="text-sm text-slate-300">Status do Docker:</p>
          <p class="text-emerald-500 font-mono font-bold">● ONLINE</p>
        </div>

        <button class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
          Começar Avaliação
        </button>
      </section>

    </div>
  </main>
</template>

<style>
/* Estilos globais simples para garantir que a fonte fique limpa */
body {
  margin: 0;
  font-family: sans-serif;
}
</style>