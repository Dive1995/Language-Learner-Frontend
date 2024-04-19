# Language Learner

Welcome to Language Learner, a powerful tool for language learners to immerse themselves in authentic content while expanding their vocabulary effortlessly.

![Home Page](https://i.ibb.co/t4tTQQL/language-learner-homepage.jpg)
![Learn Page](https://i.ibb.co/vcgpLMd/language-learner-learnpage.png)
![Hovering over to learn meaning of a word](https://i.ibb.co/xqkPFgb/language-learner-learnpage-wordmeaning.png)
![List of vocabularies learned](https://i.ibb.co/vq5qSZs/language-learner-learnpage-vocabularylist.png)

## Key Features
- Search any YouTube video in your target language and access original subtitles.
- Hover over words to instantly view their meanings and add them to your vocabulary list for future reference.
- Support for auto-generated subtitles ensures accessibility to a wide range of content.
- Words already learned on a specific video will be displayed as a list when the user watches it again, enhancing retention and reinforcement of vocabulary.
- Paste any URLs of YouTube videos to start watching and learning instantly.


## Getting Started
To get started with [Your App Name], follow these steps:

1. Clone this project repository and the [LanguageLearningServer](https://github.com/Dive1995/LanguageLearningServer.git) repository.
    ```bash
    git clone https://github.com/Dive1995/LanguageLearningApp.git
    git clone https://github.com/Dive1995/LanguageLearningServer.git
    ```
2. Navigate to the server project directory and run the server using the command:
    ```bash
    python3 main.py
    ```
3. In a separate terminal window, navigate to the frontend project directory and start the frontend using the command:
    ```bash
    npm run start
    ```
Once the project has started, you should be able to paste any YouTube video URLs and begin your language learning journey.


## Additional Configuration

### YouTube Search Feature
If you wish to use the YouTube search feature, you'll need to add your Google API key to the `.env` file. Set your API key to the variable `GOOGLE_API_KEY`.

### Saving Progress and Sign-In
To save your progress and enable sign-in functionality, follow these steps:

1. Add your Google Auth client ID to the `.env` file in the frontend project. Set the `GOOGLE_CLIENT_ID` variable to your client ID.
2. In the server project, add your MongoDB connection string to the `.env` file.
