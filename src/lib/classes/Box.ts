
// parameters for insertion and update
export type BoxDBObj = {
    box_id: number;
    user_id: number;
}

// database response of Box functions
export type BoxResponse = {
    success: boolean;
    boxRawObjs: BoxDBObj[] | null;
    error: string | null;
}

// for selecting Boxes e.g., box/es of certain user/s
export type BoxFilter = {
    box_id: number;
    user_id: number;
}

export class Box {
    public static async selectBoxes(
        filter: BoxFilter = {
            box_id: 0,
            user_id: 0
        }
    ): Promise<BoxResponse> {
        return selectBoxDB(filter);
    }
    
}