# MASTER PROMPT — MINDSCAPE: RETRO PIXEL-ART AI 8-PUZZLE WEBSITE

Act as a senior frontend developer, UI/UX designer, and Artificial Intelligence search-algorithm developer.

Build my **complete, functional AI 8-Puzzle assignment website** using the attached image as the primary visual inspiration.

I do not want a generic dashboard, a conventional dark AI interface, or a static Figma mockup. I want the website to feel like a **retro pixel-art computer/game interface from the 1990s**, with a playful landscape background, pixelated windows, blue borders, pixel buttons, and a nostalgic operating-system aesthetic.

The application must still function as a serious undergraduate AI assignment. Every displayed search value must come from the actual algorithm execution.

Build the actual frontend and JavaScript functionality, not just a visual design.

---

# 1. PROJECT DETAILS

Use these exact details:

* Project name: MindMaze — 8-Puzzle Search Lab
* Student: Yoshita Vanapalli
* Registration number: 24BCE2812
* Course: Artificial Intelligence
* Puzzle: 8-Puzzle
* Board: 3×3
* Assigned algorithm: Greedy Best-First Search (GBFS)
* Heuristic options: Manhattan Distance and Misplaced Tiles
* Blank tile: `0` internally, visually represented as an empty cell.

The website should feel like a retro computer program called:

**LANDSCAPE.EXE**

The main interface can resemble a pixel-art game window, but the actual product name should remain MindMaze.

---

# 2. USE THE ATTACHED IMAGE AS THE VISUAL REFERENCE

The uploaded reference image has a very specific aesthetic. Recreate its visual language as closely as possible without copying unrelated elements that do not fit the assignment.

The reference features:

* A warm, off-white page background.
* A centered, retro computer/application window.
* Thick royal-blue borders.
* Pixelated blue typography.
* A pixel-art landscape inside the main window.
* Small floating pixel-art objects.
* Old operating-system-style popup windows.
* Pixelated buttons and controls.
* A loading bar.
* A large central START button.
* A nostalgic, playful, slightly chaotic computer-game atmosphere.
* Small overlapping windows and interface elements.
* A restrained palette of blue, cream, green, white, and muted pixel-art colors.

**Use these as the core design principles throughout the entire website.**

Do not turn the website into a generic neon cyberpunk dashboard.

Do not use a standard black-and-purple AI aesthetic.

Do not use glassmorphism.

Do not use realistic 3D objects.

Do not use unrelated stock photos.

Do not use excessive gradients.

Do not make it look like a standard SaaS admin template.

The website should look like an actual retro pixel-art application.

---

# 3. TECHNOLOGY STACK

Use:

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)
* DOM APIs
* Google Fonts

Use a pixel font such as:

* Press Start 2P for headings, labels, buttons, and retro interface details.
* VT323 or another readable pixel-inspired font for descriptions and longer content.

Use a clean monospaced font for technical data if necessary.

Optional: Tailwind CSS CDN may be used for utilities, but custom CSS must control the visual style.

Do not require:

* React
* Next.js
* A backend
* A database
* API keys
* Paid services

The project must run locally in a modern browser.

---

# 4. PROJECT STRUCTURE

Create this project structure:

```text
AI-8Puzzle-Visualizer/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
└── README.md
```

The files must contain the complete working implementation.

* `index.html`: All pages, sections, interface windows, and controls.
* `css/style.css`: Complete pixel-art styling, responsive layout, animations, and UI states.
* `js/app.js`: Actual GBFS algorithm, heuristics, puzzle validation, search event logging, playback, metrics, and interactions.
* `README.md`: Project overview, technologies, setup, algorithm details, metric definitions, limitations, and testing.

Do not leave placeholders or TODOs.

---

# 5. DESIGN SYSTEM

## Color palette

Use the reference image as the basis for the color palette.

Primary colors:

