# Language Learner

Welcome to Language Learner, a powerful tool for language learners to immerse themselves in authentic content from YouTube in their targeted language, while expanding their vocabulary effortlessly.

## Key Features
- Search any YouTube video in your target language and access original subtitles.
- Paste any URLs of YouTube videos to start watching and learning instantly.
  ![Home Page](https://i.ibb.co/kxzy28K/language-learner-homepage.png)

- Hover over words to instantly view their meanings and add them to your vocabulary list for future reference.
- Pause after each sentence.
- Support for auto-generated subtitles ensures accessibility to a wide range of content.
  ![Hovering over to learn meaning of a word](https://i.ibb.co/xqkPFgb/language-learner-learnpage-wordmeaning.png)

- Words already learned on a specific video will be displayed as a list when the user watches it again, enhancing retention and reinforcement of vocabulary.
  ![List of vocabularies learned](https://i.ibb.co/vq5qSZs/language-learner-learnpage-vocabularylist.png)



## Getting Started
To get started with [Your App Name], follow these steps:

1. Clone this project repository and the [Language-Learner-Backend](https://github.com/Dive1995/Language-Learner-Backend) repository.
    ```bash
    git clone https://github.com/Dive1995/Language-Learner-Frontend.git
    git clone https://github.com/Dive1995/Language-Learner-Backend.git
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
