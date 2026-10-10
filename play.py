"""Open the Hangman parlor game in a browser."""

import webbrowser
from pathlib import Path

webbrowser.open(Path(__file__).resolve().parent.joinpath("index.html").as_uri())
