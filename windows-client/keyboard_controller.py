from pynput.keyboard import Controller, Key
import logging

logger = logging.getLogger(__name__)

class KeyboardController:
    def __init__(self):
        self.keyboard = Controller()

    def type_text(self, text):
        """Simulates typing the given text."""
        try:
            # Pynput type method handles most characters
            self.keyboard.type(text)
            logger.debug(f"Typed: {text}")
        except Exception as e:
            logger.error(f"Error typing text: {e}")

    def press_key(self, key_name):
        """Simulates pressing a special key."""
        try:
            # Map string key names to pynput Keys if necessary
            # For now, simplistic handling
            if key_name == "enter":
                self.keyboard.press(Key.enter)
                self.keyboard.release(Key.enter)
            elif key_name == "backspace":
                self.keyboard.press(Key.backspace)
                self.keyboard.release(Key.backspace)
            # Add more keys as needed
        except Exception as e:
            logger.error(f"Error pressing key {key_name}: {e}")
