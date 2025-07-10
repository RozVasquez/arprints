# AR Prints - Professional React Architecture

## 📁 Project Structure

```
src/
├── components/           # React components organized by type
│   ├── ui/              # Reusable UI components
│   │   ├── Button/      # Button component with variants
│   │   └── index.js     # Barrel exports for UI components
│   ├── layout/          # Layout components (Header, Footer, etc.)
│   │   └── index.js     # Barrel exports for layout components
│   ├── features/        # Business logic components
│   │   ├── ProductPricing/  # Pricing display logic
│   │   └── index.js     # Barrel exports for feature components
│   └── index.js         # Main component barrel export
├── animations/          # Animation components and utilities
│   ├── ScrollReveal/    # Scroll-triggered reveal animations
│   ├── SplitText/       # Text splitting and animation effects
│   └── index.js         # Animation barrel exports
├── hooks/               # Custom React hooks
│   ├── usePricing.js    # Pricing logic hook
│   └── index.js         # Hook barrel exports
├── utils/               # Utility functions
│   ├── imageUtils.js    # Image optimization utilities
│   └── index.js         # Utility barrel exports
├── constants/           # Application constants
│   └── index.js         # Configuration constants
├── data/                # Static data and configuration
│   ├── products.js      # Product catalog data
│   └── galleryData.js   # Gallery configuration
├── pages/               # Page components
│   ├── Home.js          # Home page
│   ├── Products.js      # Products page
│   └── Pricing.js       # Pricing page
└── styles/              # Global styles (future)
```

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- **UI Components**: Pure, reusable components focused on presentation
- **Feature Components**: Business logic and domain-specific functionality
- **Layout Components**: Page structure and navigation
- **Animation Components**: GSAP-based animations and visual effects
- **Hooks**: Stateful logic extraction for reusability
- **Utils**: Pure functions for common operations

### 2. **Clean Imports**
```javascript
// ✅ Clean barrel exports
import { Button } from 'components/ui';
import { ScrollReveal, SplitText } from 'animations';
import { usePricing } from 'hooks';
import { CONTACT } from 'constants';

// ❌ Avoid deep imports
import Button from 'components/ui/Button/Button';
import ScrollReveal from 'animations/ScrollReveal/ScrollReveal';
```

### 3. **Component Organization**

#### UI Components (`src/components/ui/`)
- Reusable, presentation-focused components
- No business logic
- Configurable through props
- Consistent styling system

#### Feature Components (`src/components/features/`)
- Domain-specific business logic
- May use multiple UI components
- Handle complex state and side effects

#### Layout Components (`src/components/layout/`)
- Page structure components (Header, Footer, Sidebar)
- Navigation and routing logic
- Responsive design concerns

#### Animation Components (`src/animations/`)
- GSAP-powered animations and effects
- Self-contained with co-located CSS
- Reusable across different pages/components
- Performance optimized with proper cleanup

### 4. **Custom Hooks Pattern**
```javascript
// Extract complex logic into custom hooks
const { compactPricing } = usePricing(selectedCategory, activeSubtype);
```

Benefits:
- Reusable across components
- Easier to test
- Cleaner component code
- Separation of stateful logic

### 5. **Constants & Configuration**
```javascript
// Centralized configuration
export const ANIMATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300
};
```

## 🔄 Migration Strategy

### Phase 1: ✅ **Foundation** (Completed)
- [x] Create folder structure
- [x] Extract custom hooks (`usePricing`)
- [x] Create utility functions (`imageUtils`)
- [x] Setup constants
- [x] Create reusable UI components (`Button`)
- [x] Extract feature components (`ProductPricing`)
- [x] Organize animations (`ScrollReveal`, `SplitText`)

### Phase 2: 🚧 **Component Refactoring** (Next Steps)
- [ ] Refactor `BlobImage` to use image utilities
- [ ] Split large components (`DesignGallery`, `ProductTabs`)
- [ ] Create more UI components (`Modal`, `Grid`, `Card`)
- [ ] Extract more custom hooks (`useImageOptimization`, `useModal`)

### Phase 3: 📱 **Advanced Patterns** (Future)
- [ ] Implement compound components pattern
- [ ] Add TypeScript for better type safety
- [ ] Setup component testing strategy
- [ ] Performance optimization with React.memo
- [ ] Accessibility improvements

## 🧩 Component Examples

### Reusable UI Component
```javascript
// src/components/ui/Button/Button.js
const Button = ({ variant, size, children, ...props }) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  return <button className={classes} {...props}>{children}</button>;
};
```

### Feature Component with Hook
```javascript
// src/components/features/ProductPricing/ProductPricing.js
const ProductPricing = ({ selectedCategory, activeSubtype }) => {
  const { compactPricing } = usePricing(selectedCategory, activeSubtype);
  
  return (
    <div>
      {/* Pricing display logic */}
    </div>
  );
};
```

### Animation Component
```javascript
// src/animations/ScrollReveal/ScrollReveal.js
const ScrollReveal = ({ children, enableBlur, baseOpacity }) => {
  // GSAP animation logic with proper cleanup
  useEffect(() => {
    // Animation setup and ScrollTrigger
    return () => {
      // Cleanup animations
    };
  }, []);
  
  return <div ref={elementRef}>{children}</div>;
};
```

### Custom Hook
```javascript
// src/hooks/usePricing.js
export const usePricing = (selectedCategory, activeSubtype) => {
  const compactPricing = useMemo(() => {
    // Complex pricing logic
  }, [selectedCategory, activeSubtype]);
  
  return { compactPricing };
};
```

## 📈 Benefits of This Architecture

1. **Maintainability**: Clear separation makes code easier to maintain
2. **Reusability**: Components and hooks can be reused across the app
3. **Testability**: Isolated logic is easier to unit test
4. **Scalability**: Structure supports team growth and feature expansion
5. **Developer Experience**: Clean imports and organized code
6. **Performance**: Better code splitting and lazy loading opportunities
7. **Animation Organization**: Self-contained animation logic with proper cleanup

## 🎨 Animation Architecture

The `animations/` folder contains reusable animation components that:

- **Self-contained**: Each animation has its own folder with JS and CSS
- **GSAP-powered**: Professional animations using GSAP library
- **Performance optimized**: Proper cleanup and memory management
- **Configurable**: Props-based configuration for different use cases
- **ScrollTrigger integration**: Scroll-based animation triggers

### Animation Usage
```javascript
import { ScrollReveal, SplitText } from 'animations';

// Scroll-triggered reveal
<ScrollReveal enableBlur={true} baseOpacity={0.2}>
  <h2>Your content here</h2>
</ScrollReveal>

// Text splitting animation
<SplitText delay={80} splitType="words">
  <h1>Your Memories, Beautifully Printed.</h1>
</SplitText>
```

## 🚀 Getting Started

To use the new architecture:

1. **Import from barrel exports**:
   ```javascript
   import { Button } from 'components/ui';
   import { ScrollReveal } from 'animations';
   import { usePricing } from 'hooks';
   ```

2. **Follow the folder structure** when adding new components

3. **Extract logic into hooks** when components get complex

4. **Use constants** instead of magic strings/numbers

5. **Keep UI components pure** and feature components focused

6. **Co-locate CSS with components** for better maintainability

This architecture follows React best practices and industry standards for professional applications. 