* Warm cream background: `#F3F1E8`
* Main royal blue: `#194FA5`
* Deep blue: `#123C83`
* Light blue: `#8FC7E5`
* Pixel sky blue: `#5E9DD1`
* Grass green: `#789B4A`
* Dark forest green: `#334D36`
* Pixel cream: `#FFFDF3`
* Pixel white: `#FFFFFF`
* Soft yellow: `#F3D95B`
* Dark text: `#172B48`
* Pixel gray: `#C7CBD0`
* Error red: `#D94354`
* Success green: `#477F42`

Keep the palette consistent across every page.

## Pixel-art borders

Use:

* Thick blue window borders.
* Square corners or intentionally stepped corners.
* Pixelated shadows.
* Inset/outset button styling inspired by old desktop software.
* Small decorative corner details.
* Hard-edged shadows rather than blurry shadows.

Create the pixelated look using CSS where possible.

Avoid excessive rounded cards. The reference uses mostly square, framed interface elements.

## Typography

Use Press Start 2P for:

* Application name.
* Window titles.
* Main headings.
* Section labels.
* Buttons.
* Status badges.
* Small pixel labels.

Use VT323 or another readable retro font for:

* Explanations.
* Algorithm descriptions.
* Long text.
* Technical documentation.

Important: Press Start 2P can be difficult to read at small sizes. Use it selectively and keep body text readable.

## Background

Create a pixel-art landscape inspired by the image:

* Pixelated blue sky.
* Blocky clouds.
* Pixelated hills and grass.
* Small stars or sparkles.
* A distant mountain silhouette.
* Pixel flowers or tiny decorative objects.

The landscape can be made with CSS pixel blocks, a custom pixel-art background, or a suitable generated asset.

Do not use a blurry photographic landscape.

Keep text and controls readable over the background.

Use a cream outer page background and place the main application inside a large blue-framed window.

---

# 6. OVERALL WEBSITE STRUCTURE

Create a complete single-page application with navigation between these sections:

1. Welcome / Start Screen
2. Puzzle Setup
3. Search Process Visualization
4. Solution Summary
5. Solution Path Explorer
6. Algorithm Information
7. About / Project Details

Use a retro desktop-window style.

Each major section should look like a different window or application panel.

Navigation should resemble old computer menus, tabs, or clickable pixel buttons.

Every navigation control must work.

Do not make separate decorative pages that contain no functionality.

---

# 7. WELCOME SCREEN

Make the first screen closely resemble the uploaded image.

## Main window

Create a centered application window with:

* Thick blue frame.
* Pixelated title bar.
* Window title: `LANDSCAPE.EXE`
* A minimize-style decorative control.
* A close-style decorative control, if appropriate.
* Pixel-art landscape background.
* A central large START button.

The START button should look like a large green pixel-art game button with a white border and pixel lettering.

When clicked, it should transition to the puzzle configuration section.

## Loading bar

At the top of the welcome screen, create a retro loading bar.

It may animate briefly when the page loads.

Do not make the user wait unnecessarily.

After loading, show a label such as:

`SYSTEM READY`

Do not show a fake loading percentage that continuously increases without purpose.

## Decorative elements

Use small pixel-art decorations inspired by the reference:

* Cursor arrows.
* Stars.
* Tiny flowers.
* Hearts.
* Small retro computer icons.
* Pixel windows.

These must not obstruct important controls.

## Retro warning popup

Include a small optional popup resembling the reference's warning dialog.

Example:

`WARNING`

“Ready to explore the puzzle state space?”

Buttons:

* `YES`
* `NO`

YES opens the solver.

NO can close the popup or return to the welcome screen.

This popup should be dismissible and must not prevent access to the application.

---

# 8. PUZZLE SETUP WINDOW

Create a retro window titled:

`PUZZLE.EXE`

Inside, display:

* Initial State board.
* Goal State board.
* Heuristic selector.
* Shuffle control.
* Reset control.
* Run Search button.

Use the following default initial state:

