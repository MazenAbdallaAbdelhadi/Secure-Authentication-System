# MERN Stack Authentication Project

Welcome to our MERN stack authentication project! This project focuses on providing robust authentication features using the MERN (MongoDB, Express.js, React.js, Node.js) stack. Below you'll find instructions on how to set up and use the project.

## Installation

Before using the project, ensure you have Node.js and MongoDB installed on your system. Then, follow these steps:

1. Clone the repository to your local machine:

```
git clone https://github.com/Mazen-Abdalla/basic-auth.git
```

2. Navigate to the project directory:

```
cd mern-authentication-project
```

3. Install dependencies for both the server and the client:

```
cd server
npm install
cd ../app
npm install
```

## Configuration

1. Create a `.env` file in the `server` directory based on the `.env.example` file provided.
2. Update the variables in the `.env` file with your MongoDB connection URI, JWT secret, and other necessary configurations.

## Usage

1. Start the server:

```
cd server
npm run dev
```

2. Start the client:

```
cd app
npm run dev
```

3. Access the application in your browser at `http://localhost:5173`.

## Features

- **Login:** Secure login functionality with email and password.
- **Social Login:** Seamlessly login using Google for added convenience.
- **Register:** Simple registration process for new users.
- **Logout:** Easily log out when done with the session.
- **Forget Password:** Reset your password hassle-free if forgotten.
- **Confirm Reset:** Secure confirmation step for resetting passwords.
- **Reset Password:** Effortlessly reset your password after confirmation.
- **User Profile:** Access and view your user profile at any time.
- **Update Profile:** Update your profile information with ease.
- **Update Password:** Keep your account secure by updating your password.
- **Delete Account:** Delete your account when needed.

## Feedback

We welcome any feedback or suggestions! Feel free to open an issue or submit a pull request with any improvements you'd like to see.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize it further to match your project's specifics!
