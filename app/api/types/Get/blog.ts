export interface blog {
    title:string;
    summary:string;
    name:string
}

export interface blogDetails {
    title:string;
    description:string;
    keywords:string;
    summary:string;
    content:string;
    editor:{
        name:string;
    }
    published_at:string;
}