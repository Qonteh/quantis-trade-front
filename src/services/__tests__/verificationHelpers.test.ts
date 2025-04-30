
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useVerificationHelpers } from '../verificationHelpers';
import { AuthService } from '../api';
import { renderHook, act } from '@testing-library/react-hooks';

// Mock dependencies
vi.mock('../api', () => ({
  AuthService: {
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
    updateProfile: vi.fn()
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

describe('useVerificationHelpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      // Arrange
      const userId = '123';
      const code = '123456';
      const mockResponse = { 
        success: true, 
        message: 'Email successfully verified' 
      };
      
      vi.mocked(AuthService.verifyEmail).mockResolvedValueOnce(mockResponse);
      
      // Act
      const { result } = renderHook(() => useVerificationHelpers());
      let response;
      
      await act(async () => {
        response = await result.current.verifyEmail(userId, code);
      });
      
      // Assert
      expect(AuthService.verifyEmail).toHaveBeenCalledWith(userId, code);
      expect(response).toEqual(mockResponse);
    });
    
    it('should throw an error when email verification fails', async () => {
      // Arrange
      const userId = '123';
      const code = '000000';
      
      const error = new Error('Verification failed');
      error.response = { data: { error: 'Invalid verification code' } };
      
      vi.mocked(AuthService.verifyEmail).mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useVerificationHelpers());
      
      // Assert
      await expect(result.current.verifyEmail(userId, code)).rejects.toThrow();
      expect(AuthService.verifyEmail).toHaveBeenCalledWith(userId, code);
    });
  });

  describe('resendVerification', () => {
    it('should resend verification code successfully', async () => {
      // Arrange
      const email = 'john@example.com';
      const mockResponse = { 
        success: true, 
        message: 'Verification code sent' 
      };
      
      vi.mocked(AuthService.resendVerification).mockResolvedValueOnce(mockResponse);
      
      // Act
      const { result } = renderHook(() => useVerificationHelpers());
      let response;
      
      await act(async () => {
        response = await result.current.resendVerification(email);
      });
      
      // Assert
      expect(AuthService.resendVerification).toHaveBeenCalledWith(email);
      expect(response).toEqual(mockResponse);
    });
    
    it('should throw an error when resending verification fails', async () => {
      // Arrange
      const email = 'john@example.com';
      
      const error = new Error('Failed to resend code');
      error.response = { data: { error: 'User not found' } };
      
      vi.mocked(AuthService.resendVerification).mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useVerificationHelpers());
      
      // Assert
      await expect(result.current.resendVerification(email)).rejects.toThrow();
      expect(AuthService.resendVerification).toHaveBeenCalledWith(email);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      // Arrange
      const userData = { firstName: 'John Updated', lastName: 'Doe Updated' };
      const mockResponse = { 
        data: { 
          id: '1',
          firstName: 'John Updated',
          lastName: 'Doe Updated',
          email: 'john@example.com'
        } 
      };
      
      vi.mocked(AuthService.updateProfile).mockResolvedValueOnce(mockResponse);
      
      // Act
      const { result } = renderHook(() => useVerificationHelpers());
      let updatedUser;
      
      await act(async () => {
        updatedUser = await result.current.updateProfile(userData);
      });
      
      // Assert
      expect(AuthService.updateProfile).toHaveBeenCalledWith(userData);
      expect(updatedUser).toEqual(mockResponse.data);
      expect(localStorageMock.getItem('user')).toBe(JSON.stringify(mockResponse.data));
    });
    
    it('should throw an error when profile update fails', async () => {
      // Arrange
      const userData = { firstName: 'John', lastName: 'Doe' };
      
      const error = new Error('Update failed');
      error.response = { data: { error: 'Failed to update profile' } };
      
      vi.mocked(AuthService.updateProfile).mockRejectedValueOnce(error);
      
      // Act
      const { result } = renderHook(() => useVerificationHelpers());
      
      // Assert
      await expect(result.current.updateProfile(userData)).rejects.toThrow();
      expect(AuthService.updateProfile).toHaveBeenCalledWith(userData);
    });
  });
});
