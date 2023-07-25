const arr = [7, 1, 5, 3, 6, 4];

function greatest_diff(arr) {
  let a = 0;
  let b = 0;
  let i = 0;

  let max_diff = 0;

  while (a !== arr.length - 1 && a !== arr.length - 1) {
    if (b !== arr.length - 1)
      b++;
    else
      a++;

    if (arr[b-1] >= arr[b]) {
      continue;
    }

    const diff = arr[b] - arr[a];
    if (diff > max_diff) max_diff = diff;
    while ((arr[a] > arr[b]) && (a <= b)) {
      a++;
      const diff = arr[b] - arr[a];
      if (diff > max_diff) max_diff = diff;
    }
  }

  return max_diff;
}

console.log(greatest_diff(arr));

