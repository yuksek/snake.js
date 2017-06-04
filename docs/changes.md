# What's Changed?

  - In the legacy code snake could reverse its direction such as heading to the right while going left. Added necessary controls to prevent this behavior.
  - In the legacy code the plane was consisting an infinite loop as whenever snake goes out of the plane, it comes out from the opposite site. Implemented deadly boundaries to prevent this. Also, implemented the hook for registering a keycode to turn this feature on and off, so players can play the game with the rules they prefer.
  - In the legacy code there was no score mechanism nor any scoreboard. Implemented a score system by using both the time spent alive and the fruits snake collects. Also, implemented a scoreboard to display score for the user.
  - In the legacy code the behavior of snake when it collides with itself was to keep on moving as nothing happened. Implemented a collision detection code to change the behavior to ending game when the snake collides with itself. Also, implemented the hook for registering a keycode to turn this feature on and off, so players can play the game with the rules they prefer.
  - In the legacy code, only direction and the position of snake was being saved but changed that part to save the score, too. This way, unless you to a different domain or change the protocol from http to https or vice versa, you can continue your game even when you changed pages.
  - There were no comments in the legacy code, added the comments.
  - Legacy code was just a script but this repository is designed as a Chrome Extension.
