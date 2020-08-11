
export type Variables = Record<string,string | string[] | undefined | boolean>

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

    public getPrimitiveValue(name:string):string | boolean{
        const res = this.variables[name];
        if(typeof res === "string" || typeof res === "boolean"){
            return  res;
        }
        throw new Error(`Variable [${name}] not found or not primitive`);
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