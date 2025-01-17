import { Logger } from '../../../../cli/Logger.js';
import { odata } from '../../../../utils/odata.js';
import GraphCommand from '../../../base/GraphCommand.js';
import commands from '../../commands.js';

class SearchExternalConnectionListCommand extends GraphCommand {
  public get name(): string {
    return commands.EXTERNALCONNECTION_LIST;
  }

  public get description(): string {
    return 'Lists external connections defined in the Microsoft Search';
  }

  public defaultProperties(): string[] | undefined {
    return ['id', 'name', 'state'];
  }

  public async commandAction(logger: Logger): Promise<void> {
    try {
      const connections = await odata.getAllItems(`${this.resource}/v1.0/external/connections`);
      await logger.log(connections);
    }
    catch (err: any) {
      this.handleRejectedODataJsonPromise(err);
    }
  }
}

export default new SearchExternalConnectionListCommand();