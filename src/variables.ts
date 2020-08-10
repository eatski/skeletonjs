
export type Variables = Record<string,string | string[] | undefined>

export class VariablesWrapper {
    public constructor(
        private variables: Variables
    ) {}

    public getTextValue(name:string):string{
        const res = this.variables[name];
        if(typeof res === "string"){
            return  res;
        }
        throw new Error(`Variable [${name}] not found or not text`);
    }

    public getArrayValue(name:string):string[] {
        const res = this.variables[name];
        if(typeof res === "object"){
            return  res;
        }
        throw new Error(`Variable [${name}] not found or not array`);
    }

    public addVariables(target:Variables):VariablesWrapper {
        return new VariablesWrapper({
            ...this.variables,
            ...target
        })
    }
}