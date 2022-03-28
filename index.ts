import chalk from "chalk";

//#region Exceptions listener

function listener(error)
{
    if (error instanceof MetaError)
    {
        error.print();
        console.log();
        process.exit(1);
    }
}

export function enableMetaErrors()
{
    process.addListener('uncaughtExceptionMonitor', listener);
}

export function disableMetaErrors()
{
    process.removeListener('uncaughtExceptionMonitor', listener);
}

//#endregion

//#region Functions

export function withErrorMeta(func: () => any, meta: any)
{
    let result;

    try { result = func(); }
    catch (error)
    {
        if (error instanceof MetaError)
        {
            error.addMeta(meta);
            error.throw();
        }

        throw error;
    }

    return result;
}

export function throwMetaError(reason: string, meta: any = null)
{
    new MetaError(reason, meta).throw();
}

//#endregion

//#region Meta error class

export class MetaError
{
    reason: string;
    metaItems: any[];
    stack?: string;
    
    constructor(reason: string, meta: any = null)
    {
        this.reason = reason;
        this.metaItems = [];

        if (meta != null)
            this.addMeta(meta);
    }

    addMeta(meta: any)
    {
        this.metaItems.push(meta);
    }

    throw()
    {
        if (!this.stack)
            this.stack = (new Error()).stack;

        throw this;
    }

    print()
    {
        console.log();
        console.log();

        console.log(chalk.bgRed.whiteBright.bold(' Error! ') + ' ' + chalk.redBright(this.reason));

        console.group();

        this.metaItems.forEach(metaItem =>
        {
            console.log();
            MetaError.printMetaItem(metaItem);
        });

        console.groupEnd();

        console.log();
        console.log();

        if (this.stack)
            console.log(this.stack);
    }

    static printMetaItem(meta: any)
    {
        if (isObjWithProps(meta))
        {
            Object.keys(meta).forEach((label, i) =>
            {
                if (i !== 0)
                    console.log();

                console.log(chalk.bold.whiteBright(label + ':'));
                console.log(meta[label]);
            });
        }
        else
        {
            console.log(chalk.bold.magentaBright('<unknown>'));
            console.log(meta);
        }
    }
}

//#endregion

//#region Utils

function isObjWithProps(target: any)
{
    if (typeof target !== 'object')
        return false;

    try { target['property']; return true; }
    catch { return false; }
}

//#endregion