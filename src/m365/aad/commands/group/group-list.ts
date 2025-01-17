import { Group } from '@microsoft/microsoft-graph-types';
import { Cli } from '../../../../cli/Cli.js';
import { Logger } from '../../../../cli/Logger.js';
import GlobalOptions from '../../../../GlobalOptions.js';
import { odata } from '../../../../utils/odata.js';
import GraphCommand from '../../../base/GraphCommand.js';
import commands from '../../commands.js';

interface CommandArgs {
  options: GlobalOptions;
}

interface ExtendedGroup extends Group {
  groupType?: string;
}

class AadGroupListCommand extends GraphCommand {
  public get name(): string {
    return commands.GROUP_LIST;
  }

  public get description(): string {
    return 'Lists all groups defined in Azure Active Directory.';
  }

  public defaultProperties(): string[] | undefined {
    return ['id', 'displayName', 'groupType'];
  }

  public async commandAction(logger: Logger, args: CommandArgs): Promise<void> {
    try {
      const groups = await odata.getAllItems<Group>(`${this.resource}/v1.0/groups`);

      if (Cli.shouldTrimOutput(args.options.output)) {
        groups.forEach((group: ExtendedGroup) => {
          if (group.groupTypes && group.groupTypes.length > 0 && group.groupTypes[0] === 'Unified') {
            group.groupType = 'Microsoft 365';
          }
          else if (group.mailEnabled && group.securityEnabled) {
            group.groupType = 'Mail enabled security';
          }
          else if (group.securityEnabled) {
            group.groupType = 'Security';
          }
          else if (group.mailEnabled) {
            group.groupType = 'Distribution';
          }
        });
      }

      await logger.log(groups);
    }
    catch (err: any) {
      this.handleRejectedODataJsonPromise(err);
    }
  }
}

export default new AadGroupListCommand();