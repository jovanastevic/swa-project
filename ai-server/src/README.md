### API Doc
This is how you acc read the api documentation in a clean Format.
1. First run this command in your Terminal`npm i`.
2. Then this command `npm run start.`
3. After that go to http://localhost:3000/api-docs.

### Auth frontend implamation example:

Information pulled from here: https://www.wisp.blog/blog/ultimate-guide-to-securing-jwt-authentication-with-httponly-cookies

    // React example using fetch
    const login = async (username, password) => {
    try {
    const response = await fetch('https://yourapi.com/api/login', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include' // Important! This tells fetch to include cookies
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const userData = await response.json();
    // Store user data in state management (React Context, Redux, etc.)
    return userData;
    } catch (error) {
    console.error('Login error:', error);
    throw error;
    }
    };

## Example two:
    // Utility function for API requests
    const apiRequest = async (url, options = {}) => {
    try {
    const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
    ...options.headers,
    'Content-Type': 'application/json',
    }
    });

    // If unauthorized, try to refresh the token
    if (response.status === 401) {
      const refreshResponse = await fetch('https://yourapi.com/api/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (refreshResponse.ok) {
        // Retry the original request after token refresh
        return apiRequest(url, options);
      } else {
        // Redirect to login if refresh fails
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return response.json();
    } catch (error) {
    console.error('API error:', error);
    throw error;
    }
    };

    // Example usage
    const fetchUserData = () => apiRequest('https://yourapi.com/api/protected');