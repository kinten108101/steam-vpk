#!/usr/bin/gjs

function array_insert(source, item, index) {
  for (let i = source.length; i > index; i--) {
    source[i] = source[i-1];
  }
  source[index] = item;
}

var a = [4, 6, 8, 9, 11, 1];
array_insert(a, 211, -5);
console.log(a);
