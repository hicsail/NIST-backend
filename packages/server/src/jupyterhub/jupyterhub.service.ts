import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../auth/user.dto';
import createClient from 'openapi-fetch';
import { paths, components } from './schema';
import { Model } from 'mongoose';
import { JupyterHubUser, JupyterHubUserDocument } from './jupyterhub-user.model';
import { InjectModel } from '@nestjs/mongoose';

type JupyterUserBackend = components['schemas']['User'];
type JupyterToken = components['schemas']['Token'];

@Injectable()
export class JupyterhubService {
  private readonly client: ReturnType<typeof createClient<paths>>;
  private readonly publicBaseUrl: string;

  constructor(
    configService: ConfigService,
    @InjectModel(JupyterHubUser.name) private readonly jupyterHubUserModel: Model<JupyterHubUserDocument>
  ) {
    const jupyterURL = configService.getOrThrow('jupyterhub.apiUrl');
    const apiKey = configService.getOrThrow('jupyterhub.apiKey');
    this.publicBaseUrl = configService.getOrThrow('jupyterhub.publicUrl');

    // Make the OpenAPI client for JupyterHub
    this.client = createClient<paths>({
      baseUrl: jupyterURL,
      headers: {
        Authorization: `Bearer ${apiKey}`
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
    // Get the JupyterHub User
    const jupyterUser = await this.getOrCreateUser(user);

    // Stop any existing servers
    await this.stopUserServer(jupyterUser);

    // Spawn the new server
    await this.createNotebook(jupyterUser, fileURL, fileName);

    // Get the server url
    const serverURL = await this.getServerURL(jupyterUser);
    if (!serverURL) {
      throw new Error('Unexpected error, server never created');
    }

    // Construct the URL that includes the path to the file and the user's
    // token
    const url = `${this.publicBaseUrl}${serverURL}lab/tree/${encodeURIComponent(fileName)}?token=${jupyterUser.token}`;
    return url;
  }

  /**
   * Create a new Jupyter Notebook with the provided file included
   */
  async createNotebook(user: JupyterHubUser, fileURL: string, fileName: string): Promise<void> {
    // Make the request for the new notebook, need the casting to handle
    // that typically a body is not present
    const requestBody = { fileURL: fileURL, fileName: fileName } as any;
    const newServerResponse = await this.client.post('/users/{name}/server', {
      params: { path: { name: user.name } },
      body: requestBody
    });

    if (newServerResponse.error) {
      throw new Error('Failed to make JupyterNotebook instance');
    }
  }

  /**
   * Stop any running user server
   */
  private async stopUserServer(user: JupyterHubUser): Promise<void> {
    await this.client.del('/users/{name}/server', { params: { path: { name: user.name } } });
  }

  /**
   * Check if the user is registerd with JupyterHub, if not, create the user
   * in JupyterHub
   */
  private async getOrCreateUser(user: TokenPayload): Promise<JupyterHubUser> {
    // If the user already exists, return that user
    const existingUser = await this.jupyterHubUserModel.findOne({ name: user.id });
    if (existingUser) {
      return existingUser;
    }

    // Otherwise, make a new user
    const newUserResponse = await this.client.post('/users/{name}', { params: { path: { name: user.id } } });
    if (newUserResponse.error || !newUserResponse.data) {
      console.error('Failed to create a new JupterHub user');
      console.error(newUserResponse);
    }

    // Make the token for the user
    const token = await this.genUserToken(newUserResponse.data);

    // Store the result for next time the user is requested
    return await this.jupyterHubUserModel.create({ name: newUserResponse.data.name!, token: token.token! });
  }

  /**
   * Generate an authentication token for the user
   */
  private async genUserToken(user: JupyterUserBackend): Promise<JupyterToken> {
    const tokenResponse = await this.client.post('/users/{name}/tokens', { params: { path: { name: user.name! } } });

    if (tokenResponse.error) {
      throw new Error('Failed to generate token');
    }

    return tokenResponse.data;
  }

  private async getServerURL(user: JupyterHubUser): Promise<string | null> {
    const userResponse = await this.client.get('/users/{name}', { params: { path: { name: user.name } } });
    if (userResponse.error) {
      throw new Error('Unexpected error attempting to get user information');
    }
    return userResponse.data.server || null;
  }
}
