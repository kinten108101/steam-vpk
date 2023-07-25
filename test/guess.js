function guessNumber(range) {
  const number = Math.round(Math.random() * range);
  console.log('picked', number);

  function guess(val) {
    if (val === number) return 0;
    else if (val > number) return -1;
    else return 1;
  }

  let currentRange = range;
  let i = currentRange / 2;
  console.log('i =', i);
  let result = guess(i);
  console.log('result =', result);
  while (result !== 0) {
    if (result === 1) {
      i = Math.ceil(i + currentRange / 4);
      console.log('up');
    } else if (result === -1) {
      i = Math.floor(i - currentRange / 4);
      console.log('down');
    } else throw error('Wtf');
    console.log('i =', i);
    currentRange = currentRange / 2;
    result = guess(i);
  }
  return i;
}

const range = 20000 || Math.round(Math.random()*100);
console.log('range is', range);
console.log('my guesss is', guessNumber(range));

