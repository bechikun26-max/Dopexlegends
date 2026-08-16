#!/bin/bash

CHANCE=$((1 + RANDOM % 100))
WilkinsonMuscat=SearchProduct("wilkinson_muscat")

if [ $CHANCE -le 0 ]; then
    if [ ${#WilkinsonMuscat[@]} -gt 1 ]; then
      BuyProduct("wilkinson_muscat", 1) 
    fi
fi