```text
2 8 3
1 6 4
7 0 5
```

Use the following default goal state:

```text
1 2 3
8 0 4
7 6 5
```

## Puzzle boards

Each board must be a real 3×3 grid.

Style the tiles like retro game tiles:

* Blue or cream backgrounds.
* Thick square borders.
* Pixel-style numbers.
* A distinct blank tile.
* Visible selected-tile states.
* Simple pixel transitions.

The initial and goal boards should be clearly labeled.

## Editing

Provide a valid way to configure the initial and goal boards.

Prevent duplicate values from silently creating invalid configurations.

Each board must contain exactly the numbers 0 through 8 once each.

Include a reset button.

If the user enters an invalid board, show a retro warning window with a clear explanation.

## Controls

Include:

* `RESET`
* `SHUFFLE`
* `RUN SEARCH`
* Heuristic selector:

  * Manhattan Distance
  * Misplaced Tiles
* Playback speed selector or slider.

All controls must work.

The selected heuristic must affect the actual GBFS execution.

---

# 9. SEARCH ALGORITHM

Implement actual Greedy Best-First Search in JavaScript.

Do not simulate the algorithm with hardcoded results.

## State representation

Represent each board as an array of nine integers.

Use a consistent state key for duplicate detection.

## Legal moves

Find the blank tile and generate valid adjacent moves:

* Up
* Down
* Left
* Right

Do not allow moves outside the 3×3 board.

## GBFS priority

Select the OPEN node with the smallest heuristic value h(n).

Use deterministic tie-breaking:

1. Lowest h(n).
2. Shallowest depth.
3. Stable insertion order.

**Do not use g(n) + h(n) as the selection priority.** That would be A*, not GBFS.

## Data structures

Maintain:

* OPEN list.
* CLOSED list.
* Discovered-state set.
* Parent references.
* Search depth.
* g(n).
* h(n).
* f(n).
* Unique node IDs.
* Search event log.

## Heuristics

### Manhattan Distance

Sum the Manhattan distances of all numbered tiles from their goal positions.

Exclude the blank.

### Misplaced Tiles

Count numbered tiles that are not in their goal positions.

Exclude the blank.

The selected goal state must be used when calculating either heuristic.

---

# 10. SOLVABILITY VALIDATION

Before searching:

* Validate both boards.
* Ensure each contains 0–8 exactly once.
* Check whether the initial state can reach the selected goal.
* Use inversion parity for the 3×3 puzzle.

If unsolvable:

* Do not run GBFS.
* Show a retro warning dialog.
* Explain that the initial and goal states have different inversion parity.
* Offer the solvable shuffle button.

If initial equals goal:

* Return a successful zero-move result.
* Do not crash.
* Display the correct metrics.

Generate random solvable states by applying legal blank moves starting from the goal state.

Do not create arbitrary random permutations and assume they are solvable.

---

# 11. SEARCH PROCESS VISUALIZATION — MANDATORY

Create a dedicated window titled:

`SEARCH.EXE`

This section must display the actual search execution in real time or through a fully replayable event log.

Do not simply animate the final solution path and pretend it is the full search process.

## Required information

During execution, display:

1. Current node being expanded.
2. Number of nodes generated.
3. Number of nodes expanded.
4. Frontier / OPEN list.
5. Explored / CLOSED list.
6. Current search depth.
7. Parent node.
8. Path cost.
9. Heuristic value h(n).
10. Path cost g(n).
11. Evaluation function f(n).

For GBFS:

* `g(n)` = cost from the initial state to n.
* `h(n)` = heuristic estimate from n to the goal.
* `f(n) = g(n) + h(n)`.
* GBFS priority = h(n) only.

Clearly show that f(n) is displayed for educational purposes and is not used to rank GBFS nodes.

## Current node window

Create a prominent pixel-art panel showing:

* Current node ID.
* Current 3×3 board.
* Parent node ID.
* Search depth.
* g(n).
* h(n).
* f(n).
* Current status.

