export interface Case {
    readonly directory:string,
    readonly template:string,
    readonly patterns:{
        readonly input:string,
        readonly expected:string
    }[]
}

const case1: Case = {
  directory: __dirname + "/case1",
  template: "template.html",
  patterns: [
    {
      input: __dirname + "/case1/input_1.json",
      expected: __dirname + "/case1/snap_1.html",
    },
  ],
};

export const cases = {
    case1
} as const

