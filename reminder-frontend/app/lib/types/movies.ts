export type movie ={
    movie_id: number,
    name: string,
    availability: string,
    notes:string | null,
}

export type LoaderData={ movies : movie[] }