import { SupabaseClient } from '@supabase/supabase-js';
// import { createClient } from "@supabase/supabase-js";
import { type BoxDBObj, type BoxFilter, type BoxResponse } from '$lib/classes/Box';
// import { format } from "path";

const success: BoxResponse = {
	success: true,
	boxRawObjs: null,
	error: null
};

export async function selectBoxDB(filter: BoxFilter | null, supabase: SupabaseClient): Promise<BoxResponse> {
    let query;
    if (filter == null) {
        query = supabase
        .from('box')
        .select();
    } else{
        query = supabase
        .from('box')
        .select('box_id, user_id');

		if (filter.box_id != null) {
			query = query.eq('box_id', filter.box_id);
		}

		if (filter.user_id != null) {
			query = query.eq('user_id', filter.user_id);
		}
	}

	// execute query
	const { data, error } = await query;

	// error catch
	if (error) {
		return {
			success: false,
			boxRawObjs: null,
			error: error.message
		};
	}

	// format query into BoxDBObj

	const formattedData: BoxDBObj[] = [];

	if (data != null) {
		for (const row of data) {
			formattedData.push({
				box_id: row.box_id,
				user_id: row.user_id,
				locked: row.locked
			});
		}
	}
	return {
		success: true,
		boxRawObjs: formattedData,
		error: null
	};
}

export async function insertBoxDB(box: BoxDBObj, supabase: SupabaseClient): Promise<BoxResponse> {
	const { error } = await supabase.from('box').insert(box);

	if (error) {
		return {
			success: false,
			boxRawObjs: null,
			error: error.message
		};
	}

	return success;
}

// only works for checking a single box
async function checkBoxExistsDB(filter: BoxFilter, supabase: SupabaseClient): Promise<BoxResponse> {
	const boxDB = await selectBoxDB(filter, supabase);

	if (boxDB.success && boxDB.boxRawObjs?.length == 1) {
		return success;
	} else {
		return {
			success: false,
			boxRawObjs: null,
			error: 'Error: Box does not exist'
		};
	}
}

export async function updateBoxDB(box: BoxDBObj, supabase: SupabaseClient): Promise<BoxResponse> {
	// updates a box entry based on their box_id
	// box_id should not be updated
	const boxCheck = await checkBoxExistsDB(
		{
			box_id: box.box_id,
			user_id: 0, // null ata dapat to 
			locked: false
		},
		supabase
	);

	if (!boxCheck.success) {
		return boxCheck;
	}

	// only permitted types to be updated (for now)
	const updateObj: { [key: string]: number } = {};

	for (const [key, value] of Object.entries(box)) {
		if (value && key != 'box_id') {
			// prevents box_id to be updated
			updateObj[key] = value;
		}
	}

	const { error } = await supabase.from('box').update(updateObj).eq('box_id', box.box_id);

	if (error) {
		return {
			success: false,
			boxRawObjs: null,
			error: error.message
		};
	}
	return success;
}

export async function deleteBoxDB(boxID: string, supabase: SupabaseClient): Promise<BoxResponse> {
	const boxCheck = await checkBoxExistsDB(
		{
			box_id: boxID,
			user_id: 0,
			locked: false
		},
		supabase
	);

	if (!boxCheck.success) {
		return boxCheck;
	}

	const { error } = await supabase.from('box').delete().eq('box_id', boxID);

	if (error) {
		return {
			success: false,
			boxRawObjs: null,
			error: error.message
		};
	}

	return success;
}
