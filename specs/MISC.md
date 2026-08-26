- The enemy-phase timing trap — press_sequence waits for input to drain, not for the game to respond, which is why my first post-turn diff showed nothing. Any automation acting on a post-turn diff will hit this. 
(In other words, we may have to prompt the model to check in memory if it is currently the player's turn before it sends inputs. Could also use something crude like a timer. )

