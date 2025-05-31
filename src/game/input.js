export function createInputHandlers(spacecraft, isTutorial) {
  let arrowUpPressed = false;

  function handleKeyDown(event) {
    // Prevent Enter key from being processed in tutorial mode
    if (isTutorial && (event.code === "Enter" || event.key === "Enter")) {
      // Ignore Enter key in tutorial mode
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    switch (event.code) {
      case "ArrowLeft":
        spacecraft.angular_velocity -= 0.01;
        break;
      case "ArrowRight":
        spacecraft.angular_velocity += 0.01;
        break;
      case "ArrowUp":
        arrowUpPressed = true;
        break;
      case "ArrowDown":
        spacecraft.speed -= 0.1;
        break;
      case "Space":
        // In tutorial, prevent spacebar from triggering other events
        if (isTutorial) {
          event.stopPropagation();
        }
        return true; // Signal that a nuke should be fired
      case "KeyP":
      case "p":
        return "togglePause"; // Signal that game should be paused
      default:
        break;
    }
    return false;
  }

  function handleKeyUp(event) {
    if (event.code === "ArrowUp") {
      arrowUpPressed = false;
    }
  }

  return {
    handleKeyDown,
    handleKeyUp,
    isArrowUpPressed: () => arrowUpPressed
  };
} 