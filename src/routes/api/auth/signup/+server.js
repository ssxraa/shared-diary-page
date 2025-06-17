import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export async function POST({ request }) {
    try {
        const { username1, username2, password } = await request.json();


        if (!username1 || !username2 || !password) {
            return json({ error: 'All fields are required' }, { status: 400 });
        }


        const { data: diary, error: diaryError } = await supabase
            .from('diaries')
            .insert([
                { password }
            ])
            .select()
            .single();

        if (diaryError) {
            console.error('Diary creation error:', diaryError);
            return json({ error: `Diary creation failed: ${diaryError.message}` }, { status: 500 });
        }

        const { error: usersError } = await supabase
            .from('users')
            .insert([
                { username: username1, diary_id: diary.id },
                { username: username2, diary_id: diary.id }
            ]);

        if (usersError) {
            console.error('Users creation error:', usersError);
            await supabase
                .from('diaries')
                .delete()
                .eq('id', diary.id);
                
            return json({ error: `Users creation failed: ${usersError.message}` }, { status: 500 });
        }

        return json({ success: true, diary_id: diary.id });

    } catch (error) {
        console.error('Signup error:', error);
        return json({ error: error.message }, { status: 500 });
    }
}