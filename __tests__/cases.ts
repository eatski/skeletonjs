export interface Case {
    directory:string,
    template:string,
    patterns:{
        input:string,
        expected:string
    }[]
}

export const cases : Record<"case1",Case> = {
    case1:{
        directory:__dirname + "/case1",
        template:__dirname + "/case1/template.html",
        patterns:[
            {
                input:__dirname + "/case1/input_1.json",
                expected:__dirname + "/case1/snap_1.html"
            }
        ]
    }
}
    
