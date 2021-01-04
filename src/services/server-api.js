import axios from 'axios';
import config from '../config';

export class ServerApi {
  authToken = '';

  setAuthToken(authToken) {
    this.authToken = authToken;
    return this;
  }

  async login(code) {
    return this.fetch({url: `${config.SERVER}/auth/login`, method: 'POST', body: {code}});
  }

  async submitAnswer(questionId, answer) {
    return this.fetch({
      url: `${config.SERVER}/questions/${questionId}`,
      method: 'POST',
      body: {answer},
      withAuth: true,
    });
  }

  async fetchQuestions({lat, long}) {
    return this.fetch({url: `${config.SERVER}/questions?lat=${lat}&long=${long}`, method: 'GET', withAuth: true});
  }

  async fetch({url, body, method, withAuth}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    const response = await axios({
      url,
      method,
      data: body,
      headers: withAuth ? {Authorization: this.authToken, ...defaultHeaders} : defaultHeaders,
    });
    return response.data;
  }

  async getProfile() {
    return this.fetch({
      url: `${config.SERVER}/user`,
      method: 'GET',
      withAuth: true,
    });
  }

  async updateProfile({name, phone, photoData}) {
    return this.fetch({
      url: `${config.SERVER}/user`,
      method: 'POST',
      body: {name, phone, photoData},
      withAuth: true,
    });
  }
}
