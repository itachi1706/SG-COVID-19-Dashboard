# SG COVID-19 Dashboard

Singapore COVID-19 Dashboard (WIP)

Site will be available [here](https://ccn-covid19-sg-dashboard.herokuapp.com/) when it is up and running


## How to start
* Get a config key from [Firebase](https://console.firebase.google.com)
* Create a file called "config-dev.js" in the root repository directory.
* Add the following code
```javascript
module.exports.config = <your firebase config>;
```
* Generate a service account from Project Settings and save the file as __service-account.json__ in the root of the repository folder