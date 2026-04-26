# Intro
What has been committed until commit ec76919 was stage 1, which included adding design tokens, adding html structure, and timer logic with start, pause, reset, and mode switching.

Below are the instructions for Stage 2 and Stage 3. Help guide through the steps of each stage and remind me if anything is missed.





# Stage 2

In this stage, you’ll add a settings panel so users can customize their work and break durations, and a notification when the timer ends. You’ll have less step-by-step guidance than Stage 1—the patterns are the same, so you’ll apply what you’ve already learned.

Plan the additions
Before you start coding, think through what’s changing:

### New features
- A settings UI where users can set custom work and break durations
- A notification (sound or visual) when the timer reaches zero

### New state
workDuration and breakDuration — user-configurable values (replacing the constants)
These need to be read from the settings UI and applied to the timer

### New interface elements
Input fields for work and break duration (in minutes)
Possibly a settings panel that shows/hides, or just sits below the timer

### What changes in existing code
- WORK_DURATION and BREAK_DURATION are currently constants. They’ll need to become values that can be updated from the settings UI.
- switchMode() and resetTimer() should use the new configurable durations.
That’s the plan. Not a detailed spec—just enough to know what you’re building before you open the editor.



## Build the settings UI
Add a settings section to your HTML, below the timer component. Here’s the general idea—but figure out the specific implementation with Cursor or on your own:

- Add a section with a class like .settings or .settings-panel
- Include labeled inputs for work duration and break duration (number inputs, in minutes)
- Include a button to apply the settings (or apply them automatically when changed)

## Style the settings
Your design tokens are already in place. Use them. A few suggestions:

- Use var(--color-surface) for the settings panel background
- Use var(--space-md) and var(--space-lg) for padding and gaps
- Use var(--radius-md) for rounded corners
- Style the inputs to match your button styles
- If you need new tokens—for instance, a specific width for the inputs or a new color for the settings panel—add them to your :root block. That’s the design system growing.



## Connect settings to the timer
In src/main.js, you’ll need to:

1. Get references to the new input elements (like you did with the buttons in Stage 1)
2. Replace the constants (WORK_DURATION and BREAK_DURATION) with variables that can be updated
3. Read values from the inputs when the user applies settings
4. Update the timer — if the user changes the work duration while in work mode, the timer should reset to the new duration (or at least use it for the next session)

Think about edge cases:

What happens if the user changes settings while the timer is running? A simple approach: apply the new durations on the next mode switch or reset.
What if someone enters 0 or a negative number? Add a sensible minimum.
This is the kind of decision-making you’ll do more of as you build more complex apps. There’s no single right answer—just choices with trade-offs.



## Add a notification
When the timer reaches zero and switches modes, the user should know about it. Right now, the mode text changes—but if they’re not looking at the screen, they’ll miss it.

Think about what kind of notification feels right for your timer. There are two main directions, and you can do one or both:

Visual notification — A brief flash, pulse, or color change when the timer hits zero. 

Audio notification — Play a short sound when the timer completes.

You can use a free sound file from the web, or place your own sound in the public/ folder for Vite to serve.



## Quick polish pass
Before you commit and merge, take 10–15 minutes to refine how the timer feels. This isn’t a major redesign—it’s a quick pass to improve the details:

- Add hover and focus states to your new inputs and buttons
- Make sure the settings panel feels visually connected to the timer (consistent spacing, colors, etc.)
- Check that the transition between work and break modes still feels smooth with your new notification

You’ll have more room for visual exploration and personality in Stage 3, where it’s one of the extension options.


## Final checks

- Test that Apply works: change the work minutes to 1, hit Apply, then hit Reset — the timer should jump to 01:00.



# Stage 3
Here are some extensions I want to add to my pomodoro timer

### UI change: Replace spinner buttons with custom + and − buttons
The native number input arrows are hard to style consistently across browsers. Replace them with your own buttons built in HTML.

- Hide the native spinner arrows with CSS (`-webkit-appearance: none`)
- Add a `−` button before and a `+` button after each number input in the settings panel
- Wire them up in `main.js` — each button should read the current input value, increment or decrement it, and write the new value back
- Apply a minimum of 1 so the value can’t go below 1
- Style the buttons using your existing `.btn` styles or a new variant that fits the compact settings layout


### UI change 2: Change Start and Reset buttons to icons
Replace Start and Reset with:
- Stop: Left
- Pause: In the middle
- Restart: Right


### Local storage

Save the user’s settings (work/break durations) and optionally session history to localStorage, so they’re still there when the user comes back. You used localStorage in the Score Keeper last week—same idea here. Think about:

What data should persist? (Settings, session count, maybe the current timer state?)
When do you save? (After settings change, after a session completes?)
When do you load? (On page load, before initializing the timer.)


### Session tracking
Keep count of how many pomodoros (work sessions) you’ve completed and display the count. You could show it as a simple number, a row of dots, or even small tomato icons. Think about:

What state do you need? (A counter, probably.)
When does it increment? (When a work session ends, before switching to break.)
Where does it display in the UI?