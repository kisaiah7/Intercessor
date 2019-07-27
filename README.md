# intercessor-web

This is a web app I made called Intercessor. It's a prayer sharing app with several functionalities.

It handles user authentication via Google and also a simple provided email and password. It differentiates between a new user and a returning one, and provides a unqiue "new user" prompt to the former. The app's data is hosted on mongoDB and passwords are encrpyted. Users can search up other users by name, email, and user acronyms; they can also form groups with other users. Prayer requests can be sent to individuals and groups by providing user/group names, user email, and/or user/group acronyms. Other people's prayer requests can be retrieved by filtering through groups and personal requests sent to the user.

Check out the app, register an account, and send prayer requests to friends and family here: https://intercessor-web.herokuapp.com/. Be prepared to wait a few seconds for the website to load for the first time, since Heroku puts to sleep sites that have not been used for over thirty minutes. (https://devcenter.heroku.com/articles/free-dyno-hours)

Check out the rest of my portfolio here at github/yanghakim or on my portfolio: https://yanghakim.netlify.com/
