import requests
import time
from datetime import datetime

# 16x16 grid, each pixel is a hex color string
GRID_SIZE = 16
PIXEL_ON = "#00ff99"
PIXEL_OFF = "#000000"
PIXEL_SECONDARY = "#CFFF04"

# Simple 3x5 pixel font for digits 0-9 and colon
FONT = {
    "0": [
        "111",
        "101",
        "101",
        "101",
        "111"
    ],
    "1": [
        "1",
        "1",
        "1",
        "1",
        "1"
    ],
    "2": [
        "11",
        "01",
        "11",
        "10",
        "11"
    ],
    "3": [
        "11",
        "01",
        "11",
        "01",
        "11"
    ],
    "4": [
        "101",
        "101",
        "111",
        "001",
        "001"
    ],
    "5": [
        "11",
        "10",
        "11",
        "01",
        "11"
    ],
    "6": [
        "111",
        "100",
        "111",
        "101",
        "111"
    ],
    "7": [
        "11",
        "01",
        "01",
        "01",
        "01"
    ],
    "8": [
        "111",
        "101",
        "111",
        "101",
        "111"
    ],
    "9": [
        "111",
        "101",
        "111",
        "001",
        "111"
    ],
    ":": [
        "0",
        "1",
        "0",
        "1",
        "0"
    ]
}

def render_time_to_grid(timestr):
    """
    timestr: string like "12:34"
    returns: 16x16 grid of hex color strings
    """
    grid = [[PIXEL_OFF for _ in range(GRID_SIZE)] for _ in range(GRID_SIZE)]
    # Each digit is 3x5, colon is 1x5, add 1px space between digits
    # Layout: center horizontally and vertically
    chars = list(timestr)
    char_widths = [len(FONT[str(c)][0]) for c in chars]
    total_width = sum(char_widths) + (len(chars) - 3)  # spaces between
    start_x = (GRID_SIZE - total_width) // 2
    start_y = (GRID_SIZE - 5) // 2
    
    x = start_x
    for c in chars:
        pattern = FONT[c]
        w = len(FONT[str(c)][0])
        for dy, row in enumerate(pattern):
            for dx, val in enumerate(row):
                if val == "1":
                    grid[start_y + dy][x + dx] = PIXEL_ON if c != ":" else PIXEL_SECONDARY
        x += w  # move to next char, add space
        if chars.index(c) not in [1, 2]:
            x += 1
    return grid

def send_grid(grid):
    url = "http://localhost:5000/set_grid"
    data = {"pixels": grid}
    requests.post(url, json=data)

def main():
    while True:
        now = datetime.now()
        timestr = now.strftime("%H:%M")
        grid = render_time_to_grid(timestr)
        send_grid(grid)
        # Update every second, but only send if minute/second changed for less flicker
        time.sleep(1)

if __name__ == "__main__":
    main()