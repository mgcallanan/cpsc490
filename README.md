# CPSC 490: Senior Project

## Continuous Line Interpretation of User Drawn Polygons

_Documentation Last Updated: 12/14/22_

Codebase for my senior project for CPSC 490 at Yale University. Advised by Dr. Scott Petersen. A demo of the system installed can be found [here](https://youtu.be/Pm56kx5IGyY).

## Project Overview

## How to Run

### Prerequisites

The project requires that you have Node.js installed on your system. See installation instructions [here](https://nodejs.org/en/download/).

### Getting Set Up

#### Installing Libraries

Once you have Node installed, run the terminal commands below from the `cpsc490` directory:

```
~/cpsc490$ cd polygon-draw
~/cpsc490/polygon-draw$ npm install
```

This command will install all of the required dependencies for the project.

#### Setting IP Address

In order for users to connect, you have to set the server IP to be the IP address for parts of the system.

In [cpsc490/polygon-draw/package.json](./polygon-draw/package.json) in line 28 in the `dev-server` script command, change the IP address to be your machine's public IP address (which you can find by searching "what is my ip" using your preferred browser).

In [cpsc490/polygon-draw/src/utils/ipAddr.js](./polygon-draw/src/utils/ipAddr.js) in line 1, change the `SERVER_IP_ADDR` value to be your machine's public IP address (which you can find by searching "what is my ip" using your preferred browser).

### Running the Program

Still working from the `cpsc490` directory, run the following commands:

```
~/cpsc490$ cd polygon-draw
~/cpsc490/polygon-draw$ npm start
```

This starts the UI element of the project. Navigate to `localhost:3000` to observe the site and use.

Open a new terminal tab and from the `cpsc490` directory, run the following commands:

```
~/cpsc490$ cd polygon-draw/server
~/cpsc490/polygon-draw/server$ node index.js
```

This starts the WebSocket server for the application.

Now, open one more terminal tab (while keeping the previous two open), and from the `cpsc490` directory, run the following commands:

```
~/cpsc490$ cd polygon-draw
~/cpsc490/polygon-draw$ npm run dev-server
```

This sets up the mock database backend for the project.

## How to Use

### Inputting Polygons, Part by Part

![](demos/head.gif) ![](demos/torso.gif) ![](demos/arms.gif)

The program accepts the polygons for the various body parts in stages to expand user control since they will be using their fingeres to draw the polygons.

As seen in the GIF above, users drag to draw lines (since this will translate well to a phone touchscreen interface) that form polygons. In order to close the polygon, they drag the last line to the initial point, and as long as the line's endpoint is within the white circle (within 20px radius of the initial point), the shape will be closed. The polygons are completely custom, in that they can have as many sides at whatever angle the user desires.

Once you finish the polygon, the system automatically places the shape where it would typically be on a body. When you click `Next Part`, you will be prompted to draw the next body part in the sequence.

### Converting to an Outline

Once the user has finished inputting all of the body parts, they will be prompted to convert the figure into its concave hull counterpart. This outline shows up on the projector that the user is connected to.

## Dependencies

- [p5.js](https://p5js.org/)
- [hull.js](https://github.com/AndriiHeonia/hull)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Sass](https://sass-lang.com/)
- Anything else installed with [create-react-app](https://create-react-app.dev/)
