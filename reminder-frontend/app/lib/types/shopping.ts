export type shopping_item ={
    item_id: number,
    name: string,
    quantity: number,
    store_type:string,
    bought:boolean,
    notes:string | null,
    created_at:string,
}

export type LoaderData={ shopping_items : shopping_item[] }