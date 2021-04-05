import axios from 'axios';
import config from '../config';

export class ServerApi {
  authToken = '';

  setAuthToken(authToken) {
    this.authToken = authToken;
    return this;
  }

  async login(username, password) {
    return this.fetch({url: `${config.SERVER}/auth/login`, method: 'POST', body: {username, password}});
  }

  async submitAnswer(questionId, answer) {
    return this.fetch({
      url: `${config.SERVER}/questions/${questionId}/submit`,
      method: 'PUT',
      body: {answer},
      withAuth: true,
    });
  }

  async fetchQuestions({lat, long}) {
    return this.fetch({
      url: `${config.SERVER}/questions?latitude=${lat}&longitude=${long}`,
      method: 'GET',
      withAuth: true,
    });
  }

  async fetch({url, body, method, withAuth}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    const response = await axios({
      url,
      method,
      data: body,
      headers: withAuth ? {Authorization: `Bearer ${this.authToken}`, ...defaultHeaders} : defaultHeaders,
    });
    return response.data;
  }

  async getProfile() {
    return this.fetch({
      url: `${config.SERVER}/account`,
      method: 'GET',
      withAuth: true,
    });
  }

  async updateProfile({name, phone, photoData}) {
    return this.fetch({
      url: `${config.SERVER}/account`,
      method: 'POST',
      body: {name, phone, avatar: photoData},
      withAuth: true,
    });
  }
}
