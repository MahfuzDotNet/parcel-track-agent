import { v4 as uuidv4 } from 'uuid';

export let users = [
  {
    id: uuidv4(),
    email: 'admin@courier.com',
    password: '$2a$10$rOzJqKkJvkI8E8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // 'admin123'
    name: 'Admin User',
    role: 'admin',
    phone: '+1234567890',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    email: 'agent@courier.com',
    password: '$2a$10$rOzJqKkJvkI8E8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // 'agent123'
    name: 'John Agent',
    role: 'agent',
    phone: '+1234567891',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    email: 'customer@courier.com',
    password: '$2a$10$rOzJqKkJvkI8E8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8', // 'customer123'
    name: 'Jane Customer',
    role: 'customer',
    phone: '+1234567892',
    createdAt: new Date().toISOString()
  }
];

export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

export const createUser = (userData) => {
  const newUser = {
    id: uuidv4(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};