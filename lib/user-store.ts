// User Store - manages user authentication with localStorage persistence

const USER_SESSION_KEY = "vintly_user_session";
const USERS_KEY = "vintly_users";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

// Get all registered users
function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save users
function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged-in user
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(USER_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Check if user is logged in
export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// Sign up - create new user
export function signUp(name: string, email: string, password: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  
  // Check if email already exists
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "An account with this email already exists" };
  }

  // Create new user
  const newUser: StoredUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=C4A484&color=1a1a1a`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  // Auto login after signup
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userWithoutPassword));

  // Dispatch event
  window.dispatchEvent(new Event("userAuthChanged"));

  return { success: true };
}

// Sign in
export function signIn(email: string, password: string): { success: boolean; error?: string } {
  const users = getStoredUsers();
  
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  // Save session (without password)
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userWithoutPassword));

  // Dispatch event
  window.dispatchEvent(new Event("userAuthChanged"));

  return { success: true };
}

// Sign out
export function signOut(): void {
  localStorage.removeItem(USER_SESSION_KEY);
  window.dispatchEvent(new Event("userAuthChanged"));
}

// Update user profile
export function updateUserProfile(updates: Partial<User>): void {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const updatedUser = { ...currentUser, ...updates };
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));

  // Also update in users list
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === currentUser.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveStoredUsers(users);
  }

  window.dispatchEvent(new Event("userAuthChanged"));
}











