# Clock Application

This clock application displays the current time with both analog and digital representations, including a graphical representation of the time zone. It features customizable clock hands and debug options for development and testing.

## Features

- Analog clock display with hour, minute, and second hands.
- Digital clock display showing the current time.
- Graphical representation of the time zone.
- Customizable colors for the clock hands.
- Debug mode for real-time configuration and testing.

## Setup

To run this project, clone it locally and open the HTML file in a web browser. Ensure that all script files are correctly linked in your HTML.

```bash
git clone https://your-repository-url-here
cd your-project-directory
open index.html
```
## Usage

The clock displays the current time in the specified time zone. You can change the time zone and clock hand colors using the debug controls if enabled.

### Debugging

If debug mode is active, you can adjust the following parameters in real-time:

- Line width of the clock hands.
- Speed of time (for simulation purposes).
- Color of the clock and its hands.
- Time zone offset.

## Customization

To customize the clock settings, modify the parameters in the `Scenario` class constructor in `Scenario.js`. Available parameters include:

- `line-width`: Thickness of the clock hands.
- `speed`: Speed multiplier for the clock's time progression.
- `color`: Default color for the clock elements.
- `hour-hand-color`: Color of the hour hand.
- `minute-hand-color`: Color of the minute hand.
- `second-hand-color`: Color of the second hand.
- `timezone-offset`: Offset for the time zone.