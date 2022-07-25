# Hourly Client Frontend

## Overview
This application is a React application bundled with Create-React-App. The application is broken up into sections
by screens -> components. The application is designed to interface directly with the Hourly Cloud application,
however integrating with 3rd party APIs is simple, as the API client is built with a scalable approach in mind.

## API Client
API Clients are designed as classes that inherit from the superclass APIController, which provides methods and
functionality to query in a manner that mimics synchronous programming with async-await. Each invocation of an API call method
should be wrapped in a try-catch block, as the API response will be thrown as an error to be caught at your
convenience. Below is an example of a query to the employees domain that will fetch all employees matching the name
'John':

    async function fetchEmployees() {
        try {
            const employees = await EmployeesApi.findAll({
                name: 'John'
            })
            if (employees && employees.length > 0) {
                // Do something with the data.
            }
        } catch (error) {
            // Do something with the error.
        }
    }

## Material-UI
This project is wrapped in a React.js-based component library known as Material-UI (renamed as MUI). The library
hosts hundreds of components that you may leverage when building an interface. Please note that when importing
Material-UI components for use in an interface, you should NEVER utilize destructured imports, as this drastically
affects the bundle size due to the size overhead of importing the entire library. Each component has a path, which
is preceded by '@mui/material'. Below is an example:

    import Button from '@mui/material/Button'

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
