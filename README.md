# Node.JS Server with RSS Feed
### Make sure you have the latest version of Node.js installed.
## Installation & Configuration:
```
git clone https://github.com/dincadaniel146/rss-web-app
```
Open the terminal inside the folder and install dependencies with:
```
npm shrinkwrap
npm install
```
For the database:
```
Install MongoDB Community Server ( make sure to install MongoDB Compass as well)
```
```
Once installed, make a new connection to mongodb://localhost:27017 using MongoDB Compass
```
>App will load slow without database initialization!

## For starting the server:
```
node app.js
```
Enter the following URL in your browser:
```
localhost:3000/news
```






# Features:
- Uses 'RSSParser' to parse NYtimes RSS and show news inside HTML.
- Saves news list to database via MongoDB
- Possibility to sort news alphabetically (asc/desc) or by publication date
- Possibility to search news by keywords
- Contains a method that returns the "production version"
- Built using Node.JS , ExpressJS , MongoDB and Bootstrap
