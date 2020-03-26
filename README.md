# About

This repo is a scratchpad for the files and lessons learned from [Node Js Unit Testing]https://www.udemy.com/course/nodejs-unit-testing-in-depth) by Murtez Alrohani on Udemy.

## Motivation

I learn by writing and blowing things up. All of my repositories that start with the word "learnings" are from tutorials or books I have read.

## Goals for Project

-   documenting things I learned so I can use them as resource later
-   Introduction to mocha testing
-   general awesomeness in Node unit testing

# Tech Used

-   [Node](https://nodejs.org/en/)
-   [Mocha](https://mochajs.org/)
-   [Chai](https://www.chaijs.com/)

# Installaton

# Lessons Learned

-   Describe blocks
    -   usually a file to be tested
    -   can be a function or state
-   Context Blocks
    -   function to be tested
-   It Blocks

    -   should do something, i.e. save the user, delete file,
    -   If you only pass one argument it will be considered a pending test. Pending tests don't fail

-   Before and After
    -   Before takes a function, it is fired once, at the beginning of the first test in the block
    -   After takes a function, it is fired once, at the end of the last test in the block
    -   BeforeEach and AfterEach, takes a function, runs before each test in the block
-   Organization
    -   Context can help group beforeEAch and AfterEach. Can help with breaking things down and keeping things seperate
-   DeepEqual
    -   When comparing objects always use deep.equal.
-   Testing Callbacks and Aysnch code with Done
    -   When testing callbacks or asynchronous code, use mocha done
    -   call done() to terminate test and proceed to the next test
    -   using chai-as-promised library can help more with async code
-   Spys and Stubs with Sinon
    -   Using spys to spy on parts of a function
    -   Using stubs to stub out calls to a function we actually dont want to run (like saves to a db)
-   Rewire for testing private code
    -   Use rewire for testing private methods

## Follow Ups
