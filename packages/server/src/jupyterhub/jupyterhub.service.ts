import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {TokenPayload} from 'src/auth/user.dto';

@Injectable()
export class JupyterhubService {
  private readonly jupyterURL: string;
  private readonly apiKey: string;

  constructor(configService: ConfigService) {
    this.jupyterURL = configService.getOrThrow('jupyterhub.apiUrl');
    this.apiKey = configService.getOrThrow('jupyterhub.apiKey');
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
    // Ensure the user exists in JupyterHub


    return '';
  }

  /**
   * Check if the user is registerd with JupyterHub, if not, create the user
   * in JupyterHub
   *
  private async getOrCreateUser(user: TokenPayload):  {
    const requestURL = `${this.jupyterURL}/users/${user.id}`;
    const userResponse = await firstValueFrom(this.httpService.get(requestURL));

    if (userResponse.status != 200) {
      throw new Error('Failed to make request against JupyterHub');
    }
  }
  */
}
