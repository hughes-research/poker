# Contributing

We welcome contributions to the Poker Game project! Here are some guidelines to help you get started.

## Development Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd poker-game
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Code Style

-   **TypeScript**: We use strict TypeScript. Ensure all types are defined in `src/types/index.ts` or co-located with components if specific.
-   **Linting**: Run `npm run lint` before committing to ensure code quality.
-   **Formatting**: Follow the existing Prettier configuration (implied by the project structure).
-   **Comments**: Add JSDoc style comments for all exported functions and classes.
    ```typescript
    /**
     * Calculates the score based on...
     * @param input - The input value
     * @returns The calculated score
     */
    ```

## Directory Structure Rules

-   **Components**: Place reusable UI components in `src/components/ui`. Game-specific components go in `src/components/game`.
-   **Logic**: Keep business logic pure and testable in `src/lib`.
-   **State**: All global state should reside in `src/store`.

## Pull Requests

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

Please ensure your PR includes:
-   A clear description of the changes.
-   Updates to documentation if logic changes.
-   Screenshots for UI changes.

