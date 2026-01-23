export type book ={
    book_id: number,
    name: string,
    author:string,
    category: string,
    notes:string | null,
}

export type LoaderData={ books : book[] }