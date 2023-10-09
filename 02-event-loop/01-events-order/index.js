// create macro task
const intervalId = setInterval(() => {
  // main stream
  console.log('James'); // 1
}, 10);
// create macro task 2
setTimeout(() => {
  const promise = new Promise((resolve) => {
    // micro task
    console.log('Richard'); // 2
    resolve('Robert');
  });

  promise
      .then((value) => {
        // micro task
        console.log(value); // 4

        setTimeout(() => {
          // macro task 3
          console.log('Michael'); // 5

          clearInterval(intervalId);
        }, 10);
      });
  console.log('John'); // 3
}, 10);
