import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'


// O "!" no final de getElementById diz ao TypeScript que temos certeza que esse ID existe
const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento raiz 'app'. Verifique seu index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)