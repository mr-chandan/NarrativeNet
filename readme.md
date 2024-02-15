# NarrativeNet

## Description

NarrativeNet is a web application for sharing and discovering stories written by users. It allows users to create, publish, and read stories, as well as contribute to existing stories.

## Features

- **User Authentication**: Users can sign up, log in, and log out securely using OAuth 2.0 authentication provided by Auth0.
- **Create Stories**: Authenticated users can create new stories, providing a title, starting line, and tone for the story.
- **Discover Stories**: Users can explore trending stories on the platform to find interesting reads.
- **View User Stories**: Authenticated users can view stories they've created and track their contributions to existing stories.
- **Contribute to Stories**: Users can contribute to existing stories by adding their own lines.
- **Vote on Contributions**: Users can upvote or downvote contributions made by other users.
- **Secure Data Storage**: User and story data is stored securely in a PostgreSQL database.

## Installation

1. Clone the repository: `git clone https://github.com/mr-chandan/NarrativeNet.git`
2. Navigate to the project directory: `cd NarrativeNet`
3. Install dependencies: `npm install`

## Usage

1. Start the server: `npm run dev`
2. Access the application at `http://localhost:3000` in your web browser.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, React.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: Auth0
- **Other**: dotenv (for environment variables)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

Feel free to customize it further with additional information or sections specific to your project!
