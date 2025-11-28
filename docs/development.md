# Development Guide

Complete guide for setting up, developing, and contributing to the 5-Card Draw Poker game.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [Best Practices](#best-practices)

## Prerequisites

### Required Software

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For version control

### Recommended Tools

- **VS Code**: Recommended IDE with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
- **Chrome DevTools**: For debugging
- **React DevTools**: Browser extension for React debugging

## Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd poker-game
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required dependencies including:
- Next.js and React
- Three.js and React Three Fiber
- Zustand for state management
- Tailwind CSS for styling
- TypeScript and type definitions

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
poker-game/
├── public/                 # Static assets
│   ├── cards/             # Card SVG images
│   └── 58471.jpg         # Background image
├── src/
│   ├── app/               # Next.js app router
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── game/         # Game-specific components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Core business logic
│   │   ├── poker/        # Poker game engine
│   │   └── utils/        # Utility functions
│   ├── store/            # State management
│   │   └── gameStore.ts  # Zustand store
│   ├── types/            # TypeScript definitions
│   │   └── index.ts      # Type exports
│   └── hooks/            # Custom React hooks
├── docs/                 # Documentation
├── .gitignore
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Development Workflow

### Starting Development

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**:
   - Edit files in `src/`
   - Add new components in appropriate directories
   - Update types in `src/types/`

3. **Test locally**:
   ```bash
   npm run dev
   ```

4. **Check for errors**:
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

5. **Commit changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

### Hot Reload

Next.js provides hot module replacement (HMR):
- Changes to React components reload automatically
- State is preserved during hot reload
- TypeScript errors appear in browser console

### File Naming Conventions

- **Components**: PascalCase (e.g., `GameBoard.tsx`)
- **Utilities**: camelCase (e.g., `cardUtils.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCardAnimation.ts`)

## Code Style

### TypeScript Guidelines

1. **Always use TypeScript types**:
   ```typescript
   // Good
   function calculatePot(playerBet: number, opponentBet: number): number {
     return playerBet + opponentBet;
   }
   
   // Bad
   function calculatePot(playerBet, opponentBet) {
     return playerBet + opponentBet;
   }
   ```

2. **Use interfaces for object shapes**:
   ```typescript
   interface Player {
     id: string;
     chips: number;
     hand: Hand;
   }
   ```

3. **Use type aliases for unions**:
   ```typescript
   type GamePhase = 'IDLE' | 'BETTING' | 'SHOWDOWN';
   ```

### React Component Guidelines

1. **Use functional components**:
   ```typescript
   export default function GameBoard() {
     // Component logic
   }
   ```

2. **Extract custom hooks**:
   ```typescript
   function useGameState() {
     const { phase, player } = useGameStore();
     return { phase, player };
   }
   ```

3. **Use proper prop types**:
   ```typescript
   interface CardProps {
     card: Card;
     isFaceUp: boolean;
     onClick?: () => void;
   }
   ```

### Code Organization

1. **Keep components small and focused**
2. **Extract business logic to `lib/`**
3. **Use Zustand for global state**
4. **Keep local state in components when appropriate**

### Documentation Standards

1. **JSDoc comments for functions**:
   ```typescript
   /**
    * Evaluates a poker hand and returns its rank.
    * @param hand - Array of exactly 5 cards
    * @returns HandEvaluation object with rank and value
    * @throws Error if hand doesn't contain 5 cards
    */
   function evaluateHand(hand: Hand): HandEvaluation {
     // Implementation
   }
   ```

2. **Inline comments for complex logic**:
   ```typescript
   // Handle wheel straight (A-2-3-4-5) as lowest straight
   if (highCard.rank === 'ace' && sorted[0].rank === '2') {
     highCard = sorted[3]; // 5 is the high card
   }
   ```

## Testing

### Manual Testing Checklist

- [ ] Game starts correctly
- [ ] Cards deal properly
- [ ] Betting actions work (bet, call, raise, fold, check)
- [ ] Draw phase allows card selection
- [ ] Hand evaluation is correct
- [ ] AI opponent makes reasonable decisions
- [ ] Match scoring works correctly
- [ ] Settings persist across sessions
- [ ] Game history saves correctly

### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit
```

### Linting

```bash
# Run ESLint
npm run lint
```

### Browser Testing

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on macOS)

## Debugging

### React DevTools

1. Install React DevTools browser extension
2. Inspect component tree
3. View component props and state
4. Profile component performance

### Zustand DevTools

Zustand store can be inspected:
- View current state
- Track state changes
- Time-travel debugging (if configured)

### Console Logging

Use console.log for debugging (remove before committing):
```typescript
console.log('Current phase:', phase);
console.log('Player hand:', player?.hand);
```

### Breakpoints

Use VS Code debugger:
1. Set breakpoints in code
2. Run "Debug: Start Debugging"
3. Select "Next.js: debug server-side"
4. Inspect variables and step through code

## Contributing

### Pull Request Process

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes** following code style guidelines
4. **Test thoroughly**
5. **Update documentation** if needed
6. **Commit changes**: `git commit -m "Add amazing feature"`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open Pull Request**

### Pull Request Guidelines

- **Clear title**: Describe what the PR does
- **Description**: Explain changes and why
- **Screenshots**: Include for UI changes
- **Testing**: Describe how you tested
- **Breaking changes**: Document any breaking changes

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] No console.log statements
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No linting errors

## Best Practices

### State Management

1. **Use Zustand for global state**
2. **Keep local state in components when possible**
3. **Avoid prop drilling** - use store or context
4. **Update state immutably**

### Performance

1. **Memoize expensive calculations**:
   ```typescript
   const handEvaluation = useMemo(
     () => evaluateHand(player.hand),
     [player.hand]
   );
   ```

2. **Use React.memo for expensive components**:
   ```typescript
   export default React.memo(CardComponent);
   ```

3. **Lazy load heavy components**:
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

### Error Handling

1. **Validate inputs**:
   ```typescript
   if (hand.length !== 5) {
     throw new Error('Hand must contain exactly 5 cards');
   }
   ```

2. **Handle edge cases**:
   ```typescript
   if (amount > player.chips) {
     throw new Error('Insufficient chips');
   }
   ```

3. **Provide user-friendly error messages**

### Accessibility

1. **Use semantic HTML**
2. **Add ARIA labels where needed**
3. **Ensure keyboard navigation works**
4. **Test with screen readers**

### Security

1. **Validate all user inputs**
2. **Sanitize data before rendering**
3. **Don't expose sensitive data**
4. **Use TypeScript for type safety**

## Common Issues

### Issue: TypeScript Errors

**Solution**: Run `npx tsc --noEmit` to see all type errors. Fix type definitions or add type assertions.

### Issue: Hot Reload Not Working

**Solution**: Restart dev server. Sometimes HMR cache needs clearing.

### Issue: Build Fails

**Solution**: Check for:
- TypeScript errors
- Missing dependencies
- Import path errors

### Issue: State Not Updating

**Solution**: Ensure Zustand store updates are immutable. Check that you're using store actions correctly.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Three.js Documentation](https://threejs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

- Check existing documentation in `docs/`
- Review code comments and JSDoc
- Search GitHub issues
- Ask questions in discussions

---

Happy coding! 🎴