Highlight the currently expanded node using a distinct pixel border.

## Metrics panel

Use compact retro metric boxes for:

* Nodes generated.
* Nodes expanded.
* Current depth.
* Current heuristic.
* g(n).
* f(n).

Update these values from actual algorithm events.

## OPEN list window

Title:

`OPEN.EXE`

Display the actual frontier in priority order.

For every visible node, show:

* Node ID.
* Miniature board.
* h(n).
* g(n).
* f(n).
* Depth.

Highlight the next node selected for expansion.

Make the list scrollable.

## CLOSED list window

Title:

`CLOSED.EXE`

Display the actual explored states.

For every visible node, show:

* Node ID.
* Miniature board.
* h(n).
* g(n).
* f(n).
* Depth.

Highlight the most recently expanded node.

Make the list scrollable.

## Search events

Record the actual events generated by GBFS.

At minimum, record:

* Node selected for expansion.
* Node moved from OPEN to CLOSED.
* Successor generation.
* Duplicate successor rejection.
* Goal detection.
* Search termination.

Each event must contain enough information to reconstruct the correct OPEN and CLOSED lists and all relevant counters.

The playback must replay the real recorded events, not fabricated data.

## Search responsiveness

Avoid freezing the browser during long searches.

Use asynchronous or incremental search processing where appropriate.

Keep the interface responsive while the algorithm runs.

---

# 12. SEARCH PLAYBACK

Create retro playback controls:

* Previous.
* Play.
* Pause.
* Next.
* Reset.
* Speed control.

Use pixel-art buttons.

Include:

* Current event number.
* Total event count.
* Progress bar.
* START label.
* GOAL or END label.

When moving between events, update:

* Current node.
* Current board.
* OPEN list.
* CLOSED list.
* Generated count.
* Expanded count.
* Depth.
* Parent.
* g(n).
* h(n).
* f(n).

Allow the user to replay the complete event log after the search finishes.

The playback must work in both directions.

Do not show stale metrics or mismatched boards.

---

# 13. SOLUTION SUMMARY — MANDATORY

Create a dedicated retro window titled:

`RESULTS.EXE`

After the search finishes, display:

1. Solution Found / Not Found.
2. Total Number of Moves.
3. Total Nodes Generated.
4. Total Nodes Expanded.
5. Maximum Search Depth.
6. Execution Time.
7. Path Cost.
8. Memory Usage (Approximate).

## Metric definitions

Use these definitions consistently:

* Solution status: Whether the goal was reached.
* Total moves: Number of legal moves in the reconstructed path.
* Nodes generated: Unique search nodes created, including the initial node.
* Nodes expanded: Nodes removed from OPEN and processed.
* Maximum search depth: Greatest depth reached among generated nodes.
* Execution time: Measured elapsed search time in milliseconds.
* Path cost: Sum of move costs along the solution path.
* Approximate memory usage: Clearly labelled estimate based on actual stored search data.

Do not claim approximate memory is exact browser memory consumption.

Show an explanation or tooltip for the memory estimate.

Do not fabricate benchmark numbers.

If no solution is found, display `NOT FOUND` and handle unavailable path metrics appropriately.

## Visual style

Use pixel-art result panels with:

* Large status display.
* Pixelated success/failure icon.
* Compact metric cards.
* Clear numeric typography.
* A button to inspect the solution path.
* A button to rerun the search.

For a successful search, show a celebratory but restrained pixel-art success animation.

---

# 14. SOLUTION PATH EXPLORER

Create a window titled:

`PATH.EXE`

Display the reconstructed solution path from the initial state to the goal state.

Each step must be selectable.

For every step, show:

* Step number.
* Node ID.
* Board state.
* Parent node.
* Depth.
* g(n).
* h(n).
* f(n).

Include:

* Initial state.
* Intermediate states.
* Goal state.

When a step is selected:

