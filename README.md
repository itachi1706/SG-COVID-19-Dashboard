# SG COVID-19 Dashboard

>⚠️ This service has since been stood down as it is no longer needed and APIs are no longer active ⚠️

Singapore COVID-19 Dashboard

View the publicly accessible site [here](https://covid19sg.itachi1706.com/)

## Features currently available
* View latest day statistics
* View Case History (Up to 19 April 2020)
* View past statistics in a table
* Graphs showcasing some statistics (More coming soon!)
* Add statistics

## Databse Configuration
As of now, only MySQL is supported
* Create 2 tables with the schemas available [here](db/schema). You can change any of the table names except `sg_case_info`
* Extract and run the data script found [here](db/data)

## Using the Docker image
Ready made docker images are available for this project and can be found in the project's [container registry](https://gitlab.com/itachi1706/sg-covid-19-dashboard/container_registry).  
It is also recommended to use Docker Compose to do so for filling up some of the environment variables (alternatively you can save the variable into config-dev.js)  
* Using environment variables  
Use the following docker-compose file to start the server up, replacing values accordingly. Note that you can also startup your database through docker, but make sure the steps in [database configuration](#databse-configuration) is followed.  
```yaml
version: "3.5"
services: 
    webserver:
        image: registry.gitlab.com/itachi1706/sg-covid-19-dashboard:latest
        ports:
            - "443:3000"
        environment:
            - dbDatabase=<Database Name>
            - dbDelta=<Database Delta Table Name>
            - dbHost=<Database Host Name>
            - dbInfo=<Database Info Table Name>
            - dbPassword=<Database User Password>
            - dbUser=<Database User Name>
            - fbApi=<Firebase API Key>
            - fbAppId=<Firebase Application ID>
            - fbAuthDomain=<Firebase Authentication Domain>
            - fbDatabaseURL=<Firebase Database URL>
            - fbMeasurement=<Firebase Measurement ID>
            - fbMessage=<Firebase Messaging ID>
            - fbProjId=<Firebase Project ID>
            - fbStorage=<Firebase Storage ID>
            - firebaseSvcAcct=<Firebase Service Account>
            - PRODMODE=true
            - NODE_ENV=production
```

## 301 Redirect Note
If you are exeperiencing a infinite 301 redirect (or Chrome throws a TOO_MANY_REDIRECTS error), try disabling the HTTP -> HTTPS automatic redirect by adding the following environment variable
`disableHTTPSRedirect = true`

## Images available
* **latest**: registry.gitlab.com/itachi1706/sg-covid-19-dashboard:latest  
* **1.0.0**: registry.gitlab.com/itachi1706/sg-covid-19-dashboard:1-0-0

## How to start development
* Get a config key from [Firebase](https://console.firebase.google.com)
* Setup a MySQL Database and create 2 tables (schemas available [here](db/schema)). You can change any of the table names except `sg_case_info`
* Extract and run the data script found [here](db/data)
* Create a file called "config-dev.js" in the root repository directory.
* Add the following code
```javascript
module.exports.config = 'yourFirebaseConfigObject';
module.exports.db = {
    host: 'hostname',
    user: 'user',
    password: 'password',
    database: 'database',
    infoTable: 'table name of info table',
    deltaTable: 'table name of delta table'
}
```
* Generate a service account from `Firebase > Project Settings` and save the file as __service-account.json__ in the root of the repository folder
