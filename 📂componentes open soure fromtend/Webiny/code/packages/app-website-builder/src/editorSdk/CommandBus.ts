import type { Command } from "./createCommand.js";
export * from "./createCommand.js";

const INTERNAL_STOP = Symbol("INTERNAL_STOP");

export type CommandHandler<T> = (
    payload: T,
    control: CommandHandlerControl
) => void | typeof INTERNAL_STOP | Promise<void | typeof INTERNAL_STOP>;

export type CommandHandlerControl = {
    stop: () => typeof INTERNAL_STOP;
};

export enum CommandPriority {
    LOW = -100,
    NORMAL = 0,
    HIGH = 100,
    CRITICAL = 1000
}

export class CommandBus {
    private handlers = new Map<
        string,
        { priority: number; handler: (payload: any, control: CommandHandlerControl) => any }[]
    >();

    private middleware: ((
        type: string,
        payload: any,
        next: (payload: any) => Promise<void>
    ) => Promise<void>)[] = [];

    register<T>(
        command: Command<T>,
        handler: CommandHandler<T>,
        priority: CommandPriority = CommandPriority.NORMAL
    ): () => void {
        const list = this.handlers.get(command.type) ?? [];

        const entry = { handler, priority };
        list.push(entry);
        list.sort((a, b) => b.priority - a.priority);
        this.handlers.set(command.type, list);

        // Return an unregister function
        return () => {
            const current = this.handlers.get(command.type);
            if (!current) {
                return;
            }

            const index = current.indexOf(entry);

            if (index !== -1) {
                current.splice(index, 1);
            }

            if (current.length === 0) {
                this.handlers.delete(command.type);
            }
        };
    }

    use(mw: (type: string, payload: any, next: (payload: any) => Promise<void>) => Promise<void>) {
        this.middleware.push(mw);
    }

    async execute<T>(command: Command<T>, payload?: T) {
        const list = this.handlers.get(command.type) ?? [];

        const runHandlers = async (p?: T) => {
            const control: CommandHandlerControl = {
                stop: () => INTERNAL_STOP
            };

            for (const entry of list) {
                const result = await entry.handler(p, control);
                if (result === INTERNAL_STOP) {
                    break;
                }
            }
        };

        const composed = this.middleware.reduceRight(
            (next, mw) => async (p?: T) => mw(command.type, p, next),
            runHandlers
        );

        // console.log("[Execute Command]", command.type, payload);
        await composed(payload);
    }
}
