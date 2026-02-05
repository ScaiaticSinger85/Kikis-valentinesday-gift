# Copilot Instructions for KIKI Birthday & Valentine's Day Gift Project

## Overview
This project is designed to create an interactive experience for a birthday and Valentine's Day gift. The main features include animated hearts, a confetti burst, and user interactions through buttons.

## Architecture
- **Main Components**:
  - `index.html`: The main HTML file that structures the application.
  - `valentines.css`: Contains styles for the application, including animations and layout.
  - `valentines.js`: Handles all the interactive functionality, including heart animations and button events.

- **Data Flow**:
  - User interactions trigger animations and display sections of the page.
  - The `spawnHeart` function creates heart elements that float across the screen.
  - The `confettiBurst` function generates a burst of confetti when the user clicks the "Yes" button.

## Developer Workflows
- **Running the Project**:
  - Open `index.html` in a web browser to view the project.

- **Testing**:
  - Ensure all animations work as expected by interacting with the buttons.

- **Debugging**:
  - Use browser developer tools to inspect elements and debug JavaScript errors.

## Project-Specific Conventions
- **Event Handling**:
  - Use `addEventListener` for handling user interactions.
  - Functions like `showSection` are used to manage visibility of different sections based on user actions.

- **Animation Patterns**:
  - Use `requestAnimationFrame` for smooth animations, as seen in the `confettiBurst` function.

## Integration Points
- **External Dependencies**:
  - The project does not currently use external libraries but relies on native JavaScript and CSS for functionality.

- **Cross-Component Communication**:
  - Components communicate through DOM manipulation and event listeners, ensuring a cohesive user experience.

## Key Files
- **`valentines.js`**: Contains the core logic for animations and user interactions.
- **`valentines.css`**: Defines styles and animations for the project.

## Conclusion
This document serves as a guide for AI coding agents to understand the structure and functionality of the KIKI Birthday & Valentine's Day gift project. Follow the outlined conventions and workflows to maintain consistency and enhance productivity.