* Display its board.
* Update its details.
* Highlight the selected step.
* Allow the user to return to search playback.

The path must be reconstructed from actual parent references.

Do not hardcode the path.

---

# 15. ALGORITHM INFORMATION PAGE — FLASHCARD DESIGN

This is a major design requirement.

Create a dedicated section titled:

`ALGORITHM CARDS.EXE`

The algorithm information page must look like a collection of **retro pixel-art flashcards**, not a conventional textbook page or a large comparison table.

Maintain the same cream, royal-blue, pixel-font, square-window aesthetic as the reference image.

## Flashcard layout

Create a grid of seven algorithm flashcards:

1. Breadth-First Search (BFS)
2. Depth-First Search (DFS)
3. Depth-Limited Search (DLS)
4. Iterative Deepening Depth-First Search (IDDFS / IDDLS)
5. Uniform Cost Search (UCS)
6. Greedy Best-First Search (GBFS)
7. A* Search

Desktop:

* Display cards in a visually balanced grid.
* Prefer 3 columns where space permits.
* Keep consistent card dimensions and spacing.

Tablet:

* Use 2 columns.

Mobile:

* Use 1 column.

Each card should resemble a retro information card or old computer dialog box.

## Card front

Each card front must show:

* Algorithm name in pixel typography.
* Short one-sentence description.
* Small pixel-art icon or algorithm-specific visual.
* Algorithm category, such as uninformed or informed search.
* `FLIP CARD` or `OPEN FILE` button.
* Implementation status.

For GBFS, display a clear badge:

`IMPLEMENTED · ASSIGNED`

For other algorithms, display:

`REFERENCE ONLY`

Do not imply they are implemented unless they actually are.

## Card interaction

When clicked, the card should flip or open to reveal the detailed information.

Use a smooth but restrained pixel-inspired transition.

Avoid excessive 3D flipping if it makes the text difficult to read.

A good alternative is an old-school popup detail window appearing over the card.

The interaction must work with mouse, keyboard, and touch.

Include a clear `BACK` or `CLOSE` button.

Do not hide the required content behind hover-only interactions.

## Card back / expanded details

Every algorithm card must include all eight required fields:

1. Description.
2. Working Principle.
3. Advantages.
4. Limitations.
5. Time Complexity.
6. Space Complexity.
7. Completeness.
8. Optimality.

Do not omit any field.

Use clearly labelled pixel-style sections.

Keep explanations understandable for an undergraduate AI student and suitable for a viva.

## Algorithm-specific accuracy

Use standard AI search definitions and explicitly state assumptions for completeness and optimality.

Use:

* `b` = branching factor.
* `d` = depth of shallowest solution.
* `m` = maximum search depth.
* `l` = depth limit.
* `C*` = optimal solution cost.
* `ε` = minimum positive step cost, where relevant.

Do not claim an algorithm is always complete or optimal without stating the conditions.

Do not confuse GBFS with A*.

---

# 16. ALGORITHM CARD CONTENT REQUIREMENTS

Provide complete and accurate information for each card.

## BFS

Include:

* Explores nodes level by level.
* Uses a FIFO queue.
* Advantages: complete under standard finite-branching assumptions; optimal for equal step costs.
* Limitations: memory-intensive.
* Time and space complexity.
* Completeness conditions.
* Optimality conditions.

## DFS

Include:

* Explores deeper nodes before backtracking.
* Uses a stack or recursion.
* Advantages: relatively low memory in depth-limited settings.
* Limitations: can follow deep or infinite paths; not generally optimal.
* Time and space complexity.
* Completeness conditions.
* Optimality conditions.

## DLS

Include:

* DFS with a maximum depth limit.
* Advantages: avoids exploring beyond the chosen limit.
* Limitations: can miss solutions deeper than the limit.
* Time and space complexity in terms of b and l.
* Completeness conditions.
* Optimality conditions.

## IDDFS / IDDLS

Include:

