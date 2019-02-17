# CourseBin
The SOEN341 course project repository.

## Getting Started
**NOTE 1:** *We use* `yarn` *in this project instead of* `npm` *because it handles sub-folder module dependencies better (the* `client` *folder contains it's own* `node_modules`*).*

**NOTE 2:** *Make sure to read* `CONTRIBUTING.md` *before starting to develop on this project or Tatum will spank you.*

Clone the repo:
```
git clone https://github.com/tatumalenko/CourseBin.git
```

Change directory into repo:
```
cd CourseBin
```

Switch to the appropriate branch:
```
git checkout basic-project-prototype-2
```

If you need to create a new issue branch, instead use these commands **(remember, each branch must follow from an issue created on GitHub)**:
```
git brach <name-of-branch-#issue>
git checkout <name-of-branch-#issue>
```

Install the required root node modules:
```
yarn install
```

Change directory into the client folder:
```
cd client
```

Install the required client node modules:
```
yarn install
```

Change back into the root directory:
```
cd ..
```

Create a new file `.env` in the root directory and add the necessary stuff (See Basecamp Docs & Files):
```
touch .env
vim .env
...
```

Start both frontend and backend servers:
```
yarn dev
```

To instead run the production build, execute the following command which first builds the frontend files and starts only a backend server:
```
yarn start
```

Enjoy!




