# 8-Puzzle Search Lab

## Project Description
This project is an interactive web application built to demonstrate how search algorithms solve the classic 8-puzzle problem. The project visualizes the board state, explores possible moves, and compares the behavior of uninformed and informed search strategies in a retro pixel-art interface inspired by classic computer-game styling.

This assignment focuses on the 8-puzzle as a state-space search problem and is designed to help users understand how algorithms such as Breadth-First Search (BFS), Depth-First Search (DFS), Iterative Deepening Depth-Limited Search (IDDLS), Greedy Best-First Search (GBFS), and A* find a path from the initial state to the goal state.

The application includes a student-friendly UI, an interactive puzzle board, search statistics, and algorithm comparison features. The assigned search strategy for this project is Greedy Best-First Search (GBFS), with Manhattan Distance and Misplaced Tiles heuristics available for analysis.

---

## Technologies Used
- HTML5
- CSS3
- JavaScript (ES6+)
- React
- Vite
- TypeScript
- Tailwind CSS
- Google Fonts (Press Start 2P, VT323)
- SVG/CSS-based retro styling and pixel-art interface

---

## Search Algorithms Implemented
The project includes the following algorithms for the 8-puzzle problem:

- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Depth-Limited Search (DLS)
- Iterative Deepening Depth-Limited Search (IDDLS)
- Greedy Best-First Search (GBFS)  
  - Assigned algorithm for this project
- A* Search

These algorithms are implemented to explore the puzzle state space and compute solution paths, node expansions, search depth, execution time, and memory usage.

---

## Heuristics Used
The informed search algorithms use the following heuristic functions:

- Manhattan Distance
  - Estimates the distance each tile must move to reach its goal position.
- Misplaced Tiles
  - Counts how many tiles are not in their correct goal positions.

For this project, GBFS and A* can use either heuristic to compare search performance.

---

## Screenshots

![MindMaze welcome screen](src/imports/image-3.png)

![Retro pixel-art game interface](src/imports/image-1.png)

![Puzzle and algorithm visualization](src/imports/image-2.png)

---

## GitHub Pages URL
Live project URL (to be updated after deployment):

https://<your-github-username>.github.io/AI-8Puzzle-Visualizer

Repository URL:

https://github.com/<your-github-username>/AI-8Puzzle-Visualizer

> Replace the placeholder GitHub username with the actual account used for publishing the project.

---

## Student Details
- Student Name: Yoshita Vanapalli
- Registration Number: 24BCE2812
- Course: Artificial Intelligence
- Assignment: Interactive 8-Puzzle Problem Solver using AI Search Algorithms
- Project Title: MindMaze — 8-Puzzle Search Lab

---

## References
- AI 8-Puzzle Digital Assignment Case Study provided by the course instructor
- Artificial Intelligence: A Modern Approach by Stuart Russell and Peter Norvig
- Project assignment prompt stored in the repository under `src/imports/pasted_text/ai-8puzzle-assignment.md`
- Search algorithm concepts based on classic state-space exploration and heuristic search theory

---

## How to Run the Project
Follow these steps to run the project locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AI-8Puzzle-Visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the local URL shown in the terminal (typically Vite's default localhost port such as http://localhost:5173).

5. To create a production build:
   ```bash
   npm run build
   ```

6. To preview the production build locally:
   ```bash
   npm run preview
   ```

---

## Notes
This project was designed to meet the requirements of an AI digital assignment and includes interactive puzzle solving, algorithm comparison, performance statistics, and a retro-themed user interface. The project can be deployed on GitHub Pages by publishing the built static files from the Vite output.