* Repeated depth-limited searches with increasing limits.
* Advantages: combines shallow-solution completeness with DFS-like memory usage.
* Limitations: repeats work at shallower depths.
* Time and space complexity.
* Completeness conditions.
* Optimality conditions for equal step costs.

## UCS

Include:

* Expands the node with the lowest path cost g(n).
* Uses a priority queue.
* Advantages: finds least-cost solutions under standard assumptions.
* Limitations: can expand many low-cost paths; may be inefficient with small step costs.
* Time and space complexity using C* and ε where applicable.
* Completeness conditions.
* Optimality conditions.

## GBFS

Include:

* Expands the frontier node with the smallest h(n).
* Uses a heuristic to estimate closeness to the goal.
* Advantages: heuristic guidance can reduce exploration on some instances.
* Limitations: not generally optimal; can be misled by the heuristic; can use substantial memory.
* Time and space complexity.
* Completeness conditions.
* Optimality: not guaranteed.

Clearly explain that the implemented project uses GBFS.

## A*

Include:

* Expands the node with the smallest f(n) = g(n) + h(n).
* Advantages: can find optimal solutions with appropriate heuristic and cost assumptions.
* Limitations: memory-intensive; performance depends on the heuristic.
* Time and space complexity.
* Completeness conditions.
* Optimality conditions.

Clearly distinguish A*'s priority rule from GBFS.

---

# 17. ALGORITHM COMPARISON VIEW

In addition to the flashcards, provide a compact optional comparison table.

Include:

* Algorithm.
* Selection rule.
* Time complexity.
* Space complexity.
* Completeness.
* Optimality.
* Implementation status.

The comparison table is supplementary.

The flashcards are the primary algorithm information interface.

Keep the table visually consistent with the pixel-art aesthetic.

Use a horizontally scrollable table on mobile if necessary.

---

# 18. HEURISTIC EXPLAINER

Create a retro window titled:

`HEURISTIC.EXE`

Explain:

## Manhattan Distance

* Calculates the sum of row and column distances from the goal for numbered tiles.
* Excludes the blank tile.
* Uses the selected goal state.
* Explain why it is useful for the 8-puzzle.

## Misplaced Tiles

* Counts numbered tiles not currently in their goal positions.
* Excludes the blank tile.
* Uses the selected goal state.

Show a small worked example.

Calculate the example correctly.

If the goal changes, update the heuristic calculations to use the new goal.

Show:

* Current board.
* Goal board.
* Manhattan Distance.
* Misplaced Tiles.

Clearly distinguish heuristic values from actual path cost.

---

# 19. ABOUT / PROJECT DETAILS

Create a small retro window titled:

`ABOUT.EXE`

Include:

* Project name.
* Student name.
* Registration number.
* Course.
* Assigned algorithm.
* Technologies used.
* Short project description.

Include a clear note:

“This application implements Greedy Best-First Search. Other algorithms are provided for educational comparison unless explicitly implemented.”

---

# 20. RESPONSIVE DESIGN

The reference image is a narrow portrait composition, so make the design work especially well on mobile.

Desktop:

* Centered retro application window.
* Sidebar or compact top navigation.
* Multiple panels may appear side by side.
* Flashcards in a three-column grid where appropriate.

Tablet:

* Two-column layout.
* Compact navigation.
* Cards reorganize naturally.

Mobile:

* Single-column layout.
* Main window fills most of the screen.
* No horizontal overflow.
* Puzzle boards remain square.
* Controls are large enough to tap.
* OPEN and CLOSED lists stack.
* Flashcards become a vertical list.
* Popup windows fit within the viewport.
* Text does not overflow.
* Pixel font sizes remain readable.

Do not shrink desktop content until it becomes unreadable.

Reflow the layout instead.

---

# 21. ACCESSIBILITY

Implement:

* Semantic HTML.
* Accessible button labels.
* Keyboard-accessible navigation.
* Visible focus states.
* Keyboard-accessible flashcard interactions.
* Screen-reader-friendly status messages.
* Sufficient text contrast.
* Reduced-motion support.
* Clear error messages.

