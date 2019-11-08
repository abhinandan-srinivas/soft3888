---

Run the tests with 

> npm test

---

Installation

If the tests don't work, perhaps the added dependencies couldn't be uploaded and they can be added manually.  
[link](https://www.npmjs.com/package/jest-expo)


1. Add jest-expo with: npm i jest-expo --save-dev.  
2. Add this in package.json:  

> "scripts": {  
>  "test": "node_modules/.bin/jest",  
>  "test:debug": "node --inspect-brk node_modules/jest/bin/jest.js --runInBand"  
> },  
> "jest": {  
>   "preset": "jest-expo"  
> }  

3. Add react-test-renderer by running: (the react-test-renderer version should be the same as the react version, in this case, in package.json we see that it is 16.8.3) 
> npm i react-test-renderer@16.8 --save-dev 