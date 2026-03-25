# 005 - Backend Adapter Layer Refactoring

## Overview

Refactor the React front-end to support easy switching between Firebase serverless backend and the custom Node.js REST API backend. Create an abstraction layer that decouples the UI components from the specific backend implementation.

## Goals

- Create a backend-agnostic API layer
- Maintain all existing functionality
- Enable switching between backends via configuration
- Minimize changes to UI components
- Ensure type safety and consistent error handling

## Current Architecture Analysis

### Firebase Backend (Current)

- **Authentication**: `firebaseLogin`, `firebaseLogout`, `firebaseSignUp`, `useAuth`, `checkIfAdmin`
- **Data Operations**: `doc-utils.js` with Firestore CRUD operations
- **Real-time**: Firestore listeners for live updates
- **State Management**: Redux with Firebase subscriptions

### REST Backend (Target)

- **Authentication**: `/user/login`, `/user/logout`, `/user/signup`
- **Data Operations**: REST endpoints for categories, products, orders, users
- **Real-time**: Polling or WebSocket (not implemented yet)
- **State Management**: Redux with API calls

## Implementation Plan

### Phase 1: Configuration Layer

1. Create a configuration system to switch between backends
2. Define backend interface contracts
3. Implement environment-based backend selection

### Phase 2: Authentication Adapter

1. Create `authAdapter.js` that abstracts authentication operations
2. Implement Firebase auth adapter
3. Implement REST auth adapter
4. Update `useAuth` hook to use adapter
5. Update Login/SignUp components

### Phase 3: Data Operations Adapter

1. Create `dataAdapter.js` that abstracts CRUD operations
2. Implement Firebase data adapter (wrap existing doc-utils)
3. Implement REST data adapter (HTTP calls to backend)
4. Update Redux actions to use adapter
5. Handle real-time vs polling differences

### Phase 4: State Management Updates

1. Update data loading in AdminMain/CustomerMain
2. Ensure consistent data structures between backends
3. Handle authentication state synchronization

### Phase 5: Testing & Validation

1. Test switching between backends
2. Ensure all features work with both backends
3. Performance comparison
4. Error handling validation

## Technical Details

### Backend Interface Contracts

#### Authentication Contract

```javascript
interface AuthAdapter {
  login(username, password): Promise<void>
  logout(): Promise<void>
  signup(userData): Promise<void>
  getCurrentUser(): Promise<User | null>
  isAdmin(user): Promise<boolean>
  updateUser(userData): Promise<void>
  updatePassword(currentPassword, newPassword): Promise<void>
}
```

#### Data Contract

```javascript
interface DataAdapter {
  // Categories
  getCategories(): Promise<Category[]>
  addCategory(name): Promise<string>
  updateCategory(id, name): Promise<void>
  removeCategory(id): Promise<void>

  // Products
  getProducts(): Promise<Product[]>
  addProduct(productData): Promise<string>
  upsertProduct(id, productData): Promise<void>

  // Users
  getUsers(): Promise<User[]>
  getUser(id): Promise<User>
  updateUser(userData): Promise<void>
  deleteUser(id): Promise<void>

  // Orders
  getOrders(userId?): Promise<Order[]>
  addOrder(orderData): Promise<void>

  // Real-time subscriptions (optional)
  subscribeCategories(callback): UnsubscribeFn
  subscribeProducts(callback): UnsubscribeFn
  subscribeUsers(callback): UnsubscribeFn
}
```

### Configuration System

```javascript
// config/backend.js
export const BACKEND_TYPE = process.env.VITE_REACT_APP_BACKEND || "firebase"; // 'firebase' | 'rest'

export const BACKEND_CONFIG = {
  firebase: {
    // Firebase config
  },
  rest: {
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  },
};
```

### Adapter Factory

```javascript
// adapters/index.js
import { BACKEND_TYPE } from "../config/backend";
import FirebaseAuthAdapter from "./firebase/auth";
import RestAuthAdapter from "./rest/auth";
import FirebaseDataAdapter from "./firebase/data";
import RestDataAdapter from "./rest/data";

export const authAdapter =
  BACKEND_TYPE === "firebase"
    ? new FirebaseAuthAdapter()
    : new RestAuthAdapter();

export const dataAdapter =
  BACKEND_TYPE === "firebase"
    ? new FirebaseDataAdapter()
    : new RestDataAdapter();
```

## File Structure Changes

```
src/
├── adapters/
│   ├── index.js
│   ├── firebase/
│   │   ├── auth.js
│   │   └── data.js
│   └── rest/
│       ├── auth.js
│       └── data.js
├── config/
│   └── backend.js
├── firebase/ (existing - becomes firebase adapter)
├── hooks/
│   ├── useAuth.js (update to use adapter)
│   ├── useCategories.js (update to use adapter)
│   └── useProducts.js (update to use adapter)
└── redux/
    ├── actions/ (new - backend-agnostic actions)
    └── ...
```

## Migration Strategy

### Phase 1: Non-Breaking Changes

- Create adapters alongside existing code
- Update imports gradually
- Maintain backward compatibility

### Phase 2: Component Updates

- Update hooks to use adapters
- Update components to use new hooks
- Test each component

### Phase 3: Cleanup

- Remove old Firebase-specific code
- Update documentation
- Final testing

## Risk Mitigation

- Comprehensive testing before switching
- Feature flags for gradual rollout
- Rollback plan if issues arise
- Performance monitoring

## Success Criteria

- [ ] Can switch backends via environment variable
- [ ] All existing features work with both backends
- [ ] No breaking changes to UI/UX
- [ ] Consistent error handling
- [ ] Performance acceptable for both backends
- [ ] Code is maintainable and extensible</content>
      <parameter name="filePath">c:\Ran\Code\Fullstack_Course\ecommerce-project\react55-final-project\plan\005-backend-adapter-refactoring.md