Do not rely on color alone to distinguish states.

Do not require hover to reveal important information.

---

# 22. ERROR HANDLING

Handle:

* Invalid board values.
* Duplicate tiles.
* Missing tiles.
* Unsolvable boards.
* Initial state already equal to goal.
* Empty OPEN list.
* Search failure.
* Reset during playback.
* Heuristic changes.
* Board changes after a run.
* Starting a new search during playback.
* Previous at the first event.
* Next at the last event.
* Playing an empty event log.
* Long searches.

When a board or heuristic changes:

* Stop playback.
* Clear stale results.
* Clear the old event log.
* Reset visualization metrics.
* Require a fresh search.

Use retro warning dialogs for validation errors, but never block the application unnecessarily.

---

# 23. CODE QUALITY

Write complete, readable, maintainable code.

Use:

* Clear function names.
* Small functions with specific responsibilities.
* Centralized state management.
* Safe DOM updates.
* Correct parent references.
* Correct duplicate detection.
* Actual event logging.
* Consistent metric definitions.
* Comments explaining important algorithm decisions.

Do not:

* Hardcode a solution path.
* Fake OPEN or CLOSED states.
* Fabricate metrics.
* Mislabel GBFS as A*.
* Use f(n) to prioritize GBFS.
* Leave nonfunctional buttons.
* Leave placeholder content.
* Claim testing that was not performed.

---

# 24. README

Create a complete README containing:

* Project overview.
* Student details.
* Problem statement.
* Technologies used.
* Folder structure.
* Setup instructions.
* How to run the website.
* How to configure the puzzle.
* How GBFS works.
* Heuristic explanations.
* OPEN and CLOSED list explanations.
* Search metric definitions.
* Algorithm properties.
* Complexity explanations.
* Memory estimation method.
* Limitations.
* Testing instructions.
* Viva questions.

---

# 25. FINAL TESTING CHECKLIST

Test the following before declaring the project complete:

1. The welcome screen loads correctly.
2. START opens the puzzle setup.
3. Both puzzle boards work.
4. Board validation prevents invalid configurations.
5. Solvable shuffle produces reachable states.
6. GBFS actually executes.
7. Manhattan Distance affects search priority.
8. Misplaced Tiles affects search priority.
9. OPEN and CLOSED contain real search states.
10. Current node updates correctly.
11. Generated and expanded counts are consistent.
12. Parent node, depth, g(n), h(n), and f(n) are correct.
13. Playback can move forwards and backwards.
14. Event snapshots accurately represent the search.
15. The final goal matches the selected goal state.
16. The solution summary shows all eight required metrics.
17. Solution path steps are selectable.
18. All seven algorithm flashcards open correctly.
19. Every algorithm card includes all eight required fields.
20. The comparison table is accurate.
21. Reset and rerun work.
22. Mobile layout works without horizontal overflow.
23. All buttons and navigation elements work.

Do not claim that tests passed unless they were actually performed.

---

# 26. FINAL DELIVERABLE

Generate the complete working website.

Deliver:

* `index.html`
* `css/style.css`
* `js/app.js`
* `README.md`

If the environment supports file creation, package the project as:

`AI-8Puzzle-Visualizer-24BCE2812.zip`

If working inside Figma Make, generate the full application source and explain how to export it into the required project structure.

Do not stop after producing a wireframe or screenshot.

Do not provide only a plan.

Build the actual working application.

---

# FINAL DESIGN PRIORITY

The finished website should feel like the attached image has been transformed into a fully functional AI search application.

The welcome screen should be immediately recognizable as a retro pixel-art interface.

The solver, search visualization, results, and algorithm flashcards must all maintain the same design language.

**Most importantly: preserve the playful retro aesthetic without sacrificing the accuracy of the GBFS algorithm or any assignment requirement.**
