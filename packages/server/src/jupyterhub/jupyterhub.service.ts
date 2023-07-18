import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../auth/user.dto';
import createClient from 'openapi-fetch';
import { paths, components } from './schema';

@Injectable()
export class JupyterhubService {
  private readonly jupyterURL: string;
  private readonly apiKey: string;
  private readonly client: ReturnType<typeof createClient<paths>>;

  constructor(configService: ConfigService) {
    this.jupyterURL = configService.getOrThrow('jupyterhub.apiUrl');
    this.apiKey = configService.getOrThrow('jupyterhub.apiKey');

    // Make the OpenAPI client for JupyterHub
    this.client = createClient<paths>({
      baseUrl: this.jupyterURL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    });
  }


  /**
   * Creates a Jupyter Notebook for the given user where the provided file
   * is present in the notebook environment. Creating the notebook involves
   * the following steps.
   *
   * 1. Check if the user exists, and if not, creating the user
   * 2. Check if an existing notebook is running, if so, stop it
   * 3. Request a new notebook with the provided file included
   * 4. Generate a token for the user to access the notebook
   * 5. Return the URL with the included token to the user
   */
  async getJupterNotebook(user: TokenPayload, fileURL: string, fileName: string): Promise<string> {
    const jupyterUser = await this.getOrCreateUser(user);
    console.log(jupyterUser);


    return '';
  }

  /**
   * Check if the user is registerd with JupyterHub, if not, create the user
   * in JupyterHub
   */
  private async getOrCreateUser(user: TokenPayload): Promise<components['schemas']['User']>  {
    // If the user already exists, return that user
    const existingUserResponse = await this.client.get('/users/{name}', { params: { path: { name: user.id } } });
    if (existingUserResponse.data) {
      return existingUserResponse.data;
    }

    // Otherwise, make a new user
    const newUserResponse = await this.client.post('/users/{name}', { params: { path: { name: user.id } } });
    if (newUserResponse.error || !newUserResponse.data) {
      console.error('Failed to create a new JupterHub user');
      console.error(newUserResponse);
    }

    return newUserResponse.data;
  }
}
