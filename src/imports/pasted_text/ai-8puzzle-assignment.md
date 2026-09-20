ArƟficial Intelligence Digital Assignment(Case Study) (10 Marks)
InteracƟve 8-Puzzle Problem Solver using AI Search Algorithms
Course: ArƟficial Intelligence
Individual Assignment
Submission: GitHub Repository + GitHub Pages Live URL
ObjecƟve
The objecƟve of this assignment is to understand the working of state-space search algorithms by
developing an interacƟve web applicaƟon that solves the 8-Puzzle Problem using both uninformed
and informed search techniques.
Students are expected to implement the search algorithms from scratch using JavaScript and visually
demonstrate how each algorithm searches for the goal state.
Problem Statement
Develop an interacƟve web applicaƟon that solves the 8-Puzzle Problem using any one of the
following search algorithms. Each student is assigned one specific algorithm, and the algorithm
alloƩed to each student is listed at the end of this document. Students must implement only the
algorithm assigned to them.
Uninformed Search Algorithms
1. Breadth First Search (BFS)
2. Depth First Search (DFS)
3. Depth Limited Search (DLS)
4. IteraƟve Deepening Depth Limited Search (IDDLS)
5. Uniform cost search
Informed Search Algorithms
6. Greedy Best First Search (GBFS)
7. A* Search
Technologies
Students must use
 HTML5
 CSS3
 JavaScript (ES6)
Any one UI Framework
 Bootstrap
OR
 Tailwind CSS
OpƟonal
 React
 Vue
 Angular
AnimaƟon Libraries (OpƟonal)
 Canvas API
 SVG
 D3.js
Note: The search algorithms can implement either manually or usage of AI/search libraries for
algorithm implementaƟon.
Website Requirements
The applicaƟon should contain the following pages/features.
1. Home Page
The homepage should display
 Course Name
 Assignment Title
 Student Name
 RegistraƟon Number
 IntroducƟon to the 8-Puzzle Problem
 NavigaƟon Menu
2. Puzzle Input
Provide two methods to create the puzzle.
Method 1
User enters
 IniƟal State
 Goal State
Example
IniƟal State
2 8 3
1 6 4
7 _ 5
Goal State
1 2 3
8 _ 4
7 6 5
Method 2
Generate a random solvable puzzle.
Provide a buƩon
Generate Random Puzzle
3. Algorithm SelecƟon
The user should be able to choose
 BFS
 DFS
 DLS
 IDDLS
 GBFS
 A*
For DLS
Provide
Depth Limit
For GBFS and A*
Provide heurisƟc selecƟon.
Students should implement at least the following heurisƟcs.
 Misplaced Tiles
 ManhaƩan Distance
4. Puzzle VisualizaƟon
The applicaƟon should visually display
 IniƟal State
 Goal State
 Current State
 Generated Successor States
 Final SoluƟon Path
The movement of the blank Ɵle should be animated.
Example
Step 0
2 8 3
1 6 4
7 _ 5
↓
Step 1
2 8 3
1 _ 4
7 6 5
↓
Step 2
2 _ 3
1 8 4
7 6 5
ConƟnue unƟl the goal state is reached.
5. Search Process VisualizaƟon
During execuƟon, display the following informaƟon in real Ɵme.
 Current node being expanded
 Number of nodes generated
 Number of nodes expanded
 FronƟer (Open List)
 Explored (Closed List)
 Current search depth
 Parent node
 Path cost (if applicable)
For GBFS and A*, also display
 HeurisƟc value h(n)
 Path cost g(n)
 EvaluaƟon funcƟon f(n)
6. SoluƟon Summary
AŌer reaching the goal state, display
 SoluƟon Found / Not Found
 Total Number of Moves
 Total Nodes Generated
 Total Nodes Expanded
 Maximum Search Depth
 ExecuƟon Time
 Path Cost
 Memory Usage (Approximate)
7. Comparison Page
Provide a comparison table showing the performance of all six algorithms on the same puzzle
instance.
Example
Algorithm SoluƟon Found Nodes Expanded Moves Time Memory
BFS Yes 152 8 24 ms High
DFS Yes 391 21 12 ms Low
DLS No 85 - 8 ms Low
IDDLS Yes 170 8 30 ms Medium
GBFS Yes 39 8 5 ms Low
A* Yes 25 8 4 ms Medium
8. Algorithm InformaƟon Page
For each algorithm, include
 DescripƟon
 Working Principle
 Advantages
 LimitaƟons
 Time Complexity
 Space Complexity
 Completeness
 OpƟmality
9. InteracƟve Controls
Provide the following controls.
 Run
 Pause
 Resume
 Next Step
 Previous Step
 Reset
 Change Speed
GitHub Repository Structure
AI-8Puzzle-Visualizer/
│── index.html
│── css/
│── js/
│── assets/
│── images/
│── README.md
│── docs/
README.md Should Include
 Project DescripƟon
 Technologies Used
 Search Algorithms Implemented
 HeurisƟcs Used
 Screenshots
 GitHub Pages URL
 Student Details
 References
 How to Run the Project
Deployment
Students must deploy the project using GitHub Pages.
Submit the following.
1. GitHub Repository Link
Example
hƩps://github.com/username/AI-8Puzzle-Visualizer
2. Live Website
Example
hƩps://username.github.io/AI-8Puzzle-Visualizer
EvaluaƟon Rubric (10 Marks)
Component Marks
Correct implementaƟon of BFS, DFS, DLS and IDDLS 2
Correct implementaƟon of GBFS and A* with heurisƟcs 2
InteracƟve visualizaƟon of the search process 2
User interface, responsiveness and usability 1
Performance staƟsƟcs, comparison page and algorithm documentaƟon 1
GitHub repository quality, code organizaƟon and README 1
Successful deployment on GitHub Pages and project demonstraƟon 1
Total 10
Submission Guidelines
Each student must submit the following through the pdf which contains the URL’s of the below
requirements:
1. GitHub Repository URL
2. GitHub Pages Live URL
3. README.md
4. A 3–5 minute demonstraƟon video explaining:
o The implemented algorithms
o Puzzle solving process
o Comparison of algorithms
o HeurisƟc funcƟons used
o Overall project features
Academic Integrity
 Properly acknowledge all third-party resources in the README.
Expected Learning Outcomes
Upon successful compleƟon of this assignment, students will be able to:
 Model the 8-Puzzle as a state-space search problem.
 Implement both uninformed and informed search algorithms from scratch.
 Compare algorithms based on completeness, opƟmality, Ɵme, and memory usage.
 Apply heurisƟc funcƟons such as Misplaced Tiles and ManhaƩan Distance.
 Develop an interacƟve AI visualizaƟon tool using modern web technologies.
 Deploy a complete web applicaƟon using GitHub and GitHub Pages.