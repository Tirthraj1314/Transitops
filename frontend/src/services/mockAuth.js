const USERS_KEY = "transitops_mock_users";

const SEED_USERS = [
  {
    id: "demo-1",
    name: "Demo User",
    email: "demo@transitops.com",
    phone: "9999999999",
    password: "password123",
    role: "Fleet Manager",
  },
];

function readUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function mockError(message) {
  const err = new Error(message);
  err.response = { data: { message } };
  return err;
}

function toPublicUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}

export async function login(email, password) {
  const user = readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw mockError("No account found for this email");
  if (user.password !== password) throw mockError("Incorrect password");
  return { token: `mock-token-${user.id}`, user: toPublicUser(user) };
}

export async function register({ name, email, phone, password }) {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw mockError("An account with this email already exists");
  }
  const user = { id: crypto.randomUUID(), name, email, phone, password, role: "Fleet Manager" };
  writeUsers([...users, user]);
  return { token: `mock-token-${user.id}`, user: toPublicUser(user) };
}

export async function fetchCurrentUser() {
  const stored = localStorage.getItem("transitops_user");
  if (!stored) throw mockError("Not authenticated");
  return JSON.parse(stored);
}
