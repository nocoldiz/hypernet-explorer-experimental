/*:
 * @plugindesc Makes the options window fill the entire game window
 * @author Nocoldiz + Gemini + ChatGPT + Claude
 *
 * @help This plugin resizes the options window to occupy the entire game window.
 */

(function() {
    // Store the original initialize method
    const _Window_Options_initialize = Window_Options.prototype.initialize;
    
    // Override the initialize method
    Window_Options.prototype.initialize = function(rect) {
        // Create a rectangle with the size of the game window
        rect = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        // Call the original method with our modified rectangle
        _Window_Options_initialize.call(this, rect);
    };
})();