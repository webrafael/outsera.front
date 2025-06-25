#!/bin/bash

# Script para executar testes unitários no container Docker

echo "Executando testes unitários no container Docker..."

# Verificar se o container está rodando
if [ "$(docker ps -q -f name=outsera-front)" ]; then
    echo "Container já está rodando. Executando testes..."
    docker exec outsera-front npm test
else
    echo "Container não está rodando. Iniciando e executando testes..."
    docker-compose up -d
    sleep 10
    docker exec outsera-front npm test
fi

echo "Testes concluídos!"
