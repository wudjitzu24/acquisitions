// src/services/auth.service.js
import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

// Funkcja haszująca hasło
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing the password: ${e}`);
    throw new Error('Error hashing password', { cause: e });
  }
};

// Funkcja porównująca hasło
export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing password: ${e}`);
    throw new Error('Error comparing password', { cause: e });
  }
};

// Uwierzytelnienie użytkownika
export const authenticateUser = async ({ email, password }) => {
  try {
    // Znajdź użytkownika po email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    // Sprawdź hasło
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${user.email} authenticated successfully`);

    // Zwróć użytkownika bez hasła
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    throw e;
  }
};

// Tworzenie nowego użytkownika
export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    // Sprawdzenie czy użytkownik istnieje
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      throw new Error('User already exists');
    }

    // Haszowanie hasła
    const password_hash = await hashPassword(password);

    // Tworzenie użytkownika w bazie i zwrócenie pełnego obiektu
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: password_hash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User ${newUser.email} created successfully`);

    return newUser; // <<< bardzo ważne!
  } catch (e) {
    logger.error(`Error creating the user: ${e}`);
    throw e; // przekaż błąd do kontrolera
  }
};