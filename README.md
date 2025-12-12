# Enhanced color picker plugin for the Camunda Modeler

Camunda Modeler plugin that adds a flexible color picker to the toolbar, allowing you to easily apply preset colors to your BPMN elements.

![Enhanced color picker plugin for the Camunda Modeler](docs/img/enhanced-color-picker.png)

## Description

This plugin provides a floating, draggable color picker panel that enhances the modeling experience by offering a quick way to style elements. It is particularly useful for creating heatmaps, highlighting process flows, or simply organizing your diagram with visual cues.

## Features

*   **Three Coloring Modes:**
    *   **Fill (Background):** Changes the background color of the selected element.
    *   **Stroke (Border):** Changes the border color of the selected element.
    *   **Text:** Changes the color of the element's label.
*   **Preset Palette:** A curated selection of colors arranged in a grid for consistent styling across your diagrams.
*   **Custom Colors:**
    *   **Add:** Use the (+) button to pick any color. It can be done either by manually selecting it or using the HEXA or RGBA values. Click the Save button to add it to your palette.
    *   **Persist:** Custom colors are saved locally and persist between sessions.
    *   **Remove:** Hover over a custom color and click the 'x' to remove it individually, or click the (X) button to clear all custom colors.
*   **Draggable Interface:** The color picker panel can be dragged anywhere on the canvas, ensuring it's always accessible but never in the way.

## Installation

1.  Download or clone this repository.
2.  Copy the `camunda-modeler-plugin-enhanced-color-picker` folder into the `plugins` directory of your Camunda Modeler installation.
    *   MacOS: `~/Library/Application Support/camunda-modeler/resources/plugins`
    *   Windows: `%APPDATA%/camunda-modeler/resources/plugins`
    *   Linux: `~/.config/camunda-modeler/resources/plugins`
3.  Restart the Camunda Modeler.

## Usage

1.  **Open the Color Picker:**
    *   Click the "Toggle Color Picker" option in the `Plugins` menu.
    *   Or use the keyboard shortcut: `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux).
2.  **Select an Element:** Click on a BPMN element in the diagram to select it.
3.  **Choose a Mode:** Use the icons in the color picker toolbar to switch between Fill, Stroke, or Text mode.
4.  **Pick a Color:** Click any color in the grid to apply it to the selected element.

## Development

If you want to modify or extend the plugin, follow these steps:

### Prerequisites

*   Node.js installed on your machine.

### Setup

1.  Clone the repository to your local machine:
    ```sh
    git clone git@github.com:kommitters/camunda-modeler-plugin-enhanced-color-picker.git
    cd camunda-modeler-plugin-enhanced-color-picker
    ```
2.  Install dependencies:
    ```sh
    npm install
    ```

### Build

*   **One-time build:**
    ```sh
    npm run client
    ```
    This bundles the client-side code into `client/client-bundle.js`.

*   **Watch mode (for development):**
    ```sh
    npm run dev
    ```
    This watches for changes and rebuilds the bundle automatically.

## Compatibility

This plugin is compatible with Camunda Modeler versions that support `bpmn-js`. It uses `camunda-modeler-plugin-helpers` to register with the application.

## Changelog

Features and bug fixes are listed in the [CHANGELOG][changelog] file.

## Code of conduct

We welcome everyone to contribute. Make sure you have read the [CODE_OF_CONDUCT][coc] before.

## Contributing

For information on how to contribute, please refer to our [CONTRIBUTING][contributing] guide.

## License

This library is licensed under an MIT license. See [LICENSE][license] for details.

## Acknowledgements

Made with 💙 by [kommitters Open Source](https://kommit.co)

[license]: https://github.com/kommitters/camunda-modeler-plugin-enhanced-color-picker/blob/main/LICENSE
[coc]: https://github.com/kommitters/camunda-modeler-plugin-enhanced-color-picker/blob/main/CODE_OF_CONDUCT.md
[changelog]: https://github.com/kommitters/camunda-modeler-plugin-enhanced-color-picker/blob/main/CHANGELOG.md
[contributing]: https://github.com/kommitters/camunda-modeler-plugin-enhanced-color-picker/blob/main/CONTRIBUTING.md
