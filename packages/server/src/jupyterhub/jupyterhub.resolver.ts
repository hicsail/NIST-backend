import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserContext } from '../auth/user.decorator';
import { TokenPayload } from '../auth/user.dto';
import { JupyterhubService } from './jupyterhub.service';

@UseGuards(JwtAuthGuard)
@Resolver()
export class JupyterhubResolver {
  constructor(private readonly jupyterHubService: JupyterhubService) {}

  @Mutation(() => String, { description: 'Create new JupyterNotebook for user' })
  async nistGetJupterNotebook(
    @UserContext() user: TokenPayload,
    @Args('fileURL') fileURL: string,
    @Args('fileName') fileName: string
  ): Promise<string> {
    return this.jupyterHubService.getJupterNotebook(user, fileURL, fileName);
  }
}
