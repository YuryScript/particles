export const assertEqual = (message, value1, value2) => {
  const assertion = value1 === value2

  if(assertion) {
    console.log('\x1b[32m%s\x1b[0m', `${message} - passed!`)
  } else {
    console.log('\x1b[31m%s\x1b[0m', `${message} - ${value1} not equal ${value2}!`)
  }
}