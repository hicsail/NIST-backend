import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UserContext } from '../auth/user.decorator';
import { TokenPayload } from '../auth/user.dto';


@UseGuards(JwtAuthGuard)
@Resolver()
export class JupyterhubResolver {

  @Mutation(() => String, { description: 'Create new JupyterNotebook for user' })
  async nistGetJupterNotebook(@UserContext() user: TokenPayload, @Args('fileURL') fileURL: string, @Args('fileName') fileName: string): Promise<string> {
    return '';
  }

  @Mutation(() => Boolean, { description: 'Delete a running user notebook' })
  async nistDeleteJupyterNotebook(@UserContext() user: TokenPayload) {
    return true;
  }
}