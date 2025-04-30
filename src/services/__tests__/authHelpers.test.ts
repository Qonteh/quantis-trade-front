
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthHelpers } from '../authHelpers';
import { AuthService } from '../api';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock dependencies
vi.mock('../api', () => ({
  AuthService: {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  }
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
delete window.location;
window.location = { href: '' } as unknown as Location;

describe('useAuthHelpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      // Arrange
      const mockUserData = { 
        firstName: 'John', 
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        countryCode: '+1',
        phone: '1234567890'
      };
      const mockResponse = { 
        token: 'mock-token', 
        data: { 
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isVerified: false
        } 
      };
      
      vi.mocked(AuthService.register).mockResolvedValueOnce(mockResponse);
      
      // Act
      const { result } = renderHook(() => useAuthHelpers());
      let userData;
      
      await act(async () => {
        userData = await result.current.register(mockUserData);
      });
      
      // Assert
      expect(AuthService.register).toHaveBeenCalledWith(mockUserData);
      expect(userData).toEqual(mockResponse.data);
      expect(localStorageMock.getItem('token')).toBe('mock-token');
      expect(localStorageMock.getItem('user')).toBe(JSON.stringify(mockResponse.data));
    });
    
    it('should throw an error when registration fails', async () => {
      // Arrange
      const mockUserData = { 
        firstName: 'John', 
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        countryCode: '+1',
        phone: '1234567890'
      };
      
      const error = new Error('Registration failed');
      error.response = { data: { error: 'Email already exists' } };
      
      vi.mocked(AuthService.register).mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useAuthHelpers());
      
      // Assert
      await expect(result.current.register(mockUserData)).rejects.toThrow();
      expect(AuthService.register).toHaveBeenCalledWith(mockUserData);
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('user')).toBeNull();
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const email = 'john@example.com';
      const password = 'password123';
      const mockResponse = { 
        token: 'mock-token',
        data: { 
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isVerified: true
        } 
      };
      
      vi.mocked(AuthService.login).mockResolvedValueOnce(mockResponse);
      
      // Act
      const { result } = renderHook(() => useAuthHelpers());
      let userData;
      
      await act(async () => {
        userData = await result.current.login(email, password);
      });
      
      // Assert
      expect(AuthService.login).toHaveBeenCalledWith(email, password);
      expect(userData).toEqual(mockResponse.data);
    });
    
    it('should throw an error when login fails', async () => {
      // Arrange
      const email = 'john@example.com';
      const password = 'wrongpassword';
      
      const error = new Error('Login failed');
      error.response = { data: { error: 'Invalid credentials' } };
      
      vi.mocked(AuthService.login).mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useAuthHelpers());
      
      // Assert
      await expect(result.current.login(email, password)).rejects.toThrow();
      expect(AuthService.login).toHaveBeenCalledWith(email, password);
    });
  });

  describe('logout', () => {
    it('should logout a user successfully', () => {
      // Arrange
      localStorageMock.setItem('token', 'mock-token');
      localStorageMock.setItem('user', JSON.stringify({ id: '1', name: 'John' }));
      window.location.href = '/dashboard';
      
      // Act
      const { result } = renderHook(() => useAuthHelpers());
      
      act(() => {
        result.current.logout();
      });
      
      // Assert
      expect(AuthService.logout).toHaveBeenCalled();
      expect(window.location.href).toBe('/');
    });
  });
});
