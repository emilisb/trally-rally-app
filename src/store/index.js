import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'user-auth-token';
const USER_KEY = 'user-details';

export class GlobalStore {
  state;

  constructor() {
    this.state = new Map();
  }

  async isLoggedIn() {
    const authToken = await this.getAuthToken();
    return !!authToken;
  }

  async setAuthToken(authToken) {
    this.state.set(AUTH_TOKEN_KEY, authToken);
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken);
  }

  async getAuthToken() {
    if (!this.state.has(AUTH_TOKEN_KEY)) {
      const authToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      this.state.set(AUTH_TOKEN_KEY, authToken);
    }

    return this.state.get(AUTH_TOKEN_KEY);
  }

  async setUser(user) {
    this.state.set(USER_KEY, user);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  async getUser() {
    if (!this.state.has(USER_KEY)) {
      const user = await AsyncStorage.getItem(USER_KEY);
      this.state.set(USER_KEY, JSON.parse(user));
    }

    return this.state.get(USER_KEY);
  }

  async deleteUser() {
    AsyncStorage.removeItem(USER_KEY);
    this.state.delete(USER_KEY);
  }

  async deleteAuthToken() {
    AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    this.state.delete(AUTH_TOKEN_KEY);
  }

  async logoutUser() {
    this.deleteUser();
    this.deleteAuthToken();
  }
}
