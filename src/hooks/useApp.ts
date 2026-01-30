// Aqui centralizamos os imports que você usará em quase todas as telas
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import '@/index.css' // <--- ESTA LINHA É OBRIGATÓRIA!



export function useApp() {
  // Inicializamos as ferramentas
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // Retornamos tudo em um único objeto mestre
  return {
    navigate,
    params,
    location,
    useEffect,
    useState
  };
}