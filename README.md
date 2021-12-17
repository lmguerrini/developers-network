<div align="center">
  <img alt="dn" src="client/public/img/theDeveloperNetworkBackgroundLogo.png">
</div>

# The Developers Network

A social network made for developers as a final project during the Full-Stack Web Developer Bootcamp at [Spiced Academy](https://github.com/spicedacademy) in Berlin. <br />
In a world increasingly populated by social media, I noticed the lack of one made specifically for developers. From this observation the idea was born to develop one that summarizes on the one hand the typical needs of a developer (such as having the ability to share formatted code in the chat) and on the other the more common ones of other social networks (such as add photos on your wall and be able to comment on them), which can thus complete a developer's profile, going beyond the mere professional sphere. <br />
Thus **DN**™️ was born: the developers network made by devolpers for developers.

## Overview

-   [Technologies](#technologies)
-   [Setup](#setup)
-   [Structure & features](#structure--features)
-   [Preview](#preview)

## Technologies

This project was created with:

-   Front-End: HTML, [SCSS](https://sass-lang.com), [React.js](https://reactjs.org) (Hooks, Redux, React-Icons, [MUI](https://mui.com))
-   Back-End: [Node.js](https://nodejs.org/en/about/) / [Express](http://expressjs.com) (Csurf, Cookie Session, Bcrypt)
-   Data & Cloud: [PostgreSQL](https://www.postgresql.org), [Multer](https://github.com/expressjs/multer), [AWS S3](https://aws.amazon.com/s3/)
-   API & Others: [Geolocation API](http://geolocation-db.com), [Socket.IO](https://socket.io/docs/v4/)
-   Testing: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Setup

First of all clone the repo on your own machine

```bash
git clone https://github.com/lmguerrini/developers-network.git
```

Go to the project directory

```bash
cd developers-network
```

Install all the dependencies required

```bash
npm install
```

For the sockets functionalities of the project you may also need to install all the related packages

```bash
npm install socket.io socket.io-client
```

Start the server

```bash
npm run dev
```

Now you should be ready to dive into DN at http://localhost:3000
<br /><br />

## Structure & features

-   ### Welcome (logged out)
    -   Opening Animation
        -   **Sign-in** (w/ specific errors)
        -   **Log-in** (w/ specific errors)
        -   **Reset password**
            -   1st component: enter email address
            -   2nd component: enter code received by email (using AWS SES)
            -   3rd component: receipt of confirmation
-   ### App (logged in)
    -   Main Animation (on cover / background according to dark mode)
        -   **Profile**:
            -   Edit Account (edit name, surname, psw, email - log-out, account deletion)
            -   Uploader (update your profile picture and store it to the cloud, using Multer and AWS S3)
            -   Personal Developer Profile infos w/ two card animation
                -   1st card: main infos (editable intro / bio)
                -   2nd card: extra infos (editable education, skills, work, github, linkedin, languages, location w/ optional geolocation API for current location)
            -   Personal Wall
                -   Images/posts uploading and their deletion
                -   Post comments and replies to comments w/ their deletion
        -   **Other Developer Profile**:
            -   Profile infos w/ two card animation
                -   1st card: main infos (viewable intro / bio)
                -   2nd card: extra infos (viewable education, skills, work, github, linkedin, languages, location w/ optional geolocation API for current location)
            -   Wall
                -   Images/posts viewing
                -   Post comments and replies to comments w/ their deletion
        -   **My Developers Network**:
            -   Display all developers who are your friend
            -   Display all developers who want to be your friend
        -   **Find Developers**:
            -   Look for Developers who joined DN - send them a friendhsip, check their wall out or just write them a PM
        -   **General Chat**:
            -   List of developers currently online
            -   Write something in the chat for all DN members (w/ automatically formatted code)
        -   **Private Chat**:
            -   Write something to a specific developer member of DN (w/ automatically formatted code)
        -   **Notifications**
            -   List of all notifications: friendships, chat, private messages
            -   Push notifications for new/deleted message in general or private chat, friend requests received or revoked, errors
        -   **Extra**:
            -   **Log-out**
            -   **Account deletion** (w/ all related data stored on AWS)
            -   **Dark mode** (w/ different animations according to mode in use)
            -   **Cross-platform optimization**
                -   Different interlinked animations according to device screen size
                -   Tablet and Mobile responsiveness

## Preview

### Welcome animation

![](/client/public/git/desktop/welcome/welcomeAnimation.gif)

### Registration & Login w/ specific errors

![](/client/public/git/desktop/welcome/registrationSpecificErrors.gif) &emsp;
![](/client/public/git/desktop/welcome/loginSpecificErrors.gif) &emsp;

### Reset password w/ AWS SES

![](/client/public/git/desktop/welcome/resetPswGeneralError.gif)

### App dark mode slide animation

![](/client/public/git/desktop/app/profile/darkModeSlideAnimation.gif)

### Reactive background animation (w/ mouse move and clicking) detail

![](/client/public/git/desktop/app/profile/backgroundAnimationReactionMouseMoveAndClicking.gif)

<!-- ![](/client/public/git/desktop/app/profile/logoAnimation.gif) -->

### Profile card edit intro and extra infos w/ animation

![](/client/public/git/desktop/app/profile/profileCardAnimation.gif)

### Profile card different animation (w/ different screen size)

![](/client/public/git/desktop/app/profile/differentCardAnimation.gif)

### Wall section

![](/client/public/git/desktop/app/profile/wallAnimation.gif)

### Reply to wall comment and delete

![](/client/public/git/desktop/app/profile/replyCommentAndDelete.gif)

### Change profile picture

![](/client/public/git/desktop/app/upload/changeProfilePicture.gif)

### Edit account

![](/client/public/git/desktop/app/editAccount/editProfile.png)

### Other profile different card animation

![](/client/public/git/desktop/app/otherProfile/otherProfileCardAnimation.gif)

### My developers network (w/ dark mode)

![](/client/public/git/desktop/app/myDevelopersNetwork/myDevelopersNetworkDM.png)

### Look for developers in DN (w/ dark mode)

![](/client/public/git/desktop/app/findDeveloper/lookForDevelopers.gif)

### Chat (w/ formatted code) and online developers all in real time

![](/client/public/git/desktop/app/chat/liveChatAndOnlineDevelopers.gif)

### Private messages (w/ formatted code)

![](/client/public/git/desktop/app/pm/pmWithFormattedCode.png)

### Notifications page w/ push notifications

![](/client/public/git/desktop/app/notifications/notifications.gif) <br />
![](/client/public/git/desktop/app/notifications/deleteMessagePushNotification.gif) <br />
![](/client/public/git/desktop/app/notifications/chatPushNotification.png)

### Tablet welcome optimization

![](/client/public/git/tablet/welcome/tabletWelcome.gif)

### Tablet profile page

![](/client/public/git/tablet/app/tabletProfile.gif)

### Tablet app preview

![](/client/public/git/tablet/app/tabletAppPreview.gif)

### Mobile welcome optimization

![](/client/public/git/mobile/welcome/mobileWelcome.gif) <br />
![](/client/public/git/mobile/welcome/mobileWelcomeA.gif) &emsp;
![](/client/public/git/mobile/welcome/mobileWelcomeL.gif)

### Mobile menu bar and dark mode

![](/client/public/git/mobile/app/mobileReverse.gif)
![](/client/public/git/mobile/app/mobileB.gif)

<!-- ![](/client/public/git/mobile/app/mobileMenu.gif) -->

### Mobile app preview

![](/client/public/git/mobile/app/mobileProfile.gif) &emsp;
![](/client/public/git/mobile/app/mobileAppPreview.gif)
<br /> <br />

#### [Go back](#dn---the-developers-network) or demo it yourself at https://the-developers-network.herokuapp.com
